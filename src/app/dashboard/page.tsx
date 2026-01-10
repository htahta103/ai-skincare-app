export const runtime = 'edge';


import { createClient } from '@/lib/supabase/server'
import { DashboardClient } from '@/components/dashboard/dashboard-client'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch latest scan for glow score
  const { data: latestScan } = await supabase
    .from('skin_scans')
    .select('glow_score, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  // Fetch recent activity (last 3 scans)
  const { data: recentScans } = await supabase
    .from('skin_scans')
    .select('glow_score, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(3)

  // Fetch streak from challenges (if exists)
  const { data: challenge } = await supabase
    .from('challenges')
    .select('current_streak')
    .eq('user_id', user.id)
    .eq('challenge_type', 'daily_routine') // assuming this type exists or just any active challenge
    .maybeSingle()

  return (
    <DashboardClient 
      profile={profile} 
      email={user.email} 
      glowScore={latestScan?.glow_score || 0}
      streak={challenge?.current_streak || 0}
      recentActivity={recentScans || []}
    />
  )
}
