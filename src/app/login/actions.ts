'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('full_name') as string

    const { error, data: authData } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName || email.split('@')[0],
            }
        }
    })

    if (error) {
        return { error: error.message }
    }

    // Check if email confirmation is required
    if (authData.user && !authData.session) {
        return {
            success: true,
            message: 'Check your email for a confirmation link!'
        }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function loginWithCredentials(email: string, password: string) {
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    return { success: true, redirect: '/dashboard' }
}

export async function signupWithCredentials(email: string, password: string, fullName?: string) {
    const supabase = await createClient()

    const { error, data: authData } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName || email.split('@')[0],
            }
        }
    })

    if (error) {
        return { error: error.message }
    }

    // Check if email confirmation is required
    if (authData.user && !authData.session) {
        return {
            success: true,
            message: 'Check your email for a confirmation link!',
            needsConfirmation: true
        }
    }

    revalidatePath('/', 'layout')
    return { success: true, redirect: '/dashboard' }
}

export async function forgotPassword(email: string) {
    const supabase = await createClient()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/reset-password`,
    })

    if (error) {
        return { error: error.message }
    }

    return { success: true, message: 'Check your email for a password reset link!' }
}

export async function resetPassword(newPassword: string) {
    const supabase = await createClient()

    const { error } = await supabase.auth.updateUser({
        password: newPassword
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    return { success: true, redirect: '/login' }
}

export async function signInWithGoogle() {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
        },
    })

    if (error) {
        return { error: error.message }
    }

    return { success: true, url: data.url }
}

export async function resendConfirmationEmail(email: string) {
    const supabase = await createClient()

    const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
    })

    if (error) {
        return { error: error.message }
    }

    return { success: true, message: 'Confirmation email sent!' }
}
