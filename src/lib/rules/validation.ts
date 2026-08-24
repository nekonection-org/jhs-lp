import type {
  ContentIcon,
  ContentStatus,
  Locale,
  RulebookBlockContent,
  RulebookListItemContent,
  RulesContent,
} from "@/content";

export type RulesFieldErrors = Readonly<Record<string, string>>;

export type RulesValidationResult =
  | {
      success: true;
      data: { ja: RulesContent; en: RulesContent };
    }
  | { success: false; errors: RulesFieldErrors };

const ruleItems = [
  ["raid-window", "clock"],
  ["team-size", "users"],
  ["fair-play", "shield"],
  ["community-conduct", "message"],
  ["reporting", "report"],
  ["rule-updates", "refresh"],
] as const satisfies readonly (readonly [string, ContentIcon])[];

const localizedSectionFields = [
  ["eyebrow", "セクションラベル", 80],
  ["title", "見出し", 160],
  ["description", "概要", 600],
  ["noticeTitle", "注意見出し", 160],
  ["notice", "注意文", 1200],
] as const;

const localizedRulebookFields = [
  ["title", "ルール全文の見出し", 160],
  ["openLabel", "開くボタン", 100],
  ["closeLabel", "閉じるボタン", 100],
  ["supplementaryNote", "補足", 1200],
  ["lastUpdatedLabel", "更新日ラベル", 80],
  ["lastUpdated", "更新日", 80],
] as const;

function getText(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function requireText(
  formData: FormData,
  name: string,
  label: string,
  maximumLength: number,
  errors: Record<string, string>,
) {
  const value = getText(formData, name);
  if (!value) {
    errors[name] = `${label}を入力してください。`;
  } else if (value.length > maximumLength) {
    errors[name] = `${label}は${maximumLength}文字以内で入力してください。`;
  }
  return value;
}

function optionalText(
  formData: FormData,
  name: string,
  label: string,
  maximumLength: number,
  errors: Record<string, string>,
) {
  const value = getText(formData, name);
  if (value.length > maximumLength) {
    errors[name] = `${label}は${maximumLength}文字以内で入力してください。`;
  }
  return value;
}

function getCount(
  formData: FormData,
  name: string,
  label: string,
  minimum: number,
  maximum: number,
  errors: Record<string, string>,
) {
  const value = getText(formData, name);
  const count = Number(value);
  if (
    !/^\d+$/.test(value) ||
    !Number.isSafeInteger(count) ||
    count < minimum ||
    count > maximum
  ) {
    errors[name] =
      `${label}は${minimum}件以上${maximum}件以下で登録してください。`;
    return minimum;
  }
  return count;
}

function getContentStatus(
  formData: FormData,
  name: string,
  errors: Record<string, string>,
) {
  const value = getText(formData, name);
  if (value !== "confirmed" && value !== "pending") {
    errors[name] = "確認状態を選択してください。";
    return "pending";
  }
  return value satisfies ContentStatus;
}

function validateId(
  id: string,
  name: string,
  label: string,
  errors: Record<string, string>,
) {
  if (!/^[a-z0-9][a-z0-9-]{0,63}$/.test(id)) {
    errors[name] = `${label}の内部IDが不正です。追加し直してください。`;
  }
}

function getParagraphs(
  formData: FormData,
  name: string,
  label: string,
  errors: Record<string, string>,
) {
  const value = requireText(formData, name, label, 8000, errors);
  const paragraphs = value
    .split(/\r?\n\s*\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (paragraphs.length > 8) {
    errors[name] = `${label}は8段落以内で入力してください。`;
  } else if (paragraphs.some((paragraph) => paragraph.length > 2000)) {
    errors[name] = `${label}は1段落2000文字以内で入力してください。`;
  }
  return paragraphs;
}

function getLocalizedValues<
  Fields extends readonly (readonly [string, string, number])[],
>(
  formData: FormData,
  locale: Locale,
  prefix: string,
  fields: Fields,
  errors: Record<string, string>,
) {
  const localeLabel = locale === "ja" ? "日本語" : "英語";
  return Object.fromEntries(
    fields.map(([field, label, maximumLength]) => [
      field,
      requireText(
        formData,
        `${prefix}${field}-${locale}`,
        `${localeLabel}の${label}`,
        maximumLength,
        errors,
      ),
    ]),
  ) as Record<Fields[number][0], string>;
}

function getBlocks(formData: FormData, errors: Record<string, string>) {
  const blockCount = getCount(
    formData,
    "blockCount",
    "ルール項目",
    1,
    12,
    errors,
  );
  const japanese: RulebookBlockContent[] = [];
  const english: RulebookBlockContent[] = [];
  const blockIds = new Set<string>();

  for (let blockIndex = 0; blockIndex < blockCount; blockIndex += 1) {
    const prefix = `block-${blockIndex}`;
    const idName = `${prefix}-id`;
    const id = getText(formData, idName);
    validateId(id, idName, `ルール項目${blockIndex + 1}`, errors);
    if (blockIds.has(id)) {
      errors[idName] = "ルール項目の内部IDが重複しています。";
    }
    blockIds.add(id);

    const titleJa = requireText(
      formData,
      `${prefix}-title-ja`,
      `ルール項目${blockIndex + 1}の日本語見出し`,
      200,
      errors,
    );
    const titleEn = requireText(
      formData,
      `${prefix}-title-en`,
      `ルール項目${blockIndex + 1}の英語見出し`,
      200,
      errors,
    );
    const penaltyJa = optionalText(
      formData,
      `${prefix}-penalty-ja`,
      `ルール項目${blockIndex + 1}の日本語処分ラベル`,
      100,
      errors,
    );
    const penaltyEn = optionalText(
      formData,
      `${prefix}-penalty-en`,
      `ルール項目${blockIndex + 1}の英語処分ラベル`,
      100,
      errors,
    );
    if (Boolean(penaltyJa) !== Boolean(penaltyEn)) {
      errors[`${prefix}-penalty-ja`] =
        "処分ラベルは日本語と英語を両方入力するか、両方空欄にしてください。";
    }

    const paragraphsJa = getParagraphs(
      formData,
      `${prefix}-paragraphs-ja`,
      `ルール項目${blockIndex + 1}の日本語本文`,
      errors,
    );
    const paragraphsEn = getParagraphs(
      formData,
      `${prefix}-paragraphs-en`,
      `ルール項目${blockIndex + 1}の英語本文`,
      errors,
    );
    if (paragraphsJa.length !== paragraphsEn.length) {
      errors[`${prefix}-paragraphs-en`] =
        "日本語と英語の段落数を揃えてください。段落は空行で区切ります。";
    }

    const itemCount = getCount(
      formData,
      `${prefix}-itemCount`,
      `ルール項目${blockIndex + 1}の箇条書き`,
      0,
      12,
      errors,
    );
    const itemsJa: RulebookListItemContent[] = [];
    const itemsEn: RulebookListItemContent[] = [];
    const itemIds = new Set<string>();

    for (let itemIndex = 0; itemIndex < itemCount; itemIndex += 1) {
      const itemPrefix = `${prefix}-item-${itemIndex}`;
      const itemIdName = `${itemPrefix}-id`;
      const itemId = getText(formData, itemIdName);
      validateId(
        itemId,
        itemIdName,
        `ルール項目${blockIndex + 1}の箇条書き${itemIndex + 1}`,
        errors,
      );
      if (itemIds.has(itemId)) {
        errors[itemIdName] = "同じルール項目内で内部IDが重複しています。";
      }
      itemIds.add(itemId);

      const labelJa = optionalText(
        formData,
        `${itemPrefix}-label-ja`,
        `箇条書き${itemIndex + 1}の日本語ラベル`,
        160,
        errors,
      );
      const labelEn = optionalText(
        formData,
        `${itemPrefix}-label-en`,
        `箇条書き${itemIndex + 1}の英語ラベル`,
        160,
        errors,
      );
      if (Boolean(labelJa) !== Boolean(labelEn)) {
        errors[`${itemPrefix}-label-ja`] =
          "ラベルは日本語と英語を両方入力するか、両方空欄にしてください。";
      }
      const descriptionJa = requireText(
        formData,
        `${itemPrefix}-description-ja`,
        `箇条書き${itemIndex + 1}の日本語説明`,
        2000,
        errors,
      );
      const descriptionEn = requireText(
        formData,
        `${itemPrefix}-description-en`,
        `箇条書き${itemIndex + 1}の英語説明`,
        2000,
        errors,
      );

      itemsJa.push({
        id: itemId,
        ...(labelJa ? { label: labelJa } : {}),
        description: descriptionJa,
      });
      itemsEn.push({
        id: itemId,
        ...(labelEn ? { label: labelEn } : {}),
        description: descriptionEn,
      });
    }

    const shared = { id };
    japanese.push({
      ...shared,
      title: titleJa,
      ...(penaltyJa ? { penalty: penaltyJa } : {}),
      paragraphs: paragraphsJa,
      ...(itemsJa.length > 0 ? { items: itemsJa } : {}),
    });
    english.push({
      ...shared,
      title: titleEn,
      ...(penaltyEn ? { penalty: penaltyEn } : {}),
      paragraphs: paragraphsEn,
      ...(itemsEn.length > 0 ? { items: itemsEn } : {}),
    });
  }

  return { ja: japanese, en: english };
}

function createContent(
  formData: FormData,
  locale: Locale,
  statuses: Readonly<Record<(typeof ruleItems)[number][0], ContentStatus>>,
  blocks: readonly RulebookBlockContent[],
  errors: Record<string, string>,
): RulesContent {
  const values = getLocalizedValues(
    formData,
    locale,
    "",
    localizedSectionFields,
    errors,
  );
  const rulebook = getLocalizedValues(
    formData,
    locale,
    "rulebook-",
    localizedRulebookFields,
    errors,
  );
  const localeLabel = locale === "ja" ? "日本語" : "英語";

  function createRuleItem<
    Id extends (typeof ruleItems)[number][0],
    Icon extends ContentIcon,
  >(id: Id, icon: Icon) {
    return {
      id,
      title: requireText(
        formData,
        `item-${id}-title-${locale}`,
        `${localeLabel}の${id}見出し`,
        160,
        errors,
      ),
      description: requireText(
        formData,
        `item-${id}-description-${locale}`,
        `${localeLabel}の${id}説明`,
        1200,
        errors,
      ),
      icon,
      status: statuses[id],
      ...(formData.get(`item-${id}-important`) === "on"
        ? { important: true }
        : {}),
    };
  }

  return {
    id: "rules",
    eyebrow: values.eyebrow,
    title: values.title,
    description: values.description,
    noticeTitle: values.noticeTitle,
    notice: values.notice,
    items: [
      createRuleItem("raid-window", "clock"),
      createRuleItem("team-size", "users"),
      createRuleItem("fair-play", "shield"),
      createRuleItem("community-conduct", "message"),
      createRuleItem("reporting", "report"),
      createRuleItem("rule-updates", "refresh"),
    ],
    rulebook: {
      title: rulebook.title,
      openLabel: rulebook.openLabel,
      closeLabel: rulebook.closeLabel,
      blocks,
      supplementaryNote: rulebook.supplementaryNote,
      lastUpdatedLabel: rulebook.lastUpdatedLabel,
      lastUpdated: rulebook.lastUpdated,
    },
  };
}

export function validateRulesForm(formData: FormData): RulesValidationResult {
  const errors: Record<string, string> = {};
  const statuses = Object.fromEntries(
    ruleItems.map(([id]) => [
      id,
      getContentStatus(formData, `item-${id}-status`, errors),
    ]),
  ) as Record<(typeof ruleItems)[number][0], ContentStatus>;
  const blocks = getBlocks(formData, errors);
  const ja = createContent(formData, "ja", statuses, blocks.ja, errors);
  const en = createContent(formData, "en", statuses, blocks.en, errors);

  return Object.keys(errors).length > 0
    ? { success: false, errors }
    : { success: true, data: { ja, en } };
}
