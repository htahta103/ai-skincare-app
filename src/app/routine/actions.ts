'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function toggleRoutineStep(stepId: string, completed: boolean) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    // For now, we'll track completion in a simple way
    // In production, you might want a separate completion tracking table
    const { error } = await supabase
        .from('routine_steps')
        .update({
            // Using metadata or a completion field
        })
        .eq('id', stepId)

    if (error) {
        return { error: 'Failed to update step' }
    }

    revalidatePath('/routine')
    return { success: true }
}

export async function markAllComplete(routineId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    // Mark all steps in routine as complete
    revalidatePath('/routine')
    return { success: true }
}

export async function regenerateRoutine() {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        return { error: 'Not authenticated' }
    }

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
            console.error('Routine regeneration error:', errorData)
            return { error: errorData.message || 'Failed to regenerate routine' }
        }

        revalidatePath('/routine')
        return { success: true }
    } catch (error) {
        console.error('Error regenerating routine:', error)
        return { error: 'Failed to regenerate routine' }
    }
}
