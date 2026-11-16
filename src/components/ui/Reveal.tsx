"use client";

import type { ReactNode } from "react";
import { FadeContent } from "@/components/ui/FadeContent";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  ready?: boolean;
  sequence?: "default" | "hero";
}

export function Reveal({
  children,
  className,
  delay = 0,
  ready = true,
  sequence = "default",
}: RevealProps) {
  return (
    <FadeContent
      className={className}
      delay={delay}
      ready={ready}
      sequence={sequence}
    >
      {children}
    </FadeContent>
  );
}
