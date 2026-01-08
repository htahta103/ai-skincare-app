import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { GoogleGenerativeAI } from "npm:@google/generative-ai";

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY') || '';

// Initialize clients
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

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

// Map quiz values to database values
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

Deno.serve(async (req: Request) => {
    // CORS
    if (req.method === 'OPTIONS') {
        return new Response(null, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
            },
        });
    }

    try {
        const body = await req.json();
        const userId = body.user_id;

        if (!userId) {
            return new Response(
                JSON.stringify({ error: 'Missing user_id' }),
                { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
            );
        }

        console.log(`[LOG] Generating routine for user: ${userId}`);

        // 1. Fetch user's skin profile
        const { data: profile, error: profileError } = await supabase
            .from('skin_profiles')
            .select('skin_type, skin_concerns, skin_goals')
            .eq('user_id', userId)
            .single();

        if (profileError || !profile) {
            console.error('[ERROR] No skin profile found:', profileError);
            return new Response(
                JSON.stringify({ error: 'Skin profile not found. Complete the quiz first.' }),
                { status: 404, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
            );
        }

        const skinProfile = profile as SkinProfile;
        console.log('[LOG] Skin profile:', skinProfile);

        // 2. Fetch all products
        const { data: products, error: productsError } = await supabase
            .from('products')
            .select('id, name, brand, category, affiliate_url, metadata');

        if (productsError || !products || products.length === 0) {
            console.error('[ERROR] No products found:', productsError);
            return new Response(
                JSON.stringify({ error: 'No products available' }),
                { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
            );
        }

        // 3. Filter products by skin type and concerns
        const matchedProducts = filterProducts(products as Product[], skinProfile);
        console.log(`[LOG] Matched ${matchedProducts.length} products`);

        // 4. Use Gemini to select the best products for AM/PM routines
        const routineSelection = await selectRoutineProducts(matchedProducts, skinProfile);
        console.log('[LOG] Routine selection:', routineSelection);

        // 5. Create routines in database
        const routineIds = await createRoutines(userId, routineSelection);

        return new Response(
            JSON.stringify({
                success: true,
                routines: routineIds,
                message: 'Routine generated successfully'
            }),
            { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
        );

    } catch (error: any) {
        console.error('[ERROR]', error);
        return new Response(
            JSON.stringify({ error: error.message || 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
        );
    }
});

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
    products: Product[],
    profile: SkinProfile
): Promise<{ morning: Product[], evening: Product[] }> {
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

    // Use Gemini to select best products if API key available
    if (GEMINI_API_KEY) {
        try {
            return await geminiSelectProducts(products, profile, morningSteps, eveningSteps);
        } catch (error) {
            console.error('[WARN] Gemini selection failed, using fallback:', error);
        }
    }

    // Fallback: select first matching product for each step
    const selectBestForStep = (stepType: string): Product | null => {
        const candidates = byStepType[stepType] || [];
        // Prefer products that match skin type
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

async function geminiSelectProducts(
    products: Product[],
    profile: SkinProfile,
    morningSteps: string[],
    eveningSteps: string[]
): Promise<{ morning: Product[], evening: Product[] }> {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
{
  "morning": ["product_id_1", "product_id_2", ...],
  "evening": ["product_id_1", "product_id_2", ...]
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');

    const selection = JSON.parse(jsonMatch[0]);

    // Map IDs back to products
    const productMap = new Map(products.map(p => [p.id, p]));

    return {
        morning: (selection.morning || []).map((id: string) => productMap.get(id)).filter(Boolean),
        evening: (selection.evening || []).map((id: string) => productMap.get(id)).filter(Boolean)
    };
}

async function createRoutines(
    userId: string,
    selection: { morning: Product[], evening: Product[] }
): Promise<{ morning_id: string | null, evening_id: string | null }> {
    const result = { morning_id: null as string | null, evening_id: null as string | null };

    // Delete existing routines for user
    await supabase.from('routines').delete().eq('user_id', userId);

    // Create morning routine
    if (selection.morning.length > 0) {
        const { data: morningRoutine, error: morningError } = await supabase
            .from('routines')
            .insert({
                user_id: userId,
                routine_type: 'morning',
                name: 'Morning Routine',
                is_active: true
            })
            .select('id')
            .single();

        if (!morningError && morningRoutine) {
            result.morning_id = morningRoutine.id;

            // Create steps
            const steps = selection.morning.map((product, index) => ({
                routine_id: morningRoutine.id,
                product_id: product.id,
                step_order: index + 1,
                step_type: product.metadata?.step_type || product.category,
                instructions: getInstructions(product.metadata?.step_type || product.category)
            }));

            await supabase.from('routine_steps').insert(steps);
        }
    }

    // Create evening routine
    if (selection.evening.length > 0) {
        const { data: eveningRoutine, error: eveningError } = await supabase
            .from('routines')
            .insert({
                user_id: userId,
                routine_type: 'evening',
                name: 'Evening Routine',
                is_active: true
            })
            .select('id')
            .single();

        if (!eveningError && eveningRoutine) {
            result.evening_id = eveningRoutine.id;

            const steps = selection.evening.map((product, index) => ({
                routine_id: eveningRoutine.id,
                product_id: product.id,
                step_order: index + 1,
                step_type: product.metadata?.step_type || product.category,
                instructions: getInstructions(product.metadata?.step_type || product.category)
            }));

            await supabase.from('routine_steps').insert(steps);
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
