import { Archive, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { archiveFaqAction, updateFaqAction } from "@/app/admin/faqs/actions";
import { FaqForm, type FaqFormValues } from "@/components/admin/FaqForm";
import { FaqStatusBadge } from "@/components/admin/FaqStatusBadge";
import { Button } from "@/components/ui/Button";
import { requireAdmin } from "@/lib/auth/admin";
import { findAdminFaq } from "@/lib/faqs/repository";
import { getFaqTranslation } from "@/lib/faqs/types";

interface EditFaqPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}

export default async function EditFaqPage({
  params,
  searchParams,
}: EditFaqPageProps) {
  await requireAdmin();
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const faq = await findAdminFaq(id);
  if (!faq) {
    notFound();
  }

  const japanese = getFaqTranslation(faq, "ja");
  const english = getFaqTranslation(faq, "en");
  const action = updateFaqAction.bind(null, faq.id);
  const archiveAction = archiveFaqAction.bind(null, faq.id);
  const values: FaqFormValues = {
    status: faq.status === "published" ? "published" : "draft",
    contentStatus: faq.contentStatus,
    sortOrder: String(faq.sortOrder),
    questionJa: japanese?.question ?? "",
    answerJa: japanese?.answer ?? "",
    questionEn: english?.question ?? "",
    answerEn: english?.answer ?? "",
    version: faq.version,
  };

  return (
    <div className="grid gap-8">
      <div>
        <Link
          className="inline-flex min-h-10 items-center gap-2 rounded-lg text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]"
          href="/admin/faqs"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          FAQ一覧へ戻る
        </Link>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="section-eyebrow">Edit</p>
              <FaqStatusBadge status={faq.status} />
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
              {faq.status === "archived" ? "アーカイブ済みのFAQ" : "FAQを編集"}
            </h1>
          </div>
        </div>
      </div>

      {query.saved ? (
        <p
          className="rounded-lg border border-[color-mix(in_srgb,var(--accent)_45%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_9%,var(--surface))] px-4 py-3 text-sm font-semibold text-[var(--accent-strong)]"
          role="status"
        >
          {query.saved === "created"
            ? "FAQを作成しました。"
            : "FAQを更新しました。"}
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

      {faq.status === "archived" ? (
        <div className="surface-card p-6">
          <p className="text-sm leading-6 text-[var(--text-secondary)]">
            アーカイブ済みのFAQは編集できません。監査ログとともに保持されます。
          </p>
        </div>
      ) : (
        <>
          <FaqForm action={action} submitLabel="変更を保存" values={values} />

          <details className="surface-card border-[color-mix(in_srgb,var(--danger)_30%,var(--border))] p-5 sm:p-6">
            <summary className="cursor-pointer text-sm font-bold text-[var(--danger)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]">
              アーカイブ操作
            </summary>
            <div className="mt-4 border-t border-[var(--border)] pt-4">
              <p className="text-sm leading-6 text-[var(--text-secondary)]">
                公開サイトから非表示にします。データと操作ログは削除されません。
              </p>
              <form action={archiveAction} className="mt-4">
                <input name="version" type="hidden" value={faq.version} />
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
