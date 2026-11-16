"use client";

import { Fragment, useId } from "react";
import { motion } from "motion/react";

import { useReducedMotion } from "@/hooks/useReducedMotion";

import type { LanguageContent } from "@/content/types";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/cn";
import { motionTiming } from "@/lib/motion";

interface LanguageToggleProps {
  content: LanguageContent;
  compact?: boolean;
}

export function LanguageToggle({
  content,
  compact = false,
}: LanguageToggleProps) {
  const { locale, setLocale } = useLanguage();
  const id = useId();
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-label={content.label}
      className="inline-flex items-center rounded-md border border-[var(--border)] bg-[var(--surface)] p-1"
      role="group"
    >
      {(["ja", "en"] as const).map((value) => (
        <Fragment key={value}>
          {value === "en" ? (
            <span
              aria-hidden="true"
              className="px-0.5 text-xs text-[var(--border-strong)]"
            >
              /
            </span>
          ) : null}
          <button
            aria-label={value === "ja" ? content.japanese : content.english}
            aria-pressed={locale === value}
            className={cn(
              "relative min-h-9 rounded px-2.5 text-xs font-bold tracking-wide text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]",
              locale === value && "text-[var(--text-primary)]",
              compact && "min-h-11 flex-1 text-sm",
            )}
            onClick={() => setLocale(value)}
            type="button"
          >
            {locale === value ? (
              <motion.span
                aria-hidden="true"
                className="language-indicator"
                initial={false}
                layoutId={`${id}-language`}
                transition={{
                  ...motionTiming.interaction,
                  duration: reduceMotion
                    ? 0
                    : motionTiming.interaction.duration,
                }}
              />
            ) : null}
            <span className="relative">{value === "ja" ? "JP" : "EN"}</span>
          </button>
        </Fragment>
      ))}
    </div>
  );
}
