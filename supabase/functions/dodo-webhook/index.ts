import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
});

// Webhook secrets
const DODO_WEBHOOK_SECRET_TEST = Deno.env.get('DODO_WEBHOOK_SECRET_TEST') || '';
const DODO_WEBHOOK_SECRET_LIVE = Deno.env.get('DODO_WEBHOOK_SECRET_LIVE') || '';

// Plan quotas
const PLAN_QUOTAS: Record<string, number> = {
    free: 10,
    pro: 50,
    premium: 999, // Unlimited
};

// Idempotency
const processedWebhookIds = new Set<string>();

Deno.serve(async (req: Request) => {
    console.log('=== Dodo Webhook received ===');

    if (req.method === 'OPTIONS') {
        return new Response(null, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, webhook-id, webhook-signature, webhook-timestamp',
            },
        });
    }

    try {
        // Standard Webhooks headers
        const webhookId = req.headers.get('webhook-id');
        const webhookSignature = req.headers.get('webhook-signature');
        const webhookTimestamp = req.headers.get('webhook-timestamp');

        if (!webhookId || !webhookSignature || !webhookTimestamp) {
            return new Response(
                JSON.stringify({ error: 'Missing webhook headers' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Idempotency check
        if (processedWebhookIds.has(webhookId)) {
            return new Response(
                JSON.stringify({ received: true, message: 'Already processed' }),
                { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const rawBody = await req.text();
        let event: any;
        try {
            event = JSON.parse(rawBody);
        } catch {
            return new Response(
                JSON.stringify({ error: 'Invalid JSON' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Verify signature with both secrets (Test and Live)
        // Dodo might not strictly enforce URL params, so we check both to be robust.
        const secretsToTry: string[] = [];
        if (DODO_WEBHOOK_SECRET_TEST) secretsToTry.push(DODO_WEBHOOK_SECRET_TEST);
        if (DODO_WEBHOOK_SECRET_LIVE) secretsToTry.push(DODO_WEBHOOK_SECRET_LIVE);

        let verified = false;

        for (const secret of secretsToTry) {
            try {
                const webhook = new Webhook(secret);
                await webhook.verify(rawBody, {
                    'webhook-id': webhookId,
                    'webhook-signature': webhookSignature,
                    'webhook-timestamp': webhookTimestamp,
                });
                verified = true;
                console.log(`[LOG] Signature verified with secret: ${secret.substring(0, 5)}...`);
                break;
            } catch (e) {
                // Try next secret
            }
        }

        if (!verified) {
            console.error('[ERROR] Signature verification failed for all secrets.');
            return new Response(
                JSON.stringify({ error: 'Invalid signature' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        processedWebhookIds.add(webhookId);

        const eventType = event.type;
        const eventData = event.data;
        console.log(`[LOG] Event: ${eventType}`);

        switch (eventType) {
            case 'payment.succeeded': {
                const userId = eventData.metadata?.user_id;
                const planType = eventData.metadata?.plan_type || 'pro';
                const customerId = eventData.customer_id || eventData.customer?.id;
                const subscriptionId = eventData.subscription_id;

                if (!userId) {
                    console.warn('[WARN] No user_id in metadata');
                    break;
                }

                console.log(`[LOG] Payment succeeded for user: ${userId}, plan: ${planType}`);

                // Update subscription record
                // Note: Optimistic locking trigger (check_subscription_version) has been removed, so we don't need to manage versions.
                const { error: subError } = await supabase
                    .from('subscriptions')
                    .upsert({
                        user_id: userId,
                        plan_type: planType,
                        status: 'active',
                        payment_provider: 'dodo',
                        provider_subscription_id: subscriptionId || customerId,
                        current_period_start: new Date().toISOString(),
                        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // +30 days
                        updated_at: new Date().toISOString(),
                    }, { onConflict: 'user_id' });

                if (subError) {
                    console.error('[ERROR] Failed to update subscription:', subError);
                }

                // Update scan quota limit
                const newLimit = PLAN_QUOTAS[planType] || PLAN_QUOTAS.pro;
                const today = new Date().toISOString().split('T')[0];

                await supabase
                    .from('scan_usage')
                    .upsert({
                        user_id: userId,
                        usage_date: today,
                        scans_limit: newLimit,
                    }, { onConflict: 'user_id,usage_date' });

                console.log(`[LOG] ✓ Subscription activated: ${planType}`);
                break;
            }

            case 'subscription.cancelled':
            case 'subscription.deleted': {
                const customerId = eventData.customer_id || eventData.customer?.id;
                const userId = eventData.metadata?.user_id;

                // Find user by customer ID or user_id
                let targetUserId = userId;
                if (!targetUserId && customerId) {
                    const { data } = await supabase
                        .from('subscriptions')
                        .select('user_id')
                        .eq('provider_subscription_id', customerId)
                        .single();
                    targetUserId = data?.user_id;
                }

                if (targetUserId) {
                    await supabase
                        .from('subscriptions')
                        .update({
                            status: 'cancelled',
                            plan_type: 'free',
                            cancelled_at: new Date().toISOString(),
                            updated_at: new Date().toISOString(),
                        })
                        .eq('user_id', targetUserId);

                    // Reset quota to free tier
                    const today = new Date().toISOString().split('T')[0];
                    await supabase
                        .from('scan_usage')
                        .upsert({
                            user_id: targetUserId,
                            usage_date: today,
                            scans_limit: PLAN_QUOTAS.free,
                        }, { onConflict: 'user_id,usage_date' });

                    console.log(`[LOG] ✓ Subscription cancelled for user: ${targetUserId}`);
                }
                break;
            }

            case 'subscription.renewed': {
                const customerId = eventData.customer_id;
                const userId = eventData.metadata?.user_id;

                let targetUserId = userId;
                if (!targetUserId && customerId) {
                    const { data } = await supabase
                        .from('subscriptions')
                        .select('user_id, plan_type')
                        .eq('provider_subscription_id', customerId)
                        .single();
                    targetUserId = data?.user_id;
                }

                if (targetUserId) {
                    await supabase
                        .from('subscriptions')
                        .update({
                            status: 'active',
                            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                            updated_at: new Date().toISOString(),
                        })
                        .eq('user_id', targetUserId);

                    console.log(`[LOG] ✓ Subscription renewed for user: ${targetUserId}`);
                }
                break;
            }

            default:
                console.log(`[LOG] Unhandled event type: ${eventType}`);
        }

        return new Response(
            JSON.stringify({ received: true }),
            { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
        );

    } catch (error: any) {
        console.error('[ERROR]', error);
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
        );
    }
});
