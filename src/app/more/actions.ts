'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/login')
}

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const fullName = formData.get('full_name') as string

    const { error } = await supabase
        .from('profiles')
        .update({
            full_name: fullName,
            updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

    if (error) {
        return { error: 'Failed to update profile' }
    }

    revalidatePath('/more')
    return { success: true }
}
