"use client";

import { motion } from "framer-motion";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { ArrowUp } from "lucide-react";
import { Icon } from "@/components/ui/icon";

interface RoastOMeterProps {
  score: number;
  trend?: number;
  className?: string;
}

export const RoastOMeter = ({ score, trend, className }: RoastOMeterProps) => {
  // Determine color based on score
  const color = score >= 80 ? "text-glow-green" : score >= 50 ? "text-yellow-500" : "text-primary";
  const strokeColor = score >= 80 ? "#34c759" : score >= 50 ? "#eab308" : "#ff382e";

  return (
    <div className={cn("relative flex flex-col items-center justify-center", className)}>
      <div className="relative size-40 md:size-48 flex items-center justify-center">
        {/* SVG Circle Background */}
        <svg className="absolute inset-0 size-full -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            className="stroke-card-border fill-none"
            strokeWidth="10"
          />
          <motion.circle
            cx="50%"
            cy="50%"
            r="45%"
            className="fill-none"
            stroke={strokeColor}
            strokeWidth="10"
            strokeLinecap="round"
            initial={{ strokeDasharray: "0, 1000" }}
            animate={{ strokeDasharray: `${(score / 100) * 283}, 283` }}
            transition={{ duration: 1.5, ease: "backOut" }}
          />
        </svg>

        <div className="flex flex-col items-center justify-center z-10">
          <Typography variant="score" className={color}>
            {score}
          </Typography>
          {trend !== undefined && (
            <div className="flex items-center gap-1 bg-glow-green/10 text-glow-green px-2 py-0.5 rounded-full mt-1">
              <Icon icon={ArrowUp} size={12} />
              <Typography weight="bold" className="text-xs">+{trend}%</Typography>
            </div>
          )}
        </div>
      </div>
      
      {/* Glow Effect */}
      <div 
        className="absolute inset-0 blur-3xl opacity-20 -z-10 rounded-full" 
        style={{ backgroundColor: strokeColor }}
      />
    </div>
  );
};
