"use client";

// Adapted from React Bits FadeContent (c83b5e7). See THIRD_PARTY_NOTICES.md.
// Content stays readable in the initial HTML and animates at most once.
import { useEffect, type ReactNode } from "react";
import { useAnimate } from "motion/react";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { motionTiming } from "@/lib/motion";

interface FadeContentProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  sequence?: "default" | "hero";
}

export function FadeContent({
  children,
  className,
  delay = 0,
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
    const restore = (target: HTMLElement) => {
      target.style.removeProperty("opacity");
      target.style.removeProperty("transform");
      target.style.removeProperty("filter");
    };

    if (reduceMotion || typeof IntersectionObserver === "undefined") {
      targets.forEach(restore);
      return;
    }

    // Hidden translations and closed disclosures should appear immediately when
    // selected, rather than replaying a section's entrance animation.
    const visibleTargets = targets.filter(
      (target) => target.getClientRects().length > 0,
    );
    const initiallyVisible = new Set(
      visibleTargets.filter((target) => {
        const bounds = target.getBoundingClientRect();
        return bounds.top < window.innerHeight && bounds.bottom > 0;
      }),
    );
    const animations: ReturnType<typeof animate>[] = [];
    let active = true;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const target = entry.target;
          if (
            !(target instanceof HTMLElement) ||
            target.dataset.revealState === "entered"
          )
            continue;
          target.dataset.revealState = "entered";
          element.dataset.revealState = "entered";
          observer.unobserve(target);

          const timing =
            sequence === "hero" ? motionTiming.hero : motionTiming.entrance;
          const stagger =
            sequence === "hero"
              ? Math.min(visibleTargets.indexOf(target) * 0.035, 0.14)
              : Math.min(visibleTargets.indexOf(target) * 0.035, 0.07);
          const focusLine =
            sequence === "hero" &&
            target.classList.contains("hero-headline-line");
          const animation = animate(
            target,
            {
              opacity: [
                sequence === "hero"
                  ? 0.3
                  : initiallyVisible.has(target)
                    ? 0.8
                    : 0,
                1,
              ],
              y: [
                sequence === "hero"
                  ? 12
                  : initiallyVisible.has(target)
                    ? 8
                    : 12,
                0,
              ],
              ...(focusLine ? { filter: ["blur(6px)", "blur(0px)"] } : {}),
            },
            { ...timing, delay: Math.min(Math.max(delay, 0), 0.08) + stagger },
          );
          animations.push(animation);
          void animation.then(() => {
            if (active) restore(target);
          });
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -24px 0px" },
    );

    visibleTargets.forEach((target) => {
      if (target.dataset.revealState !== "entered") observer.observe(target);
    });
    return () => {
      active = false;
      observer.disconnect();
      // Finish Motion's values too: stopping midway can reapply a partial frame
      // after reduced-motion CSS is removed or a queued render is flushed.
      animations.forEach((animation) => animation.complete());
      targets.forEach(restore);
    };
  }, [animate, delay, reduceMotion, scope, sequence]);

  return (
    <div
      ref={scope}
      className={className}
      data-motion-profile={sequence === "hero" ? "hero-focus" : "fade-up"}
    >
      {children}
    </div>
  );
}
