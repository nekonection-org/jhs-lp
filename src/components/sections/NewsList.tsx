import { ArrowLeft, ArrowRight, Newspaper, WifiOff } from "lucide-react";
import Link from "next/link";

import { LocalizedText } from "@/components/ui/LocalizedText";
import { Reveal } from "@/components/ui/Reveal";
import { en, ja } from "@/content";
import type {
  PublicAnnouncementsPagination,
  PublicAnnouncementsResult,
} from "@/lib/announcements/public-types";
import { formatAnnouncementDate } from "@/lib/date";

interface NewsListProps {
  result: PublicAnnouncementsResult;
}

export function NewsList({ result }: NewsListProps) {
  if (result.status === "unavailable") {
    return (
      <NewsPlaceholder
        icon="unavailable"
        titleJa={ja.news.unavailableTitle}
        titleEn={en.news.unavailableTitle}
        descriptionJa={ja.news.unavailableDescription}
        descriptionEn={en.news.unavailableDescription}
      />
    );
  }

  if (result.items.length === 0) {
    return (
      <NewsPlaceholder
        icon="empty"
        titleJa={ja.news.emptyTitle}
        titleEn={en.news.emptyTitle}
        descriptionJa={ja.news.emptyDescription}
        descriptionEn={en.news.emptyDescription}
      />
    );
  }

  const isArchivePage = result.pagination.page > 1;

  return (
    <>
      {isArchivePage ? (
        <Reveal className="mt-10 lg:mt-12">
          <div className="surface-card flex flex-col gap-5 border-l-4 border-l-[var(--accent)] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <p className="text-lg font-bold tracking-[-0.02em]">
                <LocalizedText
                  ja={ja.news.archiveTitle}
                  en={en.news.archiveTitle}
                />
              </p>
              <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                <LocalizedText
                  ja={ja.news.archiveDescription}
                  en={en.news.archiveDescription}
                />
              </p>
            </div>
            <Link
              className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-lg border border-[var(--border)] px-4 text-sm font-semibold text-[var(--text-secondary)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)] sm:self-auto"
              href="/#news"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              <LocalizedText
                ja={ja.news.backToLatest}
                en={en.news.backToLatest}
              />
            </Link>
          </div>
        </Reveal>
      ) : null}

      <div className={isArchivePage ? "news-list mt-4" : "news-list"}>
        {result.items.map((item, index) => {
          const publishedAt = new Date(item.publishedAt);
          const english = item.translations.en ?? {
            title: en.news.translationPendingTitle,
            description: en.news.translationPendingDescription,
          };

          return (
            <Reveal delay={index * 0.04} key={item.id}>
              <article className="news-item">
                <a
                  className="news-summary"
                  href={`/news/${encodeURIComponent(item.id)}${result.pagination.page > 1 ? `?newsPage=${result.pagination.page}` : ""}`}
                >
                  <h3 className="news-row">
                    <time className="news-date" dateTime={item.publishedAt}>
                      <span data-locale-content="ja">
                        {formatAnnouncementDate(publishedAt, "ja")}
                      </span>
                      <span data-locale-content="en">
                        {formatAnnouncementDate(publishedAt, "en")}
                      </span>
                    </time>
                    <span className="news-category">
                      <LocalizedText
                        ja={ja.news.categoryLabels[item.category]}
                        en={en.news.categoryLabels[item.category]}
                      />
                    </span>
                    <span className="news-title">
                      <LocalizedText
                        ja={item.translations.ja.title}
                        en={english.title}
                      />
                    </span>
                    <ArrowRight
                      aria-hidden="true"
                      className="size-4 shrink-0"
                      data-news-icon
                    />
                  </h3>
                </a>
              </article>
            </Reveal>
          );
        })}
      </div>

      <NewsPagination pagination={result.pagination} />
    </>
  );
}

interface NewsPaginationProps {
  pagination: PublicAnnouncementsPagination;
}

function newsPageHref(page: number) {
  return page === 1 ? "/#news" : `/?newsPage=${page}#news`;
}

export function NewsArchiveLink({ result }: NewsListProps) {
  if (
    result.status !== "ready" ||
    result.pagination.page !== 1 ||
    result.pagination.totalPages <= 1
  ) {
    return null;
  }

  return (
    <Link className="news-archive-link" href={newsPageHref(2)}>
      <LocalizedText ja={ja.news.viewArchive} en={en.news.viewArchive} />
      <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
    </Link>
  );
}

function NewsPagination({ pagination }: NewsPaginationProps) {
  if (pagination.totalPages <= 1 || pagination.page === 1) {
    return null;
  }

  const previousPage = pagination.page - 1;
  const nextPage = pagination.page + 1;

  return (
    <Reveal className="mt-6">
      <nav
        aria-labelledby="news-pagination-label"
        className="surface-card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <p className="sr-only" id="news-pagination-label">
          <LocalizedText
            ja={ja.news.paginationLabel}
            en={en.news.paginationLabel}
          />
        </p>
        <Link
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[var(--border)] px-4 text-sm font-semibold transition-colors hover:border-[var(--accent)] hover:text-[var(--accent-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]"
          href={newsPageHref(previousPage)}
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          <LocalizedText ja={ja.news.previousPage} en={en.news.previousPage} />
        </Link>
        <p className="text-center text-sm font-semibold text-[var(--text-secondary)]">
          <LocalizedText
            ja={`${pagination.page} / ${pagination.totalPages} ページ`}
            en={`Page ${pagination.page} of ${pagination.totalPages}`}
          />
        </p>
        {nextPage <= pagination.totalPages ? (
          <Link
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[var(--border)] px-4 text-sm font-semibold transition-colors hover:border-[var(--accent)] hover:text-[var(--accent-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]"
            href={newsPageHref(nextPage)}
          >
            <LocalizedText ja={ja.news.nextPage} en={en.news.nextPage} />
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        ) : (
          <span
            aria-hidden="true"
            className="hidden min-h-11 sm:block sm:w-32"
          />
        )}
      </nav>
    </Reveal>
  );
}

interface NewsPlaceholderProps {
  icon: "empty" | "unavailable";
  titleJa: string;
  titleEn: string;
  descriptionJa: string;
  descriptionEn: string;
}

function NewsPlaceholder({
  icon,
  titleJa,
  titleEn,
  descriptionJa,
  descriptionEn,
}: NewsPlaceholderProps) {
  const Icon = icon === "unavailable" ? WifiOff : Newspaper;

  return (
    <Reveal className="mt-10 lg:mt-12">
      <div className="flex flex-col items-start border-t border-[var(--border)] py-8">
        <span className="text-[var(--text-muted)]">
          <Icon aria-hidden="true" className="size-6" />
        </span>
        <h3 className="mt-5 text-xl font-bold tracking-[-0.025em]">
          <LocalizedText ja={titleJa} en={titleEn} />
        </h3>
        <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--text-secondary)]">
          <LocalizedText ja={descriptionJa} en={descriptionEn} />
        </p>
      </div>
    </Reveal>
  );
}
