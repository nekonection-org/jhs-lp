import type { Locale } from "@/content/types";

const localeNames: Record<Locale, string> = {
  ja: "ja-JP",
  en: "en-US",
};

export function formatPublishedDate(value: string, locale: Locale) {
  const date = new Date(`${value}T00:00:00Z`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(localeNames[locale], {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatAnnouncementDate(value: Date, locale: Locale) {
  if (Number.isNaN(value.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(localeNames[locale], {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "Asia/Tokyo",
  }).format(value);
}
