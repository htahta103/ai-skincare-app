"use client";

import { motion } from "framer-motion";
import { Typography } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { RoastOMeter } from "@/components/dashboard/roast-o-meter";
import { Navigation } from "@/components/layout/navigation";
import { PageWrapper, FadeInItem } from "@/components/layout/page-wrapper";
import { 
  Flame, 
  Sun, 
  Lightbulb, 
  Timer, 
  Plus,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <PageWrapper className="min-h-screen bg-background text-foreground pb-32 transition-colors duration-300">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-6 border-b border-white/5 bg-background/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <FadeInItem className="flex items-center gap-2">
            <Icon icon={Flame} className="text-primary" />
            <Typography weight="bold" className="text-xl">ROAST</Typography>
          </FadeInItem>
          <div className="flex items-center gap-4">
            <FadeInItem className="hidden sm:flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
              <Icon icon={Sun} size={16} className="text-yellow-500" />
              <Typography variant="caption" className="opacity-100 font-bold">UV 6 HIGH</Typography>
            </FadeInItem>
            <FadeInItem className="size-10 rounded-full bg-gradient-to-br from-primary to-orange-500 border-2 border-white/10 overflow-hidden">
               <img src="/assets/face_clean.png" alt="User" className="w-full h-full object-cover" />
            </FadeInItem>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 flex flex-col gap-8">
        <FadeInItem className="flex flex-col gap-1">
          <Typography variant="display" weight="black" className="text-4xl md:text-5xl">
            Good Morning, Alexa.
          </Typography>
          <Typography className="opacity-60">Ready for your daily roast?</Typography>
        </FadeInItem>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          
          {/* Main Score - Spans 4 cols on lg */}
          <FadeInItem className="lg:col-span-4 h-full">
            <Card className="p-8 flex flex-col justify-between h-[400px] hover:border-primary/50 group transition-all">
              <div className="flex flex-col gap-1">
                <Typography variant="caption">Glow Score</Typography>
                <Typography variant="headline" weight="bold">Looking crispy.</Typography>
                <Typography className="text-sm opacity-60 italic">"Drink some water, seriously."</Typography>
              </div>
              <RoastOMeter score={78} trend={5} />
            </Card>
          </FadeInItem>

          {/* Tips Section - Spans 5 cols on lg */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <FadeInItem className="flex-1">
              <Card className="h-full p-8 bg-gradient-to-br from-card-dark to-[#342221] relative overflow-hidden group border-white/5">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                  <Icon icon={Lightbulb} size={120} className="text-primary" />
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <Icon icon={Lightbulb} className="text-primary" />
                  <Typography variant="caption" className="text-primary opacity-100 italic">Daily Roast</Typography>
                </div>
                <Typography variant="headline" weight="bold" className="max-w-xs">
                  Stop picking at that spot on your chin. It's not going to fix itself.
                </Typography>
              </Card>
            </FadeInItem>

            <div className="grid grid-cols-2 gap-6 h-40">
              <FadeInItem>
                <Card className="h-full p-6 flex flex-col justify-between hover:bg-white/5 cursor-pointer border-white/5">
                  <Icon icon={Sun} className="text-yellow-500" />
                  <div>
                    <Typography variant="headline" weight="black">6</Typography>
                    <Typography variant="caption" className="opacity-100 text-yellow-500">UV Index</Typography>
                  </div>
                </Card>
              </FadeInItem>
              <FadeInItem>
                <Card className="h-full p-6 flex flex-col justify-between hover:bg-white/5 cursor-pointer border-white/5">
                  <Icon icon={Flame} className="text-orange-500" />
                  <div>
                    <Typography variant="headline" weight="black">12</Typography>
                    <Typography variant="caption" className="opacity-100 text-orange-500">Streak</Typography>
                  </div>
                </Card>
              </FadeInItem>
            </div>
          </div>

          {/* Activity/Actions - Spans 3 cols on lg */}
          <div className="lg:col-span-3 flex flex-col gap-6">
             <FadeInItem>
               <Link href="/scan">
                 <Button size="xl" className="w-full flex justify-between px-6 group rounded-2xl">
                   <span>SCAN FACE</span>
                   <Icon icon={Plus} className="group-hover:rotate-90 transition-transform" />
                 </Button>
               </Link>
             </FadeInItem>

             <FadeInItem className="flex-1">
               <Card className="h-full p-6 flex flex-col gap-4 border-white/5">
                 <Typography variant="headline" weight="bold" className="text-xl">Recent</Typography>
                 <div className="flex flex-col gap-4">
                   {[
                     { icon: Sun, label: "Morning Routine", status: "Done", time: "8:00 AM", color: "text-glow-green" },
                     { icon: Flame, label: "Face Scan", status: "78", time: "Yesterday", color: "text-primary" },
                     { icon: Timer, label: "Progress Photo", status: "Added", time: "2d ago", color: "text-white/40" },
                   ].map((item, i) => (
                     <div key={i} className="flex items-center gap-3 group cursor-pointer">
                       <div className="size-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-white/20 transition-colors">
                         <Icon icon={item.icon} size={16} className="text-white/60" />
                       </div>
                       <div className="flex-1 min-w-0">
                         <Typography weight="medium" className="text-sm truncate">{item.label}</Typography>
                         <Typography className="text-[10px] opacity-40 uppercase tracking-wider">{item.time}</Typography>
                       </div>
                       <Typography weight="bold" className={cn("text-xs uppercase", item.color)}>{item.status}</Typography>
                     </div>
                   ))}
                 </div>
                 <Button variant="ghost" size="sm" className="mt-auto w-full group">
                   View All <Icon icon={ArrowRight} size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                 </Button>
               </Card>
             </FadeInItem>
          </div>
        </div>

        {/* Special Tip Card */}
        <FadeInItem>
          <Card className="p-6 bg-primary/10 border-primary/20 flex items-center justify-between group cursor-pointer hover:bg-primary/20 transition-all rounded-3xl">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-2xl bg-primary flex items-center justify-center">
                <Icon icon={Sparkles} className="text-white" />
              </div>
              <div>
                <Typography weight="bold">Tonight's Goal</Typography>
                <Typography className="opacity-60 text-sm italic">"Your skin is thirstier than a LinkedIn influencer."</Typography>
              </div>
            </div>
            <Icon icon={ArrowRight} className="text-primary group-hover:translate-x-1 transition-transform" />
          </Card>
        </FadeInItem>
      </main>

      <Navigation />
    </PageWrapper>
  );
}
