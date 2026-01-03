import { cn } from "@/lib/utils";
import * as React from "react";

interface TypographyProps extends React.HTMLAttributes<HTMLHeadingElement | HTMLParagraphElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  variant?: "display" | "headline" | "body" | "caption" | "score";
  weight?: "light" | "regular" | "medium" | "bold" | "black";
}

export const Typography = ({
  as: Component = "p",
  variant = "body",
  weight,
  className,
  ...props
}: TypographyProps) => {
  const variants = {
    display: "text-5xl md:text-7xl font-display tracking-tight leading-[1.1]",
    headline: "text-2xl md:text-3xl font-display tracking-tight leading-tight",
    body: "text-base md:text-lg font-body leading-relaxed",
    caption: "text-xs font-body tracking-wider uppercase opacity-60",
    score: "text-6xl md:text-8xl font-display font-black tracking-tighter",
  };

  const weights = {
    light: "font-light",
    regular: "font-normal",
    medium: "font-medium",
    bold: "font-bold",
    black: "font-black",
  };

  return (
    <Component
      className={cn(
        variants[variant],
        weight && weights[weight],
        className
      )}
      {...props}
    />
  );
};
