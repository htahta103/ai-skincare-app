"use client";

import { motion } from "framer-motion";
import { Typography } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, Sparkles, Droplets, 
  Scan, Sun, CircleDot, ShoppingBag, Lightbulb, Share2,
  ChevronRight, Zap, ArrowRight
} from "lucide-react";
import { useRef } from "react";
import Link from "next/link";
import { Navigation } from "@/components/layout/navigation";
import { PageWrapper, FadeInItem } from "@/components/layout/page-wrapper";
import { cn } from "@/lib/utils";
import { getSupabaseImageUrl } from "@/lib/images";

interface AnalysisMetric {
  score: number;
  severity: string;
  description: string;
}

interface AnalysisSummary {
  hydration: AnalysisMetric;
  texture: AnalysisMetric;
  tone: AnalysisMetric;
  pores: AnalysisMetric;
  roast_message?: string;
}

interface ScanData {
  id: string;
  glow_score: number;
  analysis_summary: AnalysisSummary;
  image_path: string;
  created_at: string;
  recommendations?: string[];
  product_suggestions?: string[];
}

interface ResultsClientProps {
  latestScan: ScanData | null;
  profile: any;
  email: string | undefined;
}

const METRIC_CONFIG = {
  hydration: { 
    icon: Droplets, 
    label: "Hydration", 
    color: "from-blue-500 to-cyan-400",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-400"
  },
  texture: { 
    icon: Scan, 
    label: "Texture", 
    color: "from-purple-500 to-pink-400",
    bgColor: "bg-purple-500/10",
    textColor: "text-purple-400"
  },
  tone: { 
    icon: Sun, 
    label: "Skin Tone", 
    color: "from-amber-500 to-orange-400",
    bgColor: "bg-amber-500/10",
    textColor: "text-amber-400"
  },
  pores: { 
    icon: CircleDot, 
    label: "Pores", 
    color: "from-emerald-500 to-teal-400",
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-400"
  }
};

function getScoreLabel(score: number): string {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 55) return "Fair";
  return "Needs Work";
}

function getSeverityColor(severity: string): string {
  switch (severity) {
    case "minimal": return "text-green-400";
    case "mild": return "text-yellow-400";
    case "moderate": return "text-orange-400";
    case "severe": return "text-red-400";
    default: return "text-white/60";
  }
}

export function ResultsClient({ latestScan, profile, email }: ResultsClientProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const displayName = profile?.full_name?.split(' ')[0] || email?.split('@')[0] || "User";

  const glowScore = latestScan?.glow_score || 0;
  const analysis = latestScan?.analysis_summary;
  const roastMessage = analysis?.roast_message || "Your skin is... interesting. Let's leave it at that.";
  
  const recommendations = latestScan?.recommendations || [
    "Drink at least 8 glasses of water daily",
    "Use SPF 30+ sunscreen every morning",
    "Apply a hydrating serum before moisturizer"
  ];

  const productSuggestions = latestScan?.product_suggestions || [
    "CeraVe Hydrating Facial Cleanser",
    "The Ordinary Niacinamide 10% + Zinc 1%"
  ];

  if (!latestScan) {
    return (
      <PageWrapper className="flex flex-col items-center justify-center min-h-screen bg-background text-white p-6">
        <div className="text-center">
          <Typography variant="headline" className="mb-4">No Scan Found</Typography>
          <Typography className="opacity-60 mb-6">Take a scan first to see your results</Typography>
          <Link href="/scan">
            <Button>Start Scan</Button>
          </Link>
        </div>
        <Navigation />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="flex flex-col min-h-screen bg-background text-white">
      {/* Header */}
      <header className="px-6 py-4 border-b border-white/5 bg-background/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-4xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="p-2 h-auto rounded-full">
                <Icon icon={ArrowLeft} size={20} />
              </Button>
            </Link>
            <div className="flex flex-col">
              <Typography weight="bold" className="text-sm">Skin Analysis</Typography>
              <Typography variant="caption" className="text-[10px] opacity-60">
                {new Date(latestScan.created_at).toLocaleDateString('en-US', { 
                  month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                })}
              </Typography>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="p-2 h-auto rounded-full">
            <Icon icon={Share2} size={18} />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main ref={scrollRef} className="flex-1 overflow-y-auto pb-32">
        <div className="px-6 py-6 max-w-4xl mx-auto space-y-6">
          {/* Glow Score Hero */}
          <FadeInItem>
            <Card className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-orange-500/10 to-transparent border-primary/20 p-6">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
              <div className="relative flex items-center gap-6">
                {/* Score Circle */}
                <div className="relative size-28 shrink-0">
                  <svg className="size-full -rotate-90">
                    <circle 
                      cx="50%" cy="50%" r="45%" 
                      className="stroke-white/10 fill-none" 
                      strokeWidth="8" 
                    />
                    <circle 
                      cx="50%" cy="50%" r="45%" 
                      className="stroke-primary fill-none" 
                      strokeWidth="8" 
                      strokeLinecap="round"
                      strokeDasharray={`${(glowScore / 100) * 283} 283`}
                      style={{ transition: "stroke-dasharray 1s ease-out" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Typography weight="black" className="text-3xl">{glowScore}</Typography>
                    <Typography variant="caption" className="text-[10px] opacity-60">GLOW</Typography>
                  </div>
                </div>
                
                {/* Score Details */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon icon={Sparkles} size={16} className="text-primary" />
                    <Typography weight="bold" className="text-lg">
                      {getScoreLabel(glowScore)}
                    </Typography>
                  </div>
                  <Typography variant="body" className="opacity-70 leading-relaxed">
                    {glowScore >= 80 
                      ? "Your skin is looking radiant! Keep up the great routine."
                      : glowScore >= 60
                      ? "Solid foundation, but there's room for improvement."
                      : "Time to step up your skincare game. Let's fix this."
                    }
                  </Typography>
                </div>
              </div>
            </Card>
          </FadeInItem>

          {/* AI Roast */}
          <FadeInItem delay={0.1}>
            <Card className="bg-white/5 border-white/10 p-4">
              <div className="flex items-start gap-3">
                <div className="size-10 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center shrink-0">
                  <Icon icon={Zap} size={18} className="text-white" />
                </div>
                <div>
                  <Typography weight="bold" variant="body" className="mb-1">RoastBot says:</Typography>
                  <Typography className="text-sm opacity-80 italic">"{roastMessage}"</Typography>
                </div>
              </div>
            </Card>
          </FadeInItem>

          {/* Detailed Metrics */}
          <FadeInItem delay={0.2}>
            <div className="space-y-3">
              <Typography weight="bold" className="text-sm uppercase tracking-wider opacity-60">
                Detailed Analysis
              </Typography>
              <div className="grid grid-cols-2 gap-3">
                {analysis && Object.entries(METRIC_CONFIG).map(([key, config]) => {
                  const metric = analysis[key as keyof typeof METRIC_CONFIG];
                  if (!metric) return null;
                  
                  return (
                    <Card 
                      key={key} 
                      className="p-4 border-white/10 bg-white/5"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div className={cn("p-2 rounded-lg", config.bgColor)}>
                          <Icon icon={config.icon} size={16} className={config.textColor} />
                        </div>
                        <Typography weight="medium" variant="body">{config.label}</Typography>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="relative h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${metric.score}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className={cn("h-full rounded-full bg-gradient-to-r", config.color)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Typography weight="bold" className="text-lg">{metric.score}</Typography>
                        <Typography 
                          variant="caption" 
                          className={cn("uppercase text-[10px] font-bold", getSeverityColor(metric.severity))}
                        >
                          {metric.severity}
                        </Typography>
                      </div>
                      
                      {metric.description && (
                        <Typography variant="caption" className="opacity-60 mt-1 line-clamp-2">
                          {metric.description}
                        </Typography>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          </FadeInItem>

          {/* Recommendations */}
          <FadeInItem delay={0.3}>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Icon icon={Lightbulb} size={16} className="text-yellow-400" />
                <Typography weight="bold" className="text-sm uppercase tracking-wider opacity-60">
                  Recommendations
                </Typography>
              </div>
              <Card className="bg-white/5 border-white/10 divide-y divide-white/5">
                {recommendations.map((rec, idx) => (
                  <div key={idx} className="p-4 flex items-start gap-3">
                    <div className="size-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Typography weight="bold" variant="caption">{idx + 1}</Typography>
                    </div>
                    <Typography variant="body" className="opacity-80">{rec}</Typography>
                  </div>
                ))}
              </Card>
            </div>
          </FadeInItem>

          {/* Product Suggestions */}
          <FadeInItem delay={0.4}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon icon={ShoppingBag} size={16} className="text-pink-400" />
                  <Typography weight="bold" className="text-sm uppercase tracking-wider opacity-60">
                    Suggested Products
                  </Typography>
                </div>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6">
                {productSuggestions.map((product, idx) => (
                  <Card 
                    key={idx} 
                    className="min-w-[200px] p-4 bg-white/5 border-white/10 hover:border-primary/50 transition-colors cursor-pointer"
                  >
                    <div className="size-12 rounded-lg bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center mb-3">
                      <Icon icon={Sparkles} size={20} className="text-pink-400" />
                    </div>
                    <Typography weight="medium" variant="body" className="line-clamp-2">
                      {product}
                    </Typography>
                  </Card>
                ))}
              </div>
            </div>
          </FadeInItem>

          {/* View Your Routine CTA */}
          <FadeInItem delay={0.5}>
            <Link href="/routine">
              <Card className="relative overflow-hidden bg-gradient-to-r from-primary/30 to-orange-500/20 border-primary/30 p-5 hover:border-primary/50 transition-colors group cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-full bg-primary/30 flex items-center justify-center">
                      <Icon icon={Sparkles} size={24} className="text-primary" />
                    </div>
                    <div>
                      <Typography weight="bold" className="text-lg">View Your Routine</Typography>
                      <Typography variant="body" className="opacity-70">
                        Personalized morning & evening steps
                      </Typography>
                    </div>
                  </div>
                  <Icon 
                    icon={ArrowRight} 
                    size={24} 
                    className="text-primary group-hover:translate-x-1 transition-transform" 
                  />
                </div>
              </Card>
            </Link>
          </FadeInItem>

          {/* Secondary Actions */}
          <FadeInItem delay={0.6}>
            <div className="flex gap-3">
              <Link href="/scan" className="flex-1">
                <Button variant="outline" className="w-full">
                  New Scan
                </Button>
              </Link>
              <Link href="/progress" className="flex-1">
                <Button variant="outline" className="w-full">
                  Track Progress
                </Button>
              </Link>
            </div>
          </FadeInItem>
        </div>
      </main>

      <Navigation />
    </PageWrapper>
  );
}
