
"use client";

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
import { Database } from "@/types/supabase"

type Profile = Database['public']['Tables']['profiles']['Row']

import { getSupabaseImageUrl } from "@/lib/images";

interface DashboardClientProps {
    profile: Profile | null
    email?: string | null
    glowScore: number
    streak: number
    recentActivity: {
      glow_score: number | null
      created_at: string | null
    }[]
}

const DAILY_ROASTS = [
  "Stop picking at that spot on your chin. It's not going to fix itself.",
  "Your skin is thirstier than a LinkedIn influencer. Drink water.",
  "I've seen pizza crusts with better texture. Use that exfoliant.",
  "Sunscreen isn't optional, unless you're auditioning for a raisin role.",
  "That 'natural glow' is just oil. Blotting papers are your friend.",
];

export function DashboardClient({ profile, email, glowScore, streak, recentActivity }: DashboardClientProps) {
  const displayName = profile?.full_name?.split(' ')[0] || "Stranger";
  const avatarUrl = getSupabaseImageUrl(profile?.avatar_url, 'avatars') || "/assets/face_clean.png";
  
  // Use a stable random roast based on date
  const roastIndex = new Date().getDate() % DAILY_ROASTS.length;
  const currentDailyRoast = DAILY_ROASTS[roastIndex];

  // Mock UV index for now - in a real app this would come from an API based on location
  const uvIndex = 6; 

  const getStatusText = (score: number) => {
    if (score >= 85) return "Looking radiant.";
    if (score >= 70) return "Looking crispy.";
    if (score >= 50) return "A bit rough.";
    return "Oof, rough night?";
  };

  const getRoastText = (score: number) => {
    if (score >= 85) return "\"Don't get cocky, it's just good lighting.\"";
    if (score >= 70) return "\"Drink some water, seriously.\"";
    if (score >= 50) return "\"Maybe try sleeping instead of doomscrolling.\"";
    return "\"Your skin is thirstier than a LinkedIn influencer.\"";
  };

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
            <Link href="/subscription">
            <button className="hidden sm:flex h-9 items-center justify-center rounded-lg px-4 bg-white/5 hover:bg-white/10 text-white text-sm font-bold transition-colors border border-white/5 disabled:opacity-50 disabled:cursor-not-allowed">
              <span>Premium</span>
            </button>
            </Link>
            <FadeInItem className="size-10 rounded-full bg-gradient-to-br from-primary to-orange-500 border-2 border-white/10 overflow-hidden relative">
               {/* Use standard img tag for now or Next Image if configured */}
               <img src={avatarUrl} alt="User" className="w-full h-full object-cover" />
            </FadeInItem>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 flex flex-col gap-8">
        <FadeInItem className="flex flex-col gap-1">
          <Typography variant="display" weight="black" className="text-4xl md:text-5xl">
            Good Morning, {displayName}.
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
                <Typography variant="headline" weight="bold">{getStatusText(glowScore)}</Typography>
                <Typography className="text-sm opacity-60 italic">{getRoastText(glowScore)}</Typography>
              </div>
              <RoastOMeter score={glowScore || 0} trend={glowScore > 0 ? 5 : 0} />
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
                  {currentDailyRoast}
                </Typography>
              </Card>
            </FadeInItem>

            <div className="grid grid-cols-2 gap-6 h-40">
              <FadeInItem>
                <Card className="h-full p-6 flex flex-col justify-between hover:bg-white/5 cursor-pointer border-white/5">
                  <Icon icon={Sun} className="text-yellow-500" />
                  <div>
                    <Typography variant="headline" weight="black">{uvIndex}</Typography>
                    <Typography variant="caption" className="opacity-100 text-yellow-500">UV Index</Typography>
                  </div>
                </Card>
              </FadeInItem>
              <FadeInItem>
                <Card className="h-full p-6 flex flex-col justify-between hover:bg-white/5 cursor-pointer border-white/5">
                  <Icon icon={Flame} className="text-orange-500" />
                  <div>
                    <Typography variant="headline" weight="black">{streak}</Typography>
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
                   {recentActivity.length > 0 ? (
                     recentActivity.map((item, i) => (
                       <Link key={i} href="/progress">
                         <div className="flex items-center gap-3 group cursor-pointer py-1">
                           <div className="size-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-white/20 transition-colors">
                             <Icon icon={Flame} size={16} className="text-white/60" />
                           </div>
                           <div className="flex-1 min-w-0">
                             <Typography weight="medium" className="text-sm truncate">Face Scan</Typography>
                             <Typography className="text-[10px] opacity-40 uppercase tracking-wider">
                               {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
                             </Typography>
                           </div>
                           <Typography weight="bold" className="text-xs uppercase text-primary">{item.glow_score}</Typography>
                         </div>
                       </Link>
                     ))
                   ) : (
                     <div className="flex flex-col items-center justify-center py-6 opacity-40 text-center gap-2">
                        <Icon icon={Timer} size={24} />
                        <Typography variant="caption">No activity yet</Typography>
                     </div>
                   )}
                 </div>
                 <Link href="/progress" className="mt-auto block">
                    <Button variant="ghost" size="sm" className="w-full group">
                      View All <Icon icon={ArrowRight} size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                 </Link>
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
