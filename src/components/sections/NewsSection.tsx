import { ArrowUpRight, Newspaper } from "lucide-react";

import type { NewsContent } from "@/content";
import { Container } from "@/components/ui/Container";
import { LocalizedText } from "@/components/ui/LocalizedText";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { en, ja } from "@/content";
import { getMatchingItem } from "@/lib/content";
import { formatPublishedDate } from "@/lib/date";

function safeHttpUrl(value: string | undefined) {
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

export function NewsSection() {
  const japaneseNews: NewsContent = ja.news;
  const englishNews: NewsContent = en.news;

  return (
    <section
      className="section-shell border-y border-[var(--border)] bg-[linear-gradient(145deg,var(--surface-secondary),color-mix(in_srgb,var(--surface)_62%,var(--surface-secondary)))]"
      id="news"
    >
      <Container>
        <Reveal>
          <SectionHeading
            description={
              <LocalizedText
                ja={japaneseNews.description}
                en={englishNews.description}
              />
            }
            eyebrow={
              <LocalizedText
                ja={japaneseNews.eyebrow}
                en={englishNews.eyebrow}
              />
            }
            title={
              <LocalizedText ja={japaneseNews.title} en={englishNews.title} />
            }
          />
        </Reveal>

        {japaneseNews.items.length > 0 ? (
          <div className="mt-10 grid gap-4 lg:mt-12">
            {japaneseNews.items.slice(0, 5).map((item, index) => {
              const englishItem = getMatchingItem(englishNews.items, item.id);
              const href = safeHttpUrl(item.url);

              return (
                <Reveal delay={index * 0.04} key={item.id}>
                  <article className="surface-card interactive-card grid gap-4 p-5 sm:grid-cols-[9rem_minmax(0,1fr)_auto] sm:items-center sm:p-6">
                    <div className="flex flex-wrap items-center gap-2 sm:block">
                      <time
                        className="text-sm font-semibold text-[var(--text-secondary)]"
                        dateTime={item.publishedAt}
                      >
                        <span data-locale-content="ja">
                          {formatPublishedDate(item.publishedAt, "ja")}
                        </span>
                        <span data-locale-content="en">
                          {formatPublishedDate(item.publishedAt, "en")}
                        </span>
                      </time>
                      <p className="mt-0 text-xs font-bold uppercase tracking-[0.08em] text-[var(--accent-strong)] sm:mt-2">
                        <LocalizedText
                          ja={japaneseNews.categoryLabels[item.category]}
                          en={englishNews.categoryLabels[englishItem.category]}
                        />
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold tracking-[-0.02em]">
                        <LocalizedText ja={item.title} en={englishItem.title} />
                      </h3>
                      <p className="mt-1.5 text-sm leading-6 text-[var(--text-secondary)]">
                        <LocalizedText
                          ja={item.description}
                          en={englishItem.description}
                        />
                      </p>
                    </div>
                    {href ? (
                      <a
                        className="grid size-10 place-items-center rounded-lg border border-[var(--border)] text-[var(--text-secondary)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]"
                        href={href}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <span className="sr-only">
                          <LocalizedText
                            ja={item.title}
                            en={englishItem.title}
                          />{" "}
                          (
                          <LocalizedText
                            ja={ja.common.opensInNewTab}
                            en={en.common.opensInNewTab}
                          />
                          )
                        </span>
                        <ArrowUpRight aria-hidden="true" className="size-4" />
                      </a>
                    ) : null}
                  </article>
                </Reveal>
              );
            })}
          </div>
        ) : (
          <Reveal className="mt-10 lg:mt-12">
            <div className="surface-card flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center sm:px-10">
              <span className="grid size-12 place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] text-[var(--text-muted)]">
                <Newspaper aria-hidden="true" className="size-6" />
              </span>
              <h3 className="mt-5 text-xl font-bold tracking-[-0.025em]">
                <LocalizedText
                  ja={japaneseNews.emptyTitle}
                  en={englishNews.emptyTitle}
                />
              </h3>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--text-secondary)]">
                <LocalizedText
                  ja={japaneseNews.emptyDescription}
                  en={englishNews.emptyDescription}
                />
              </p>
            </div>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
