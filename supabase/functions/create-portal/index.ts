
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "jsr:@supabase/supabase-js@2"
import DodoPayments from 'npm:dodopayments';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // 1. Auth Setup
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            {
                global: {
                    headers: { Authorization: req.headers.get('Authorization')! },
                },
            }
        )

        const {
            data: { user },
        } = await supabaseClient.auth.getUser()

        if (!user) {
            throw new Error('User not found')
        }

        // 2. Get Subscription from DB
        // We need the secret_role key here to read subscriptions if RLS is strict, 
        // but usually the user can read their own.
        // However, for robustness, we can use the service role client for DB queries inside functions if needed.
        // But let's stick to the auth client for RLS security (only read own subscription).
        const { data: subscription, error: subError } = await supabaseClient
            .from('subscriptions')
            .select('provider_subscription_id')
            .eq('user_id', user.id)
            .eq('status', 'active') // Only manage active subs
            .single();

        if (subError || !subscription) {
            return new Response(
                JSON.stringify({ error: 'No active subscription found' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        const subId = subscription.provider_subscription_id;
        if (!subId) {
            throw new Error('Subscription ID missing in database');
        }

        // 3. Try to get Customer ID and Create Portal Session
        // We don't know if it's Live or Test, so we try Test first.

        const DODO_API_KEY_TEST = Deno.env.get('DODO_API_KEY_TEST');
        const DODO_API_KEY_LIVE = Deno.env.get('DODO_API_KEY_LIVE');

        let portalUrl: string | null = null;
        let errorLog: any[] = [];

        // Try Test Mode
        if (DODO_API_KEY_TEST) {
            try {
                const client = new DodoPayments({
                    bearerToken: DODO_API_KEY_TEST,
                    environment: 'test_mode',
                });

                // Get Subscription to find Customer ID
                const subData = await client.subscriptions.retrieve(subId);
                const customerId = subData.customerId || subData.customer?.id;

                if (customerId) {
                    const session = await client.portal.sessions.create({
                        customer: customerId,
                    });
                    portalUrl = session.link; // Verify logic/property name
                }
            } catch (e) {
                errorLog.push({ mode: 'test', error: e });
            }
        }

        // If not found in Test, Try Live Mode
        if (!portalUrl && DODO_API_KEY_LIVE) {
            try {
                const client = new DodoPayments({
                    bearerToken: DODO_API_KEY_LIVE,
                    environment: 'live_mode',
                });

                // Get Subscription to find Customer ID
                const subData = await client.subscriptions.retrieve(subId);
                const customerId = subData.customerId || subData.customer?.id;

                if (customerId) {
                    const session = await client.portal.sessions.create({
                        customer: customerId,
                    });
                    portalUrl = session.link;
                }
            } catch (e) {
                errorLog.push({ mode: 'live', error: e });
            }
        }

        if (!portalUrl) {
            console.error('Portal creation failed:', errorLog);
            return new Response(
                JSON.stringify({ error: 'Could not create portal session', details: errorLog }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        return new Response(
            JSON.stringify({ url: portalUrl }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            }
        )

    } catch (error) {
        console.error(error)
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            }
        )
    }
})
