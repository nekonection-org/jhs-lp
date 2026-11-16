"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

import { useReducedMotion } from "@/hooks/useReducedMotion";

export function HeroScrollScene({ children }: { children: ReactNode }) {
  const target = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -20]);

  return (
    <motion.div
      className="hero-scroll-scene"
      ref={target}
      style={{ y: reduceMotion ? 0 : y }}
    >
      {children}
    </motion.div>
  );
}
