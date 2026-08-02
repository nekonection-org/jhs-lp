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
        "interactive-card surface-card flex h-full flex-col p-5 sm:p-6",
        important && "rule-card",
        className,
      )}
      data-important={important || undefined}
    >
      <div className="mb-5 grid size-10 place-items-center rounded-lg border border-[var(--border)] bg-[var(--surface-secondary)] text-[var(--accent-strong)]">
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
