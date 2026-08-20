import type {
  ContentIcon,
  ContentStatus,
  Locale,
  VipBenefit,
  VipContent,
} from "@/content";

export type VipFieldErrors = Readonly<Record<string, string>>;

export type VipValidationResult =
  | {
      success: true;
      data: { ja: VipContent; en: VipContent };
    }
  | { success: false; errors: VipFieldErrors };

const detailIds = [
  "price",
  "duration",
  "purchase-method",
  "refund-policy",
] as const;

const allowedBenefitIcons = [
  "badge",
  "calendar",
  "clock",
  "community",
  "credit-card",
  "settings",
  "shield",
  "users",
] as const satisfies readonly ContentIcon[];

const localizedFields = [
  ["eyebrow", "セクションラベル", 80],
  ["title", "見出し", 160],
  ["description", "概要", 600],
  ["statusTitle", "状態の見出し", 160],
  ["statusDescription", "状態の説明", 600],
  ["benefitsTitle", "特典見出し", 160],
  ["emptyBenefitsTitle", "特典未登録時の見出し", 160],
  ["emptyBenefitsDescription", "特典未登録時の説明", 600],
  ["purchaseUnavailableMessage", "購入不可時の説明", 600],
  ["notice", "注意事項", 1200],
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

function getLocalizedValues(
  formData: FormData,
  locale: Locale,
  errors: Record<string, string>,
) {
  return Object.fromEntries(
    localizedFields.map(([field, label, maximumLength]) => [
      field,
      requireText(
        formData,
        `${field}-${locale}`,
        `${locale === "ja" ? "日本語" : "英語"}の${label}`,
        maximumLength,
        errors,
      ),
    ]),
  ) as Record<(typeof localizedFields)[number][0], string>;
}

function getBenefits(formData: FormData, errors: Record<string, string>) {
  const countValue = getText(formData, "benefitCount");
  const count = Number(countValue);
  if (
    !/^\d+$/.test(countValue) ||
    !Number.isSafeInteger(count) ||
    count < 0 ||
    count > 8
  ) {
    errors.benefitCount = "特典は8件まで登録できます。";
    return { ja: [] as VipBenefit[], en: [] as VipBenefit[] };
  }

  const japanese: VipBenefit[] = [];
  const english: VipBenefit[] = [];

  for (let index = 0; index < count; index += 1) {
    const prefix = `benefit-${index}`;
    const id = getText(formData, `${prefix}-id`);
    const icon = getText(formData, `${prefix}-icon`);
    const titleJa = requireText(
      formData,
      `${prefix}-title-ja`,
      `特典${index + 1}の日本語見出し`,
      160,
      errors,
    );
    const descriptionJa = requireText(
      formData,
      `${prefix}-description-ja`,
      `特典${index + 1}の日本語説明`,
      600,
      errors,
    );
    const titleEn = requireText(
      formData,
      `${prefix}-title-en`,
      `特典${index + 1}の英語見出し`,
      160,
      errors,
    );
    const descriptionEn = requireText(
      formData,
      `${prefix}-description-en`,
      `特典${index + 1}の英語説明`,
      600,
      errors,
    );

    if (!/^[a-z0-9][a-z0-9-]{0,63}$/.test(id)) {
      errors[`${prefix}-id`] =
        "特典IDが不正です。削除して追加し直してください。";
    }
    if (
      icon &&
      !allowedBenefitIcons.some((allowedIcon) => allowedIcon === icon)
    ) {
      errors[`${prefix}-icon`] = "アイコンを選択してください。";
    }

    const benefitBase = {
      id,
      ...(icon ? { icon: icon as ContentIcon } : {}),
    };
    japanese.push({
      ...benefitBase,
      title: titleJa,
      description: descriptionJa,
    });
    english.push({
      ...benefitBase,
      title: titleEn,
      description: descriptionEn,
    });
  }

  return { ja: japanese, en: english };
}

function createContent(
  formData: FormData,
  locale: Locale,
  status: ContentStatus,
  detailsStatus: Readonly<Record<(typeof detailIds)[number], ContentStatus>>,
  benefits: readonly VipBenefit[],
  purchaseEnabled: boolean,
  errors: Record<string, string>,
): VipContent {
  const values = getLocalizedValues(formData, locale, errors);
  const localizedLabel = locale === "ja" ? "日本語" : "英語";

  function createDetail<Id extends (typeof detailIds)[number]>(id: Id) {
    return {
      id,
      label: requireText(
        formData,
        `detail-${id}-label-${locale}`,
        `${localizedLabel}の${id}ラベル`,
        100,
        errors,
      ),
      value: requireText(
        formData,
        `detail-${id}-value-${locale}`,
        `${localizedLabel}の${id}内容`,
        600,
        errors,
      ),
      status: detailsStatus[id],
    };
  }

  const purchaseAction = purchaseEnabled
    ? {
        id: "purchase-vip",
        label: requireText(
          formData,
          `purchaseLabel-${locale}`,
          `${localizedLabel}の購入ボタン`,
          100,
          errors,
        ),
        ariaLabel: requireText(
          formData,
          `purchaseAriaLabel-${locale}`,
          `${localizedLabel}の購入ボタン補足`,
          160,
          errors,
        ),
        destination: "tebex" as const,
      }
    : null;

  return {
    id: "vip",
    eyebrow: values.eyebrow,
    title: values.title,
    description: values.description,
    status,
    statusTitle: values.statusTitle,
    statusDescription: values.statusDescription,
    details: [
      createDetail("price"),
      createDetail("duration"),
      createDetail("purchase-method"),
      createDetail("refund-policy"),
    ],
    benefitsTitle: values.benefitsTitle,
    benefits,
    emptyBenefitsTitle: values.emptyBenefitsTitle,
    emptyBenefitsDescription: values.emptyBenefitsDescription,
    purchaseAction,
    purchaseUnavailableMessage: values.purchaseUnavailableMessage,
    notice: values.notice,
  };
}

export function validateVipForm(formData: FormData): VipValidationResult {
  const errors: Record<string, string> = {};
  const status = getContentStatus(formData, "status", errors);
  const detailsStatus = Object.fromEntries(
    detailIds.map((id) => [
      id,
      getContentStatus(formData, `detail-${id}-status`, errors),
    ]),
  ) as Record<(typeof detailIds)[number], ContentStatus>;
  const benefits = getBenefits(formData, errors);
  const purchaseEnabled = formData.get("purchaseEnabled") === "on";
  const ja = createContent(
    formData,
    "ja",
    status,
    detailsStatus,
    benefits.ja,
    purchaseEnabled,
    errors,
  );
  const en = createContent(
    formData,
    "en",
    status,
    detailsStatus,
    benefits.en,
    purchaseEnabled,
    errors,
  );

  return Object.keys(errors).length > 0
    ? { success: false, errors }
    : { success: true, data: { ja, en } };
}
