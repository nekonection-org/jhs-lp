"use client";

import type { LanguageContent } from "@/content/types";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/cn";

interface LanguageToggleProps {
  content: LanguageContent;
  compact?: boolean;
}

export function LanguageToggle({
  content,
  compact = false,
}: LanguageToggleProps) {
  const { locale, setLocale } = useLanguage();

  return (
    <div
      aria-label={content.label}
      className="inline-flex items-center rounded-lg border border-[var(--border)] bg-[var(--surface)] p-1"
      role="group"
    >
      <button
        aria-label={content.japanese}
        aria-pressed={locale === "ja"}
        className={cn(
          "min-h-8 rounded-md px-2.5 text-xs font-bold tracking-wide text-[var(--text-secondary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]",
          locale === "ja" &&
            "bg-[var(--surface-secondary)] text-[var(--text-primary)]",
          compact && "min-h-9 flex-1 text-sm",
        )}
        onClick={() => setLocale("ja")}
        type="button"
      >
        JP
      </button>
      <span aria-hidden="true" className="text-xs text-[var(--border-strong)]">
        /
      </span>
      <button
        aria-label={content.english}
        aria-pressed={locale === "en"}
        className={cn(
          "min-h-8 rounded-md px-2.5 text-xs font-bold tracking-wide text-[var(--text-secondary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]",
          locale === "en" &&
            "bg-[var(--surface-secondary)] text-[var(--text-primary)]",
          compact && "min-h-9 flex-1 text-sm",
        )}
        onClick={() => setLocale("en")}
        type="button"
      >
        EN
      </button>
    </div>
  );
}
