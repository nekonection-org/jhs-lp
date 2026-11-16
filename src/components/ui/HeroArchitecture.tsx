"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Reveal } from "@/components/ui/Reveal";

// An original, resolution-independent architectural study. No image requests,
// filters or animation loop: the two layers respond only to native scrolling.
const vertices = [
  [95, 145, 335, 310],
  [515, -65, 455, 250],
  [845, 175, 550, 320],
  [705, 655, 510, 460],
  [305, 855, 395, 520],
  [-35, 610, 295, 450],
] as const;
const contours = Array.from({ length: 18 }, (_, index) => {
  const t = index / 21;
  const points = vertices.map(
    ([x, y, innerX, innerY]) =>
      `${x + (innerX - x) * t},${y + (innerY - y) * t}`,
  );
  return {
    id: index,
    upper: points.slice(0, 4).join(" "),
    lower: points.slice(3).concat(points.slice(0, 1)).join(" "),
  };
});

export function HeroArchitecture({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  const reduceMotion = useReducedMotion();
  const upperX = useTransform(progress, [0, 1], [0, 64]);
  const upperY = useTransform(progress, [0, 1], [0, -32]);
  const lowerX = useTransform(progress, [0, 1], [0, -48]);
  const lowerY = useTransform(progress, [0, 1], [0, 40]);

  return (
    <div className="hero-architecture" aria-hidden="true">
      <Reveal className="architecture-entrance" variant="aperture">
        <svg viewBox="0 0 800 800" fill="none" focusable="false">
          <motion.g
            className="architecture-upper"
            style={{
              x: reduceMotion ? 0 : upperX,
              y: reduceMotion ? 0 : upperY,
            }}
          >
            <path
              className="architecture-plane"
              d="M95 145 515-65 845 175 550 320 455 250 335 310Z"
            />
            {contours.map(({ id, upper }) => (
              <polyline
                key={id}
                points={upper}
                className="architecture-contour"
              />
            ))}
            <path className="architecture-edge" d="m95 145 420-210 330 240" />
          </motion.g>
          <motion.g
            className="architecture-lower"
            style={{
              x: reduceMotion ? 0 : lowerX,
              y: reduceMotion ? 0 : lowerY,
            }}
          >
            <path
              className="architecture-plane architecture-plane-lower"
              d="m705 655-400 200-340-245 330-160 100 70 115-60Z"
            />
            {contours.map(({ id, lower }) => (
              <polyline
                key={id}
                points={lower}
                className="architecture-contour"
              />
            ))}
            <path
              className="architecture-accent"
              d="m705 655-400 200-340-245"
            />
          </motion.g>
        </svg>
      </Reveal>
    </div>
  );
}
