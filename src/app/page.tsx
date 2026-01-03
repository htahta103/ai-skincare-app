"use client";

import { motion } from "framer-motion";
import { ArrowRight, Flame, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Icon } from "@/components/ui/icon";
import Link from "next/link";
import { PageWrapper, FadeInItem } from "@/components/layout/page-wrapper";

export default function WelcomePage() {
  return (
    <PageWrapper className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Navigation */}
      <nav className="border-b border-white/5 bg-background/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-6 md:px-12 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <Icon icon={Flame} className="text-primary w-8 h-8" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link href="/login">
              <Button variant="ghost">Log In</Button>
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center py-12 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <div className="flex flex-col gap-10 text-left order-2 lg:order-1">
            <div className="flex flex-col gap-8 pt-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <Typography as="h1" weight="black" className="text-5xl md:text-7xl leading-[1] tracking-tighter text-foreground">
                  SKINCARE <br />
                  <span className="text-primary">WITHOUT</span> <br />
                  THE BS.
                </Typography>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-center gap-6"
            >
              <Link href="/onboarding/quiz" className="w-full sm:w-auto">
                <Button size="xl" className="w-full sm:w-auto px-10 h-16 text-lg rounded-2xl group relative overflow-hidden">
                  <span className="relative z-10 flex items-center gap-2">
                    START THE ROAST
                    <Icon icon={ArrowRight} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                  <motion.div 
                    className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                  />
                </Button>
              </Link>
              
            </motion.div>
          </div>

          {/* Visual Anchor */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative order-1 lg:order-2"
          >
            <div className="aspect-[4/5] md:aspect-square rounded-[2.5rem] overflow-hidden relative shadow-[0_0_100px_rgba(255,56,46,0.15)] border border-white/10 group">
              <img 
                src="/assets/hero_bottle.png"
                alt="Premium skincare"
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background-dark/40 via-transparent to-transparent opacity-60" />
              
            </div>
            
            {/* Background Decor */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-full blur-[120px]" />
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-background">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <Typography variant="caption" className="opacity-30">© 2024 ROAST. No feelings were hurt in the making.</Typography>
          <div className="flex gap-12">
            {['Privacy', 'Terms', 'Instagram'].map((item) => (
              <Link key={item} href="#" className="text-[10px] uppercase tracking-widest opacity-30 hover:opacity-100 hover:text-primary transition-all font-bold">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </PageWrapper>
  );
}
