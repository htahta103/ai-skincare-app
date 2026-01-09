import { Env } from '../types';

/**
 * Routine Agent
 * Generates personalized AM/PM routines based on skin profile
 */

interface SkinProfile {
    skin_type: string;
    skin_concerns: string[];
    skin_goals: string[];
}

interface Product {
    id: string;
    name: string;
    brand: string;
    category: string;
    affiliate_url: string;
    metadata: {
        skin_types: string[];
        concerns_targeted: string[];
        step_type: string;
        price_range: string;
    };
}

interface RoutineSelection {
    morning: Product[];
    evening: Product[];
}

// Map quiz values to product concerns
const concernsMap: Record<string, string> = {
    'acne': 'acne',
    'aging': 'aging',
    'spots': 'spots',
    'pores': 'pores',
    'dryness': 'dryness',
    'redness': 'redness',
    'sensitivity': 'sensitivity',
    'hydration': 'hydration'
};

export async function generateRoutine(
    env: Env,
    userId: string,
    skinProfile: SkinProfile
): Promise<{ morning_id: string | null; evening_id: string | null }> {
    console.log('[RoutineAgent] Generating routine for user:', userId);
    console.log('[RoutineAgent] Profile:', skinProfile);

    // 1. Fetch products from Supabase
    const products = await fetchProducts(env);
    if (products.length === 0) {
        console.error('[RoutineAgent] No products available');
        throw new Error('No products available for routine generation');
    }

    // 2. Filter products by skin type and concerns
    const matchedProducts = filterProducts(products, skinProfile);
    console.log(`[RoutineAgent] Matched ${matchedProducts.length} products`);

    // 3. Select best products using AI
    const selection = await selectRoutineProducts(env, matchedProducts, skinProfile);
    console.log('[RoutineAgent] Selection:', {
        morning: selection.morning.map(p => p.name),
        evening: selection.evening.map(p => p.name)
    });

    // 4. Create routines in database
    const routineIds = await createRoutines(env, userId, selection);
    console.log('[RoutineAgent] Created routines:', routineIds);

    return routineIds;
}

async function fetchProducts(env: Env): Promise<Product[]> {
    const response = await fetch(
        `${env.SUPABASE_URL}/rest/v1/products?select=id,name,brand,category,affiliate_url,metadata`,
        {
            headers: {
                'apikey': env.SUPABASE_SERVICE_KEY,
                'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
                'Content-Type': 'application/json'
            }
        }
    );

    if (!response.ok) {
        console.error('[RoutineAgent] Failed to fetch products:', response.status);
        return [];
    }

    return response.json();
}

function filterProducts(products: Product[], profile: SkinProfile): Product[] {
    return products.filter(product => {
        const meta = product.metadata;
        if (!meta) return false;

        // Check skin type compatibility
        const skinTypeMatch = meta.skin_types?.includes(profile.skin_type) ||
            meta.skin_types?.includes('all');

        // Check if product targets any of user's concerns
        const concernsMatch = profile.skin_concerns?.some(concern =>
            meta.concerns_targeted?.includes(concernsMap[concern] || concern)
        ) || meta.concerns_targeted?.length === 0;

        return skinTypeMatch || concernsMatch;
    });
}

async function selectRoutineProducts(
    env: Env,
    products: Product[],
    profile: SkinProfile
): Promise<RoutineSelection> {
    // Group products by step type
    const byStepType: Record<string, Product[]> = {};
    products.forEach(p => {
        const stepType = p.metadata?.step_type || p.category;
        if (!byStepType[stepType]) byStepType[stepType] = [];
        byStepType[stepType].push(p);
    });

    // Define routine structures
    const morningSteps = ['cleanser', 'toner', 'serum', 'moisturizer', 'spf'];
    const eveningSteps = ['cleanser', 'toner', 'treatment', 'serum', 'moisturizer'];

    // Use Cloudflare AI for intelligent selection
    try {
        return await aiSelectProducts(env, products, profile, morningSteps, eveningSteps);
    } catch (error) {
        console.error('[RoutineAgent] AI selection failed, using fallback:', error);
    }

    // Fallback: select best matching product for each step
    const selectBestForStep = (stepType: string): Product | null => {
        const candidates = byStepType[stepType] || [];
        const sorted = candidates.sort((a, b) => {
            const aMatch = a.metadata?.skin_types?.includes(profile.skin_type) ? 1 : 0;
            const bMatch = b.metadata?.skin_types?.includes(profile.skin_type) ? 1 : 0;
            return bMatch - aMatch;
        });
        return sorted[0] || null;
    };

    const morning = morningSteps.map(selectBestForStep).filter(Boolean) as Product[];
    const evening = eveningSteps.map(selectBestForStep).filter(Boolean) as Product[];

    return { morning, evening };
}

async function aiSelectProducts(
    env: Env,
    products: Product[],
    profile: SkinProfile,
    morningSteps: string[],
    eveningSteps: string[]
): Promise<RoutineSelection> {
    const productList = products.map(p => ({
        id: p.id,
        name: `${p.brand} ${p.name}`,
        category: p.category,
        step_type: p.metadata?.step_type,
        skin_types: p.metadata?.skin_types,
        concerns: p.metadata?.concerns_targeted
    }));

    const prompt = `You are a skincare expert. Based on the user's skin profile, select the best products for their morning and evening routines.

User Skin Profile:
- Skin Type: ${profile.skin_type}
- Concerns: ${profile.skin_concerns?.join(', ') || 'none'}
- Goals: ${profile.skin_goals?.join(', ') || 'general care'}

Available Products:
${JSON.stringify(productList, null, 2)}

Morning Routine Steps: ${morningSteps.join(' → ')}
Evening Routine Steps: ${eveningSteps.join(' → ')}

Select ONE product ID for each step. If no product fits a step, skip it.
Return ONLY valid JSON in this exact format:
{"morning": ["product_id_1", "product_id_2"], "evening": ["product_id_1", "product_id_2"]}`;

    const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
        messages: [
            { role: 'system', content: 'You are a skincare expert. Return only valid JSON.' },
            { role: 'user', content: prompt }
        ],
        max_tokens: 500
    });

    const text = response.response || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in AI response');

    const selection = JSON.parse(jsonMatch[0]);
    const productMap = new Map(products.map(p => [p.id, p]));

    return {
        morning: (selection.morning || []).map((id: string) => productMap.get(id)).filter(Boolean),
        evening: (selection.evening || []).map((id: string) => productMap.get(id)).filter(Boolean)
    };
}

async function createRoutines(
    env: Env,
    userId: string,
    selection: RoutineSelection
): Promise<{ morning_id: string | null; evening_id: string | null }> {
    const result = { morning_id: null as string | null, evening_id: null as string | null };

    // Delete existing routines for user
    await fetch(
        `${env.SUPABASE_URL}/rest/v1/routines?user_id=eq.${userId}`,
        {
            method: 'DELETE',
            headers: {
                'apikey': env.SUPABASE_SERVICE_KEY,
                'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`
            }
        }
    );

    // Create morning routine
    if (selection.morning.length > 0) {
        const morningRes = await fetch(
            `${env.SUPABASE_URL}/rest/v1/routines?select=id`,
            {
                method: 'POST',
                headers: {
                    'apikey': env.SUPABASE_SERVICE_KEY,
                    'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify({
                    user_id: userId,
                    routine_type: 'morning',
                    name: 'Morning Routine',
                    is_active: true
                })
            }
        );

        if (morningRes.ok) {
            const [routine] = await morningRes.json() as [{ id: string }];
            result.morning_id = routine.id;

            // Create steps
            const steps = selection.morning.map((product, index) => ({
                routine_id: routine.id,
                product_id: product.id,
                step_order: index + 1,
                step_type: product.metadata?.step_type || product.category,
                instructions: getInstructions(product.metadata?.step_type || product.category)
            }));

            await fetch(
                `${env.SUPABASE_URL}/rest/v1/routine_steps`,
                {
                    method: 'POST',
                    headers: {
                        'apikey': env.SUPABASE_SERVICE_KEY,
                        'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(steps)
                }
            );
        }
    }

    // Create evening routine
    if (selection.evening.length > 0) {
        const eveningRes = await fetch(
            `${env.SUPABASE_URL}/rest/v1/routines?select=id`,
            {
                method: 'POST',
                headers: {
                    'apikey': env.SUPABASE_SERVICE_KEY,
                    'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify({
                    user_id: userId,
                    routine_type: 'evening',
                    name: 'Evening Routine',
                    is_active: true
                })
            }
        );

        if (eveningRes.ok) {
            const [routine] = await eveningRes.json() as [{ id: string }];
            result.evening_id = routine.id;

            const steps = selection.evening.map((product, index) => ({
                routine_id: routine.id,
                product_id: product.id,
                step_order: index + 1,
                step_type: product.metadata?.step_type || product.category,
                instructions: getInstructions(product.metadata?.step_type || product.category)
            }));

            await fetch(
                `${env.SUPABASE_URL}/rest/v1/routine_steps`,
                {
                    method: 'POST',
                    headers: {
                        'apikey': env.SUPABASE_SERVICE_KEY,
                        'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(steps)
                }
            );
        }
    }

    return result;
}

function getInstructions(stepType: string): string {
    const instructions: Record<string, string> = {
        cleanser: 'Apply to damp skin, massage gently for 30-60 seconds, then rinse.',
        toner: 'Apply to a cotton pad and gently sweep across face, or pat directly onto skin.',
        serum: 'Apply 2-3 drops to clean skin, pat gently until absorbed.',
        moisturizer: 'Apply a pea-sized amount and massage into skin using upward motions.',
        spf: 'Apply generously as the last step. Reapply every 2 hours when outdoors.',
        treatment: 'Apply a thin layer to affected areas. Start with every other night if new to this product.'
    };
    return instructions[stepType] || 'Apply as directed on product packaging.';
}
