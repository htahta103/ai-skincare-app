import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { MoreClient } from './more-client'

export default async function MorePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, email, avatar_url')
    .eq('id', user.id)
    .maybeSingle()

  // Fetch subscription status
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan_type, status')
    .eq('user_id', user.id)
    .maybeSingle()

  return (
    <MoreClient 
      profile={profile} 
      subscription={subscription} 
      email={user.email} 
    />
  )
}
