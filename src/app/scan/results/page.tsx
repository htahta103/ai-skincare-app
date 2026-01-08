import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ResultsClient } from './results-client'

export default async function ScanResultsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch the latest scan for this user
  const { data: latestScan } = await supabase
    .from('skin_scans')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  // Fetch user profile for avatar
  const { data: profile } = await supabase
    .from('profiles')
    .select('avatar_url, full_name')
    .eq('id', user.id)
    .maybeSingle()

  return (
    <ResultsClient 
      latestScan={latestScan as any} 
      profile={profile}
      email={user.email}
    />
  )
}
