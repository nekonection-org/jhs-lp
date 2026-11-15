"use client";

// Adapted from React Bits FadeContent (c83b5e7). See THIRD_PARTY_NOTICES.md.
// SSR remains visible. Enhance the first appearance only after an observer fires.
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
            { opacity: [0.65, 1], y: [12, 0] },
            {
              duration: 0.38,
              ease: [0.22, 1, 0.36, 1],
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
      element.style.removeProperty("transform");
    };
  }, [animate, delay, reduceMotion, scope]);

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
