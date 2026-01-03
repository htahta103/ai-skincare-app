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

interface RoutineItem {
  step: number;
  type: string;
  name: string;
  brand: string;
  done: boolean;
  locked?: boolean;
}

const ROUTINE_DATA: Record<"morning" | "evening", RoutineItem[]> = {
  morning: [
    { step: 1, type: "Cleanser", name: "CeraVe Gentle Cleanser", brand: "CeraVe", done: true },
    { step: 2, type: "Toner", name: "Klairs Hydrating Toner", brand: "Dear, Klairs", done: true },
    { step: 3, type: "Serum", name: "Niacinamide 10% + Zinc", brand: "The Ordinary", done: false },
    { step: 4, type: "Moisturizer", name: "CeraVe PM Lotion", brand: "CeraVe", done: false },
    { step: 5, type: "Sunscreen", name: "EltaMD UV Clear SPF 46", brand: "EltaMD", done: false },
  ],
  evening: [
    { step: 1, type: "Oil Cleanser", name: "Anua Heartleaf Oil", brand: "Anua", done: false, locked: true },
    { step: 2, type: "Cleanser", name: "CeraVe Gentle Cleanser", brand: "CeraVe", done: false, locked: true },
    { step: 3, type: "Treatment", name: "Retinol 0.5% in Squalane", brand: "The Ordinary", done: false, locked: true },
  ]
};

export default function RoutinePage() {
  const [activeTab, setActiveTab] = useState<"morning" | "evening">("morning");
  const routine = ROUTINE_DATA[activeTab];

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
          {routine.map((item, i) => (
            <FadeInItem key={i}>
              <Card className={cn(
                "p-6 flex items-center gap-4 transition-all group border-2 rounded-2xl",
                item.done ? "border-glow-green/20 bg-glow-green/5" : "border-white/5 hover:border-white/10",
                item.locked && "opacity-50 grayscale"
              )}>
                <div className="flex-1 flex items-center gap-4">
                   <div className={cn(
                     "size-8 rounded-lg flex items-center justify-center border font-mono text-xs",
                     item.done ? "border-glow-green text-glow-green" : "border-white/10 text-white/40"
                   )}>
                     {item.step}
                   </div>
                   <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                         <Typography variant="caption" className="opacity-40">{item.type}</Typography>
                         {item.locked && <Icon icon={Lock} size={10} className="text-primary" />}
                      </div>
                      <Typography weight="bold" className="truncate text-foreground">{item.name}</Typography>
                      <Typography className="text-xs opacity-40">{item.brand}</Typography>
                   </div>
                </div>
                
                {item.locked ? (
                   <Button variant="ghost" size="sm" className="text-primary font-bold text-[10px] uppercase">Unlock</Button>
                ) : (
                  <button className={cn(
                    "size-10 rounded-full flex items-center justify-center transition-all",
                    item.done ? "bg-glow-green/20 text-glow-green" : "bg-white/5 text-white/20 hover:text-white hover:bg-white/10"
                  )}>
                    <Icon icon={item.done ? CheckCircle2 : Circle} size={24} />
                  </button>
                )}
              </Card>
            </FadeInItem>
          ))}
        </div>

        {activeTab === "morning" && (
           <FadeInItem>
             <Button variant="primary" size="xl" className="w-full mt-4 rounded-2xl">
               Mark All as Complete
             </Button>
           </FadeInItem>
        )}

        {/* Locked PM Message */}
        {activeTab === "evening" && (
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
               <Button variant="primary" className="w-full rounded-2xl">Feed the AI (Upgrade)</Button>
            </Card>
          </FadeInItem>
        )}
      </main>

      <Navigation />
    </PageWrapper>
  );
}
