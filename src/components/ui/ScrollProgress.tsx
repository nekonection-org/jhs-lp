"use client";

import { motion, useScroll, useSpring } from "motion/react";

import { useReducedMotion } from "@/hooks/useReducedMotion";

export function ScrollProgress() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 240,
    damping: 36,
    restDelta: 0.001,
  });
  if (reduceMotion) return null;
  return (
    <motion.div
      aria-hidden="true"
      className="scroll-progress"
      style={{ scaleX }}
    />
  );
}
