"use client";

import { motion } from "framer-motion";
import { Typography } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/layout/navigation";
import { PageWrapper, FadeInItem } from "@/components/layout/page-wrapper";
import { Plus, ChevronRight, Share2, TrendingUp, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const PROGRESS_PHOTOS = [
  { id: 1, date: "Jan 2", src: "/assets/face_clean.png", score: 78 },
  { id: 2, date: "Dec 30", src: "https://images.unsplash.com/photo-1621607512214-68297480165e?q=80&w=1974&auto=format&fit=crop", score: 72 },
  { id: 3, date: "Dec 25", src: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=1974&auto=format&fit=crop", score: 68 },
];

export default function ProgressPage() {
  return (
    <PageWrapper className="min-h-screen bg-background text-foreground pb-32 transition-colors duration-300">
      <header className="px-6 py-6 border-b border-white/5 sticky top-0 bg-background/80 backdrop-blur-xl z-30">
        <div className="max-w-4xl mx-auto w-full flex items-center justify-between">
          <FadeInItem>
             <Typography as="h1" variant="headline" weight="bold">My Progress</Typography>
             <Typography variant="caption" className="opacity-60 italic">"Look at that evolution. Mostly."</Typography>
          </FadeInItem>
          <FadeInItem>
            <Button variant="ghost" size="sm" className="p-2 h-auto rounded-full bg-white/5">
               <Icon icon={Share2} size={20} />
            </Button>
          </FadeInItem>
        </div>
      </header>

      <main className="p-6 max-w-4xl mx-auto flex flex-col gap-8">
        
        {/* Glow Score Trend */}
        <FadeInItem>
          <Card className="p-8 flex flex-col gap-6 bg-gradient-to-br from-card-dark to-[#251817] border-white/5 rounded-3xl">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <Icon icon={TrendingUp} className="text-glow-green" />
                   <Typography weight="bold">Glow Score Trend</Typography>
                </div>
                <div className="flex items-center gap-2 opacity-40">
                   <Icon icon={Calendar} size={14} />
                   <Typography variant="caption" className="normal-case">Last 30 days</Typography>
                </div>
             </div>
             
             <div className="h-40 flex items-end gap-2 px-2">
                {[45, 52, 48, 65, 72, 68, 78].map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                     <motion.div 
                       initial={{ height: 0 }}
                       animate={{ height: `${v}%` }}
                       transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                       className={cn(
                         "w-full rounded-t-lg transition-all",
                         i === 6 ? "bg-primary" : "bg-white/10 group-hover:bg-white/20"
                       )}
                     />
                     <Typography variant="caption" className="text-[10px] opacity-20">0{i+1}</Typography>
                  </div>
                ))}
             </div>
          </Card>
        </FadeInItem>

        {/* Progress Photos Grid */}
        <div className="flex flex-col gap-6">
           <FadeInItem className="flex items-center justify-between">
              <Typography variant="headline" weight="bold" className="text-xl">Timeline</Typography>
              <Button variant="outline" size="sm" className="h-10 px-4 group rounded-full">
                 Add Photo <Icon icon={Plus} size={16} className="ml-2 group-hover:rotate-90 transition-transform" />
              </Button>
           </FadeInItem>

           <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {PROGRESS_PHOTOS.map((photo, idx) => (
                <FadeInItem key={photo.id}>
                  <Card className="group relative aspect-[3/4] overflow-hidden border-2 border-white/5 hover:border-primary/50 transition-all cursor-pointer rounded-2xl">
                    <img 
                      src={photo.src} 
                      alt={`Scan from ${photo.date}`} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                    
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                       <div className="flex flex-col">
                          <Typography weight="black" className="text-2xl text-white">{photo.score}</Typography>
                          <Typography variant="caption" className="opacity-100 font-bold text-white">{photo.date}</Typography>
                       </div>
                       <div className="size-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 text-white">
                          <Icon icon={ChevronRight} size={18} />
                       </div>
                    </div>
                  </Card>
                </FadeInItem>
              ))}
              
              {/* Empty State / Add Card */}
              <FadeInItem>
                <Card className="aspect-[3/4] border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 hover:border-white/20 cursor-pointer transition-all bg-white/5 group rounded-2xl">
                   <div className="size-14 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon icon={Plus} size={32} className="opacity-20 group-hover:opacity-100 group-hover:text-primary transition-all" />
                   </div>
                   <Typography variant="caption">Capture Today</Typography>
                </Card>
              </FadeInItem>
           </div>
        </div>

        {/* Compare Card */}
        <FadeInItem>
          <Card className="p-8 border-2 border-primary/20 bg-primary/5 overflow-hidden relative group cursor-pointer rounded-3xl">
             <div className="flex items-center justify-between relative z-10">
                <div className="flex flex-col gap-1">
                   <Typography variant="headline" weight="bold">Before & After</Typography>
                   <Typography className="text-sm opacity-60">"See how far you've come. Or haven't."</Typography>
                </div>
                <Button size="lg" className="rounded-2xl">Compare</Button>
             </div>
             
             {/* Decorative elements */}
             <div className="absolute -right-12 -top-12 size-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all" />
          </Card>
        </FadeInItem>
      </main>

      <Navigation />
    </PageWrapper>
  );
}
