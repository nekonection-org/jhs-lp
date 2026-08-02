import type { ReactNode } from "react";

import type {
  ContentIcon as ContentIconName,
  ContentStatus,
} from "@/content/types";
import { ContentIcon } from "@/components/ui/ContentIcon";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/cn";

interface FeatureCardProps {
  icon: ContentIconName;
  title: ReactNode;
  description: ReactNode;
  status?: ContentStatus;
  statusLabel?: { ja: string; en: string };
  important?: boolean;
  className?: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  status,
  statusLabel,
  important = false,
  className,
}: FeatureCardProps) {
  return (
    <article
      className={cn(
        "interactive-card surface-card group relative flex h-full flex-col overflow-hidden p-5 transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_color-mix(in_srgb,var(--background)_22%,transparent)] sm:p-6",
        important && "rule-card",
        className,
      )}
      data-important={important || undefined}
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-[var(--accent)] transition-transform duration-200 group-hover:scale-x-100"
      />
      <div className="mb-5 grid size-10 place-items-center rounded-lg border border-[var(--border)] bg-[var(--surface-secondary)] text-[var(--accent-strong)] transition-[transform,border-color] duration-200 group-hover:-rotate-2 group-hover:scale-105 group-hover:border-[color-mix(in_srgb,var(--accent)_40%,var(--border))]">
        <ContentIcon className="size-5" name={icon} />
      </div>
      <h3 className="text-lg font-bold tracking-[-0.025em] text-[var(--text-primary)]">
        {title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-[var(--text-secondary)]">
        {description}
      </p>
      {status && statusLabel ? (
        <StatusBadge
          className="mt-5"
          en={statusLabel.en}
          ja={statusLabel.ja}
          status={status}
        />
      ) : null}
    </article>
  );
}
