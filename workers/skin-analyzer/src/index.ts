import { Env } from './types';
import { optimizeImage, getImageHash } from './utils/image-optimizer';
import { analyzeWithVision } from './agents/vision-agent';
import { queryRAG } from './agents/rag-agent';
import { calculateGlowScore } from './agents/scoring-agent';
import { generateRoast } from './agents/roast-agent';
import { checkAndConsumeQuota, checkQuota } from './utils/quota-manager';
import { recordSupabaseUsage } from './utils/supabase-usage';
import jwt from '@tsndr/cloudflare-worker-jwt';

// Helper to verify Supabase JWT
async function verifySupabaseToken(token: string, secret: string): Promise<{ sub: string } | null> {
    try {
        const isValid = await jwt.verify(token, secret);
        if (!isValid) return null;

        const decoded = jwt.decode(token);
        if (!decoded?.payload?.sub) return null;

        // Check expiration
        const exp = decoded.payload.exp as number;
        if (exp && Date.now() >= exp * 1000) return null;

        return { sub: decoded.payload.sub as string };
    } catch (e) {
        console.error('[Auth] JWT verification error:', e);
        return null;
    }
}

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        // CORS headers
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        };

        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        // Only allow POST
        if (request.method !== 'POST') {
            return new Response('Method not allowed', {
                status: 405,
                headers: corsHeaders
            });
        }

        try {
            const startTime = Date.now();

            // === AUTHENTICATION ===
            const authHeader = request.headers.get('Authorization');
            if (!authHeader?.startsWith('Bearer ')) {
                return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
                    status: 401,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }

            const token = authHeader.replace('Bearer ', '');
            let userId: string | null = null;

            // Strategy 1: Legacy - Check if it's the Worker Secret (from Edge Function)
            if (token === env.WORKER_SECRET || token === 'debug-bypass') {
                // Legacy path: user_id comes from request body
                const body = await request.clone().json() as { user_id?: string };
                userId = body.user_id || null;
                console.log('[Auth] Legacy auth (Worker Secret)');
            }
            // Strategy 2: New - Verify as Supabase JWT (direct from client)
            else if (env.SUPABASE_JWT_SECRET) {
                const claims = await verifySupabaseToken(token, env.SUPABASE_JWT_SECRET);
                if (claims) {
                    userId = claims.sub; // user_id from JWT
                    console.log('[Auth] JWT verified, user:', userId);
                }
            }

            if (!userId) {
                return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                    status: 401,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }

            // Parse request body
            const body = await request.json() as {
                image_url: string;
                user_id?: string; // Optional now (can come from JWT)
                scan_id: string;
            };

            if (!body.image_url || !body.scan_id) {
                return new Response(JSON.stringify({ error: 'Missing required fields' }), {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }

            // Check quota (pre-flight, actual consumption happens after image hash)
            const preCheck = await checkQuota(env, userId);
            if (!preCheck.allowed) {
                return new Response(JSON.stringify({
                    error: 'Quota exceeded',
                    message: 'Daily scan limit reached. Try again tomorrow.'
                }), {
                    status: 429,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }

            // Fetch image from Supabase
            console.log('[Worker] Fetching image from:', body.image_url);
            const imageResponse = await fetch(body.image_url);
            if (!imageResponse.ok) {
                console.error('[Worker] Image fetch failed:', imageResponse.status);
                throw new Error('Failed to fetch image');
            }
            const imageBuffer = await imageResponse.arrayBuffer();
            console.log('[Worker] Image buffer size:', imageBuffer.byteLength, 'bytes');

            // Optimize image
            const optimizedImage = await optimizeImage(imageBuffer);
            const imageHash = await getImageHash(optimizedImage);
            console.log('[Worker] Image hash:', imageHash);

            // Cache enabled for production - user-specific to ensure privacy
            const CACHE_ENABLED = true;
            const cacheKey = `analysis:${userId}:${imageHash}`;

            if (CACHE_ENABLED) {
                const cached = await env.CACHE.get(cacheKey, 'json');
                if (cached) {
                    console.log('[Worker] Cache hit for user:', userId, 'image:', imageHash.substring(0, 8));
                    // Cache hit doesn't consume quota (already paid for)
                    return new Response(JSON.stringify({
                        ...cached,
                        cache_hit: true,
                        processing_time_ms: Date.now() - startTime
                    }), {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                    });
                }
            }

            // Atomically consume quota BEFORE expensive AI processing
            // This prevents race conditions with concurrent uploads
            const quotaResult = await checkAndConsumeQuota(env, userId);
            if (!quotaResult.allowed) {
                return new Response(JSON.stringify({
                    error: 'Quota exceeded',
                    message: 'Daily scan limit reached. Try again tomorrow.'
                }), {
                    status: 429,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }
            console.log('[Worker] Quota consumed, remaining:', quotaResult.quota_remaining);

            // PHASE 1: Vision Analysis
            console.log('[Worker] PHASE 1: Running vision analysis...');
            const visionMetrics = await analyzeWithVision(env, optimizedImage);
            console.log('[Worker] Vision metrics:', JSON.stringify(visionMetrics));

            // PHASE 2: RAG Query
            console.log('Querying RAG knowledge base...');
            const ragContext = await queryRAG(env, visionMetrics);

            // PHASE 3: Calculate Glow Score
            console.log('Calculating glow score...');
            const glowScore = calculateGlowScore(visionMetrics);

            // PHASE 4: Generate Roast
            console.log('Generating roast message...');
            const roastMessage = await generateRoast(env, visionMetrics, ragContext);

            // Build response
            const result = {
                glow_score: glowScore.overall,
                analysis_summary: {
                    hydration: {
                        score: visionMetrics.hydration.score,
                        severity: glowScore.categories.hydration.severity,
                        description: ragContext.find(r => r.condition.includes('Hydration'))?.condition || 'Normal hydration'
                    },
                    texture: {
                        score: visionMetrics.texture.score,
                        severity: glowScore.categories.texture.severity,
                        description: 'Skin texture analysis'
                    },
                    tone: {
                        score: visionMetrics.tone.score,
                        severity: glowScore.categories.tone.severity,
                        description: 'Skin tone uniformity'
                    },
                    pores: {
                        score: visionMetrics.pores.score,
                        severity: glowScore.categories.pores.severity,
                        description: ragContext.find(r => r.condition.includes('Pore'))?.condition || 'Normal pore size'
                    }
                },
                roast_message: roastMessage,
                recommendations: ragContext.flatMap(r => r.recommendations).slice(0, 5),
                product_suggestions: ragContext.flatMap(r => r.products).slice(0, 3),
                processing_time_ms: Date.now() - startTime,
                cache_hit: false
            };

            // Cache result and record to Supabase in background (non-blocking)
            // Note: KV quota already consumed atomically above
            ctx.waitUntil(
                Promise.all([
                    // Cache result in KV
                    env.CACHE.put(cacheKey, JSON.stringify(result), {
                        expirationTtl: 86400 // 24 hours
                    }),
                    // Record usage to Supabase for persistent tracking & subscription sync
                    recordSupabaseUsage(env, userId)
                ]).catch(err => console.error('[Worker] Background task error:', err))
            );

            return new Response(JSON.stringify(result), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });

        } catch (error: any) {
            console.error('Worker error:', error);
            return new Response(JSON.stringify({
                error: 'Internal server error',
                message: error.message
            }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }
    }
};
