"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Camera, RefreshCw, X, ChevronLeft, Lightbulb, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Icon } from "@/components/ui/icon";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function CameraScanPage() {
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);

  // Mock face detection
  useEffect(() => {
    const timer = setTimeout(() => setFaceDetected(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleCapture = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      router.push("/scan/results");
    }, 4000);
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white overflow-hidden">
      {/* Top Controls */}
      <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-30">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="rounded-full bg-black/20 backdrop-blur-md p-2 h-auto">
          <Icon icon={ChevronLeft} size={24} />
        </Button>
        <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
           <Icon icon={Zap} size={16} className="text-yellow-500" />
           <Typography weight="bold" className="text-xs uppercase tracking-widest">Live Analysis</Typography>
        </div>
        <Button variant="ghost" size="sm" className="rounded-full bg-black/20 backdrop-blur-md p-2 h-auto">
          <Icon icon={RefreshCw} size={20} />
        </Button>
      </div>

      {/* Viewport */}
      <div className="relative flex-1 flex items-center justify-center p-6">
        <div className="relative w-full aspect-[3/4] max-w-sm rounded-[3rem] overflow-hidden border-2 border-white/20">
          {/* Black gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 z-10" />
          
          <img 
            src="https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=1974&auto=format&fit=crop"
            className="w-full h-full object-cover grayscale opacity-60"
            alt="Camera stream"
          />

          {/* Scanner Guide Overlay */}
          <div className="absolute inset-0 flex items-center justify-center p-8 z-20">
             <motion.div 
               className={cn(
                 "relative w-full aspect-[4/5] rounded-[4rem] border-2 transition-colors duration-500",
                 faceDetected ? "border-glow-green" : "border-white/40"
               )}
               animate={faceDetected ? { scale: [1, 1.02, 1] } : {}}
               transition={{ repeat: Infinity, duration: 2 }}
             >
                {/* Corners */}
                <div className="absolute -top-1 -left-1 size-8 border-t-4 border-l-4 border-inherit rounded-tl-3xl" />
                <div className="absolute -top-1 -right-1 size-8 border-t-4 border-r-4 border-inherit rounded-tr-3xl" />
                <div className="absolute -bottom-1 -left-1 size-8 border-b-4 border-l-4 border-inherit rounded-bl-3xl" />
                <div className="absolute -bottom-1 -right-1 size-8 border-b-4 border-r-4 border-inherit rounded-br-3xl" />

                {/* Face Detection Indicator */}
                <AnimatePresence>
                  {faceDetected && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                       <div className="bg-glow-green/20 backdrop-blur-sm px-4 py-2 rounded-full border border-glow-green/40">
                          <Typography weight="bold" className="text-[10px] text-glow-green uppercase tracking-widest flex items-center gap-2">
                             Face Detected <span className="size-1.5 rounded-full bg-glow-green animate-pulse" />
                          </Typography>
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>
             </motion.div>
          </div>

          {/* Analyzing Overlay */}
          <AnimatePresence>
            {isAnalyzing && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-md z-40 flex flex-col items-center justify-center gap-6 p-8"
              >
                <div className="relative size-32">
                   <motion.div 
                     className="absolute inset-0 border-4 border-primary rounded-full"
                     initial={{ scale: 0.8, opacity: 0 }}
                     animate={{ scale: 1.4, opacity: 0 }}
                     transition={{ repeat: Infinity, duration: 1.5 }}
                   />
                   <div className="absolute inset-4 rounded-full bg-primary/20 flex items-center justify-center">
                       <motion.div
                         animate={{ y: [-20, 20, -20] }}
                         transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                         className="w-full h-1 bg-primary shadow-[0_0_20px_#ff382e]"
                       />
                   </div>
                </div>
                <div className="flex flex-col gap-2 items-center text-center">
                  <Typography variant="headline" weight="bold" className="text-xl">Roasting your pores...</Typography>
                  <Typography className="text-sm opacity-60 italic">"I've seen pizza crusts with better texture. Hang on..."</Typography>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="p-8 flex flex-col gap-6 bg-black z-30">
        <div className="flex items-center justify-center gap-6">
           <div className="flex flex-col items-center gap-1 opacity-40">
              <Icon icon={Lightbulb} size={24} />
              <Typography className="text-[10px] uppercase font-bold">Tips</Typography>
           </div>
           <button 
             onClick={handleCapture}
             disabled={isAnalyzing || !faceDetected}
             className={cn(
               "relative size-20 rounded-full border-4 transition-all active:scale-95 disabled:opacity-40",
               faceDetected ? "border-primary" : "border-white/20"
             )}
           >
              <div className={cn(
                "absolute inset-1 rounded-full transition-colors",
                faceDetected ? "bg-primary" : "bg-white/10"
              )} />
           </button>
           <div className="flex flex-col items-center gap-1 opacity-40">
              <Icon icon={Camera} size={24} />
              <Typography className="text-[10px] uppercase font-bold">Gallery</Typography>
           </div>
        </div>
        <Typography variant="caption" className="text-center opacity-40">Position your face within the frame</Typography>
      </div>
    </div>
  );
}
