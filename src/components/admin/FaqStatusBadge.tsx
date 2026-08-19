import type { FaqStatus } from "@/lib/faqs/types";
import { cn } from "@/lib/cn";

const labels: Readonly<Record<FaqStatus, string>> = {
  draft: "下書き",
  published: "公開",
  archived: "アーカイブ済み",
};

export function FaqStatusBadge({ status }: { status: FaqStatus }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-md border px-2 py-1 text-xs font-bold",
        status === "published"
          ? "border-[color-mix(in_srgb,var(--accent)_45%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_9%,var(--surface))] text-[var(--accent-strong)]"
          : "border-[var(--border)] bg-[var(--surface-secondary)] text-[var(--text-secondary)]",
      )}
    >
      {labels[status]}
    </span>
  );
}
