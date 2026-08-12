import {
  announcementCategories,
  editableAnnouncementStatuses,
  type AnnouncementInput,
} from "@/lib/announcements/types";

export const announcementFieldNames = [
  "category",
  "status",
  "publishedAt",
  "externalUrl",
  "titleJa",
  "descriptionJa",
  "titleEn",
  "descriptionEn",
] as const;

export type AnnouncementFieldName = (typeof announcementFieldNames)[number];
export type AnnouncementFieldErrors = Partial<
  Readonly<Record<AnnouncementFieldName, string>>
>;

export type AnnouncementValidationResult =
  | { success: true; data: AnnouncementInput }
  | { success: false; errors: AnnouncementFieldErrors };

const japanTimeZoneOffset = "+09:00";
const dateTimeLocalPattern =
  /^(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})T(?<hour>\d{2}):(?<minute>\d{2})$/;

function getText(formData: FormData, name: AnnouncementFieldName) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function validateRequiredText(
  value: string,
  field: AnnouncementFieldName,
  label: string,
  maximumLength: number,
  errors: Record<string, string>,
) {
  if (!value) {
    errors[field] = `${label}を入力してください。`;
  } else if (value.length > maximumLength) {
    errors[field] = `${label}は${maximumLength}文字以内で入力してください。`;
  }
}

export function parseJapanDateTimeLocal(value: string) {
  const match = dateTimeLocalPattern.exec(value);

  if (!match?.groups) {
    return null;
  }

  const date = new Date(`${value}:00${japanTimeZoneOffset}`);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const formatter = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const parts = Object.fromEntries(
    formatter
      .formatToParts(date)
      .filter(({ type }) => type !== "literal")
      .map(({ type, value: partValue }) => [type, partValue]),
  );
  const normalized = `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;

  return normalized === value ? date : null;
}

export function formatJapanDateTimeLocal(date: Date | null) {
  if (!date) {
    return "";
  }

  const formatter = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const parts = Object.fromEntries(
    formatter
      .formatToParts(date)
      .filter(({ type }) => type !== "literal")
      .map(({ type, value }) => [type, value]),
  );

  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

function parseExternalUrl(value: string) {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

export function validateAnnouncementForm(
  formData: FormData,
): AnnouncementValidationResult {
  const errors: Record<string, string> = {};
  const category = getText(formData, "category");
  const status = getText(formData, "status");
  const publishedAtValue = getText(formData, "publishedAt");
  const externalUrlValue = getText(formData, "externalUrl");
  const titleJa = getText(formData, "titleJa");
  const descriptionJa = getText(formData, "descriptionJa");
  const titleEn = getText(formData, "titleEn");
  const descriptionEn = getText(formData, "descriptionEn");

  if (!announcementCategories.some((value) => value === category)) {
    errors.category = "カテゴリを選択してください。";
  }

  if (!editableAnnouncementStatuses.some((value) => value === status)) {
    errors.status = "公開状態を選択してください。";
  }

  validateRequiredText(titleJa, "titleJa", "日本語タイトル", 160, errors);
  validateRequiredText(
    descriptionJa,
    "descriptionJa",
    "日本語概要",
    600,
    errors,
  );

  if (status === "published") {
    validateRequiredText(titleEn, "titleEn", "英語タイトル", 160, errors);
    validateRequiredText(
      descriptionEn,
      "descriptionEn",
      "英語概要",
      600,
      errors,
    );
  } else if (titleEn || descriptionEn) {
    validateRequiredText(titleEn, "titleEn", "英語タイトル", 160, errors);
    validateRequiredText(
      descriptionEn,
      "descriptionEn",
      "英語概要",
      600,
      errors,
    );
  }

  const publishedAt = publishedAtValue
    ? parseJapanDateTimeLocal(publishedAtValue)
    : null;

  if (status === "published" && !publishedAtValue) {
    errors.publishedAt = "公開日時を入力してください。";
  } else if (publishedAtValue && !publishedAt) {
    errors.publishedAt = "有効な日本時間の公開日時を入力してください。";
  }

  const externalUrl = parseExternalUrl(externalUrlValue);

  if (externalUrlValue.length > 2048) {
    errors.externalUrl = "外部URLは2048文字以内で入力してください。";
  } else if (externalUrlValue && !externalUrl) {
    errors.externalUrl = "外部URLにはhttpまたはhttpsのURLを入力してください。";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      category: category as AnnouncementInput["category"],
      status: status as AnnouncementInput["status"],
      publishedAt,
      externalUrl,
      translations: {
        ja: { title: titleJa, description: descriptionJa },
        en:
          titleEn && descriptionEn
            ? { title: titleEn, description: descriptionEn }
            : null,
      },
    },
  };
}
