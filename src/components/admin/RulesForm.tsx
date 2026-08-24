"use client";

import { ArrowDown, ArrowUp, Plus, Save, Trash2 } from "lucide-react";
import { useActionState, useState } from "react";

import {
  initialRulesActionState,
  type RulesActionState,
} from "@/app/admin/rules/action-state";
import { Button } from "@/components/ui/Button";
import type { Locale, RulesContent } from "@/content";
import { cn } from "@/lib/cn";
import { getMatchingItem } from "@/lib/content";

interface RulesFormProps {
  action: (
    state: RulesActionState,
    formData: FormData,
  ) => Promise<RulesActionState>;
  values: {
    version: number;
    translations: { ja: RulesContent; en: RulesContent };
  };
}

interface RuleListEditorValue {
  id: string;
  labelJa: string;
  labelEn: string;
  descriptionJa: string;
  descriptionEn: string;
}

interface RuleBlockEditorValue {
  id: string;
  titleJa: string;
  titleEn: string;
  penaltyJa: string;
  penaltyEn: string;
  paragraphsJa: string;
  paragraphsEn: string;
  items: RuleListEditorValue[];
}

const fieldClassName =
  "min-h-11 w-full rounded-lg border border-[var(--border-strong)] bg-[var(--background)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--focus)_35%,transparent)] disabled:cursor-wait disabled:opacity-60";

const sectionFields = [
  ["eyebrow", "セクションラベル", "Section label", false],
  ["title", "見出し", "Title", false],
  ["description", "概要", "Description", true],
  ["noticeTitle", "注意見出し", "Notice title", false],
  ["notice", "注意文", "Notice", true],
] as const;

const rulebookFields = [
  ["title", "ルール全文の見出し", "Rulebook title", false],
  ["openLabel", "開くボタン", "Open button label", false],
  ["closeLabel", "閉じるボタン", "Close button label", false],
  ["supplementaryNote", "末尾の補足", "Closing note", true],
  ["lastUpdatedLabel", "更新日ラベル", "Updated date label", false],
  ["lastUpdated", "更新日", "Updated date", false],
] as const;

const summaryItemIds = [
  "raid-window",
  "team-size",
  "fair-play",
  "community-conduct",
  "reporting",
  "rule-updates",
] as const;

function FieldError({
  name,
  state,
}: {
  name: string;
  state: RulesActionState;
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
  state: RulesActionState;
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

function LocalizedSectionPanel({
  content,
  locale,
  state,
}: {
  content: RulesContent;
  locale: Locale;
  state: RulesActionState;
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
      {sectionFields.map(([field, jaLabel, enLabel, textarea]) => (
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

function LocalizedRulebookPanel({
  content,
  locale,
  state,
}: {
  content: RulesContent;
  locale: Locale;
  state: RulesActionState;
}) {
  const japanese = locale === "ja";
  return (
    <section className="surface-card grid content-start gap-5 p-5 sm:p-6">
      <div>
        <p className="section-eyebrow">
          {japanese ? "Rulebook Japanese" : "Rulebook English"}
        </p>
        <h2 className="mt-2 text-xl font-bold">
          {japanese ? "ルール全文・日本語" : "Rulebook · English"}
        </h2>
      </div>
      {rulebookFields.map(([field, jaLabel, enLabel, textarea]) => (
        <TextField
          defaultValue={content.rulebook[field]}
          key={field}
          label={japanese ? jaLabel : enLabel}
          name={`rulebook-${field}-${locale}`}
          state={state}
          textarea={textarea}
        />
      ))}
    </section>
  );
}

function createBlockValues(ja: RulesContent, en: RulesContent) {
  return ja.rulebook.blocks.map((block) => {
    const englishBlock = getMatchingItem(en.rulebook.blocks, block.id);
    return {
      id: block.id,
      titleJa: block.title,
      titleEn: englishBlock.title,
      penaltyJa: block.penalty ?? "",
      penaltyEn: englishBlock.penalty ?? "",
      paragraphsJa: block.paragraphs.join("\n\n"),
      paragraphsEn: englishBlock.paragraphs.join("\n\n"),
      items: (block.items ?? []).map((item) => {
        const englishItem = getMatchingItem(englishBlock.items ?? [], item.id);
        return {
          id: item.id,
          labelJa: "label" in item ? (item.label ?? "") : "",
          labelEn: "label" in englishItem ? (englishItem.label ?? "") : "",
          descriptionJa: item.description,
          descriptionEn: englishItem.description,
        };
      }),
    } satisfies RuleBlockEditorValue;
  });
}

function moveItem<T>(items: readonly T[], from: number, to: number) {
  if (to < 0 || to >= items.length) return [...items];
  const next = [...items];
  const [item] = next.splice(from, 1);
  if (item !== undefined) next.splice(to, 0, item);
  return next;
}

export function RulesForm({ action, values }: RulesFormProps) {
  const [state, formAction, pending] = useActionState(
    action,
    initialRulesActionState,
  );
  const [blocks, setBlocks] = useState(() =>
    createBlockValues(values.translations.ja, values.translations.en),
  );
  const ja = values.translations.ja;
  const en = values.translations.en;

  function addBlock() {
    if (blocks.length >= 12) return;
    setBlocks((current) => [
      ...current,
      {
        id: `rule-${crypto.randomUUID()}`,
        titleJa: "",
        titleEn: "",
        penaltyJa: "",
        penaltyEn: "",
        paragraphsJa: "",
        paragraphsEn: "",
        items: [],
      },
    ]);
  }

  function addListItem(blockIndex: number) {
    setBlocks((current) =>
      current.map((block, index) =>
        index === blockIndex && block.items.length < 12
          ? {
              ...block,
              items: [
                ...block.items,
                {
                  id: `item-${crypto.randomUUID()}`,
                  labelJa: "",
                  labelEn: "",
                  descriptionJa: "",
                  descriptionEn: "",
                },
              ],
            }
          : block,
      ),
    );
  }

  return (
    <form action={formAction} className="grid gap-6">
      <input name="version" type="hidden" value={values.version} />
      <input name="blockCount" type="hidden" value={blocks.length} />

      {state.message ? (
        <p
          className="rounded-lg border border-[color-mix(in_srgb,var(--danger)_55%,var(--border))] bg-[color-mix(in_srgb,var(--danger)_9%,var(--surface))] px-4 py-3 text-sm font-semibold text-[var(--danger)]"
          role="alert"
        >
          {state.message}
        </p>
      ) : null}

      <fieldset className="grid gap-6" disabled={pending}>
        <legend className="sr-only">サーバールールコンテンツ</legend>

        <div className="grid gap-5 lg:grid-cols-2">
          <LocalizedSectionPanel content={ja} locale="ja" state={state} />
          <LocalizedSectionPanel content={en} locale="en" state={state} />
        </div>

        <section className="surface-card grid gap-5 p-5 sm:p-6">
          <div>
            <p className="section-eyebrow">Rule summary</p>
            <h2 className="mt-2 text-xl font-bold">重要ルールのカード</h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              公開ページで最初に表示する6件の要約です。内部IDとアイコンは固定されています。
            </p>
          </div>
          {summaryItemIds.map((id) => {
            const japaneseItem = getMatchingItem(ja.items, id);
            const englishItem = getMatchingItem(en.items, id);
            return (
              <div
                className="grid gap-4 border-t border-[var(--border)] pt-5 lg:grid-cols-[11rem_1fr_1fr]"
                key={id}
              >
                <div className="grid content-start gap-3 text-sm font-semibold">
                  <label htmlFor={`item-${id}-status`}>確認状態</label>
                  <select
                    className={fieldClassName}
                    defaultValue={japaneseItem.status}
                    id={`item-${id}-status`}
                    name={`item-${id}-status`}
                  >
                    <option value="confirmed">確認済み</option>
                    <option value="pending">準備中</option>
                  </select>
                  <FieldError name={`item-${id}-status`} state={state} />
                  <label className="flex min-h-11 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-secondary)] px-3">
                    <input
                      className="size-4 accent-[var(--accent)]"
                      defaultChecked={
                        "important" in japaneseItem && japaneseItem.important
                      }
                      name={`item-${id}-important`}
                      type="checkbox"
                    />
                    重要表示
                  </label>
                </div>
                {(
                  [
                    ["ja", japaneseItem],
                    ["en", englishItem],
                  ] as const
                ).map(([locale, item]) => (
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
                ))}
              </div>
            );
          })}
        </section>

        <div className="grid gap-5 lg:grid-cols-2">
          <LocalizedRulebookPanel content={ja} locale="ja" state={state} />
          <LocalizedRulebookPanel content={en} locale="en" state={state} />
        </div>

        <section className="surface-card grid gap-5 p-5 sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="section-eyebrow">Rulebook entries</p>
              <h2 className="mt-2 text-xl font-bold">ルール全文の項目</h2>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                最大12項目。本文の段落は空行で区切り、日本語と英語の段落数を揃えてください。
              </p>
            </div>
            <Button
              disabled={blocks.length >= 12}
              onClick={addBlock}
              type="button"
              variant="secondary"
            >
              <Plus aria-hidden="true" className="size-4" />
              ルール項目を追加
            </Button>
          </div>
          <FieldError name="blockCount" state={state} />

          {blocks.map((block, blockIndex) => (
            <article
              className="grid gap-5 rounded-lg border border-[var(--border)] bg-[var(--surface-secondary)] p-4 sm:p-5"
              key={block.id}
            >
              <input
                name={`block-${blockIndex}-id`}
                type="hidden"
                value={block.id}
              />
              <input
                name={`block-${blockIndex}-itemCount`}
                type="hidden"
                value={block.items.length}
              />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-bold">ルール項目 {blockIndex + 1}</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    aria-label={`ルール項目${blockIndex + 1}を上へ移動`}
                    disabled={blockIndex === 0}
                    onClick={() =>
                      setBlocks((current) =>
                        moveItem(current, blockIndex, blockIndex - 1),
                      )
                    }
                    type="button"
                    variant="secondary"
                  >
                    <ArrowUp aria-hidden="true" className="size-4" />
                  </Button>
                  <Button
                    aria-label={`ルール項目${blockIndex + 1}を下へ移動`}
                    disabled={blockIndex === blocks.length - 1}
                    onClick={() =>
                      setBlocks((current) =>
                        moveItem(current, blockIndex, blockIndex + 1),
                      )
                    }
                    type="button"
                    variant="secondary"
                  >
                    <ArrowDown aria-hidden="true" className="size-4" />
                  </Button>
                  <Button
                    aria-label={`ルール項目${blockIndex + 1}を削除`}
                    disabled={blocks.length <= 1}
                    onClick={() =>
                      setBlocks((current) =>
                        current.filter((_, index) => index !== blockIndex),
                      )
                    }
                    type="button"
                    variant="secondary"
                  >
                    <Trash2 aria-hidden="true" className="size-4" />
                    削除
                  </Button>
                </div>
              </div>
              <FieldError name={`block-${blockIndex}-id`} state={state} />

              <div className="grid gap-5 lg:grid-cols-2">
                {(["ja", "en"] as const).map((locale) => (
                  <div className="grid gap-3" key={locale}>
                    <TextField
                      defaultValue={
                        locale === "ja" ? block.titleJa : block.titleEn
                      }
                      label={locale === "ja" ? "日本語見出し" : "English title"}
                      name={`block-${blockIndex}-title-${locale}`}
                      state={state}
                    />
                    <TextField
                      defaultValue={
                        locale === "ja" ? block.penaltyJa : block.penaltyEn
                      }
                      label={
                        locale === "ja"
                          ? "日本語の処分ラベル（任意）"
                          : "Penalty label (optional)"
                      }
                      name={`block-${blockIndex}-penalty-${locale}`}
                      state={state}
                    />
                    <TextField
                      defaultValue={
                        locale === "ja"
                          ? block.paragraphsJa
                          : block.paragraphsEn
                      }
                      label={locale === "ja" ? "日本語本文" : "English text"}
                      name={`block-${blockIndex}-paragraphs-${locale}`}
                      state={state}
                      textarea
                    />
                  </div>
                ))}
              </div>

              <div className="grid gap-4 border-t border-[var(--border)] pt-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h4 className="font-bold">箇条書き</h4>
                  <Button
                    disabled={block.items.length >= 12}
                    onClick={() => addListItem(blockIndex)}
                    type="button"
                    variant="secondary"
                  >
                    <Plus aria-hidden="true" className="size-4" />
                    箇条書きを追加
                  </Button>
                </div>
                <FieldError
                  name={`block-${blockIndex}-itemCount`}
                  state={state}
                />
                {block.items.map((item, itemIndex) => (
                  <div
                    className="grid gap-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4"
                    key={item.id}
                  >
                    <input
                      name={`block-${blockIndex}-item-${itemIndex}-id`}
                      type="hidden"
                      value={item.id}
                    />
                    <div className="flex items-center justify-between gap-3">
                      <h5 className="text-sm font-bold">
                        箇条書き {itemIndex + 1}
                      </h5>
                      <Button
                        aria-label={`ルール項目${blockIndex + 1}の箇条書き${itemIndex + 1}を削除`}
                        onClick={() =>
                          setBlocks((current) =>
                            current.map((currentBlock, index) =>
                              index === blockIndex
                                ? {
                                    ...currentBlock,
                                    items: currentBlock.items.filter(
                                      (_, indexToRemove) =>
                                        indexToRemove !== itemIndex,
                                    ),
                                  }
                                : currentBlock,
                            ),
                          )
                        }
                        type="button"
                        variant="secondary"
                      >
                        <Trash2 aria-hidden="true" className="size-4" />
                        削除
                      </Button>
                    </div>
                    <FieldError
                      name={`block-${blockIndex}-item-${itemIndex}-id`}
                      state={state}
                    />
                    <div className="grid gap-5 lg:grid-cols-2">
                      {(["ja", "en"] as const).map((locale) => (
                        <div className="grid gap-3" key={locale}>
                          <TextField
                            defaultValue={
                              locale === "ja" ? item.labelJa : item.labelEn
                            }
                            label={
                              locale === "ja"
                                ? "日本語ラベル（任意）"
                                : "English label (optional)"
                            }
                            name={`block-${blockIndex}-item-${itemIndex}-label-${locale}`}
                            state={state}
                          />
                          <TextField
                            defaultValue={
                              locale === "ja"
                                ? item.descriptionJa
                                : item.descriptionEn
                            }
                            label={
                              locale === "ja"
                                ? "日本語説明"
                                : "English description"
                            }
                            name={`block-${blockIndex}-item-${itemIndex}-description-${locale}`}
                            state={state}
                            textarea
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>

        <div className="flex justify-end border-t border-[var(--border)] pt-6">
          <Button disabled={pending} type="submit">
            <Save aria-hidden="true" className="size-4" />
            {pending ? "保存中..." : "サーバールールを保存"}
          </Button>
        </div>
      </fieldset>
    </form>
  );
}
