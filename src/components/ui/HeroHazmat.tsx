"use client";

import Image from "next/image";
import { motion, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { Reveal } from "@/components/ui/Reveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function HeroHazmat({ progress }: { progress: MotionValue<number> }) {
  const target = useRef<HTMLDivElement>(null);
  const [imageReady, setImageReady] = useState(false);
  const reduceMotion = useReducedMotion();
  const y = useTransform(progress, [0, 1], [0, 20]);

  useEffect(() => {
    const element = target.current;
    if (!element || reduceMotion || typeof IntersectionObserver === "undefined")
      return;
    let inView = false;
    const sync = () => {
      element.dataset.active = String(inView && !document.hidden);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry?.isIntersecting ?? false;
        sync();
      },
      { threshold: 0.1 },
    );
    observer.observe(element);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      element.dataset.active = "false";
    };
  }, [reduceMotion]);

  return (
    <div
      className="hero-hazmat"
      ref={target}
      data-active="false"
      aria-hidden="true"
    >
      <motion.div
        className="hero-character-scroll"
        style={{ y: reduceMotion ? 0 : y }}
      >
        <Reveal
          className="hero-character-reveal"
          delay={0.08}
          ready={imageReady}
        >
          <div data-reveal-item data-reveal-kind="character">
            <div className="hazmat-idle">
              <Image
                alt=""
                className="hero-character-image"
                src="/images/hazmat-operative.webp"
                width={1024}
                height={1536}
                sizes="(min-width: 1280px) 680px, (min-width: 768px) 560px, 400px"
                priority
                onLoad={() => setImageReady(true)}
              />
            </div>
          </div>
        </Reveal>
      </motion.div>
    </div>
  );
}
