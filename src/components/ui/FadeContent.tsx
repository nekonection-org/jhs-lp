"use client";

// Adapted from React Bits FadeContent (c83b5e7). See THIRD_PARTY_NOTICES.md.
// Start fully visible; apply the subtle effect only after an observer fires.
import { useEffect, type ReactNode } from "react";
import { useAnimate, useReducedMotion } from "motion/react";

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
    if (!element || reduceMotion || typeof IntersectionObserver === "undefined")
      return;

    let animation: ReturnType<typeof animate> | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          animation = animate(
            element,
            { opacity: [0.92, 1] },
            {
              duration: 0.3,
              delay: Math.min(delay, 0.15),
            },
          );
          observer.disconnect();
        }
      },
      { threshold: 0.05 },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      animation?.stop();
      // A preference change must leave content at full opacity immediately.
      element.style.opacity = "1";
    };
  }, [animate, delay, reduceMotion, scope]);

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
