import { ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";

import { updateRulesAction } from "@/app/admin/rules/actions";
import { RulesForm } from "@/components/admin/RulesForm";
import { requireAdmin } from "@/lib/auth/admin";
import { findRulesContent } from "@/lib/rules/repository";

interface AdminRulesPageProps {
  searchParams: Promise<{ saved?: string }>;
}

export default async function AdminRulesPage({
  searchParams,
}: AdminRulesPageProps) {
  await requireAdmin();
  const [content, query] = await Promise.all([
    findRulesContent(),
    searchParams,
  ]);
  if (!content) notFound();

  return (
    <div className="grid gap-8">
      <div>
        <div className="flex items-center gap-3">
          <ShieldCheck
            aria-hidden="true"
            className="size-5 text-[var(--accent-strong)]"
          />
          <p className="section-eyebrow">Server Rules</p>
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
          サーバールール管理
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--text-secondary)]">
          公開サイトの重要ルールとルール全文を日本語・英語で編集します。保存した内容は操作ログへ記録されます。
        </p>
      </div>

      {query.saved === "1" ? (
        <p
          className="rounded-lg border border-[color-mix(in_srgb,var(--accent)_45%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_9%,var(--surface))] px-4 py-3 text-sm font-semibold text-[var(--accent-strong)]"
          role="status"
        >
          サーバールールを更新しました。
        </p>
      ) : null}

      <RulesForm action={updateRulesAction} values={content} />
    </div>
  );
}
