"use client";

import { motion } from "framer-motion";
import { Typography } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/layout/navigation";
import { PageWrapper, FadeInItem } from "@/components/layout/page-wrapper";
import { Plus, ChevronRight, Share2, TrendingUp, TrendingDown, Calendar, Droplets, Scan, Sun, CircleDot, ScanFace, ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getSupabaseImageUrl } from "@/lib/images";
import Link from "next/link";
import { useState } from "react";

interface AnalysisMetric {
  score: number;
  severity: string;
  description?: string;
}

interface AnalysisSummary {
  hydration?: AnalysisMetric;
  texture?: AnalysisMetric;
  tone?: AnalysisMetric;
  pores?: AnalysisMetric;
  roast_message?: string;
}

interface SkinScan {
  id: string;
  glow_score: number | null;
  analysis_summary: AnalysisSummary | null;
  image_path: string | null;
  created_at: string | null;
}

interface ProgressPhoto {
  id: string;
  image_path: string;
  taken_at: string | null;
  created_at: string | null;
}

interface ProgressClientProps {
  progressPhotos: ProgressPhoto[];
  skinScans: SkinScan[];
  supabaseUrl: string;
}

const METRIC_CONFIG = {
  hydration: { icon: Droplets, label: "Hydration", textColor: "text-blue-400", bgColor: "bg-blue-500/20" },
  texture: { icon: Scan, label: "Texture", textColor: "text-purple-400", bgColor: "bg-purple-500/20" },
  tone: { icon: Sun, label: "Tone", textColor: "text-amber-400", bgColor: "bg-amber-500/20" },
  pores: { icon: CircleDot, label: "Pores", textColor: "text-emerald-400", bgColor: "bg-emerald-500/20" }
};

export function ProgressClient({ progressPhotos, skinScans, supabaseUrl }: ProgressClientProps) {
  const [selectedScan, setSelectedScan] = useState<SkinScan | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Unknown';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatShortDate = (dateStr: string | null) => {
    if (!dateStr) return '--';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatFullDate = (dateStr: string | null) => {
    if (!dateStr) return 'Unknown';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  // Get last 7 scans for the trend chart (with real dates)
  const trendData = skinScans
    .filter(scan => scan.glow_score !== null)
    .slice(0, 7)
    .reverse()
    .map(scan => ({
      score: scan.glow_score || 0,
      date: formatShortDate(scan.created_at)
    }));

  // Fill with empty data if less than 7 entries
  while (trendData.length < 7) {
    trendData.unshift({ score: 0, date: '--' });
  }

  const hasRealScans = skinScans.length > 0;
  const maxScore = Math.max(...trendData.map(d => d.score), 100);

  // Calculate trend
  const latestScore = skinScans[0]?.glow_score || 0;
  const previousScore = skinScans[1]?.glow_score || latestScore;
  const scoreDiff = latestScore - previousScore;
  const isPositiveTrend = scoreDiff >= 0;

  // Before & After data
  const oldestScan = skinScans[skinScans.length - 1];
  const newestScan = skinScans[0];
  const hasComparison = skinScans.length >= 2 && oldestScan && newestScan;

  // Get image URL helper
  const getScanImageUrl = (path: string | null) => {
    if (!path) return '/assets/face_clean.png';
    return getSupabaseImageUrl(path, 'scan-images') || '/assets/face_clean.png';
  };

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
          <Card className="p-6 flex flex-col gap-4 bg-gradient-to-br from-card-dark to-[#251817] border-white/5 rounded-3xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  isPositiveTrend ? "bg-green-500/20" : "bg-red-500/20"
                )}>
                  <Icon 
                    icon={isPositiveTrend ? TrendingUp : TrendingDown} 
                    className={isPositiveTrend ? "text-green-400" : "text-red-400"} 
                    size={20}
                  />
                </div>
                <div>
                  <Typography weight="bold">Glow Score Trend</Typography>
                  {hasRealScans && scoreDiff !== 0 && (
                    <Typography variant="caption" className={cn(
                      "font-bold",
                      isPositiveTrend ? "text-green-400" : "text-red-400"
                    )}>
                      {isPositiveTrend ? '+' : ''}{scoreDiff} pts from last scan
                    </Typography>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-40">
                <Icon icon={Calendar} size={14} />
                <Typography variant="caption" className="normal-case">Last 7 scans</Typography>
              </div>
            </div>
             
            <div className="h-44 flex items-end gap-2">
              {trendData.map((data, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  {/* Score label on hover */}
                  <Typography 
                    variant="caption" 
                    className={cn(
                      "text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity",
                      i === trendData.length - 1 ? "text-primary" : "text-white"
                    )}
                  >
                    {data.score > 0 ? data.score : ''}
                  </Typography>
                  
                  {/* Bar */}
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: data.score > 0 ? `${(data.score / maxScore) * 100}%` : '4px' }}
                    transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                    className={cn(
                      "w-full rounded-t-lg transition-all min-h-1",
                      i === trendData.length - 1 
                        ? "bg-gradient-to-t from-primary to-orange-400" 
                        : data.score > 0 
                          ? "bg-white/20 group-hover:bg-white/40" 
                          : "bg-white/5"
                    )}
                  />
                  
                  {/* Date label */}
                  <Typography 
                    variant="caption" 
                    className={cn(
                      "text-[10px]",
                      i === trendData.length - 1 ? "opacity-80 text-primary font-bold" : "opacity-40"
                    )}
                  >
                    {data.date}
                  </Typography>
                </div>
              ))}
            </div>

            {/* Current Score Summary */}
            {hasRealScans && (
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div>
                  <Typography variant="caption" className="opacity-60">Current Score</Typography>
                  <Typography weight="black" className="text-2xl">{latestScore}</Typography>
                </div>
                <div className="text-right">
                  <Typography variant="caption" className="opacity-60">Total Scans</Typography>
                  <Typography weight="bold" className="text-lg">{skinScans.length}</Typography>
                </div>
              </div>
            )}
          </Card>
        </FadeInItem>

        {/* Before & After Comparison */}
        {hasComparison && (
          <FadeInItem>
            <Card 
              className="p-6 border-2 border-primary/20 bg-primary/5 overflow-hidden relative group cursor-pointer rounded-3xl"
              onClick={() => setShowComparison(true)}
            >
              <div className="flex items-center gap-6">
                {/* Before */}
                <div className="flex-1 flex items-center gap-4">
                  <div className="size-16 rounded-xl overflow-hidden border-2 border-white/10">
                    <img 
                      src={getScanImageUrl(oldestScan.image_path)} 
                      alt="Before" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <Typography variant="caption" className="opacity-60">First Scan</Typography>
                    <Typography weight="bold" className="text-xl">{oldestScan.glow_score}</Typography>
                    <Typography variant="caption" className="opacity-40">{formatDate(oldestScan.created_at)}</Typography>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex flex-col items-center gap-1">
                  <Icon icon={ArrowRight} className="text-primary" size={24} />
                  <Typography 
                    variant="caption" 
                    className={cn(
                      "font-bold",
                      (newestScan.glow_score || 0) >= (oldestScan.glow_score || 0) ? "text-green-400" : "text-red-400"
                    )}
                  >
                    {(newestScan.glow_score || 0) - (oldestScan.glow_score || 0) >= 0 ? '+' : ''}
                    {(newestScan.glow_score || 0) - (oldestScan.glow_score || 0)} pts
                  </Typography>
                </div>

                {/* After */}
                <div className="flex-1 flex items-center gap-4 justify-end">
                  <div className="text-right">
                    <Typography variant="caption" className="opacity-60">Latest Scan</Typography>
                    <Typography weight="bold" className="text-xl text-primary">{newestScan.glow_score}</Typography>
                    <Typography variant="caption" className="opacity-40">{formatDate(newestScan.created_at)}</Typography>
                  </div>
                  <div className="size-16 rounded-xl overflow-hidden border-2 border-primary/50">
                    <img 
                      src={getScanImageUrl(newestScan.image_path)} 
                      alt="After" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              <Typography variant="caption" className="block text-center mt-4 opacity-60">
                Tap to see full comparison
              </Typography>
              
              <div className="absolute -right-12 -top-12 size-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all" />
            </Card>
          </FadeInItem>
        )}

        {/* Scan History */}
        <div className="flex flex-col gap-4">
          <FadeInItem className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon icon={ScanFace} size={20} className="text-primary" />
              <Typography variant="headline" weight="bold" className="text-xl">Scan History</Typography>
            </div>
            <Link href="/scan">
              <Button variant="outline" size="sm" className="h-10 px-4 group rounded-full">
                New Scan <Icon icon={Plus} size={16} className="ml-2 group-hover:rotate-90 transition-transform" />
              </Button>
            </Link>
          </FadeInItem>

          {hasRealScans ? (
            <div className="space-y-3">
              {skinScans.slice(0, 10).map((scan, idx) => {
                const analysis = scan.analysis_summary as AnalysisSummary | null;
                const isExpanded = selectedScan?.id === scan.id;

                return (
                  <FadeInItem key={scan.id} delay={idx * 0.03}>
                    <Card 
                      className={cn(
                        "p-4 border-white/10 bg-white/5 cursor-pointer transition-all",
                        isExpanded ? "border-primary/50 bg-primary/5" : "hover:border-white/20"
                      )}
                      onClick={() => setSelectedScan(isExpanded ? null : scan)}
                    >
                      {/* Main Row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {/* Score Badge */}
                          <div className="relative size-12 shrink-0">
                            <svg className="size-full -rotate-90">
                              <circle cx="50%" cy="50%" r="45%" className="stroke-white/10 fill-none" strokeWidth="4" />
                              <circle 
                                cx="50%" cy="50%" r="45%" 
                                className="stroke-primary fill-none" 
                                strokeWidth="4" 
                                strokeLinecap="round"
                                strokeDasharray={`${((scan.glow_score || 0) / 100) * 75} 75`}
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Typography weight="bold" className="text-sm">{scan.glow_score || '-'}</Typography>
                            </div>
                          </div>

                          {/* Info */}
                          <div>
                            <Typography weight="bold">Glow Score: {scan.glow_score}</Typography>
                            <Typography variant="caption" className="opacity-60">
                              {formatFullDate(scan.created_at)}
                            </Typography>
                          </div>
                        </div>

                        <Icon 
                          icon={ChevronRight} 
                          size={20} 
                          className={cn("opacity-40 transition-transform", isExpanded && "rotate-90")} 
                        />
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && analysis && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          className="mt-4 pt-4 border-t border-white/10"
                        >
                          {/* Metrics Grid */}
                          <div className="grid grid-cols-2 gap-2 mb-4">
                            {Object.entries(METRIC_CONFIG).map(([key, config]) => {
                              const metric = analysis[key as keyof typeof METRIC_CONFIG];
                              if (!metric) return null;
                              
                              return (
                                <div key={key} className={cn("flex items-center gap-2 p-3 rounded-lg", config.bgColor)}>
                                  <Icon icon={config.icon} size={16} className={config.textColor} />
                                  <Typography variant="caption" className="flex-1">{config.label}</Typography>
                                  <Typography weight="bold">{metric.score}</Typography>
                                </div>
                              );
                            })}
                          </div>

                          {/* Roast Message */}
                          {analysis.roast_message && (
                            <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                              <Typography variant="caption" className="opacity-80 italic">
                                "{analysis.roast_message}"
                              </Typography>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </Card>
                  </FadeInItem>
                );
              })}
            </div>
          ) : (
            <Card className="p-8 border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 text-center">
              <div className="size-16 rounded-full bg-white/5 flex items-center justify-center">
                <Icon icon={ScanFace} size={32} className="opacity-40" />
              </div>
              <div>
                <Typography weight="bold" className="mb-1">No scans yet</Typography>
                <Typography variant="caption" className="opacity-60">
                  Take your first scan to start tracking your skin health
                </Typography>
              </div>
              <Link href="/scan">
                <Button>Start First Scan</Button>
              </Link>
            </Card>
          )}
        </div>
      </main>

      {/* Comparison Modal */}
      {showComparison && hasComparison && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6"
        >
          <button 
            onClick={() => setShowComparison(false)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <Icon icon={X} size={24} />
          </button>

          <div className="max-w-4xl w-full">
            <Typography variant="headline" weight="bold" className="text-center mb-8">Before & After</Typography>
            
            <div className="grid grid-cols-2 gap-6">
              {/* Before */}
              <div className="text-center">
                <div className="aspect-square rounded-2xl overflow-hidden border-2 border-white/20 mb-4">
                  <img 
                    src={getScanImageUrl(oldestScan.image_path)} 
                    alt="Before" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <Typography variant="caption" className="opacity-60">First Scan</Typography>
                <Typography weight="black" className="text-3xl">{oldestScan.glow_score}</Typography>
                <Typography variant="caption" className="opacity-40">{formatFullDate(oldestScan.created_at)}</Typography>
              </div>

              {/* After */}
              <div className="text-center">
                <div className="aspect-square rounded-2xl overflow-hidden border-2 border-primary mb-4">
                  <img 
                    src={getScanImageUrl(newestScan.image_path)} 
                    alt="After" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <Typography variant="caption" className="opacity-60">Latest Scan</Typography>
                <Typography weight="black" className="text-3xl text-primary">{newestScan.glow_score}</Typography>
                <Typography variant="caption" className="opacity-40">{formatFullDate(newestScan.created_at)}</Typography>
              </div>
            </div>

            {/* Improvement Summary */}
            <div className="mt-8 p-6 bg-white/5 rounded-2xl text-center">
              <Typography variant="caption" className="opacity-60 mb-2 block">Total Improvement</Typography>
              <Typography 
                weight="black" 
                className={cn(
                  "text-4xl",
                  (newestScan.glow_score || 0) >= (oldestScan.glow_score || 0) ? "text-green-400" : "text-red-400"
                )}
              >
                {(newestScan.glow_score || 0) - (oldestScan.glow_score || 0) >= 0 ? '+' : ''}
                {(newestScan.glow_score || 0) - (oldestScan.glow_score || 0)} points
              </Typography>
              <Typography variant="caption" className="opacity-60 mt-2">
                Over {skinScans.length} scans
              </Typography>
            </div>
          </div>
        </motion.div>
      )}

      <Navigation />
    </PageWrapper>
  );
}
