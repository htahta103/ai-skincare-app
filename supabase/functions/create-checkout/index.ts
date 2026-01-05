import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';
import DodoPayments from 'npm:dodopayments';

const DODO_API_KEY_TEST = Deno.env.get('DODO_API_KEY_TEST') || '';
const DODO_API_KEY_LIVE = Deno.env.get('DODO_API_KEY_LIVE') || '';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || '';

// Initialize Supabase Client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function createDodoClient(apiKey: string, env: 'test_mode' | 'live_mode'): DodoPayments | null {
    if (!apiKey) return null;

    try {
        const trimmedApiKey = apiKey.trim().replace(/^Bearer\s+/i, '');
        return new DodoPayments({
            bearerToken: trimmedApiKey,
            environment: env,
        });
    } catch (err) {
        console.error('[ERROR] Failed to init Dodo client:', err);
        return null;
    }
}

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
        // Parse request body
        const body = await req.json();
        const planType = body.plan_type || 'pro';
        const isTest = body.is_test !== false; // Default to true if not specified

        const envMode = isTest ? 'test_mode' : 'live_mode';
        const apiKey = isTest ? DODO_API_KEY_TEST : DODO_API_KEY_LIVE;
        const productIdColumn = isTest ? 'dodo_product_id_test' : 'dodo_product_id_live';

        console.log(`[LOG] Creating checkout. Plan: ${planType}, Environment: ${envMode}`);

        if (!apiKey) {
            return new Response(
                JSON.stringify({ error: `Dodo API key not configured for ${envMode}` }),
                { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
            );
        }

        // Verify auth
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            return new Response(
                JSON.stringify({ error: 'Missing authorization header' }),
                { status: 401, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
            );
        }

        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return new Response(
                JSON.stringify({ error: 'Unauthorized' }),
                { status: 401, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
            );
        }

        const userId = user.id;
        const userEmail = user.email || '';
        const userName = user.user_metadata?.full_name || user.email || 'Customer';

        // Fetch product ID from database
        const { data: planData, error: planError } = await supabase
            .from('subscription_plans')
            .select(productIdColumn)
            .eq('tier', planType)
            .eq('active', true)
            .single();

        if (planError || !planData) {
            console.error('[ERROR] Plan lookup failed:', planError);
            return new Response(
                JSON.stringify({ error: `Invalid plan type: ${planType}. Not found in database.` }),
                { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
            );
        }

        // @ts-ignore - Dynamic column access
        const productId = planData[productIdColumn];
        if (!productId) {
            return new Response(
                JSON.stringify({ error: `Product ID not configured for ${planType} in ${envMode}` }),
                { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
            );
        }

        // Get origin for redirect
        const origin = req.headers.get('origin') || req.headers.get('referer') || 'http://localhost:3000';
        const baseUrl = origin.replace(/\/$/, '');

        // Create Dodo client
        const dodoClient = createDodoClient(apiKey, envMode);
        if (!dodoClient) {
            return new Response(
                JSON.stringify({ error: 'Failed to initialize Dodo client' }),
                { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
            );
        }

        // Create checkout session
        const checkoutSession = await dodoClient.checkoutSessions.create({
            product_cart: [{ product_id: productId, quantity: 1 }],
            customer: { email: userEmail, name: userName },
            billing: { city: '', country: 'VN', state: '', street: '', zipcode: '' },
            return_url: `${baseUrl}/subscription/success`,
            metadata: {
                user_id: userId,
                plan_type: planType,
                product_id: productId,
                environment: envMode,
            },
        });

        const sessionId = checkoutSession.session_id || checkoutSession.id;
        const checkoutUrl = checkoutSession.checkout_url || checkoutSession.url || checkoutSession.payment_link;

        if (!checkoutUrl) {
            return new Response(
                JSON.stringify({ error: 'No checkout URL received from Dodo' }),
                { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
            );
        }

        console.log(`[LOG] Checkout created: ${sessionId}`);

        return new Response(
            JSON.stringify({ sessionId, url: checkoutUrl }),
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
