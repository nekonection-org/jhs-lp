"use client";

import type { ReactNode } from "react";
import { FadeContent, type RevealVariant } from "@/components/ui/FadeContent";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: RevealVariant;
  sequence?: "default" | "hero";
}

export function Reveal({
  children,
  className,
  delay = 0,
  variant = "rise",
  sequence = "default",
}: RevealProps) {
  return (
    <FadeContent
      className={className}
      delay={delay}
      variant={variant}
      sequence={sequence}
    >
      {children}
    </FadeContent>
  );
}
