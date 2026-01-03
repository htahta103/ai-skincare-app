"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Typography } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Send, ArrowLeft, MoreHorizontal, Sparkles, AlertCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Navigation } from "@/components/layout/navigation";
import { PageWrapper, FadeInItem } from "@/components/layout/page-wrapper";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "ai" | "user";
  content: string;
  type?: "analysis" | "text" | "recommendation";
  data?: any;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: "ai",
    content: "Okay, I've analyzed your face. Brace yourself, Alexa. This might hurt a little (your ego, not your skin).",
    type: "text"
  },
  {
    id: "2",
    role: "ai",
    content: "Your 'Glow Score' is 78. That's... average. Like a participation trophy for having a face.",
    type: "analysis",
    data: { score: 78 }
  },
  {
    id: "3",
    role: "ai",
    content: "Main issue: Hydration. Or lack thereof. You're looking a bit like a desktop background of a desert. Drink some water. Seriously.",
    type: "text"
  }
];

const USER_IMAGE = "/assets/face_clean.png";

export default function RoastChatPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue
    };

    setMessages([...messages, newUserMessage]);
    setInputValue("");

    // Mock AI Response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: "I'm not integrated with the backend yet, but I bet you're going to ask something about that pimple. Don't touch it.",
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <PageWrapper className="flex flex-col h-screen bg-background text-white">
      {/* Header */}
      <header className="px-6 py-4 border-b border-card-border bg-card-dark/50 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-4xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
               <Button variant="ghost" size="sm" className="p-2 h-auto rounded-full">
                 <Icon icon={ArrowLeft} size={20} />
               </Button>
            </Link>
            <div className="flex flex-col">
              <Typography weight="bold" className="text-sm">RoastChat AI</Typography>
              <div className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-glow-green animate-pulse" />
                <Typography variant="caption" className="text-[10px] opacity-100 text-glow-green uppercase font-bold">Currently Judging You</Typography>
              </div>
            </div>
            <div className="size-10 rounded-full bg-gradient-to-br from-primary to-orange-500 border-2 border-white/10 overflow-hidden shrink-0">
               <img src={USER_IMAGE} alt="User" className="w-full h-full object-cover" />
            </div>
          </div>
          <Button variant="ghost" size="sm" className="p-2 h-auto rounded-full">
             <Icon icon={MoreHorizontal} size={20} />
          </Button>
        </div>
      </header>

      {/* Chat Area */}
      <main 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-6 scroll-smooth max-w-4xl mx-auto w-full min-h-0"
      >
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "flex flex-col max-w-[85%]",
                message.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
              )}
            >
              <div className={cn(
                "p-4 rounded-2xl flex flex-col gap-2 w-full",
                message.role === "user" 
                  ? "bg-primary text-white rounded-tr-none" 
                  : "bg-card-dark border border-card-border rounded-tl-none"
              )}>
                {message.type === "analysis" && message.data && (
                   <div className="flex items-center gap-4 mb-2 p-3 bg-white/5 rounded-xl border border-white/5 shrink-0">
                      <div className="relative size-12 shrink-0">
                         <svg className="size-full -rotate-90">
                           <circle cx="50%" cy="50%" r="45%" className="stroke-white/10 fill-none" strokeWidth="4" />
                           <circle cx="50%" cy="50%" r="45%" className="stroke-primary fill-none" strokeWidth="4" strokeDasharray={`${(message.data.score / 100) * 75}, 75`} />
                         </svg>
                         <div className="absolute inset-0 flex items-center justify-center">
                            <Typography weight="black" className="text-xs">{message.data.score}</Typography>
                         </div>
                      </div>
                      <div>
                         <Typography weight="bold" className="text-xs uppercase tracking-wider">Analysis complete</Typography>
                         <Typography variant="caption" className="text-[10px]">7 data points processed</Typography>
                      </div>
                   </div>
                )}
                <Typography className="text-sm md:text-base leading-relaxed break-words">
                  {message.content}
                </Typography>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </main>

      {/* Input Area */}
      <div className="p-6 bg-gradient-to-t from-background-dark to-transparent pb-32">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
           <Card className="flex-1 flex items-center bg-card-dark/80 backdrop-blur-xl border-card-border px-4 py-2 hover:border-primary/50 transition-colors">
              <input 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about your routine..." 
                className="flex-1 bg-transparent border-none focus:outline-none text-sm h-10 ring-0"
              />
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSend}
                className={cn("p-2 h-auto text-primary transition-all", !inputValue && "opacity-0 scale-75")}
              >
                <Icon icon={Send} size={20} />
              </Button>
           </Card>
           <Button variant="outline" size="xl" className="size-14 p-0 rounded-full border-card-border bg-card-dark/80 backdrop-blur-xl shrink-0">
              <Icon icon={Sparkles} className="text-primary" />
           </Button>
        </div>
      </div>

      <Navigation />
    </PageWrapper>
  );
}
