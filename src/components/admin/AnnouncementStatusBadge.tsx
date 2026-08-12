import { cn } from "@/lib/cn";

export type DisplayAnnouncementStatus =
  "draft" | "scheduled" | "published" | "archived";

const labels: Readonly<Record<DisplayAnnouncementStatus, string>> = {
  draft: "下書き",
  scheduled: "予約公開",
  published: "公開中",
  archived: "アーカイブ",
};

interface AnnouncementStatusBadgeProps {
  status: DisplayAnnouncementStatus;
}

export function AnnouncementStatusBadge({
  status,
}: AnnouncementStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center rounded-md border px-2 py-1 text-xs font-bold",
        status === "published" &&
          "border-[color-mix(in_srgb,var(--accent)_50%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_12%,var(--surface))] text-[var(--accent-strong)]",
        status === "scheduled" &&
          "border-[color-mix(in_srgb,var(--info)_50%,var(--border))] bg-[color-mix(in_srgb,var(--info)_10%,var(--surface))] text-[var(--info)]",
        status === "draft" &&
          "border-[color-mix(in_srgb,var(--warning)_50%,var(--border))] bg-[color-mix(in_srgb,var(--warning)_10%,var(--surface))] text-[var(--warning)]",
        status === "archived" &&
          "border-[var(--border)] bg-[var(--surface-secondary)] text-[var(--text-muted)]",
      )}
    >
      {labels[status]}
    </span>
  );
}
