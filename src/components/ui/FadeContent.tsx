"use client";

// Adapted from React Bits FadeContent (c83b5e7). See THIRD_PARTY_NOTICES.md.
// SSR remains visible. Each item animates once when it enters the viewport.
import { useEffect, type ReactNode } from "react";
import { useAnimate } from "motion/react";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { motionTiming } from "@/lib/motion";

export type RevealVariant = "rise" | "slide" | "split" | "wipe" | "aperture";

interface FadeContentProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: RevealVariant;
  sequence?: "default" | "hero";
}

export function FadeContent({
  children,
  className,
  delay = 0,
  variant = "rise",
  sequence = "default",
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
            {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              clipPath: "inset(0% 0% 0% 0%)",
            },
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
          const profile =
            target.dataset.revealKind === "left"
              ? "left"
              : target.dataset.revealKind === "right"
                ? "right"
                : variant;
          const direction =
            profile === "left"
              ? -1
              : profile === "right"
                ? 1
                : targets.indexOf(target) % 2 === 0
                  ? -1
                  : 1;
          const visibleItems = targets.filter(
            (item) => item.getClientRects().length > 0,
          );
          const itemDelay =
            sequence === "hero"
              ? Math.min(visibleItems.indexOf(target) * 0.09, 0.36)
              : Math.min(targets.indexOf(target) * 0.06, 0.12);
          animations.push(
            animate(
              target,
              profile === "aperture"
                ? {
                    scale: [0.9, 1],
                    clipPath: ["inset(0% 0% 100% 0%)", "inset(0% 0% 0% 0%)"],
                  }
                : profile === "wipe"
                  ? {
                      x: [24, 0],
                      clipPath: ["inset(0% 100% 0% 0%)", "inset(0% 0% 0% 0%)"],
                    }
                  : profile === "slide" ||
                      profile === "split" ||
                      profile === "left" ||
                      profile === "right"
                    ? { opacity: [0.3, 1], x: [direction * 40, 0], y: [0, 0] }
                    : heading
                      ? {
                          y: [24, 0],
                          clipPath: [
                            "inset(0% 0% 100% 0%)",
                            "inset(0% 0% 0% 0%)",
                          ],
                        }
                      : { opacity: [0.2, 1], y: [16, 0] },
              {
                ...motionTiming.entrance,
                duration:
                  profile === "aperture"
                    ? 0.7
                    : profile === "wipe"
                      ? 0.6
                      : heading
                        ? 0.52
                        : 0.45,
                delay: Math.min(delay, 0.08) + itemDelay,
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
  }, [animate, delay, reduceMotion, scope, sequence, variant]);

  return (
    <div ref={scope} className={className} data-motion-profile={variant}>
      {children}
    </div>
  );
}
