import { ClipboardCheck, LockKeyhole } from "lucide-react";

import { LocalizedExternalAction } from "@/components/ui/ActionLink";
import { Container } from "@/components/ui/Container";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { LocalizedText } from "@/components/ui/LocalizedText";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { en, ja } from "@/content";
import type { ModeratorContent } from "@/content/types";
import { getMatchingItem } from "@/lib/content";
import { getExternalUrl } from "@/lib/constants";
import { getPublicModeratorContent } from "@/lib/moderator/public";

function getApplicationAction(content: ModeratorContent) {
  return content.applicationAction;
}

export async function ModeratorSection() {
  const result = await getPublicModeratorContent();
  const japaneseContent = result.item?.translations.ja ?? ja.moderator;
  const englishContent = result.item?.translations.en ?? en.moderator;
  const japaneseApplicationAction = getApplicationAction(japaneseContent);
  const englishApplicationAction = getApplicationAction(englishContent);
  const applicationHref =
    japaneseApplicationAction &&
    englishApplicationAction &&
    japaneseApplicationAction.destination ===
      englishApplicationAction.destination
      ? getExternalUrl(japaneseApplicationAction.destination)
      : null;

  return (
    <section className="section-shell" id="moderator">
      <Container>
        <Reveal>
          <SectionHeading
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

        <Reveal className="mt-8">
          <div className="surface-card flex flex-col gap-5 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
            <div className="flex max-w-3xl items-start gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-lg border border-[var(--border)] bg-[var(--surface-secondary)] text-[var(--accent-strong)]">
                <ClipboardCheck aria-hidden="true" className="size-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold">
                  <LocalizedText
                    ja={japaneseContent.statusTitle}
                    en={englishContent.statusTitle}
                  />
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                  <LocalizedText
                    ja={japaneseContent.statusDescription}
                    en={englishContent.statusDescription}
                  />
                </p>
              </div>
            </div>
            <StatusBadge
              en={en.common.statusLabels[englishContent.status]}
              ja={ja.common.statusLabels[japaneseContent.status]}
              status={japaneseContent.status}
            />
          </div>
        </Reveal>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {japaneseContent.items.map((item, index) => {
            const englishItem = getMatchingItem(englishContent.items, item.id);

            return (
              <Reveal delay={index * 0.05} key={item.id}>
                <FeatureCard
                  description={
                    <LocalizedText
                      ja={item.description}
                      en={englishItem.description}
                    />
                  }
                  icon={item.icon}
                  status={item.status}
                  statusLabel={{
                    ja: ja.common.statusLabels[item.status],
                    en: en.common.statusLabels[englishItem.status],
                  }}
                  title={
                    <LocalizedText ja={item.title} en={englishItem.title} />
                  }
                />
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-6">
          <div className="surface-card grid gap-5 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h3 className="text-xl font-bold tracking-[-0.025em]">
                <LocalizedText
                  ja={japaneseContent.applicationTitle}
                  en={englishContent.applicationTitle}
                />
              </h3>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--text-secondary)]">
                <LocalizedText
                  ja={japaneseContent.applicationDescription}
                  en={englishContent.applicationDescription}
                />
              </p>
            </div>
            {japaneseApplicationAction && englishApplicationAction ? (
              <LocalizedExternalAction
                action={{
                  ja: japaneseApplicationAction,
                  en: englishApplicationAction,
                }}
                common={{ ja: ja.common, en: en.common }}
                href={applicationHref}
              />
            ) : (
              <span
                aria-disabled="true"
                className="inline-flex min-h-11 cursor-not-allowed items-center justify-center gap-2 rounded-[0.6rem] border border-[var(--border)] bg-[var(--surface-secondary)] px-5 py-2.5 text-sm font-semibold text-[var(--text-muted)]"
              >
                <LockKeyhole aria-hidden="true" className="size-4" />
                <LocalizedText
                  ja={ja.common.unavailable}
                  en={en.common.unavailable}
                />
              </span>
            )}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
