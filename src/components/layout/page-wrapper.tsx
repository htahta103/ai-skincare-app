"use client";

import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
}

const variants: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      staggerChildren: 0.1,
      when: "beforeChildren"
    }
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

export const PageWrapper = ({ children, className }: PageWrapperProps) => {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const FadeInItem = ({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) => (
  <motion.div
    variants={{
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 }
    }}
    transition={{ delay }}
    className={className}
  >
    {children}
  </motion.div>
);
