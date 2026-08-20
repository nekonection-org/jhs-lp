"use client";

import { Save } from "lucide-react";
import { useActionState } from "react";

import {
  initialModeratorActionState,
  type ModeratorActionState,
} from "@/app/admin/moderator/action-state";
import { Button } from "@/components/ui/Button";
import type { Locale, ModeratorContent } from "@/content";
import { cn } from "@/lib/cn";
import { getMatchingItem } from "@/lib/content";

interface ModeratorFormProps {
  action: (
    state: ModeratorActionState,
    formData: FormData,
  ) => Promise<ModeratorActionState>;
  values: {
    version: number;
    translations: { ja: ModeratorContent; en: ModeratorContent };
  };
}

const fieldClassName =
  "min-h-11 w-full rounded-lg border border-[var(--border-strong)] bg-[var(--background)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--focus)_35%,transparent)] disabled:cursor-wait disabled:opacity-60";

const localizedFields = [
  ["eyebrow", "セクションラベル", "Section label", false],
  ["title", "見出し", "Title", false],
  ["description", "概要", "Description", true],
  ["statusTitle", "募集状態の見出し", "Recruitment status title", false],
  [
    "statusDescription",
    "募集状態の説明",
    "Recruitment status description",
    true,
  ],
  ["applicationTitle", "応募方法の見出し", "Application title", false],
  ["applicationDescription", "応募方法の説明", "Application description", true],
] as const;

const itemIds = [
  "responsibilities",
  "requirements",
  "ideal-candidate",
] as const;

function FieldError({
  name,
  state,
}: {
  name: string;
  state: ModeratorActionState;
}) {
  return (
    <p
      aria-live="polite"
      className="min-h-5 text-xs font-semibold text-[var(--danger)]"
      id={`${name}-error`}
    >
      {state.fieldErrors[name]}
    </p>
  );
}

function TextField({
  defaultValue,
  label,
  name,
  state,
  textarea = false,
}: {
  defaultValue: string;
  label: string;
  name: string;
  state: ModeratorActionState;
  textarea?: boolean;
}) {
  const shared = {
    "aria-describedby": state.fieldErrors[name] ? `${name}-error` : undefined,
    "aria-invalid": Boolean(state.fieldErrors[name]),
    className: cn(fieldClassName, textarea && "min-h-28 resize-y"),
    defaultValue,
    id: name,
    name,
  };

  return (
    <div className="grid content-start gap-2 text-sm font-semibold">
      <label htmlFor={name}>{label}</label>
      {textarea ? <textarea {...shared} /> : <input {...shared} />}
      <FieldError name={name} state={state} />
    </div>
  );
}

function LocalizedPanel({
  content,
  locale,
  state,
}: {
  content: ModeratorContent;
  locale: Locale;
  state: ModeratorActionState;
}) {
  const japanese = locale === "ja";
  return (
    <section className="surface-card grid content-start gap-5 p-5 sm:p-6">
      <div>
        <p className="section-eyebrow">{japanese ? "Japanese" : "English"}</p>
        <h2 className="mt-2 text-xl font-bold">
          {japanese ? "日本語" : "英語"}
        </h2>
      </div>
      {localizedFields.map(([field, jaLabel, enLabel, textarea]) => (
        <TextField
          defaultValue={content[field]}
          key={field}
          label={japanese ? jaLabel : enLabel}
          name={`${field}-${locale}`}
          state={state}
          textarea={textarea}
        />
      ))}
    </section>
  );
}

export function ModeratorForm({ action, values }: ModeratorFormProps) {
  const [state, formAction, pending] = useActionState(
    action,
    initialModeratorActionState,
  );
  const ja = values.translations.ja;
  const en = values.translations.en;

  return (
    <form action={formAction} className="grid gap-6">
      <input name="version" type="hidden" value={values.version} />

      {state.message ? (
        <p
          className="rounded-lg border border-[color-mix(in_srgb,var(--danger)_55%,var(--border))] bg-[color-mix(in_srgb,var(--danger)_9%,var(--surface))] px-4 py-3 text-sm font-semibold text-[var(--danger)]"
          role="alert"
        >
          {state.message}
        </p>
      ) : null}

      <fieldset className="grid gap-6" disabled={pending}>
        <legend className="sr-only">モデレーター募集コンテンツ</legend>

        <section className="surface-card grid gap-5 p-5 sm:p-6">
          <div>
            <p className="section-eyebrow">Publication</p>
            <h2 className="mt-2 text-xl font-bold">公開設定</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid content-start gap-2 text-sm font-semibold">
              <label htmlFor="status">募集内容の確認状態</label>
              <select
                className={fieldClassName}
                defaultValue={ja.status}
                id="status"
                name="status"
              >
                <option value="confirmed">確認済み</option>
                <option value="pending">準備中</option>
              </select>
              <FieldError name="status" state={state} />
            </div>
            <div className="grid content-start gap-2 text-sm font-semibold">
              <span>応募ボタンの表示</span>
              <label
                className="flex h-11 items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-secondary)] px-4"
                data-testid="moderator-application-toggle"
              >
                <input
                  className="size-4 accent-[var(--accent)]"
                  defaultChecked={Boolean(
                    ja.applicationAction && en.applicationAction,
                  )}
                  name="applicationEnabled"
                  type="checkbox"
                />
                応募ボタンを表示する
              </label>
              <span aria-hidden="true" className="min-h-5" />
            </div>
          </div>
        </section>

        <div className="grid gap-5 lg:grid-cols-2">
          <LocalizedPanel content={ja} locale="ja" state={state} />
          <LocalizedPanel content={en} locale="en" state={state} />
        </div>

        <section className="surface-card grid gap-5 p-5 sm:p-6">
          <div>
            <p className="section-eyebrow">Recruitment details</p>
            <h2 className="mt-2 text-xl font-bold">活動内容・応募条件</h2>
          </div>
          {itemIds.map((id) => (
            <div
              className="grid gap-4 border-t border-[var(--border)] pt-5 lg:grid-cols-[10rem_1fr_1fr]"
              key={id}
            >
              <div className="grid content-start gap-2 text-sm font-semibold">
                <label htmlFor={`item-${id}-status`}>確認状態</label>
                <select
                  className={fieldClassName}
                  defaultValue={getMatchingItem(ja.items, id).status}
                  id={`item-${id}-status`}
                  name={`item-${id}-status`}
                >
                  <option value="confirmed">確認済み</option>
                  <option value="pending">準備中</option>
                </select>
                <FieldError name={`item-${id}-status`} state={state} />
              </div>
              {(["ja", "en"] as const).map((locale) => {
                const item = getMatchingItem(
                  locale === "ja" ? ja.items : en.items,
                  id,
                );
                return (
                  <div className="grid gap-3" key={locale}>
                    <TextField
                      defaultValue={item.title}
                      label={locale === "ja" ? "日本語見出し" : "English title"}
                      name={`item-${id}-title-${locale}`}
                      state={state}
                    />
                    <TextField
                      defaultValue={item.description}
                      label={
                        locale === "ja" ? "日本語説明" : "English description"
                      }
                      name={`item-${id}-description-${locale}`}
                      state={state}
                      textarea
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </section>

        <section className="surface-card grid gap-5 p-5 sm:p-6">
          <div>
            <p className="section-eyebrow">Application action</p>
            <h2 className="mt-2 text-xl font-bold">応募ボタン文言</h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              公開先は環境変数で設定された応募フォームまたはDiscord URLです。
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            {(["ja", "en"] as const).map((locale) => {
              const actionValue =
                locale === "ja" ? ja.applicationAction : en.applicationAction;
              return (
                <div className="grid gap-3" key={locale}>
                  <TextField
                    defaultValue={actionValue?.label ?? ""}
                    label={locale === "ja" ? "日本語ラベル" : "English label"}
                    name={`applicationLabel-${locale}`}
                    state={state}
                  />
                  <TextField
                    defaultValue={actionValue?.ariaLabel ?? ""}
                    label={
                      locale === "ja" ? "日本語の補足" : "English aria label"
                    }
                    name={`applicationAriaLabel-${locale}`}
                    state={state}
                  />
                </div>
              );
            })}
          </div>
        </section>

        <div className="flex justify-end border-t border-[var(--border)] pt-6">
          <Button disabled={pending} type="submit">
            <Save aria-hidden="true" className="size-4" />
            {pending ? "保存中..." : "募集内容を保存"}
          </Button>
        </div>
      </fieldset>
    </form>
  );
}
