"use client";

import { Pause, Play } from "lucide-react";
import { motion, useTransform, type MotionValue } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { Reveal } from "@/components/ui/Reveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { en, ja } from "@/content";

export function HeroRhythm({ progress }: { progress: MotionValue<number> }) {
  const { locale } = useLanguage();
  const copy = (locale === "ja" ? ja : en).hero.backgroundMotion;
  const reduceMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const scene = useRef<HTMLDivElement>(null);
  const clipId = useId();
  const y = useTransform(progress, [0, 1], [0, 24]);

  useEffect(() => {
    const element = scene.current;
    if (
      !element ||
      reduceMotion ||
      paused ||
      typeof IntersectionObserver === "undefined"
    )
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
      { threshold: 0.05 },
    );
    observer.observe(element);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      element.dataset.active = "false";
    };
  }, [paused, reduceMotion]);

  return (
    <>
      <div
        className="hero-rhythm"
        ref={scene}
        aria-hidden="true"
        data-active="false"
      >
        <Reveal className="rhythm-entrance" variant="aperture">
          <svg viewBox="0 0 720 720" fill="none" focusable="false">
            <defs>
              <clipPath id={clipId}>
                <circle cx="360" cy="350" r="280" />
              </clipPath>
            </defs>
            <circle
              className="rhythm-orbit"
              cx="360"
              cy="350"
              r="300"
              strokeDasharray="1 12"
            />
            <g clipPath={`url(#${clipId})`}>
              <circle className="rhythm-sky" cx="360" cy="350" r="280" />
              <g className="rhythm-sun">
                <circle cx="355" cy="233" r="57" className="rhythm-sun-disc" />
                <circle cx="355" cy="233" r="69" className="rhythm-sun-ring" />
              </g>
              <g className="rhythm-clouds">
                <path d="M410 190h170M453 205h80M135 292h115M158 307h140" />
              </g>
              <motion.g
                className="rhythm-landscape"
                style={{ y: reduceMotion || paused ? 0 : y }}
              >
                <path
                  className="rhythm-ridge-far"
                  d="M0 449C104 440 151 349 233 358S349 292 401 326 568 422 720 336V750H0Z"
                />
                <path
                  className="rhythm-ridge-line"
                  d="M0 449C104 440 151 349 233 358S349 292 401 326 568 422 720 336"
                />
                <g className="rhythm-distant-ridge">
                  <path
                    className="rhythm-ridge-mid"
                    d="M0 499C112 408 191 466 278 436S407 387 498 426 634 399 720 410V740H0Z"
                  />
                </g>
                <path
                  className="rhythm-ridge-near"
                  d="M0 555c130-76 209-90 323-58s239 36 397-32v255H0Z"
                />
                <path
                  className="rhythm-trail"
                  d="M408 467c-61 33-132 33-97 70s143 22 113 78-149 63-146 105"
                />
                <g className="rhythm-shelter">
                  <path
                    d="M390 437h62v40h-62z"
                    className="rhythm-shelter-wall"
                  />
                  <path
                    d="M383 438h76m-69-1v-9h62v9"
                    className="rhythm-shelter-roof"
                  />
                  <path d="M414 451h13v26h-13z" className="rhythm-window" />
                </g>
              </motion.g>
            </g>
            <circle className="rhythm-frame" cx="360" cy="350" r="280" />
            <path
              className="rhythm-hour"
              d="M360 38v12M360 650v12M48 350h12M660 350h12"
            />
          </svg>
        </Reveal>
      </div>
      <button
        className="hero-motion-control"
        type="button"
        disabled={reduceMotion}
        aria-pressed={paused || reduceMotion}
        aria-label={
          reduceMotion ? copy.reduced : paused ? copy.resume : copy.pause
        }
        onClick={() => setPaused(!paused)}
      >
        {paused || reduceMotion ? (
          <Play aria-hidden="true" className="size-3.5" />
        ) : (
          <Pause aria-hidden="true" className="size-3.5" />
        )}
        <span>
          {reduceMotion ? copy.reduced : paused ? copy.resume : copy.pause}
        </span>
      </button>
    </>
  );
}
