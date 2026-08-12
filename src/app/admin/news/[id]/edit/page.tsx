import { Archive, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  archiveAnnouncementAction,
  updateAnnouncementAction,
} from "@/app/admin/news/actions";
import {
  AnnouncementForm,
  type AnnouncementFormValues,
} from "@/components/admin/AnnouncementForm";
import { AnnouncementStatusBadge } from "@/components/admin/AnnouncementStatusBadge";
import { Button } from "@/components/ui/Button";
import { requireAdmin } from "@/lib/auth/admin";
import { findAdminAnnouncement } from "@/lib/announcements/repository";
import { formatJapanDateTimeLocal } from "@/lib/announcements/validation";
import {
  getOperationalStatus,
  getTranslation,
} from "@/lib/announcements/types";

interface EditAnnouncementPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}

export default async function EditAnnouncementPage({
  params,
  searchParams,
}: EditAnnouncementPageProps) {
  await requireAdmin();
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const announcement = await findAdminAnnouncement(id);

  if (!announcement) {
    notFound();
  }

  const japanese = getTranslation(announcement, "ja");
  const english = getTranslation(announcement, "en");
  const status = getOperationalStatus(announcement);
  const action = updateAnnouncementAction.bind(null, announcement.id);
  const archiveAction = archiveAnnouncementAction.bind(null, announcement.id);
  const values: AnnouncementFormValues = {
    category: announcement.category,
    status: announcement.status === "published" ? "published" : "draft",
    publishedAt: formatJapanDateTimeLocal(announcement.publishedAt),
    externalUrl: announcement.externalUrl ?? "",
    titleJa: japanese?.title ?? "",
    descriptionJa: japanese?.description ?? "",
    titleEn: english?.title ?? "",
    descriptionEn: english?.description ?? "",
    version: announcement.version,
  };

  return (
    <div className="grid gap-8">
      <div>
        <Link
          className="inline-flex min-h-10 items-center gap-2 rounded-lg text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]"
          href="/admin/news"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          お知らせ一覧へ戻る
        </Link>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <p className="section-eyebrow">Edit</p>
          <AnnouncementStatusBadge status={status} />
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
          {status === "archived"
            ? "アーカイブ済みのお知らせ"
            : "お知らせを編集"}
        </h1>
      </div>

      {query.saved ? (
        <p
          className="rounded-lg border border-[color-mix(in_srgb,var(--accent)_45%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_9%,var(--surface))] px-4 py-3 text-sm font-semibold text-[var(--accent-strong)]"
          role="status"
        >
          {query.saved === "created"
            ? "お知らせを作成しました。"
            : "お知らせを更新しました。"}
        </p>
      ) : null}

      {query.error ? (
        <p
          className="rounded-lg border border-[color-mix(in_srgb,var(--danger)_55%,var(--border))] bg-[color-mix(in_srgb,var(--danger)_9%,var(--surface))] px-4 py-3 text-sm font-semibold text-[var(--danger)]"
          role="alert"
        >
          操作を完了できませんでした。一覧から開き直してください。
        </p>
      ) : null}

      {status === "archived" ? (
        <div className="surface-card p-6">
          <p className="text-sm leading-6 text-[var(--text-secondary)]">
            アーカイブ済みのお知らせは編集できません。監査ログとともに保持されます。
          </p>
        </div>
      ) : (
        <>
          <AnnouncementForm
            action={action}
            submitLabel="変更を保存"
            values={values}
          />

          <details className="surface-card border-[color-mix(in_srgb,var(--danger)_30%,var(--border))] p-5 sm:p-6">
            <summary className="cursor-pointer text-sm font-bold text-[var(--danger)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]">
              アーカイブ操作
            </summary>
            <div className="mt-4 border-t border-[var(--border)] pt-4">
              <p className="text-sm leading-6 text-[var(--text-secondary)]">
                公開サイトから非表示にします。データと操作ログは削除されません。
              </p>
              <form action={archiveAction} className="mt-4">
                <input
                  name="version"
                  type="hidden"
                  value={announcement.version}
                />
                <Button type="submit" variant="secondary">
                  <Archive aria-hidden="true" className="size-4" />
                  アーカイブする
                </Button>
              </form>
            </div>
          </details>
        </>
      )}
    </div>
  );
}
