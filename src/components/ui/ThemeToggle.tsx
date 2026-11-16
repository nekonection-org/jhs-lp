"use client";

import { Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";

import { useReducedMotion } from "@/hooks/useReducedMotion";

import type { ThemeContent } from "@/content/types";
import { Button } from "@/components/ui/Button";
import { useMounted } from "@/hooks/useMounted";
import { motionTiming } from "@/lib/motion";

interface ThemeToggleProps {
  content: ThemeContent;
  showLabel?: boolean;
}

export function ThemeToggle({ content, showLabel = false }: ThemeToggleProps) {
  const mounted = useMounted();
  const reduceMotion = useReducedMotion();
  const { theme, setTheme } = useTheme();
  const isDark = theme !== "light";
  const nextLabel = isDark ? content.switchToLight : content.switchToDark;

  if (!mounted) {
    return (
      <Button
        aria-label={content.label}
        className="min-w-11 px-3"
        disabled
        size="compact"
        variant="quiet"
      >
        <Moon aria-hidden="true" className="size-4" />
        {showLabel ? <span>{content.dark}</span> : null}
      </Button>
    );
  }

  return (
    <Button
      aria-label={nextLabel}
      className="min-w-11 px-3"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      size="compact"
      title={nextLabel}
      variant="quiet"
    >
      <motion.span
        aria-hidden="true"
        className="inline-flex"
        key={isDark ? "dark" : "light"}
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          ...motionTiming.interaction,
          duration: reduceMotion ? 0 : motionTiming.interaction.duration,
        }}
      >
        {isDark ? (
          <Moon aria-hidden="true" className="size-4" />
        ) : (
          <Sun aria-hidden="true" className="size-4" />
        )}
      </motion.span>
      {showLabel ? <span>{isDark ? content.dark : content.light}</span> : null}
    </Button>
  );
}
