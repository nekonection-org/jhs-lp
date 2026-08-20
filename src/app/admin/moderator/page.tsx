import { ClipboardCheck } from "lucide-react";
import { notFound } from "next/navigation";

import { updateModeratorAction } from "@/app/admin/moderator/actions";
import { ModeratorForm } from "@/components/admin/ModeratorForm";
import { requireAdmin } from "@/lib/auth/admin";
import { findModeratorContent } from "@/lib/moderator/repository";

interface AdminModeratorPageProps {
  searchParams: Promise<{ saved?: string }>;
}

export default async function AdminModeratorPage({
  searchParams,
}: AdminModeratorPageProps) {
  await requireAdmin();
  const [content, query] = await Promise.all([
    findModeratorContent(),
    searchParams,
  ]);
  if (!content) notFound();

  return (
    <div className="grid gap-8">
      <div>
        <div className="flex items-center gap-3">
          <ClipboardCheck
            aria-hidden="true"
            className="size-5 text-[var(--accent-strong)]"
          />
          <p className="section-eyebrow">Moderator Recruitment</p>
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
          モデレーター募集管理
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
          公開サイトの募集状態、活動内容、応募条件、応募ボタンを日本語と英語で編集します。
        </p>
      </div>

      {query.saved === "1" ? (
        <p
          className="rounded-lg border border-[color-mix(in_srgb,var(--accent)_45%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_9%,var(--surface))] px-4 py-3 text-sm font-semibold text-[var(--accent-strong)]"
          role="status"
        >
          モデレーター募集内容を更新しました。
        </p>
      ) : null}

      <ModeratorForm action={updateModeratorAction} values={content} />
    </div>
  );
}
