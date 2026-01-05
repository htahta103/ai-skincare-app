"use client";

import { PageWrapper, FadeInItem } from "@/components/layout/page-wrapper";
import { Navigation } from "@/components/layout/navigation";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Flame, Check, CheckCircle2, ArrowRight, X, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const PLANS = [
  {
    name: "Free",
    subtitle: "The Gentle Roast",
    price: "$0",
    description: "Perfect for thick skin.",
    features: [
      "Basic skin scan analysis",
      "Daily roast reminder",
      "Community access"
    ],
    cta: "Start Free",
    recommended: true,
    highlight: false
  },
  {
    name: "Pro",
    subtitle: "Deep Burn",
    price: "$9.99",
    description: "For those who want results.",
    features: [
      "Unlimited scans",
      "Routine builder",
      "Ingredient analysis"
    ],
    cta: "Start 7-Day Trial",
    highlight: true,
    recommended: false
  },
  {
    name: "Premium",
    subtitle: "Incineration",
    price: "$19.99",
    description: "Total transformation.",
    features: [
      "Dermatologist review",
      "Priority support",
      "Exclusive content"
    ],
    cta: "Start 7-Day Trial",
    highlight: false,
    recommended: false
  }
];

export default function SubscriptionPage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function checkSubscription() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('status', 'active')
        .single();
      
      if (data) {
        setSubscription(data);
      }
    }
    checkSubscription();
  }, []);

  const handleManage = async () => {
    try {
      setLoadingPlan('manage');
      const { data, error } = await supabase.functions.invoke('create-portal');
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No portal URL returned');
      }
    } catch (error) {
      console.error('Portal error:', error);
      alert('Failed to open subscription settings.');
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleSubscribe = async (planName: string) => {
    const planType = planName.toLowerCase();
    
    if (planType === 'free') {
      router.push('/dashboard');
      return;
    }

    try {
      setLoadingPlan(planName);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Redirect to login if not authenticated, return to subscription page after
        router.push(`/login?next=/subscription`);
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plan_type: planType },
      });

      if (error) {
        throw error;
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        console.error('No checkout URL received', data);
        alert('Failed to start checkout. Please try again.');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <PageWrapper className="min-h-screen bg-background text-foreground flex flex-col items-center">
      {/* Header */}
      <header className="w-full flex justify-center border-b border-white/5 bg-background/80 backdrop-blur-xl sticky top-0 z-50 px-6 py-4">
        <div className="max-w-5xl w-full flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-foreground group">
             <Icon icon={Flame} className="text-primary group-hover:scale-110 transition-transform" />
             <Typography weight="bold" className="text-xl">ROAST</Typography>
          </Link>
          <div className="text-sm font-medium text-white/40">Step 2 of 3</div>
        </div>
      </header>
      
      <main className="flex-1 w-full max-w-6xl p-6 md:p-12 flex flex-col gap-12 items-center">
        
        <FadeInItem className="flex flex-col gap-4 text-center items-center max-w-2xl">
           <Typography as="h1" variant="display" weight="black" className="text-4xl md:text-6xl leading-tight">
             How hot do you want <br/>this roast?
           </Typography>
           <Typography className="text-lg opacity-60 max-w-lg">
             Choose your intensity. Honesty is our policy, but we let you pick the volume.
           </Typography>
        </FadeInItem>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
           {PLANS.map((plan, i) => {
             const isCurrentPlan = subscription?.status === 'active' && subscription?.plan_type === plan.name.toLowerCase();
             const hasActiveSub = !!subscription;
             // If user has active sub, we generally want to direct them to portal for any plan change
             // BUT for Free plan, clicking it effectively just goes to dashboard (handled by handleSubscribe 'free' check)
             // However, strictly speaking, 'Downgrade to Free' happens in portal.
             // Let's simplify: if hasActiveSub, show 'Manage' on everything except maybe Free which navigates to Dashboard?
             // Or 'Manage' on everything.
             
             // Refined logic:
             // If isCurrentPlan -> 'Manage Subscription'
             // If !isCurrentPlan but hasActiveSub -> 'Manage Subscription' (Switch in portal)
             // Unless it's Free -> 'Go to Dashboard'
             
             let buttonText = plan.cta;
             if (hasActiveSub) {
                if (isCurrentPlan) buttonText = "Manage Subscription";
                else if (plan.name === 'Free') buttonText = "Go to Dashboard";
                else buttonText = "Manage Subscription";
             }

             const handleAction = () => {
                if (hasActiveSub && plan.name !== 'Free') {
                    handleManage();
                } else {
                    handleSubscribe(plan.name);
                }
             };

             return (
             <FadeInItem key={plan.name} delay={i * 0.1} className="h-full">
               <div className={cn(
                 "group relative flex flex-col gap-6 rounded-3xl p-8 h-full transition-all duration-300 hover:-translate-y-2",
                 plan.recommended 
                   ? "bg-card-dark border-2 border-primary shadow-[0_0_40px_-10px_rgba(238,52,43,0.2)]" 
                   : "bg-black/20 border border-white/5 hover:bg-white/5 hover:border-white/10"
               )}>
                 
                 {plan.recommended && (
                   <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                      Recommended Start
                   </div>
                 )}

                 {isCurrentPlan && (
                   <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg flex gap-1 items-center">
                      <Icon icon={Check} size={12} />
                      Current Plan
                   </div>
                 )}

                 <div className="flex flex-col gap-2">
                   <div className="flex items-center justify-between">
                     <Typography variant="headline" weight="bold" className="text-2xl">{plan.name}</Typography>
                     <Typography variant="caption" className="opacity-40 uppercase tracking-widest">{plan.subtitle}</Typography>
                   </div>
                   
                   <div className="flex items-baseline gap-1 mt-2">
                     <Typography weight="black" className="text-5xl tracking-tighter">{plan.price}</Typography>
                     <Typography className="text-lg opacity-60 font-medium">/mo</Typography>
                   </div>
                   
                   <Typography className="text-sm opacity-60 mt-1">{plan.description}</Typography>
                 </div>

                 <ul className="flex flex-col gap-4 flex-grow py-4">
                   {plan.features.map((feature, j) => (
                     <li key={j} className="flex items-start gap-3 text-sm">
                       <Icon icon={CheckCircle2} size={20} className={cn(
                         (plan.recommended || isCurrentPlan) ? "text-primary" : "text-white/20 group-hover:text-white transition-colors"
                       )} />
                       <span className="opacity-80">{feature}</span>
                     </li>
                   ))}
                 </ul>
                 
                 <Button 
                   variant={plan.recommended || isCurrentPlan ? "primary" : "outline"} 
                   size="xl" 
                   className={cn(
                     "w-full rounded-xl font-bold",
                     (!plan.recommended && !isCurrentPlan) && "border-white/10 hover:bg-white hover:text-black hover:border-white"
                   )}
                   onClick={handleAction}
                   disabled={!!loadingPlan}
                 >
                   {loadingPlan === (hasActiveSub && plan.name !== 'Free' ? 'manage' : plan.name) ? 'Processing...' : buttonText}
                   {((plan.recommended && !hasActiveSub) || isCurrentPlan) && !loadingPlan && <Icon icon={isCurrentPlan ? Settings : ArrowRight} size={18} className="ml-2" />}
                 </Button>

               </div>
             </FadeInItem>
           );
         })}
        </div>
        
        <FadeInItem delay={0.4}>
          <Link href="/dashboard">
            <Typography className="text-sm font-medium opacity-40 hover:opacity-100 transition-opacity hover:underline">
              Maybe later, I'll keep my bad skin
            </Typography>
          </Link>
        </FadeInItem>

      </main>
      
      <Navigation />
    </PageWrapper>
  );
}
