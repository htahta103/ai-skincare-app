'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { Json } from '@/types/supabase'

export async function saveScanResult(imagePath: string, glowScore: number, analysisSummary: Json) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    // Check if user can perform scan - wrap in try/catch as function might not exist
    try {
        const { data: canScan } = await supabase.rpc('can_perform_scan', {
            p_user_id: user.id,
            p_scan_type: 'skin'
        })

        if (canScan && typeof canScan === 'object' && 'allowed' in canScan && !canScan.allowed) {
            return { error: (canScan as { reason?: string }).reason || 'Scan limit reached' }
        }
    } catch {
        // Function might not exist, continue with scan
    }

    // Create skin scan record
    const { data: scan, error: scanError } = await supabase
        .from('skin_scans')
        .insert({
            user_id: user.id,
            image_path: imagePath,
            glow_score: glowScore,
            analysis_summary: analysisSummary,
            scan_status: 'completed'
        })
        .select()
        .single()

    if (scanError) {
        return { error: 'Failed to save scan' }
    }

    // Consume scan quota
    await supabase.rpc('consume_scan_quota', {
        p_user_id: user.id,
        p_scan_type: 'skin'
    })

    revalidatePath('/scan')
    revalidatePath('/progress')
    revalidatePath('/dashboard')

    return { success: true, scanId: scan.id }
}

export async function checkScanQuota() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated', allowed: false }
    }

    const { data } = await supabase.rpc('can_perform_scan', {
        p_user_id: user.id,
        p_scan_type: 'skin'
    })

    return data || { allowed: true }
}

export async function uploadAndAnalyzeScan(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    const file = formData.get('image') as File
    if (!file) {
        return { error: 'No image provided' }
    }

    try {
        // Generate unique filename
        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}/${Date.now()}.${fileExt}`

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('scan-images')
            .upload(fileName, file, {
                contentType: file.type,
                upsert: false
            })

        if (uploadError) {
            console.error('Upload error:', uploadError)
            return { error: 'Failed to upload image' }
        }

        // Call AI Worker for analysis
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const workerUrl = process.env.CLOUDFLARE_WORKER_URL
        const workerSecret = process.env.CLOUDFLARE_WORKER_SECRET

        // Validate Worker configuration
        if (!workerUrl || !workerSecret) {
            console.error('[Scan] Worker not configured - missing CLOUDFLARE_WORKER_URL or CLOUDFLARE_WORKER_SECRET')
            return { error: 'AI analysis service not configured. Please contact support.' }
        }

        console.log('[Scan] Calling Worker:', {
            scan_id: 'pending',
            image_path: uploadData.path
        })

        let analysisResult
        try {
            // Construct full image URL for worker
            const imageUrl = `${supabaseUrl}/storage/v1/object/public/scan-images/${uploadData.path}`

            console.log('[Scan] Calling Worker directly')

            const response = await fetch(workerUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${workerSecret}`
                },
                body: JSON.stringify({
                    scan_id: 'pending',
                    image_path: uploadData.path,
                    image_url: imageUrl,
                    user_id: user.id
                })
            })

            console.log('AI Worker response status:', response.status)

            const responseData = await response.json()

            if (!response.ok) {
                console.error('AI Worker error:', responseData)
                // Return the user-friendly error message from the Worker
                return {
                    error: responseData.user_message || responseData.message || 'AI analysis failed. Please try scanning again.',
                    details: responseData.error
                }
            }

            // Check if there's an error in the response
            if (responseData.error) {
                console.error('Worker returned error:', responseData)
                return {
                    error: responseData.user_message || responseData.error || 'Analysis failed. Please try again.'
                }
            }

            analysisResult = responseData
            console.log('AI analysis result:', analysisResult)
        } catch (error) {
            console.error('AI Worker call failed:', error)
            // NO FALLBACK - Return error to user
            return {
                error: 'Unable to analyze image. Please check your connection and try again.'
            }
        }

        // Create scan record with FULL analysis result
        // Merge roast_message into analysis_summary and save recommendations/products
        const fullAnalysisSummary = {
            ...analysisResult.analysis_summary,
            roast_message: analysisResult.roast_message || analysisResult.analysis_summary?.roast_message,
            recommendations: analysisResult.recommendations || [],
            product_suggestions: analysisResult.product_suggestions || []
        }

        const { data: scan, error: scanError } = await supabase
            .from('skin_scans')
            .insert({
                user_id: user.id,
                image_path: uploadData.path,
                glow_score: analysisResult.glow_score,
                analysis_summary: fullAnalysisSummary,
                scan_status: 'completed'
            })
            .select()
            .single()

        console.log('Saved scan to DB:', {
            id: scan?.id,
            glow_score: analysisResult.glow_score,
            has_roast: !!fullAnalysisSummary.roast_message,
            recommendations_count: fullAnalysisSummary.recommendations?.length
        })

        if (scanError) {
            console.error('Scan creation error:', scanError)
            return { error: 'Failed to create scan record' }
        }

        revalidatePath('/dashboard')
        revalidatePath('/progress')
        revalidatePath('/scan/results')

        return { success: true, scanId: scan.id }
    } catch (error) {
        console.error('Unexpected error:', error)
        return { error: 'An unexpected error occurred' }
    }
}
