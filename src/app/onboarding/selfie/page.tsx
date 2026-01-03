"use client";

import { motion } from "framer-motion";
import { Camera, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Icon } from "@/components/ui/icon";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SelfieOnboarding() {
  const router = useRouter();
  const [scanning, setScanning] = useState(false);

  const startScan = () => {
    setScanning(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 3000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-dark text-white p-6 md:p-12 overflow-hidden">
      <main className="max-w-2xl mx-auto w-full flex-1 flex flex-col items-center justify-center gap-12">
        
        {!scanning ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-8 text-center"
          >
            <div className="flex flex-col gap-4">
              <Typography as="h1" variant="headline" weight="bold" className="text-4xl">
                Okay, show me the damage.
              </Typography>
              <Typography className="opacity-60">
                Don't worry, I've seen worse. Probably.
              </Typography>
            </div>

            <div className="relative w-full aspect-square max-w-sm">
              <div className="absolute inset-0 border-2 border-dashed border-white/20 rounded-full animate-spin-slow" />
              <div className="absolute inset-4 rounded-full overflow-hidden bg-white/5 flex items-center justify-center">
                <Icon icon={Camera} size={80} className="text-white/20" />
              </div>
              
              {/* Guides */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-primary rounded-full" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-primary rounded-full" />
              <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1 h-4 bg-primary rounded-full" />
              <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1 h-4 bg-primary rounded-full" />
            </div>

            <div className="flex flex-col gap-4 w-full">
              <Button size="xl" onClick={startScan} className="w-full">
                Take Selfie
              </Button>
              <Button variant="ghost" onClick={() => router.push("/dashboard")}>
                Skip for now
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center gap-8 text-center">
             <div className="relative w-64 h-64">
               <motion.div 
                 className="absolute inset-0 border-4 border-primary rounded-full"
                 initial={{ scale: 0.8, opacity: 0 }}
                 animate={{ scale: 1.2, opacity: 0 }}
                 transition={{ repeat: Infinity, duration: 1.5 }}
               />
               <div className="absolute inset-0 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center">
                 <motion.div
                   animate={{ y: [-20, 20, -20] }}
                   transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                   className="w-full h-1 bg-primary shadow-[0_0_20px_#ff382e]"
                 />
               </div>
             </div>
             <div className="flex flex-col gap-2">
               <Typography variant="headline" weight="bold" className="flex items-center gap-2">
                 Analyzing... <Icon icon={Sparkles} className="text-primary animate-pulse" />
               </Typography>
               <Typography className="opacity-60 italic">
                 "Hmm, let me roast— I mean, analyze this..."
               </Typography>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}
