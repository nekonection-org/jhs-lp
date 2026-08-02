import { CircleCheck, Clock3 } from "lucide-react";

import type { ContentStatus } from "@/content/types";
import { LocalizedText } from "@/components/ui/LocalizedText";
import { cn } from "@/lib/cn";

interface StatusBadgeProps {
  status: ContentStatus;
  ja: string;
  en: string;
  className?: string;
}

export function StatusBadge({ status, ja, en, className }: StatusBadgeProps) {
  const Icon = status === "confirmed" ? CircleCheck : Clock3;

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-semibold",
        status === "confirmed"
          ? "border-[color-mix(in_srgb,var(--accent)_38%,transparent)] bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] text-[var(--accent-strong)]"
          : "border-[var(--border)] bg-[var(--surface-secondary)] text-[var(--text-secondary)]",
        className,
      )}
    >
      <Icon aria-hidden="true" className="size-3.5" />
      <LocalizedText ja={ja} en={en} />
    </span>
  );
}
