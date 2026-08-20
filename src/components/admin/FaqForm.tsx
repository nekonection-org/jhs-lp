"use client";

import { Save } from "lucide-react";
import { useActionState } from "react";

import {
  initialFaqActionState,
  type FaqActionState,
} from "@/app/admin/faqs/action-state";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { FaqFieldName } from "@/lib/faqs/validation";

export interface FaqFormValues {
  status: string;
  contentStatus: string;
  sortOrder: string;
  questionJa: string;
  answerJa: string;
  questionEn: string;
  answerEn: string;
  version?: number;
}

interface FaqFormProps {
  action: (
    state: FaqActionState,
    formData: FormData,
  ) => Promise<FaqActionState>;
  submitLabel: string;
  values: FaqFormValues;
}

const fieldClassName =
  "min-h-11 w-full rounded-lg border border-[var(--border-strong)] bg-[var(--background)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--focus)_35%,transparent)] disabled:cursor-wait disabled:opacity-60";

function FieldError({
  field,
  state,
}: {
  field: FaqFieldName;
  state: FaqActionState;
}) {
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
  field: FaqFieldName,
  state: FaqActionState,
  descriptionId?: string,
) {
  return (
    [descriptionId, state.fieldErrors[field] ? `${field}-error` : null]
      .filter(Boolean)
      .join(" ") || undefined
  );
}

interface TranslationFieldsProps {
  locale: "ja" | "en";
  question: string;
  answer: string;
  state: FaqActionState;
}

function TranslationFields({
  locale,
  question,
  answer,
  state,
}: TranslationFieldsProps) {
  const japanese = locale === "ja";
  const questionField = japanese ? "questionJa" : "questionEn";
  const answerField = japanese ? "answerJa" : "answerEn";

  return (
    <section className="surface-card grid content-start gap-5 p-5 sm:p-6">
      <div className="lg:min-h-[5.25rem]">
        <p className="section-eyebrow">{japanese ? "Japanese" : "English"}</p>
        <h2 className="mt-2 text-xl font-bold tracking-[-0.025em]">
          {japanese ? "日本語" : "英語"}
        </h2>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          {japanese
            ? "下書き・公開のどちらでも必須です。"
            : "下書きでは省略できますが、公開時は必須です。"}
        </p>
      </div>

      <div className="grid gap-2 text-sm font-semibold">
        <label htmlFor={`faq-question-${locale}`}>
          {japanese ? "質問" : "Question"}
        </label>
        <input
          aria-describedby={fieldDescriptionId(questionField, state)}
          aria-invalid={Boolean(state.fieldErrors[questionField])}
          className={fieldClassName}
          defaultValue={question}
          id={`faq-question-${locale}`}
          maxLength={240}
          name={questionField}
        />
        <FieldError field={questionField} state={state} />
      </div>

      <div className="grid gap-2 text-sm font-semibold">
        <label htmlFor={`faq-answer-${locale}`}>
          {japanese ? "回答" : "Answer"}
        </label>
        <textarea
          aria-describedby={fieldDescriptionId(answerField, state)}
          aria-invalid={Boolean(state.fieldErrors[answerField])}
          className={cn(fieldClassName, "min-h-44 resize-y")}
          defaultValue={answer}
          id={`faq-answer-${locale}`}
          maxLength={4000}
          name={answerField}
        />
        <FieldError field={answerField} state={state} />
      </div>
    </section>
  );
}

export function FaqForm({ action, submitLabel, values }: FaqFormProps) {
  const [state, formAction, pending] = useActionState(
    action,
    initialFaqActionState,
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
        <legend className="sr-only">FAQ内容</legend>

        <div className="surface-card grid gap-5 p-5 sm:p-6">
          <div>
            <p className="section-eyebrow">Publication</p>
            <h2 className="mt-2 text-xl font-bold tracking-[-0.025em]">
              公開設定
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div className="grid content-start gap-2 text-sm font-semibold">
              <label
                className="sm:flex sm:min-h-10 sm:items-end"
                htmlFor="faq-status"
              >
                公開状態
              </label>
              <select
                aria-describedby={fieldDescriptionId("status", state)}
                aria-invalid={Boolean(state.fieldErrors.status)}
                className={fieldClassName}
                defaultValue={values.status}
                id="faq-status"
                name="status"
              >
                <option value="draft">下書き</option>
                <option value="published">公開</option>
              </select>
              <span aria-hidden="true" className="hidden min-h-5 sm:block" />
              <FieldError field="status" state={state} />
            </div>

            <div className="grid content-start gap-2 text-sm font-semibold">
              <label
                className="sm:flex sm:min-h-10 sm:items-end"
                htmlFor="faq-content-status"
              >
                内容の確認状態
              </label>
              <select
                aria-describedby={fieldDescriptionId("contentStatus", state)}
                aria-invalid={Boolean(state.fieldErrors.contentStatus)}
                className={fieldClassName}
                defaultValue={values.contentStatus}
                id="faq-content-status"
                name="contentStatus"
              >
                <option value="confirmed">確認済み</option>
                <option value="pending">準備中</option>
              </select>
              <span aria-hidden="true" className="hidden min-h-5 sm:block" />
              <FieldError field="contentStatus" state={state} />
            </div>

            <div className="grid content-start gap-2 text-sm font-semibold">
              <label
                className="sm:flex sm:min-h-10 sm:items-end"
                htmlFor="faq-sort-order"
              >
                表示順
              </label>
              <input
                aria-describedby={fieldDescriptionId(
                  "sortOrder",
                  state,
                  "sort-order-description",
                )}
                aria-invalid={Boolean(state.fieldErrors.sortOrder)}
                className={fieldClassName}
                defaultValue={values.sortOrder}
                id="faq-sort-order"
                max={9999}
                min={0}
                name="sortOrder"
                step={1}
                type="number"
              />
              <span
                className="text-xs leading-5 font-normal text-[var(--text-muted)]"
                id="sort-order-description"
              >
                数字が小さいFAQから上に表示します。
              </span>
              <FieldError field="sortOrder" state={state} />
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <TranslationFields
            answer={values.answerJa}
            locale="ja"
            question={values.questionJa}
            state={state}
          />
          <TranslationFields
            answer={values.answerEn}
            locale="en"
            question={values.questionEn}
            state={state}
          />
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
