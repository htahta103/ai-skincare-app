"use client";

import { motion } from "framer-motion";
import { Typography } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Sun, Moon, CheckCircle2, Circle, Lock } from "lucide-react";
import { useState } from "react";
import { Navigation } from "@/components/layout/navigation";
import { PageWrapper, FadeInItem } from "@/components/layout/page-wrapper";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface RoutineStep {
  id: string;
  step_order: number;
  step_type: string;
  instructions: string | null;
  product?: {
    name: string;
    brand: string | null;
  } | null;
}

interface Routine {
  id: string;
  routine_type: string;
  name: string | null;
  is_active: boolean | null;
  routine_steps: RoutineStep[];
}

interface RoutineClientProps {
  morningRoutine: Routine | null;
  eveningRoutine: Routine | null;
  hasSubscription: boolean;
}

// Fallback mock data when no routine exists
const FALLBACK_MORNING: RoutineStep[] = [
  { id: '1', step_order: 1, step_type: "Cleanser", instructions: null, product: { name: "CeraVe Gentle Cleanser", brand: "CeraVe" } },
  { id: '2', step_order: 2, step_type: "Toner", instructions: null, product: { name: "Klairs Hydrating Toner", brand: "Dear, Klairs" } },
  { id: '3', step_order: 3, step_type: "Serum", instructions: null, product: { name: "Niacinamide 10% + Zinc", brand: "The Ordinary" } },
  { id: '4', step_order: 4, step_type: "Moisturizer", instructions: null, product: { name: "CeraVe PM Lotion", brand: "CeraVe" } },
  { id: '5', step_order: 5, step_type: "Sunscreen", instructions: null, product: { name: "EltaMD UV Clear SPF 46", brand: "EltaMD" } },
];

const FALLBACK_EVENING: RoutineStep[] = [
  { id: '6', step_order: 1, step_type: "Oil Cleanser", instructions: null, product: { name: "Anua Heartleaf Oil", brand: "Anua" } },
  { id: '7', step_order: 2, step_type: "Cleanser", instructions: null, product: { name: "CeraVe Gentle Cleanser", brand: "CeraVe" } },
  { id: '8', step_order: 3, step_type: "Treatment", instructions: null, product: { name: "Retinol 0.5% in Squalane", brand: "The Ordinary" } },
];

export function RoutineClient({ morningRoutine, eveningRoutine, hasSubscription }: RoutineClientProps) {
  const [activeTab, setActiveTab] = useState<"morning" | "evening">("morning");
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const morningSteps = Array.isArray(morningRoutine?.routine_steps) && morningRoutine.routine_steps.length 
    ? morningRoutine.routine_steps 
    : FALLBACK_MORNING;
  
  const eveningSteps = Array.isArray(eveningRoutine?.routine_steps) && eveningRoutine.routine_steps.length 
    ? eveningRoutine.routine_steps 
    : FALLBACK_EVENING;

  const routine = activeTab === "morning" ? morningSteps : eveningSteps;
  const isEveningLocked = activeTab === "evening" && !hasSubscription;

  const toggleStep = (stepId: string) => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      if (next.has(stepId)) {
        next.delete(stepId);
      } else {
        next.add(stepId);
      }
      return next;
    });
  };

  const markAllComplete = () => {
    const allIds = routine.map(step => step.id);
    setCompletedSteps(new Set(allIds));
  };

  return (
    <PageWrapper className="min-h-screen bg-background text-foreground pb-32 transition-colors duration-300">
      <header className="px-6 py-6 border-b border-white/5 sticky top-0 bg-background/80 backdrop-blur-xl z-30">
        <div className="max-w-2xl mx-auto w-full">
          <FadeInItem>
            <Typography as="h1" variant="headline" weight="bold">My Routine</Typography>
            <Typography variant="caption" className="opacity-60 italic">"Try to stick to it this time, maybe?"</Typography>
          </FadeInItem>
        </div>
      </header>

      <main className="p-6 max-w-2xl mx-auto flex flex-col gap-8">
        {/* Tab Switcher */}
        <FadeInItem>
          <div className="flex p-1 bg-card-dark rounded-2xl border border-white/5">
            <button 
              onClick={() => setActiveTab("morning")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all",
                activeTab === "morning" ? "bg-primary text-white" : "opacity-40 hover:opacity-100"
              )}
            >
              <Icon icon={Sun} size={18} />
              <Typography weight="bold" className="text-sm">Morning</Typography>
            </button>
            <button 
              onClick={() => setActiveTab("evening")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all",
                activeTab === "evening" ? "bg-primary text-white" : "opacity-40 hover:opacity-100"
              )}
            >
              <Icon icon={Moon} size={18} />
              <Typography weight="bold" className="text-sm">Evening</Typography>
            </button>
          </div>
        </FadeInItem>

        {/* Routine Steps */}
        <div className="flex flex-col gap-4">
          {routine.map((step, i) => {
            const isDone = completedSteps.has(step.id);
            const isLocked = isEveningLocked;
            
            return (
              <FadeInItem key={step.id}>
                <Card className={cn(
                  "p-6 flex items-center gap-4 transition-all group border-2 rounded-2xl",
                  isDone ? "border-glow-green/20 bg-glow-green/5" : "border-white/5 hover:border-white/10",
                  isLocked && "opacity-50 grayscale"
                )}>
                  <div className="flex-1 flex items-center gap-4">
                     <div className={cn(
                       "size-8 rounded-lg flex items-center justify-center border font-mono text-xs",
                       isDone ? "border-glow-green text-glow-green" : "border-white/10 text-white/40"
                     )}>
                       {step.step_order}
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                           <Typography variant="caption" className="opacity-40">{step.step_type}</Typography>
                           {isLocked && <Icon icon={Lock} size={10} className="text-primary" />}
                        </div>
                        <Typography weight="bold" className="truncate text-foreground">
                          {step.product?.name || step.instructions || step.step_type}
                        </Typography>
                        {step.product?.brand && (
                          <Typography className="text-xs opacity-40">{step.product.brand}</Typography>
                        )}
                     </div>
                  </div>
                  
                  {isLocked ? (
                     <Link href="/subscription" className="z-10 relative">
                       <Button variant="ghost" size="sm" className="text-primary font-bold text-[10px] uppercase hover:bg-primary/10">Unlock</Button>
                     </Link>
                  ) : (
                    <button 
                      onClick={() => toggleStep(step.id)}
                      className={cn(
                        "size-10 rounded-full flex items-center justify-center transition-all",
                        isDone ? "bg-glow-green/20 text-glow-green" : "bg-white/5 text-white/20 hover:text-white hover:bg-white/10"
                      )}
                    >
                      <Icon icon={isDone ? CheckCircle2 : Circle} size={24} />
                    </button>
                  )}
                </Card>
              </FadeInItem>
            );
          })}
        </div>

        {activeTab === "morning" && (
           <FadeInItem>
             <Button onClick={markAllComplete} variant="primary" size="xl" className="w-full mt-4 rounded-2xl">
               Mark All as Complete
             </Button>
           </FadeInItem>
        )}

        {/* Locked PM Message */}
        {isEveningLocked && (
          <FadeInItem>
            <Card className="p-8 border-dashed border-primary/40 bg-primary/5 flex flex-col items-center text-center gap-4 rounded-3xl">
               <div className="size-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <Icon icon={Lock} size={32} className="text-primary" />
               </div>
               <div className="flex flex-col gap-1">
                  <Typography variant="headline" weight="bold">Evening routine is locked.</Typography>
                  <Typography className="text-sm opacity-60">
                     You're on the free plan. Your face isn't going to fix itself for free forever.
                  </Typography>
               </div>
               <Link href="/subscription" className="w-full">
                 <Button variant="primary" className="w-full rounded-2xl">Feed the AI (Upgrade)</Button>
               </Link>
            </Card>
          </FadeInItem>
        )}
      </main>

      <Navigation />
    </PageWrapper>
  );
}
