import { ArrowLeft, ArrowUpRight, CalendarDays } from "lucide-react";

import { LocalizedText } from "@/components/ui/LocalizedText";
import { LocalizedPageTitle } from "@/components/ui/LocalizedPageTitle";
import { LocalizedMarkdown } from "@/components/ui/MarkdownContent";
import { en, ja } from "@/content";
import type { PublicAnnouncement } from "@/lib/announcements/public-types";
import { formatAnnouncementDate } from "@/lib/date";

function safeHttpUrl(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

interface NewsArticleProps {
  announcement: PublicAnnouncement;
  backHref: string;
  presentation?: "page" | "dialog";
  titleId?: string;
}

export function NewsArticle({
  announcement,
  backHref,
  presentation = "page",
  titleId = "news-article-title",
}: NewsArticleProps) {
  const english = announcement.translations.en ?? {
    title: en.news.translationPendingTitle,
    description: en.news.translationPendingDescription,
  };
  const relatedUrl = safeHttpUrl(announcement.externalUrl);
  const inDialog = presentation === "dialog";
  const Heading = inDialog ? "h2" : "h1";

  return (
    <article
      className={`news-article${inDialog ? " news-dialog-article" : ""}`}
      aria-labelledby={titleId}
    >
      {!inDialog ? (
        <>
          <LocalizedPageTitle
            ja={`${announcement.translations.ja.title} | ${ja.common.siteName}`}
            en={`${english.title} | ${en.common.siteName}`}
          />
          <a className="news-back-link" href={backHref}>
            <ArrowLeft aria-hidden="true" className="size-4 shrink-0" />
            <LocalizedText ja={ja.news.backToList} en={en.news.backToList} />
          </a>
        </>
      ) : null}
      <header className="news-article-header">
        <p className="news-article-eyebrow">
          <LocalizedText ja={ja.news.eyebrow} en={en.news.eyebrow} />
        </p>
        <div className="news-article-meta">
          <span className="inline-flex items-center gap-2">
            <CalendarDays aria-hidden="true" className="size-4 shrink-0" />
            <time dateTime={announcement.publishedAt}>
              <LocalizedText
                ja={formatAnnouncementDate(
                  new Date(announcement.publishedAt),
                  "ja",
                )}
                en={formatAnnouncementDate(
                  new Date(announcement.publishedAt),
                  "en",
                )}
              />
            </time>
          </span>
          <span className="news-category">
            <LocalizedText
              ja={ja.news.categoryLabels[announcement.category]}
              en={en.news.categoryLabels[announcement.category]}
            />
          </span>
        </div>
        <Heading
          className="news-article-title"
          id={titleId}
          tabIndex={inDialog ? -1 : undefined}
        >
          <LocalizedText
            ja={announcement.translations.ja.title}
            en={english.title}
          />
        </Heading>
      </header>
      <div className="news-article-body">
        <LocalizedMarkdown
          headingLevel={inDialog ? 3 : 2}
          ja={announcement.translations.ja.description}
          en={english.description}
        />
      </div>
      {relatedUrl ? (
        <a
          className="news-related-link"
          href={relatedUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          <LocalizedText
            ja={ja.news.relatedLinkLabel}
            en={en.news.relatedLinkLabel}
          />
          <ArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
          <span className="sr-only">
            (
            <LocalizedText
              ja={ja.common.opensInNewTab}
              en={en.common.opensInNewTab}
            />
            )
          </span>
        </a>
      ) : null}
    </article>
  );
}
