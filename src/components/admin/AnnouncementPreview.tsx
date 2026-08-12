import { ArrowUpRight, Eye } from "lucide-react";

import { AnnouncementStatusBadge } from "@/components/admin/AnnouncementStatusBadge";
import {
  getOperationalStatus,
  getTranslation,
  type AnnouncementCategory,
  type AnnouncementLocale,
  type AnnouncementRecord,
} from "@/lib/announcements/types";

const categoryLabels: Readonly<
  Record<AnnouncementLocale, Record<AnnouncementCategory, string>>
> = {
  ja: {
    notice: "お知らせ",
    maintenance: "メンテナンス",
    update: "アップデート",
    event: "イベント",
    important: "重要",
    incident: "障害情報",
  },
  en: {
    notice: "Notice",
    maintenance: "Maintenance",
    update: "Update",
    event: "Event",
    important: "Important",
    incident: "Incident",
  },
};

const localeNames: Readonly<Record<AnnouncementLocale, string>> = {
  ja: "ja-JP",
  en: "en-US",
};

const emptyTranslationLabels: Readonly<Record<AnnouncementLocale, string>> = {
  ja: "日本語コンテンツが入力されていません。",
  en: "English content has not been entered yet.",
};

function formatPublishedAt(value: Date | null, locale: AnnouncementLocale) {
  if (!value) {
    return locale === "ja" ? "公開日時未設定" : "Publication date not set";
  }

  return new Intl.DateTimeFormat(localeNames[locale], {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Tokyo",
  }).format(value);
}

function safeHttpUrl(value: string | null) {
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

interface AnnouncementPreviewProps {
  announcement: AnnouncementRecord;
}

export function AnnouncementPreview({
  announcement,
}: AnnouncementPreviewProps) {
  const status = getOperationalStatus(announcement);
  const externalUrl = safeHttpUrl(announcement.externalUrl);

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[color-mix(in_srgb,var(--info)_38%,var(--border))] bg-[color-mix(in_srgb,var(--info)_7%,var(--surface))] px-4 py-3">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-secondary)]">
          <Eye aria-hidden="true" className="size-4 text-[var(--info)]" />
          管理者限定プレビューです。この画面から公開状態は変更されません。
        </p>
        <AnnouncementStatusBadge status={status} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {(["ja", "en"] as const).map((locale) => {
          const translation = getTranslation(announcement, locale);
          const languageLabel = locale === "ja" ? "日本語" : "English";

          return (
            <section
              aria-labelledby={`preview-${locale}-heading`}
              className="surface-card overflow-hidden"
              key={locale}
              lang={locale}
            >
              <header className="border-b border-[var(--border)] bg-[var(--surface-secondary)] px-5 py-4 sm:px-6">
                <p className="section-eyebrow">{languageLabel}</p>
                <h2
                  className="mt-1 text-lg font-bold tracking-[-0.025em]"
                  id={`preview-${locale}-heading`}
                >
                  {locale === "ja"
                    ? "公開サイトでの表示"
                    : "Public site preview"}
                </h2>
              </header>

              <article className="grid min-h-64 content-start gap-5 p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <time
                    className="text-sm font-semibold text-[var(--text-secondary)]"
                    dateTime={announcement.publishedAt?.toISOString()}
                  >
                    {formatPublishedAt(announcement.publishedAt, locale)}
                  </time>
                  <span className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--accent-strong)]">
                    {categoryLabels[locale][announcement.category]}
                  </span>
                </div>

                {translation ? (
                  <div>
                    <h3 className="text-xl font-bold tracking-[-0.025em]">
                      {translation.title}
                    </h3>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-[var(--text-secondary)]">
                      {translation.description}
                    </p>
                  </div>
                ) : (
                  <p className="rounded-lg border border-dashed border-[var(--border-strong)] bg-[var(--background)] px-4 py-5 text-sm leading-6 text-[var(--text-muted)]">
                    {emptyTranslationLabels[locale]}
                  </p>
                )}

                {externalUrl ? (
                  <a
                    className="mt-auto inline-flex min-h-10 w-fit items-center gap-2 rounded-lg font-semibold text-[var(--accent-strong)] underline decoration-[color-mix(in_srgb,var(--accent)_45%,transparent)] transition-colors hover:text-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]"
                    href={externalUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {locale === "ja" ? "関連リンクを開く" : "Open related link"}
                    <ArrowUpRight aria-hidden="true" className="size-4" />
                  </a>
                ) : null}
              </article>
            </section>
          );
        })}
      </div>
    </div>
  );
}
