"use client";

import { Save } from "lucide-react";
import { useActionState } from "react";

import {
  initialAnnouncementActionState,
  type AnnouncementActionState,
} from "@/app/admin/news/action-state";
import { Button } from "@/components/ui/Button";
import { announcementCategories } from "@/lib/announcements/types";
import type { AnnouncementFieldName } from "@/lib/announcements/validation";
import { cn } from "@/lib/cn";

export interface AnnouncementFormValues {
  category: string;
  status: string;
  publishedAt: string;
  externalUrl: string;
  titleJa: string;
  descriptionJa: string;
  titleEn: string;
  descriptionEn: string;
  version?: number;
}

interface AnnouncementFormProps {
  action: (
    state: AnnouncementActionState,
    formData: FormData,
  ) => Promise<AnnouncementActionState>;
  submitLabel: string;
  values: AnnouncementFormValues;
}

const categoryLabels: Readonly<Record<string, string>> = {
  notice: "お知らせ",
  maintenance: "メンテナンス",
  update: "アップデート",
  event: "イベント",
  important: "重要",
  incident: "障害情報",
};

const fieldClassName =
  "min-h-11 w-full rounded-lg border border-[var(--border-strong)] bg-[var(--background)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--focus)_35%,transparent)] disabled:cursor-wait disabled:opacity-60";

interface FieldErrorProps {
  field: AnnouncementFieldName;
  state: AnnouncementActionState;
}

function FieldError({ field, state }: FieldErrorProps) {
  const message = state.fieldErrors[field];

  return (
    <p
      aria-live="polite"
      className="text-xs font-semibold text-[var(--danger)] sm:min-h-5"
      id={`${field}-error`}
    >
      {message}
    </p>
  );
}

function fieldDescriptionId(
  field: AnnouncementFieldName,
  state: AnnouncementActionState,
  descriptionId?: string,
) {
  return (
    [descriptionId, state.fieldErrors[field] ? `${field}-error` : null]
      .filter(Boolean)
      .join(" ") || undefined
  );
}

export function AnnouncementForm({
  action,
  submitLabel,
  values,
}: AnnouncementFormProps) {
  const [state, formAction, pending] = useActionState(
    action,
    initialAnnouncementActionState,
  );

  return (
    <form action={formAction} className="grid gap-6">
      {values.version ? (
        <input name="version" type="hidden" value={values.version} />
      ) : null}

      {state.message ? (
        <div
          className="rounded-lg border border-[color-mix(in_srgb,var(--danger)_55%,var(--border))] bg-[color-mix(in_srgb,var(--danger)_9%,var(--surface))] px-4 py-3 text-sm font-semibold text-[var(--danger)]"
          role="alert"
        >
          {state.message}
        </div>
      ) : null}

      <fieldset className="grid gap-6" disabled={pending}>
        <legend className="sr-only">お知らせ内容</legend>

        <div className="surface-card grid gap-5 p-5 sm:p-6">
          <div>
            <p className="section-eyebrow">Publication</p>
            <h2 className="mt-2 text-xl font-bold tracking-[-0.025em]">
              公開設定
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid content-start gap-2 text-sm font-semibold">
              <label
                className="sm:flex sm:min-h-10 sm:items-end"
                htmlFor="announcement-category"
              >
                カテゴリ
              </label>
              <select
                aria-describedby={fieldDescriptionId("category", state)}
                aria-invalid={Boolean(state.fieldErrors.category)}
                className={fieldClassName}
                defaultValue={values.category}
                id="announcement-category"
                name="category"
              >
                {announcementCategories.map((category) => (
                  <option key={category} value={category}>
                    {categoryLabels[category]}
                  </option>
                ))}
              </select>
              <span aria-hidden="true" className="hidden min-h-5 sm:block" />
              <FieldError field="category" state={state} />
            </div>

            <div className="grid content-start gap-2 text-sm font-semibold">
              <label
                className="sm:flex sm:min-h-10 sm:items-end"
                htmlFor="announcement-status"
              >
                公開状態
              </label>
              <select
                aria-describedby={fieldDescriptionId(
                  "status",
                  state,
                  "status-description",
                )}
                aria-invalid={Boolean(state.fieldErrors.status)}
                className={fieldClassName}
                defaultValue={values.status}
                id="announcement-status"
                name="status"
              >
                <option value="draft">下書き</option>
                <option value="published">公開</option>
              </select>
              <span
                className="text-xs leading-5 font-normal text-[var(--text-muted)]"
                id="status-description"
              >
                公開日時が未来の場合は、その時刻まで予約公開として扱います。
              </span>
              <FieldError field="status" state={state} />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid content-start gap-2 text-sm font-semibold">
              <label
                className="sm:flex sm:min-h-10 sm:items-end"
                htmlFor="announcement-published-at"
              >
                公開日時（日本時間）
              </label>
              <input
                aria-describedby={fieldDescriptionId(
                  "publishedAt",
                  state,
                  "published-at-description",
                )}
                aria-invalid={Boolean(state.fieldErrors.publishedAt)}
                className={fieldClassName}
                defaultValue={values.publishedAt}
                id="announcement-published-at"
                name="publishedAt"
                step="60"
                type="datetime-local"
              />
              <span
                className="text-xs leading-5 font-normal text-[var(--text-muted)]"
                id="published-at-description"
              >
                公開状態では必須です。時刻はJSTとして保存されます。
              </span>
              <FieldError field="publishedAt" state={state} />
            </div>

            <div className="grid content-start gap-2 text-sm font-semibold">
              <label
                className="sm:flex sm:min-h-10 sm:items-end"
                htmlFor="announcement-external-url"
              >
                外部リンク（任意）
              </label>
              <input
                aria-describedby={fieldDescriptionId("externalUrl", state)}
                aria-invalid={Boolean(state.fieldErrors.externalUrl)}
                className={fieldClassName}
                defaultValue={values.externalUrl}
                id="announcement-external-url"
                maxLength={2048}
                name="externalUrl"
                placeholder="https://discord.com/channels/..."
                type="url"
              />
              <span aria-hidden="true" className="hidden min-h-5 sm:block" />
              <FieldError field="externalUrl" state={state} />
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <section className="surface-card grid content-start gap-5 p-5 sm:p-6">
            <div className="lg:min-h-[5.25rem]">
              <p className="section-eyebrow">Japanese</p>
              <h2 className="mt-2 text-xl font-bold tracking-[-0.025em]">
                日本語
              </h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                下書き・公開のどちらでも必須です。
              </p>
            </div>

            <div className="grid gap-2 text-sm font-semibold">
              <label htmlFor="announcement-title-ja">タイトル</label>
              <input
                aria-describedby={fieldDescriptionId("titleJa", state)}
                aria-invalid={Boolean(state.fieldErrors.titleJa)}
                className={fieldClassName}
                defaultValue={values.titleJa}
                id="announcement-title-ja"
                maxLength={160}
                name="titleJa"
              />
              <FieldError field="titleJa" state={state} />
            </div>

            <div className="grid gap-2 text-sm font-semibold">
              <label htmlFor="announcement-description-ja">概要</label>
              <textarea
                aria-describedby={fieldDescriptionId("descriptionJa", state)}
                aria-invalid={Boolean(state.fieldErrors.descriptionJa)}
                className={cn(fieldClassName, "min-h-32 resize-y")}
                defaultValue={values.descriptionJa}
                id="announcement-description-ja"
                maxLength={600}
                name="descriptionJa"
              />
              <FieldError field="descriptionJa" state={state} />
            </div>
          </section>

          <section className="surface-card grid content-start gap-5 p-5 sm:p-6">
            <div className="lg:min-h-[5.25rem]">
              <p className="section-eyebrow">English</p>
              <h2 className="mt-2 text-xl font-bold tracking-[-0.025em]">
                英語
              </h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                下書きでは省略できますが、公開時は必須です。
              </p>
            </div>

            <div className="grid gap-2 text-sm font-semibold">
              <label htmlFor="announcement-title-en">Title</label>
              <input
                aria-describedby={fieldDescriptionId("titleEn", state)}
                aria-invalid={Boolean(state.fieldErrors.titleEn)}
                className={fieldClassName}
                defaultValue={values.titleEn}
                id="announcement-title-en"
                maxLength={160}
                name="titleEn"
              />
              <FieldError field="titleEn" state={state} />
            </div>

            <div className="grid gap-2 text-sm font-semibold">
              <label htmlFor="announcement-description-en">Description</label>
              <textarea
                aria-describedby={fieldDescriptionId("descriptionEn", state)}
                aria-invalid={Boolean(state.fieldErrors.descriptionEn)}
                className={cn(fieldClassName, "min-h-32 resize-y")}
                defaultValue={values.descriptionEn}
                id="announcement-description-en"
                maxLength={600}
                name="descriptionEn"
              />
              <FieldError field="descriptionEn" state={state} />
            </div>
          </section>
        </div>

        <div className="flex justify-end border-t border-[var(--border)] pt-6">
          <Button disabled={pending} type="submit">
            <Save aria-hidden="true" className="size-4" />
            {pending ? "保存中..." : submitLabel}
          </Button>
        </div>
      </fieldset>
    </form>
  );
}
