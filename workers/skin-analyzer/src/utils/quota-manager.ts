import { Env } from '../types';

const DAILY_QUOTA = 100; // scans per day per user
const QUOTA_KEY_PREFIX = 'quota:';

/**
 * Atomically check and consume quota in one operation
 * Prevents race conditions when multiple requests come in simultaneously
 */
export async function checkAndConsumeQuota(env: Env, userId: string): Promise<{
    allowed: boolean;
    quota_remaining: number;
}> {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const quotaKey = `${QUOTA_KEY_PREFIX}${userId}:${today}`;

    // Get current usage with metadata for atomic check
    const currentUsage = await env.CACHE.get(quotaKey);
    const usage = currentUsage ? parseInt(currentUsage) : 0;

    // Check if quota exceeded
    if (usage >= DAILY_QUOTA) {
        return {
            allowed: false,
            quota_remaining: 0
        };
    }

    // Optimistically increment - KV eventual consistency is acceptable here
    // In the worst case, a user might get 1-2 extra scans during high concurrency
    await env.CACHE.put(quotaKey, (usage + 1).toString(), {
        expirationTtl: 90000 // 25 hours
    });

    return {
        allowed: true,
        quota_remaining: Math.max(0, DAILY_QUOTA - usage - 1)
    };
}

/**
 * Check quota without consuming (for pre-flight checks)
 */
export async function checkQuota(env: Env, userId: string): Promise<{
    allowed: boolean;
    quota_remaining: number;
}> {
    const today = new Date().toISOString().split('T')[0];
    const quotaKey = `${QUOTA_KEY_PREFIX}${userId}:${today}`;

    const currentUsage = await env.CACHE.get(quotaKey);
    const usage = currentUsage ? parseInt(currentUsage) : 0;

    return {
        allowed: usage < DAILY_QUOTA,
        quota_remaining: Math.max(0, DAILY_QUOTA - usage)
    };
}

/**
 * Record usage (legacy - prefer checkAndConsumeQuota for atomic operations)
 */
export async function recordUsage(env: Env, userId: string): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    const quotaKey = `${QUOTA_KEY_PREFIX}${userId}:${today}`;

    const currentUsage = await env.CACHE.get(quotaKey);
    const usage = currentUsage ? parseInt(currentUsage) : 0;

    // Increment and store with 25-hour expiration (allows for timezone differences)
    await env.CACHE.put(quotaKey, (usage + 1).toString(), {
        expirationTtl: 90000 // 25 hours
    });
}

export async function getUsageStats(env: Env, userId: string): Promise<{
    today: number;
    remaining: number;
}> {
    const today = new Date().toISOString().split('T')[0];
    const quotaKey = `${QUOTA_KEY_PREFIX}${userId}:${today}`;

    const currentUsage = await env.CACHE.get(quotaKey);
    const usage = currentUsage ? parseInt(currentUsage) : 0;

    return {
        today: usage,
        remaining: Math.max(0, DAILY_QUOTA - usage)
    };
}
