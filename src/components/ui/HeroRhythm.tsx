"use client";

import { useEffect, useId, useRef } from "react";

import { useReducedMotion } from "@/hooks/useReducedMotion";

export function HeroRhythm() {
  const reduceMotion = useReducedMotion();
  const scene = useRef<HTMLDivElement>(null);
  const lightId = useId();

  useEffect(() => {
    const element = scene.current;
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
      { threshold: 0.05 },
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
      className="hero-rhythm"
      ref={scene}
      aria-hidden="true"
      data-active="false"
    >
      <svg
        viewBox="0 0 1440 560"
        preserveAspectRatio="xMaxYMid slice"
        fill="none"
        focusable="false"
      >
        <defs>
          <radialGradient id={lightId}>
            <stop stopColor="var(--warning)" stopOpacity="0.16" />
            <stop offset="1" stopColor="var(--warning)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect className="rhythm-sky" width="1440" height="560" />
        <rect
          className="rhythm-night-sky rhythm-cycle"
          width="1440"
          height="560"
        />
        <g className="rhythm-world">
          <g className="rhythm-stars rhythm-cycle">
            <path d="M259 155v8m-4-4h8M513 269v8m-4-4h8M376 123v6m-3-3h6" />
            <circle cx="313" cy="198" r="1.4" />
            <circle cx="419" cy="155" r="1.3" />
            <circle cx="539" cy="219" r="1.5" />
            <circle cx="218" cy="256" r="1.2" />
            <circle cx="358" cy="277" r="1.2" />
            <circle cx="482" cy="127" r="1.2" />
            <circle cx="562" cy="316" r="1.2" />
          </g>
          {/* Opposite phases share one circular path; counter-rotation keeps the discs upright. */}
          <g className="rhythm-sun-orbit rhythm-celestial-orbit rhythm-cycle">
            <g className="rhythm-sun rhythm-celestial-body rhythm-cycle">
              <circle cx="350" cy="245" r="44" className="rhythm-sun-disc" />
            </g>
          </g>
          <g className="rhythm-moon-orbit rhythm-celestial-orbit rhythm-cycle">
            <g className="rhythm-moon rhythm-celestial-body rhythm-cycle">
              <circle cx="350" cy="245" r="27" className="rhythm-moon-disc" />
              <path
                d="M360 224a23 23 0 0 1-25 35 27 27 0 0 0 25-35Z"
                className="rhythm-moon-shade"
              />
              <g className="rhythm-moon-craters">
                <circle cx="342" cy="238" r="4" />
                <circle cx="356" cy="255" r="5" />
                <circle cx="337" cy="252" r="2" />
              </g>
            </g>
          </g>
          <g className="rhythm-clouds rhythm-cycle">
            <path d="M410 190h170M453 205h80M135 292h115M158 307h140" />
          </g>
          <g className="rhythm-landscape">
            <path
              className="rhythm-ridge-far"
              d="M-1000 449C-780 422-625 351-420 385S-180 472 0 449C104 440 151 349 233 358S349 292 401 326 568 422 720 336S1200 392 1600 348V750H-1000Z"
            />
            <path
              className="rhythm-ridge-line"
              d="M-1000 449C-780 422-625 351-420 385S-180 472 0 449C104 440 151 349 233 358S349 292 401 326 568 422 720 336S1200 392 1600 348"
            />
            <g className="rhythm-distant-ridge">
              <path
                className="rhythm-ridge-mid"
                d="M-1000 499C-780 468-625 518-420 481S-180 475 0 499C112 408 191 466 278 436S407 387 498 426 634 399 720 410S1240 474 1600 430V740H-1000Z"
              />
            </g>
            <g className="rhythm-vegetation">
              <path d="m207 424 15-27 15 27h-8l14 22h-16v20h-10v-20h-16l14-22Zm338 15 12-24 12 24h-6l11 19h-13v18h-8v-18h-13l11-19Z" />
              <path d="m248 481 11-10 18 3 10 12m240 17 14-9 17 4 7 8M339 511l-14-4-12 7" />
            </g>
            <g className="rhythm-shelter">
              {/* A compact stone starter base with one metal roof and a code-locked door. */}
              <path
                d="M365 484h119l35-17v8l-35 17H365Z"
                className="rhythm-shelter-foundation"
              />
              <path d="M369 426h111v58H369Z" className="rhythm-shelter-wall" />
              <path
                d="m480 426 35-17v58l-35 17Z"
                className="rhythm-shelter-side"
              />
              <path
                d="M369 445h111m-111 20h111m-85-39v19m43-19v19m-22 0v20m-21 0v19m85-39 35-17m-31 56v8"
                className="rhythm-stone-joints"
              />
              <g className="rhythm-shelter-roofs">
                <path d="M363 426l61-41 62 41Z" className="rhythm-roof-panel" />
                <path
                  d="m424 385 35-17 62 41-35 17Z"
                  className="rhythm-roof-side"
                />
                <path
                  d="m436 379 62 41m-50-47 62 41"
                  className="rhythm-roof-seams"
                />
                <path d="M363 426h123l35-17" className="rhythm-shelter-roof" />
              </g>
              <path d="M380 439h24v20h-24Z" className="rhythm-window-frame" />
              <path
                d="M383 442h18v14h-18Z"
                className="rhythm-window rhythm-cycle"
              />
              <path d="M392 442v14" className="rhythm-window-mullion" />
              <path d="M422 439h31v45h-31Z" className="rhythm-door-frame" />
              <path
                d="M426 443h23v41h-23Zm0 0 23 41m0-41-23 41"
                className="rhythm-door"
              />
              <path d="M456 454h6v10h-6Z" className="rhythm-code-lock" />
              <circle
                cx="459"
                cy="457"
                r="1"
                className="rhythm-lock-indicator"
              />
              <path
                d="M417 484h42v6h-42Z"
                className="rhythm-shelter-foundation"
              />
              <g className="rhythm-lamplight rhythm-cycle">
                <ellipse
                  cx="437"
                  cy="491"
                  rx="40"
                  ry="14"
                  fill={`url(#${lightId})`}
                />
                <path d="M433 434h9v4h-9Z" className="rhythm-lamp" />
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
