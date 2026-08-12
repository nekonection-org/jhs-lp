import { ArrowLeft, Pencil } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AnnouncementPreview } from "@/components/admin/AnnouncementPreview";
import { buttonStyles } from "@/components/ui/Button";
import { findAdminAnnouncement } from "@/lib/announcements/repository";
import { requireAdmin } from "@/lib/auth/admin";

interface PreviewAnnouncementPageProps {
  params: Promise<{ id: string }>;
}

export default async function PreviewAnnouncementPage({
  params,
}: PreviewAnnouncementPageProps) {
  await requireAdmin();
  const { id } = await params;
  const announcement = await findAdminAnnouncement(id);

  if (!announcement) {
    notFound();
  }

  return (
    <div className="grid gap-8">
      <div>
        <Link
          className="inline-flex min-h-10 items-center gap-2 rounded-lg text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]"
          href={`/admin/news/${announcement.id}/edit`}
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          編集画面へ戻る
        </Link>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-eyebrow">Preview</p>
            <h1 className="mt-3 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
              お知らせプレビュー
            </h1>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              下書き・予約公開・公開中・アーカイブを、公開せずに確認できます。
            </p>
          </div>

          <Link
            className={buttonStyles({ variant: "secondary", size: "compact" })}
            href={`/admin/news/${announcement.id}/edit`}
          >
            <Pencil aria-hidden="true" className="size-4" />
            編集する
          </Link>
        </div>
      </div>

      <AnnouncementPreview announcement={announcement} />
    </div>
  );
}
