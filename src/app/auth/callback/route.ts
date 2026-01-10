
import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type') as EmailOtpType | null
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/dashboard'

    const supabase = await createClient()

    // Handle OAuth callback with code
    if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            const redirectTo = request.nextUrl.clone()
            redirectTo.pathname = next.startsWith('/') ? next : `/${next}`
            redirectTo.searchParams.delete('code')
            return NextResponse.redirect(redirectTo)
        }
    }

    // Handle email OTP verification (signup confirmation, password reset)
    if (token_hash && type) {
        const { error } = await supabase.auth.verifyOtp({
            type,
            token_hash,
        })

        if (!error) {
            // For password recovery, redirect to reset-password page
            if (type === 'recovery') {
                const redirectTo = request.nextUrl.clone()
                redirectTo.pathname = '/reset-password'
                redirectTo.searchParams.delete('token_hash')
                redirectTo.searchParams.delete('type')
                return NextResponse.redirect(redirectTo)
            }

            // For other types (signup confirmation), redirect to next
            const relativeNext = next.startsWith('/') ? next : `/${next}`
            const redirectTo = request.nextUrl.clone()
            redirectTo.pathname = relativeNext
            redirectTo.searchParams.delete('token_hash')
            redirectTo.searchParams.delete('type')
            return NextResponse.redirect(redirectTo)
        }
    }

    // return the user to an error page with some instructions
    const redirectTo = request.nextUrl.clone()
    redirectTo.pathname = '/login'
    redirectTo.searchParams.set('error', 'auth_callback_failed')
    return NextResponse.redirect(redirectTo)
}


export const runtime = 'edge';
