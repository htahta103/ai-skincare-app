import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "dark" | "glass";
  rounded?: "xl" | "2xl" | "3xl";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", rounded = "2xl", ...props }, ref) => {
    const variants = {
      default: "bg-card-dark border border-card-border",
      dark: "bg-background-dark border border-card-border",
      glass: "bg-white/5 backdrop-blur-xl border border-white/10",
    };

    const radiuses = {
      xl: "rounded-xl",
      "2xl": "rounded-2xl",
      "3xl": "rounded-3xl",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "overflow-hidden transition-all duration-300",
          variants[variant],
          radiuses[rounded],
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";
