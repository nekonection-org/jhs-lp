import { ChevronDown, ScrollText } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { LocalizedText } from "@/components/ui/LocalizedText";
import { Reveal } from "@/components/ui/Reveal";
import { SectionDisclosure } from "@/components/ui/SectionDisclosure";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { en, ja } from "@/content";
import { getMatchingItem } from "@/lib/content";
import { getPublicRulesContent } from "@/lib/rules/public";

export async function RulesSection() {
  const result = await getPublicRulesContent();
  const japaneseContent = result.item?.translations.ja ?? ja.rules;
  const englishContent = result.item?.translations.en ?? en.rules;

  function renderRule(
    item: (typeof japaneseContent.items)[number],
    index: number,
  ) {
    const englishItem = getMatchingItem(englishContent.items, item.id);

    return (
      <Reveal variant="wipe" delay={index * 0.035} key={item.id}>
        <FeatureCard
          number={String(index + 1).padStart(2, "0")}
          className="rule-feature"
          description={
            <LocalizedText ja={item.description} en={englishItem.description} />
          }
          icon={item.icon}
          important={"important" in item && item.important}
          status={item.status}
          statusLabel={{
            ja: ja.common.statusLabels[item.status],
            en: en.common.statusLabels[englishItem.status],
          }}
          title={<LocalizedText ja={item.title} en={englishItem.title} />}
        />
      </Reveal>
    );
  }

  return (
    <section className="section-shell chapter-section" id="rules">
      <Container>
        <div className="rules-layout">
          <div className="rules-introduction">
            <Reveal>
              <SectionHeading
                index="02"
                layout="stack"
                description={
                  <LocalizedText
                    ja={japaneseContent.description}
                    en={englishContent.description}
                  />
                }
                eyebrow={
                  <LocalizedText
                    ja={japaneseContent.eyebrow}
                    en={englishContent.eyebrow}
                  />
                }
                title={
                  <LocalizedText
                    ja={japaneseContent.title}
                    en={englishContent.title}
                  />
                }
              />
            </Reveal>
          </div>
          <div className="rules-grid">
            {japaneseContent.items.slice(0, 3).map(renderRule)}
          </div>
        </div>
        <SectionDisclosure
          className="rules-additional"
          label={{ ja: ja.detailLabels.rules, en: en.detailLabels.rules }}
        >
          <aside className="mb-8 border-l-2 border-[var(--border-strong)] pl-5">
            <h3 className="text-lg font-semibold">
              <LocalizedText
                ja={japaneseContent.noticeTitle}
                en={englishContent.noticeTitle}
              />
            </h3>
            <p className="mt-3 text-sm text-[var(--text-secondary)]">
              <LocalizedText
                ja={japaneseContent.notice}
                en={englishContent.notice}
              />
            </p>
          </aside>
          <div className="rules-grid">
            {japaneseContent.items
              .slice(3)
              .map((item, index) => renderRule(item, index + 3))}
          </div>
        </SectionDisclosure>
        <Reveal className="mt-10">
          <details className="rulebook surface-card group overflow-hidden bg-[var(--surface)]">
            <summary className="flex min-h-16 cursor-pointer list-none items-center gap-4 px-5 py-4 font-bold text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--focus)] sm:px-6">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-[var(--border)] bg-[var(--surface-secondary)] text-[var(--accent-strong)]">
                <ScrollText aria-hidden="true" className="size-5" />
              </span>
              <span className="mr-auto">
                <span className="group-open:hidden">
                  <LocalizedText
                    ja={japaneseContent.rulebook.openLabel}
                    en={englishContent.rulebook.openLabel}
                  />
                </span>
                <span className="hidden group-open:inline">
                  <LocalizedText
                    ja={japaneseContent.rulebook.closeLabel}
                    en={englishContent.rulebook.closeLabel}
                  />
                </span>
              </span>
              <ChevronDown
                aria-hidden="true"
                className="size-5 shrink-0 text-[var(--text-muted)] transition-transform duration-200 group-open:rotate-180"
              />
            </summary>

            <div className="border-t border-[var(--border)] px-5 py-7 sm:px-7 sm:py-9">
              <div className="max-w-3xl">
                <p className="section-eyebrow">Server Rulebook</p>
                <h3 className="mt-2 text-2xl font-bold tracking-[-0.03em] sm:text-3xl">
                  <LocalizedText
                    ja={japaneseContent.rulebook.title}
                    en={englishContent.rulebook.title}
                  />
                </h3>
              </div>

              <div className="mt-7 divide-y divide-[var(--border)] border-y border-[var(--border)]">
                {japaneseContent.rulebook.blocks.map((block) => {
                  const englishBlock = getMatchingItem(
                    englishContent.rulebook.blocks,
                    block.id,
                  );

                  return (
                    <section className="py-7 sm:py-8" key={block.id}>
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
                        <h4 className="text-lg font-bold tracking-[-0.02em] text-[var(--text-primary)] sm:text-xl">
                          <LocalizedText
                            ja={block.title}
                            en={englishBlock.title}
                          />
                        </h4>
                        {block.penalty && englishBlock.penalty ? (
                          <span className="rounded-md border border-[color-mix(in_srgb,var(--danger)_38%,var(--border))] bg-[color-mix(in_srgb,var(--danger)_8%,transparent)] px-2.5 py-1 text-xs font-bold text-[var(--danger)]">
                            <LocalizedText
                              ja={block.penalty}
                              en={englishBlock.penalty}
                            />
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-3 max-w-4xl space-y-3 text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
                        {block.paragraphs.map((paragraph, index) => (
                          <p key={paragraph}>
                            <LocalizedText
                              ja={paragraph}
                              en={englishBlock.paragraphs[index] ?? ""}
                            />
                          </p>
                        ))}
                      </div>

                      {block.items && englishBlock.items ? (
                        <ul className="mt-4 grid gap-3 text-sm leading-6 text-[var(--text-secondary)] sm:text-base">
                          {block.items.map((item) => {
                            const englishItem = getMatchingItem(
                              englishBlock.items ?? [],
                              item.id,
                            );
                            const itemLabel =
                              "label" in item ? item.label : null;
                            const englishItemLabel =
                              "label" in englishItem ? englishItem.label : null;

                            return (
                              <li
                                className="relative pl-5 before:absolute before:top-[0.65rem] before:left-0 before:size-1.5 before:rounded-full before:bg-[var(--accent)]"
                                key={item.id}
                              >
                                {itemLabel && englishItemLabel ? (
                                  <strong className="font-bold text-[var(--text-primary)]">
                                    <LocalizedText
                                      ja={`${itemLabel}: `}
                                      en={`${englishItemLabel}: `}
                                    />
                                  </strong>
                                ) : null}
                                <LocalizedText
                                  ja={item.description}
                                  en={englishItem.description}
                                />
                              </li>
                            );
                          })}
                        </ul>
                      ) : null}
                    </section>
                  );
                })}
              </div>

              <aside className="mt-8 rounded-lg border border-[var(--border)] bg-[var(--surface-secondary)] p-4 text-sm leading-6 text-[var(--text-secondary)]">
                <LocalizedText
                  ja={japaneseContent.rulebook.supplementaryNote}
                  en={englishContent.rulebook.supplementaryNote}
                />
              </aside>
              <p className="mt-5 text-xs text-[var(--text-muted)]">
                <LocalizedText
                  ja={`${japaneseContent.rulebook.lastUpdatedLabel}: ${japaneseContent.rulebook.lastUpdated}`}
                  en={`${englishContent.rulebook.lastUpdatedLabel}: ${englishContent.rulebook.lastUpdated}`}
                />
              </p>
            </div>
          </details>
        </Reveal>
      </Container>
    </section>
  );
}
