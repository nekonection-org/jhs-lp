import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { createFaqAction } from "@/app/admin/faqs/actions";
import { FaqForm, type FaqFormValues } from "@/components/admin/FaqForm";
import { requireAdmin } from "@/lib/auth/admin";

const emptyValues: FaqFormValues = {
  status: "draft",
  contentStatus: "confirmed",
  sortOrder: "10",
  questionJa: "",
  answerJa: "",
  questionEn: "",
  answerEn: "",
};

export default async function NewFaqPage() {
  await requireAdmin();

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
        <p className="section-eyebrow mt-6">Create</p>
        <h1 className="mt-3 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
          FAQを作成
        </h1>
      </div>

      <FaqForm
        action={createFaqAction}
        submitLabel="FAQを保存"
        values={emptyValues}
      />
    </div>
  );
}
