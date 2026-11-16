"use client";

import type { ReactNode } from "react";
import { FadeContent } from "@/components/ui/FadeContent";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  sequence?: "default" | "hero";
}

export function Reveal({
  children,
  className,
  delay = 0,
  sequence = "default",
}: RevealProps) {
  return (
    <FadeContent className={className} delay={delay} sequence={sequence}>
      {children}
    </FadeContent>
  );
}
