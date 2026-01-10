export const runtime = 'edge';

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProgressClient } from './progress-client'

export default async function ProgressPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user's progress photos
  const { data: progressPhotos } = await supabase
    .from('progress_photos')
    .select('id, image_path, taken_at, created_at')
    .eq('user_id', user.id)
    .order('taken_at', { ascending: false })
    .limit(10)

  // Fetch user's skin scans for glow score trend with full analysis
  const { data: skinScans } = await supabase
    .from('skin_scans')
    .select('id, glow_score, analysis_summary, image_path, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(30)

  return (
    <ProgressClient 
      progressPhotos={progressPhotos || []}
      skinScans={(skinScans || []) as any}
      supabaseUrl={process.env.NEXT_PUBLIC_SUPABASE_URL || ''}
    />
  )
}
