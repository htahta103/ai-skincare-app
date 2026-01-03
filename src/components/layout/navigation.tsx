"use client";

import { motion } from "framer-motion";
import { Home, Camera, ClipboardList, BarChart3, Grip } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: Camera, label: "Scan", href: "/scan" },
  { icon: ClipboardList, label: "Routine", href: "/routine" },
  { icon: BarChart3, label: "Progress", href: "/progress" },
  { icon: Grip, label: "More", href: "/more" },
];

export const Navigation = () => {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <nav className="flex items-center gap-1 p-2 bg-card-dark/80 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <button
                className={cn(
                  "relative group flex flex-col items-center justify-center size-12 rounded-full transition-all",
                  isActive 
                    ? "text-primary bg-primary/10" 
                    : "text-white/40 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon icon={item.icon} size={24} />
                {isActive && (
                  <motion.div 
                    layoutId="nav-indicator"
                    className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary"
                  />
                )}
                <span className="absolute -top-12 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">
                  {item.label}
                </span>
              </button>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
