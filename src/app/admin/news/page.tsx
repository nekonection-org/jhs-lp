import { ArrowRight, Plus } from "lucide-react";
import Link from "next/link";

import { AnnouncementStatusBadge } from "@/components/admin/AnnouncementStatusBadge";
import { ButtonLink } from "@/components/ui/Button";
import { ja } from "@/content";
import { requireAdmin } from "@/lib/auth/admin";
import {
  getOperationalStatus,
  getTranslation,
} from "@/lib/announcements/types";
import { listAdminAnnouncements } from "@/lib/announcements/repository";

function formatAdminDate(date: Date | null) {
  if (!date) {
    return "未設定";
  }

  return new Intl.DateTimeFormat("ja-JP", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Tokyo",
  }).format(date);
}

interface AdminNewsPageProps {
  searchParams: Promise<{ archived?: string }>;
}

export default async function AdminNewsPage({
  searchParams,
}: AdminNewsPageProps) {
  await requireAdmin();
  const [announcements, query] = await Promise.all([
    listAdminAnnouncements(),
    searchParams,
  ]);

  return (
    <div className="grid gap-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-eyebrow">News</p>
          <h1 className="mt-3 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
            お知らせ管理
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
            下書き、即時公開、予約公開を管理します。公開日時は日本時間です。
          </p>
        </div>
        <ButtonLink href="/admin/news/new">
          <Plus aria-hidden="true" className="size-4" />
          新しいお知らせ
        </ButtonLink>
      </div>

      {query.archived === "1" ? (
        <p
          className="rounded-lg border border-[color-mix(in_srgb,var(--accent)_45%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_9%,var(--surface))] px-4 py-3 text-sm font-semibold text-[var(--accent-strong)]"
          role="status"
        >
          お知らせをアーカイブしました。
        </p>
      ) : null}

      {announcements.length > 0 ? (
        <div className="grid gap-3">
          {announcements.map((announcement) => {
            const japanese = getTranslation(announcement, "ja");
            const status = getOperationalStatus(announcement);

            return (
              <article
                className="surface-card grid gap-4 p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-6"
                key={announcement.id}
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <AnnouncementStatusBadge status={status} />
                    <span className="text-xs font-bold text-[var(--accent-strong)]">
                      {ja.news.categoryLabels[announcement.category]}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">
                      公開日時: {formatAdminDate(announcement.publishedAt)}
                    </span>
                  </div>
                  <h2 className="mt-3 truncate text-lg font-bold tracking-[-0.025em]">
                    {japanese?.title ?? "日本語タイトル未設定"}
                  </h2>
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-[var(--text-secondary)]">
                    {japanese?.description ?? "日本語概要未設定"}
                  </p>
                </div>
                <Link
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[var(--border-strong)] px-4 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]"
                  href={`/admin/news/${announcement.id}/edit`}
                >
                  {status === "archived" ? "確認" : "編集"}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="surface-card grid min-h-64 place-items-center p-8 text-center">
          <div>
            <h2 className="text-xl font-bold">お知らせはまだありません</h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              最初のお知らせを下書きとして作成してください。
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
