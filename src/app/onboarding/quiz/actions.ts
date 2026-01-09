'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface SkinProfileData {
    skinType: string
    skinConcerns: string[]
    skinGoals: string[]
}

export async function saveSkinProfile(data: SkinProfileData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    // Upsert skin profile
    const { error } = await supabase
        .from('skin_profiles')
        .upsert({
            user_id: user.id,
            skin_type: data.skinType,
            skin_concerns: data.skinConcerns,
            skin_goals: data.skinGoals,
            updated_at: new Date().toISOString()
        }, {
            onConflict: 'user_id'
        })

    if (error) {
        console.error('Error saving skin profile:', error)
        return { error: 'Failed to save skin profile' }
    }

    revalidatePath('/dashboard')
    revalidatePath('/routine')

    return { success: true }
}

export async function generateUserRoutine() {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        return { error: 'Not authenticated' }
    }

    // Call the Cloudflare Worker's generate-routine endpoint
    try {
        const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL || 'https://skin-analyzer.roast-skin.workers.dev'

        const response = await fetch(
            `${workerUrl}/generate-routine`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({})
            }
        )

        if (!response.ok) {
            const errorData = await response.json()
            console.error('Routine generation error:', errorData)
            return { error: 'Failed to generate routine' }
        }

        revalidatePath('/routine')
        return { success: true }
    } catch (error) {
        console.error('Error calling generate-routine:', error)
        return { error: 'Failed to generate routine' }
    }
}
