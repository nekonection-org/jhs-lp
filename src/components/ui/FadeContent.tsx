"use client";

// Adapted from React Bits FadeContent (c83b5e7). See THIRD_PARTY_NOTICES.md.
// SSR remains visible. Enhance the first appearance only after an observer fires.
import { useEffect, type ReactNode } from "react";
import { useAnimate } from "motion/react";

import { useReducedMotion } from "@/hooks/useReducedMotion";

import { motionTiming } from "@/lib/motion";

interface FadeContentProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function FadeContent({
  children,
  className,
  delay = 0,
}: FadeContentProps) {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const element = scope.current;
    if (!element) return;

    const items = [
      ...element.querySelectorAll<HTMLElement>("[data-reveal-item]"),
    ];
    const targets = items.length > 0 ? items : [element];
    const lines = [
      ...element.querySelectorAll<HTMLElement>("[data-reveal-line]"),
    ];
    if (reduceMotion) {
      // Update Motion's values as well as the DOM: a pending render must not
      // restore the partial frame of an interrupted entrance.
      if (element.dataset.revealState === "entered") {
        targets.forEach((target) => {
          animate(target, { opacity: 1, y: 0 }, { duration: 0 });
        });
        lines.forEach((line) => {
          animate(line, { scaleX: 1 }, { duration: 0 });
        });
      }
      return;
    }
    if (
      element.dataset.revealState === "entered" ||
      typeof IntersectionObserver === "undefined"
    )
      return;
    const animations: ReturnType<typeof animate>[] = [];
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          element.dataset.revealState = "entered";
          targets.forEach((target, index) => {
            animations.push(
              animate(
                target,
                { opacity: [0.12, 1], y: [20, 0] },
                {
                  ...motionTiming.entrance,
                  delay: Math.min(delay, 0.08) + Math.min(index * 0.06, 0.24),
                },
              ),
            );
          });
          lines.forEach((line) => {
            animations.push(
              animate(line, { scaleX: [0, 1] }, motionTiming.entrance),
            );
          });
          observer.disconnect();
        }
      },
      { threshold: 0.05 },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.stop());
    };
  }, [animate, delay, reduceMotion, scope]);

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
