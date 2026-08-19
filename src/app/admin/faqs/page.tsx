import { ArrowRight, Plus } from "lucide-react";
import Link from "next/link";

import { FaqStatusBadge } from "@/components/admin/FaqStatusBadge";
import { ButtonLink } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { en, ja } from "@/content";
import { requireAdmin } from "@/lib/auth/admin";
import { listAdminFaqs } from "@/lib/faqs/repository";
import { getFaqTranslation } from "@/lib/faqs/types";

interface AdminFaqsPageProps {
  searchParams: Promise<{ archived?: string }>;
}

export default async function AdminFaqsPage({
  searchParams,
}: AdminFaqsPageProps) {
  await requireAdmin();
  const [faqs, query] = await Promise.all([listAdminFaqs(), searchParams]);

  return (
    <div className="grid gap-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-eyebrow">FAQ</p>
          <h1 className="mt-3 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
            FAQ管理
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
            日英の質問と回答、公開状態、公開サイトでの表示順を管理します。
          </p>
        </div>
        <ButtonLink href="/admin/faqs/new">
          <Plus aria-hidden="true" className="size-4" />
          新しいFAQ
        </ButtonLink>
      </div>

      {query.archived === "1" ? (
        <p
          className="rounded-lg border border-[color-mix(in_srgb,var(--accent)_45%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_9%,var(--surface))] px-4 py-3 text-sm font-semibold text-[var(--accent-strong)]"
          role="status"
        >
          FAQをアーカイブしました。
        </p>
      ) : null}

      {faqs.length > 0 ? (
        <div className="grid gap-3">
          {faqs.map((faq) => {
            const japanese = getFaqTranslation(faq, "ja");
            return (
              <article
                className="surface-card grid gap-4 p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-6"
                key={faq.id}
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <FaqStatusBadge status={faq.status} />
                    <StatusBadge
                      en={en.common.statusLabels[faq.contentStatus]}
                      ja={ja.common.statusLabels[faq.contentStatus]}
                      status={faq.contentStatus}
                    />
                    <span className="text-xs text-[var(--text-muted)]">
                      表示順: {faq.sortOrder}
                    </span>
                  </div>
                  <h2 className="mt-3 truncate text-lg font-bold tracking-[-0.025em]">
                    {japanese?.question ?? "日本語の質問未設定"}
                  </h2>
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-[var(--text-secondary)]">
                    {japanese?.answer ?? "日本語の回答未設定"}
                  </p>
                </div>
                <Link
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[var(--border-strong)] px-4 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]"
                  href={`/admin/faqs/${faq.id}/edit`}
                >
                  {faq.status === "archived" ? "確認" : "編集"}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="surface-card grid min-h-64 place-items-center p-8 text-center">
          <div>
            <h2 className="text-xl font-bold">FAQはまだありません</h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              最初のFAQを下書きとして作成してください。
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
