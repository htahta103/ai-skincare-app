import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const rawBody = await req.text()
        console.log('[Edge Function] Request body received:', rawBody.substring(0, 200))

        let body
        try {
            body = JSON.parse(rawBody)
        } catch (e) {
            console.error('[Edge Function] Failed to parse JSON body:', e)
            return new Response(JSON.stringify({
                error: 'Invalid request format',
                user_message: 'Something went wrong. Please try scanning again.'
            }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
        }

        const { scan_id, image_path, user_id } = body
        console.log('[Edge Function] Parsed parameters:', { scan_id, image_path, user_id })

        if (!image_path || !user_id) {
            console.error('[Edge Function] Missing required fields')
            return new Response(
                JSON.stringify({
                    error: 'Missing required fields',
                    user_message: 'Image upload failed. Please try scanning again.'
                }),
                {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            )
        }

        // Get Cloudflare Worker URL and secret from environment
        const workerUrl = Deno.env.get('CLOUDFLARE_WORKER_URL')
        const workerSecret = Deno.env.get('CLOUDFLARE_WORKER_SECRET')
        const supabaseUrl = Deno.env.get('SUPABASE_URL')

        console.log('[Edge Function] Environment check:', {
            hasWorkerUrl: !!workerUrl,
            hasWorkerSecret: !!workerSecret,
            hasSupabaseUrl: !!supabaseUrl,
            workerUrlValue: workerUrl
        })

        // NO MORE FALLBACK - Return error if worker not configured
        if (!workerUrl || !workerSecret || !supabaseUrl) {
            console.error('[Edge Function] ❌ CRITICAL: Missing environment variables!')
            console.error('Missing:', {
                workerUrl: !workerUrl,
                workerSecret: !workerSecret,
                supabaseUrl: !supabaseUrl
            })
            return new Response(
                JSON.stringify({
                    error: 'Service configuration error',
                    user_message: 'AI analysis service is not available. Please contact support or try again later.',
                    debug: {
                        hasWorkerUrl: !!workerUrl,
                        hasWorkerSecret: !!workerSecret,
                        hasSupabaseUrl: !!supabaseUrl
                    }
                }),
                {
                    status: 503,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            )
        }

        // Construct full image URL
        const imageUrl = `${supabaseUrl}/storage/v1/object/public/scan-images/${image_path}`
        console.log('[Edge Function] Image URL:', imageUrl)

        console.log('[Edge Function] 🚀 Calling Cloudflare Worker at:', workerUrl)

        // Call Cloudflare Worker
        let workerResponse
        try {
            workerResponse = await fetch(workerUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${workerSecret}`
                },
                body: JSON.stringify({
                    image_url: imageUrl,
                    user_id,
                    scan_id: scan_id || 'pending'
                })
            })
        } catch (fetchError) {
            console.error('[Edge Function] ❌ Failed to reach worker:', fetchError)
            return new Response(
                JSON.stringify({
                    error: 'Worker connection failed',
                    user_message: 'Unable to connect to AI analysis service. Please check your internet connection and try again.'
                }),
                {
                    status: 503,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            )
        }

        console.log('[Edge Function] Worker response status:', workerResponse.status)

        // NO FALLBACK - Return the actual error from worker
        if (!workerResponse.ok) {
            const errorText = await workerResponse.text()
            console.error('[Edge Function] ❌ Worker error:', workerResponse.status, errorText)

            return new Response(
                JSON.stringify({
                    error: 'AI analysis failed',
                    user_message: 'Could not analyze your image. Please ensure good lighting and try scanning again.',
                    worker_status: workerResponse.status,
                    worker_error: errorText
                }),
                {
                    status: workerResponse.status,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            )
        }

        const analysisData = await workerResponse.json()
        console.log('[Edge Function] ✅ Worker returned successfully!')
        console.log('[Edge Function] Glow Score:', analysisData.glow_score)
        console.log('[Edge Function] Has roast:', !!analysisData.roast_message)

        return new Response(
            JSON.stringify({
                success: true,
                scan_id: scan_id || 'pending',
                ...analysisData
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        )

    } catch (error) {
        console.error('[Edge Function] ❌ Critical error:', error)

        return new Response(
            JSON.stringify({
                error: 'Internal server error',
                user_message: 'An unexpected error occurred. Please try scanning again.',
                message: error.message
            }),
            {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        )
    }
})
