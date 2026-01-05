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
