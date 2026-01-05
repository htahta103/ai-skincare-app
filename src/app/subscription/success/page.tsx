"use client";

import { PageWrapper, FadeInItem } from "@/components/layout/page-wrapper";
import { Navigation } from "@/components/layout/navigation";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Flame, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SubscriptionSuccessPage() {
  const router = useRouter();

  return (
    <PageWrapper className="min-h-screen bg-background text-foreground flex flex-col items-center">
      {/* Header */}
      <header className="w-full flex justify-center border-b border-white/5 bg-background/80 backdrop-blur-xl sticky top-0 z-50 px-6 py-4">
        <div className="max-w-5xl w-full flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-foreground group">
             <Icon icon={Flame} className="text-primary group-hover:scale-110 transition-transform" />
             <Typography weight="bold" className="text-xl">ROAST</Typography>
          </Link>
        </div>
      </header>
      
      <main className="flex-1 w-full max-w-2xl p-6 md:p-12 flex flex-col gap-8 items-center justify-center text-center">
        
        <FadeInItem>
          <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-6 mx-auto">
            <Icon icon={CheckCircle2} size={48} className="text-primary" />
          </div>
        </FadeInItem>

        <FadeInItem delay={0.1} className="flex flex-col gap-4">
           <Typography as="h1" variant="display" weight="black" className="text-4xl md:text-5xl leading-tight">
             Payment Successful!
           </Typography>
           <Typography className="text-lg opacity-60 max-w-lg mx-auto">
             You now have access to premium features. Get ready for some serious roasting.
           </Typography>
        </FadeInItem>

        <FadeInItem delay={0.2} className="w-full max-w-sm mt-4">
          <Link href="/dashboard">
            <Button size="xl" className="w-full font-bold rounded-xl">
              Go to Dashboard
              <Icon icon={ArrowRight} size={18} className="ml-2" />
            </Button>
          </Link>
        </FadeInItem>

      </main>
      
      <Navigation />
    </PageWrapper>
  );
}
