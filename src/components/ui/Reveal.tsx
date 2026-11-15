"use client";

import type { ReactNode } from "react";
import { FadeContent } from "@/components/ui/FadeContent";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  return (
    <FadeContent className={className} delay={delay}>
      {children}
    </FadeContent>
  );
}
