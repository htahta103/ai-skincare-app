import { Env } from '../types';

/**
 * Records scan usage to Supabase for persistent tracking
 * This syncs with subscription plans and provides audit trail
 */
export async function recordSupabaseUsage(
    env: Env,
    userId: string
): Promise<{ success: boolean; daily_used?: number; daily_remaining?: number }> {
    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_KEY) {
        console.warn('[Usage] Supabase not configured, skipping usage recording');
        return { success: false };
    }

    try {
        const response = await fetch(`${env.SUPABASE_URL}/rest/v1/rpc/record_scan_usage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': env.SUPABASE_SERVICE_KEY,
                'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`
            },
            body: JSON.stringify({ p_user_id: userId })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[Usage] Supabase RPC error:', response.status, errorText);
            return { success: false };
        }

        const result = await response.json();
        console.log('[Usage] Recorded to Supabase:', result);

        // Result is an array with one row
        const usage = Array.isArray(result) ? result[0] : result;

        return {
            success: true,
            daily_used: usage?.daily_used,
            daily_remaining: usage?.daily_remaining
        };
    } catch (error) {
        console.error('[Usage] Failed to record to Supabase:', error);
        return { success: false };
    }
}

/**
 * Gets current usage from Supabase (for checking against subscription limits)
 */
export async function getSupabaseUsage(
    env: Env,
    userId: string
): Promise<{ daily_used: number; daily_limit: number; daily_remaining: number } | null> {
    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_KEY) {
        return null;
    }

    try {
        const response = await fetch(`${env.SUPABASE_URL}/rest/v1/rpc/get_scan_usage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': env.SUPABASE_SERVICE_KEY,
                'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`
            },
            body: JSON.stringify({ p_user_id: userId })
        });

        if (!response.ok) {
            return null;
        }

        const result = await response.json();
        const usage = Array.isArray(result) ? result[0] : result;

        return usage || null;
    } catch (error) {
        console.error('[Usage] Failed to get from Supabase:', error);
        return null;
    }
}
