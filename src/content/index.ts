import { en } from "./en";
import { ja } from "./ja";
import type { Locale, SiteContent } from "./types";

export * from "./types";
export { en, ja };

export const defaultLocale: Locale = "ja";

export const contentByLocale = {
  ja,
  en,
} as const satisfies Readonly<Record<Locale, SiteContent>>;

export function isLocale(value: unknown): value is Locale {
  return value === "ja" || value === "en";
}

export function getContent(locale: Locale): SiteContent {
  return contentByLocale[locale];
}
