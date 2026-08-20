import type { ContentStatus, Locale, ModeratorContent } from "@/content";

export type ModeratorFieldErrors = Readonly<Record<string, string>>;

export type ModeratorValidationResult =
  | {
      success: true;
      data: { ja: ModeratorContent; en: ModeratorContent };
    }
  | { success: false; errors: ModeratorFieldErrors };

const itemIds = [
  "responsibilities",
  "requirements",
  "ideal-candidate",
] as const;

const localizedFields = [
  ["eyebrow", "セクションラベル", 80],
  ["title", "見出し", 160],
  ["description", "概要", 600],
  ["statusTitle", "募集状態の見出し", 160],
  ["statusDescription", "募集状態の説明", 600],
  ["applicationTitle", "応募方法の見出し", 160],
  ["applicationDescription", "応募方法の説明", 600],
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

function createContent(
  formData: FormData,
  locale: Locale,
  status: ContentStatus,
  itemStatuses: Readonly<Record<(typeof itemIds)[number], ContentStatus>>,
  applicationEnabled: boolean,
  errors: Record<string, string>,
): ModeratorContent {
  const localizedLabel = locale === "ja" ? "日本語" : "英語";
  const values = Object.fromEntries(
    localizedFields.map(([field, label, maximumLength]) => [
      field,
      requireText(
        formData,
        `${field}-${locale}`,
        `${localizedLabel}の${label}`,
        maximumLength,
        errors,
      ),
    ]),
  ) as Record<(typeof localizedFields)[number][0], string>;

  function createItem<Id extends (typeof itemIds)[number]>(
    id: Id,
    icon: "clipboard" | "user-check" | "shield",
  ) {
    return {
      id,
      title: requireText(
        formData,
        `item-${id}-title-${locale}`,
        `${localizedLabel}の${id}見出し`,
        160,
        errors,
      ),
      description: requireText(
        formData,
        `item-${id}-description-${locale}`,
        `${localizedLabel}の${id}説明`,
        600,
        errors,
      ),
      icon,
      status: itemStatuses[id],
    };
  }

  const applicationAction = applicationEnabled
    ? {
        id: "apply-moderator",
        label: requireText(
          formData,
          `applicationLabel-${locale}`,
          `${localizedLabel}の応募ボタン`,
          100,
          errors,
        ),
        ariaLabel: requireText(
          formData,
          `applicationAriaLabel-${locale}`,
          `${localizedLabel}の応募ボタン補足`,
          160,
          errors,
        ),
        destination: "moderatorApplication" as const,
      }
    : null;

  return {
    id: "moderator",
    eyebrow: values.eyebrow,
    title: values.title,
    description: values.description,
    status,
    statusTitle: values.statusTitle,
    statusDescription: values.statusDescription,
    items: [
      createItem("responsibilities", "clipboard"),
      createItem("requirements", "user-check"),
      createItem("ideal-candidate", "shield"),
    ],
    applicationTitle: values.applicationTitle,
    applicationDescription: values.applicationDescription,
    applicationAction,
  };
}

export function validateModeratorForm(
  formData: FormData,
): ModeratorValidationResult {
  const errors: Record<string, string> = {};
  const status = getContentStatus(formData, "status", errors);
  const itemStatuses = Object.fromEntries(
    itemIds.map((id) => [
      id,
      getContentStatus(formData, `item-${id}-status`, errors),
    ]),
  ) as Record<(typeof itemIds)[number], ContentStatus>;
  const applicationEnabled = formData.get("applicationEnabled") === "on";
  const ja = createContent(
    formData,
    "ja",
    status,
    itemStatuses,
    applicationEnabled,
    errors,
  );
  const en = createContent(
    formData,
    "en",
    status,
    itemStatuses,
    applicationEnabled,
    errors,
  );

  return Object.keys(errors).length > 0
    ? { success: false, errors }
    : { success: true, data: { ja, en } };
}
