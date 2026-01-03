"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { ArrowLeft, Check, Camera, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const QUIZ_STEPS = [
  {
    id: "skin-type",
    title: "How does your skin feel after cleansing?",
    options: [
      { label: "Tight and dry", value: "dry" },
      { label: "Normal and balanced", value: "normal" },
      { label: "Oily after a few hours", value: "oily" },
      { label: "Oily in T-zone, dry elsewhere", value: "combination" },
    ],
    multiple: false,
  },
  {
    id: "concerns",
    title: "What are your main skin concerns?",
    subtitle: "Select all that apply. I won't judge (much).",
    options: [
      { label: "Acne & breakouts", value: "acne" },
      { label: "Fine lines & wrinkles", value: "aging" },
      { label: "Dark spots & uneven tone", value: "spots" },
      { label: "Large pores", value: "pores" },
      { label: "Dryness & flakiness", value: "dryness" },
      { label: "Redness & sensitivity", value: "redness" },
    ],
    multiple: true,
  },
  {
    id: "goals",
    title: "What are your skincare goals?",
    subtitle: "Be realistic. We're scientists, not magicians.",
    options: [
      { label: "Clear, acne-free skin", value: "clear" },
      { label: "Anti-aging & firmness", value: "firming" },
      { label: "Even, glowing complexion", value: "glow" },
      { label: "Deep hydration", value: "hydration" },
      { label: "Minimize pores", value: "refining" },
      { label: "Calm & soothe skin", value: "calming" },
    ],
    multiple: true,
  },
];

export default function OnboardingQuiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const router = useRouter();

  const handleOptionSelect = (value: string) => {
    const step = QUIZ_STEPS[currentStep];
    if (step.multiple) {
      const currentAnswers = (answers[step.id] as string[]) || [];
      const newAnswers = currentAnswers.includes(value)
        ? currentAnswers.filter((a) => a !== value)
        : [...currentAnswers, value];
      setAnswers({ ...answers, [step.id]: newAnswers });
    } else {
      setAnswers({ ...answers, [step.id]: value });
      setTimeout(nextStep, 300);
    }
  };

  const nextStep = () => {
    if (currentStep < QUIZ_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push("/onboarding/selfie");
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentQuizData = QUIZ_STEPS[currentStep];
  const progress = ((currentStep + 1) / QUIZ_STEPS.length) * 100;

  return (
    <div className="flex flex-col min-h-screen bg-background-dark text-white p-6 md:p-12">
      {/* Header */}
      <div className="max-w-2xl mx-auto w-full mb-12 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={prevStep} className={currentStep === 0 ? "invisible" : ""}>
          <Icon icon={ArrowLeft} className="mr-2" /> Back
        </Button>
        <div className="flex-1 h-1 bg-white/10 mx-6 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
        <Typography variant="caption" className="w-12 text-right">
          {currentStep + 1}/{QUIZ_STEPS.length}
        </Typography>
      </div>

      {/* Main Quiz Area */}
      <main className="max-w-2xl mx-auto w-full flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-8"
          >
            <div className="flex flex-col gap-2">
              <Typography as="h1" variant="headline" weight="bold" className="text-4xl">
                {currentQuizData.title}
              </Typography>
              {currentQuizData.subtitle && (
                <Typography className="opacity-60 italic">
                  "{currentQuizData.subtitle}"
                </Typography>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4">
              {currentQuizData.options.map((option) => {
                const isSelected = currentQuizData.multiple
                  ? (answers[currentQuizData.id] as string[])?.includes(option.value)
                  : answers[currentQuizData.id] === option.value;

                return (
                  <Card
                    key={option.value}
                    onClick={() => handleOptionSelect(option.value)}
                    variant={isSelected ? "default" : "dark"}
                    className={cn(
                      "p-6 cursor-pointer border-2 transition-all active:scale-[0.98]",
                      isSelected 
                        ? "border-primary bg-primary/10" 
                        : "border-card-border hover:border-white/20"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <Typography weight="medium" className="text-lg">
                        {option.label}
                      </Typography>
                      {isSelected && <Icon icon={Check} className="text-primary" />}
                    </div>
                  </Card>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Actions */}
      <div className="max-w-2xl mx-auto w-full mt-12 flex justify-end">
        {currentQuizData.multiple && (
          <Button 
            size="lg" 
            onClick={nextStep}
            disabled={!(answers[currentQuizData.id] as string[])?.length}
          >
            Continue
          </Button>
        )}
      </div>
    </div>
  );
}
