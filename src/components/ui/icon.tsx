"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface IconProps {
  icon: LucideIcon;
  className?: string;
  size?: number;
  strokeWidth?: number;
}

export const Icon = ({ 
  icon: LucideIcon, 
  className, 
  size = 24, 
  strokeWidth = 1.5 
}: IconProps) => {
  return (
    <LucideIcon 
      size={size} 
      strokeWidth={strokeWidth} 
      className={cn("text-current transition-colors", className)} 
    />
  );
};
