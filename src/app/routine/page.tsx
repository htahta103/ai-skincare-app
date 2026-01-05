import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { RoutineClient } from './routine-client'

export default async function RoutinePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: morningRoutine } = await supabase
    .from('routines')
    .select(`
      id,
      routine_type,
      name,
      is_active,
      routine_steps (
        id,
        step_order,
        step_type,
        instructions,
        product:products (
          name,
          brand
        )
      )
    `)
    .eq('user_id', user.id)
    .eq('routine_type', 'morning')
    .eq('is_active', true)
    .order('step_order', { referencedTable: 'routine_steps', ascending: true })
    .maybeSingle()

  // Fetch user's evening routine with steps and products
  const { data: eveningRoutine } = await supabase
    .from('routines')
    .select(`
      id,
      routine_type,
      name,
      is_active,
      routine_steps (
        id,
        step_order,
        step_type,
        instructions,
        product:products (
          name,
          brand
        )
      )
    `)
    .eq('user_id', user.id)
    .eq('routine_type', 'evening')
    .eq('is_active', true)
    .order('step_order', { referencedTable: 'routine_steps', ascending: true })
    .maybeSingle()

  // Check subscription status
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan_type, status')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle()

  const hasSubscription = subscription?.plan_type === 'premium' || subscription?.plan_type === 'pro'

  return (
    <RoutineClient 
      morningRoutine={morningRoutine}
      eveningRoutine={eveningRoutine}
      hasSubscription={hasSubscription}
    />
  )
}
