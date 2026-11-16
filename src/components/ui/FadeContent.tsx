"use client";

// Adapted from React Bits FadeContent (c83b5e7). See THIRD_PARTY_NOTICES.md.
// SSR remains visible. Each item animates once when it enters the viewport.
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
      // Finish interrupted frames; don't mark unseen content as played during
      // hydration, whose server snapshot starts with reduced motion enabled.
      targets.forEach((target) => {
        if (target.dataset.revealState === "entered") {
          animate(
            target,
            { opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" },
            { duration: 0 },
          );
        }
      });
      lines.forEach((line) => animate(line, { scaleX: 1 }, { duration: 0 }));
      return;
    }
    if (typeof IntersectionObserver === "undefined") return;

    const animations: ReturnType<typeof animate>[] = [];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const target = entry.target as HTMLElement;
          if (target.dataset.revealState === "entered") continue;
          target.dataset.revealState = "entered";
          element.dataset.revealState = "entered";
          const heading = target.dataset.revealKind === "heading";
          animations.push(
            animate(
              target,
              heading
                ? {
                    opacity: [0.15, 1],
                    y: [20, 0],
                    clipPath: ["inset(0% 0% 100% 0%)", "inset(0% 0% 0% 0%)"],
                  }
                : { opacity: [0.15, 1], y: [16, 0] },
              {
                ...motionTiming.entrance,
                duration: heading ? 0.52 : 0.4,
                delay:
                  Math.min(delay, 0.08) +
                  Math.min(targets.indexOf(target) * 0.06, 0.12),
              },
            ),
          );
          observer.unobserve(target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -32px 0px" },
    );
    targets.forEach((target) => {
      if (target.dataset.revealState !== "entered") observer.observe(target);
    });
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
