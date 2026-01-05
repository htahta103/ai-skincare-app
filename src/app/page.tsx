import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import WelcomeClient from './welcome-client'

export default async function WelcomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return <WelcomeClient />
}
