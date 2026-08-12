import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { createAnnouncementAction } from "@/app/admin/news/actions";
import {
  AnnouncementForm,
  type AnnouncementFormValues,
} from "@/components/admin/AnnouncementForm";
import { requireAdmin } from "@/lib/auth/admin";

const emptyValues: AnnouncementFormValues = {
  category: "notice",
  status: "draft",
  publishedAt: "",
  externalUrl: "",
  titleJa: "",
  descriptionJa: "",
  titleEn: "",
  descriptionEn: "",
};

export default async function NewAnnouncementPage() {
  await requireAdmin();

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
        <p className="section-eyebrow mt-6">Create</p>
        <h1 className="mt-3 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
          お知らせを作成
        </h1>
      </div>

      <AnnouncementForm
        action={createAnnouncementAction}
        submitLabel="お知らせを保存"
        values={emptyValues}
      />
    </div>
  );
}
