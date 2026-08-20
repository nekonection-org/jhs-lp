"use client";

import { Plus, Save, Trash2 } from "lucide-react";
import { useActionState, useState } from "react";

import {
  initialVipActionState,
  type VipActionState,
} from "@/app/admin/vip/action-state";
import { Button } from "@/components/ui/Button";
import type { ContentIcon, Locale, VipContent } from "@/content";
import { cn } from "@/lib/cn";
import { getMatchingItem } from "@/lib/content";

interface VipFormProps {
  action: (
    state: VipActionState,
    formData: FormData,
  ) => Promise<VipActionState>;
  values: {
    version: number;
    translations: { ja: VipContent; en: VipContent };
  };
}

interface BenefitEditorValue {
  id: string;
  icon: ContentIcon | "";
  titleJa: string;
  descriptionJa: string;
  titleEn: string;
  descriptionEn: string;
}

const fieldClassName =
  "min-h-11 w-full rounded-lg border border-[var(--border-strong)] bg-[var(--background)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--focus)_35%,transparent)] disabled:cursor-wait disabled:opacity-60";

const localizedFields = [
  ["eyebrow", "セクションラベル", "Section label", false],
  ["title", "見出し", "Title", false],
  ["description", "概要", "Description", true],
  ["statusTitle", "状態の見出し", "Status title", false],
  ["statusDescription", "状態の説明", "Status description", true],
  ["benefitsTitle", "特典見出し", "Benefits heading", false],
  ["emptyBenefitsTitle", "特典未登録時の見出し", "Empty benefits title", false],
  [
    "emptyBenefitsDescription",
    "特典未登録時の説明",
    "Empty benefits description",
    true,
  ],
  [
    "purchaseUnavailableMessage",
    "購入不可時の説明",
    "Purchase unavailable message",
    true,
  ],
  ["notice", "注意事項", "Notice", true],
] as const;

const detailIds = [
  "price",
  "duration",
  "purchase-method",
  "refund-policy",
] as const;

const benefitIcons = [
  ["", "なし"],
  ["badge", "バッジ"],
  ["calendar", "カレンダー"],
  ["clock", "時計"],
  ["community", "コミュニティ"],
  ["credit-card", "カード"],
  ["settings", "設定"],
  ["shield", "シールド"],
  ["users", "ユーザー"],
] as const;

function FieldError({ name, state }: { name: string; state: VipActionState }) {
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
  state: VipActionState;
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
  content: VipContent;
  locale: Locale;
  state: VipActionState;
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

function createBenefitValues(ja: VipContent, en: VipContent) {
  return ja.benefits.map((benefit) => {
    const english = en.benefits.find((item) => item.id === benefit.id);
    return {
      id: benefit.id,
      icon: benefit.icon ?? "",
      titleJa: benefit.title,
      descriptionJa: benefit.description,
      titleEn: english?.title ?? "",
      descriptionEn: english?.description ?? "",
    } satisfies BenefitEditorValue;
  });
}

export function VipForm({ action, values }: VipFormProps) {
  const [state, formAction, pending] = useActionState(
    action,
    initialVipActionState,
  );
  const [benefits, setBenefits] = useState(() =>
    createBenefitValues(values.translations.ja, values.translations.en),
  );
  const ja = values.translations.ja;
  const en = values.translations.en;

  function addBenefit() {
    if (benefits.length >= 8) return;
    setBenefits((current) => [
      ...current,
      {
        id: `benefit-${crypto.randomUUID()}`,
        icon: "badge",
        titleJa: "",
        descriptionJa: "",
        titleEn: "",
        descriptionEn: "",
      },
    ]);
  }

  return (
    <form action={formAction} className="grid gap-6">
      <input name="version" type="hidden" value={values.version} />
      <input name="benefitCount" type="hidden" value={benefits.length} />

      {state.message ? (
        <p
          className="rounded-lg border border-[color-mix(in_srgb,var(--danger)_55%,var(--border))] bg-[color-mix(in_srgb,var(--danger)_9%,var(--surface))] px-4 py-3 text-sm font-semibold text-[var(--danger)]"
          role="alert"
        >
          {state.message}
        </p>
      ) : null}

      <fieldset className="grid gap-6" disabled={pending}>
        <legend className="sr-only">VIPコンテンツ</legend>

        <section className="surface-card grid gap-5 p-5 sm:p-6">
          <div>
            <p className="section-eyebrow">Publication</p>
            <h2 className="mt-2 text-xl font-bold">公開設定</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid content-start gap-2 text-sm font-semibold">
              <label htmlFor="status">内容の確認状態</label>
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
              <span>購入ボタンの表示</span>
              <label
                className="flex h-11 items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-secondary)] px-4"
                data-testid="vip-purchase-toggle"
              >
                <input
                  className="size-4 accent-[var(--accent)]"
                  defaultChecked={Boolean(
                    ja.purchaseAction && en.purchaseAction,
                  )}
                  name="purchaseEnabled"
                  type="checkbox"
                />
                Tebex購入ボタンを表示する
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
            <p className="section-eyebrow">Details</p>
            <h2 className="mt-2 text-xl font-bold">料金・期間・購入情報</h2>
          </div>
          {detailIds.map((id) => (
            <div
              className="grid gap-4 border-t border-[var(--border)] pt-5 lg:grid-cols-[10rem_1fr_1fr]"
              key={id}
            >
              <div className="grid content-start gap-2 text-sm font-semibold">
                <label htmlFor={`detail-${id}-status`}>確認状態</label>
                <select
                  className={fieldClassName}
                  defaultValue={getMatchingItem(ja.details, id).status}
                  id={`detail-${id}-status`}
                  name={`detail-${id}-status`}
                >
                  <option value="confirmed">確認済み</option>
                  <option value="pending">準備中</option>
                </select>
                <FieldError name={`detail-${id}-status`} state={state} />
              </div>
              {(["ja", "en"] as const).map((locale) => {
                const detail = getMatchingItem(
                  locale === "ja" ? ja.details : en.details,
                  id,
                );
                return (
                  <div className="grid gap-3" key={locale}>
                    <TextField
                      defaultValue={detail.label}
                      label={locale === "ja" ? "日本語ラベル" : "English label"}
                      name={`detail-${id}-label-${locale}`}
                      state={state}
                    />
                    <TextField
                      defaultValue={detail.value}
                      label={locale === "ja" ? "日本語内容" : "English value"}
                      name={`detail-${id}-value-${locale}`}
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
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="section-eyebrow">Benefits</p>
              <h2 className="mt-2 text-xl font-bold">VIP特典</h2>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                公開する実在の特典だけを最大8件まで登録してください。
              </p>
            </div>
            <Button
              disabled={benefits.length >= 8}
              onClick={addBenefit}
              type="button"
              variant="secondary"
            >
              <Plus aria-hidden="true" className="size-4" />
              特典を追加
            </Button>
          </div>
          <FieldError name="benefitCount" state={state} />
          {benefits.map((benefit, index) => (
            <div
              className="grid gap-4 rounded-lg border border-[var(--border)] p-4"
              key={benefit.id}
            >
              <input
                name={`benefit-${index}-id`}
                type="hidden"
                value={benefit.id}
              />
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-bold">特典 {index + 1}</h3>
                <Button
                  aria-label={`特典${index + 1}を削除`}
                  onClick={() =>
                    setBenefits((current) =>
                      current.filter((_, itemIndex) => itemIndex !== index),
                    )
                  }
                  type="button"
                  variant="secondary"
                >
                  <Trash2 aria-hidden="true" className="size-4" />
                  削除
                </Button>
              </div>
              <div className="grid gap-4 lg:grid-cols-[12rem_1fr_1fr]">
                <div className="grid content-start gap-2 text-sm font-semibold">
                  <label htmlFor={`benefit-${index}-icon`}>アイコン</label>
                  <select
                    className={fieldClassName}
                    defaultValue={benefit.icon}
                    id={`benefit-${index}-icon`}
                    name={`benefit-${index}-icon`}
                  >
                    {benefitIcons.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <FieldError name={`benefit-${index}-icon`} state={state} />
                </div>
                {(["ja", "en"] as const).map((locale) => (
                  <div className="grid gap-3" key={locale}>
                    <TextField
                      defaultValue={
                        locale === "ja" ? benefit.titleJa : benefit.titleEn
                      }
                      label={locale === "ja" ? "日本語見出し" : "English title"}
                      name={`benefit-${index}-title-${locale}`}
                      state={state}
                    />
                    <TextField
                      defaultValue={
                        locale === "ja"
                          ? benefit.descriptionJa
                          : benefit.descriptionEn
                      }
                      label={
                        locale === "ja" ? "日本語説明" : "English description"
                      }
                      name={`benefit-${index}-description-${locale}`}
                      state={state}
                      textarea
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="surface-card grid gap-5 p-5 sm:p-6">
          <div>
            <p className="section-eyebrow">Purchase action</p>
            <h2 className="mt-2 text-xl font-bold">購入ボタン文言</h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              公開先は環境変数で設定されたTebex URLです。
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            {(["ja", "en"] as const).map((locale) => {
              const actionValue =
                locale === "ja" ? ja.purchaseAction : en.purchaseAction;
              return (
                <div className="grid gap-3" key={locale}>
                  <TextField
                    defaultValue={actionValue?.label ?? ""}
                    label={locale === "ja" ? "日本語ラベル" : "English label"}
                    name={`purchaseLabel-${locale}`}
                    state={state}
                  />
                  <TextField
                    defaultValue={actionValue?.ariaLabel ?? ""}
                    label={
                      locale === "ja" ? "日本語の補足" : "English aria label"
                    }
                    name={`purchaseAriaLabel-${locale}`}
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
            {pending ? "保存中..." : "VIP内容を保存"}
          </Button>
        </div>
      </fieldset>
    </form>
  );
}
