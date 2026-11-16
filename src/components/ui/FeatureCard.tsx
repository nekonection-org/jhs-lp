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
  number?: string;
  title: ReactNode;
  description: ReactNode;
  status?: ContentStatus;
  statusLabel?: { ja: string; en: string };
  important?: boolean;
  className?: string;
}

export function FeatureCard({
  icon,
  number,
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
        "feature-row grid gap-x-8 gap-y-3 border-t border-[var(--border)] py-6 md:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]",
        important && "rule-card",
        className,
      )}
      data-important={important || undefined}
    >
      <div className="flex items-start gap-3">
        {number ? (
          <span className="feature-number" aria-hidden="true">
            {number}
          </span>
        ) : (
          <ContentIcon
            className="mt-1 size-5 shrink-0 text-[var(--accent-strong)]"
            name={icon}
          />
        )}
        <h3 className="text-lg font-bold tracking-[-0.025em] text-[var(--text-primary)]">
          {title}
        </h3>
      </div>
      <div>
        <p className="text-sm leading-7 text-[var(--text-secondary)]">
          {description}
        </p>
        {status && statusLabel ? (
          <StatusBadge
            className="mt-3"
            en={statusLabel.en}
            ja={statusLabel.ja}
            status={status}
          />
        ) : null}
      </div>
    </article>
  );
}
