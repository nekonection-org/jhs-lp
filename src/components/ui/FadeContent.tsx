"use client";

// Adapted from React Bits FadeContent (c83b5e7). See THIRD_PARTY_NOTICES.md.
// SSR remains visible. Enhance the first appearance only after an observer fires.
import { useEffect, type ReactNode } from "react";
import { useAnimate, useReducedMotion } from "motion/react";

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
    if (
      !element ||
      reduceMotion ||
      element.dataset.revealState === "entered" ||
      typeof IntersectionObserver === "undefined"
    )
      return;

    const items = [
      ...element.querySelectorAll<HTMLElement>("[data-reveal-item]"),
    ];
    const targets = items.length > 0 ? items : [element];
    const lines = [
      ...element.querySelectorAll<HTMLElement>("[data-reveal-line]"),
    ];
    const animations: ReturnType<typeof animate>[] = [];
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          element.dataset.revealState = "entered";
          targets.forEach((target, index) => {
            animations.push(
              animate(
                target,
                { opacity: [0.4, 1], y: [16, 0] },
                {
                  ...motionTiming.entrance,
                  delay: Math.min(delay, 0.08) + Math.min(index * 0.045, 0.2),
                },
              ),
            );
          });
          lines.forEach((line) => {
            animations.push(
              animate(line, { scaleX: [0.25, 1] }, motionTiming.entrance),
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
      // A preference change must leave content at full opacity immediately.
      [...targets, ...lines].forEach((target) => {
        target.style.opacity = "1";
        target.style.removeProperty("transform");
      });
    };
  }, [animate, delay, reduceMotion, scope]);

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
