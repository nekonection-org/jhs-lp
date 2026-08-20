import { Gem } from "lucide-react";
import { notFound } from "next/navigation";

import { updateVipAction } from "@/app/admin/vip/actions";
import { VipForm } from "@/components/admin/VipForm";
import { requireAdmin } from "@/lib/auth/admin";
import { findVipContent } from "@/lib/vip/repository";

interface AdminVipPageProps {
  searchParams: Promise<{ saved?: string }>;
}

export default async function AdminVipPage({
  searchParams,
}: AdminVipPageProps) {
  await requireAdmin();
  const [content, query] = await Promise.all([findVipContent(), searchParams]);
  if (!content) {
    notFound();
  }

  return (
    <div className="grid gap-8">
      <div>
        <div className="flex items-center gap-3">
          <Gem
            aria-hidden="true"
            className="size-5 text-[var(--accent-strong)]"
          />
          <p className="section-eyebrow">VIP</p>
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
          VIP管理
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
          公開サイトのVIP案内、料金、特典、購入ボタンを日本語と英語で編集します。
        </p>
      </div>

      {query.saved === "1" ? (
        <p
          className="rounded-lg border border-[color-mix(in_srgb,var(--accent)_45%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_9%,var(--surface))] px-4 py-3 text-sm font-semibold text-[var(--accent-strong)]"
          role="status"
        >
          VIP内容を更新しました。
        </p>
      ) : null}

      <VipForm action={updateVipAction} values={content} />
    </div>
  );
}
