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
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    // Call the generate-routine Edge Function
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-routine`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
                },
                body: JSON.stringify({ user_id: user.id })
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
