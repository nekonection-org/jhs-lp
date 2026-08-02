import { TriangleAlert } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { LocalizedText } from "@/components/ui/LocalizedText";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { en, ja } from "@/content";
import { getMatchingItem } from "@/lib/content";

export function RulesSection() {
  return (
    <section
      className="section-shell border-y border-[var(--border)] bg-[var(--surface-secondary)]"
      id="rules"
    >
      <Container>
        <Reveal>
          <SectionHeading
            description={
              <LocalizedText
                ja={ja.rules.description}
                en={en.rules.description}
              />
            }
            eyebrow={
              <LocalizedText ja={ja.rules.eyebrow} en={en.rules.eyebrow} />
            }
            title={<LocalizedText ja={ja.rules.title} en={en.rules.title} />}
          />
        </Reveal>

        <Reveal className="mt-8">
          <aside className="surface-card flex items-start gap-4 p-5 sm:p-6">
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[color-mix(in_srgb,var(--danger)_10%,transparent)] text-[var(--danger)]">
              <TriangleAlert aria-hidden="true" className="size-5" />
            </span>
            <div>
              <h3 className="font-bold text-[var(--text-primary)]">
                <LocalizedText
                  ja={ja.rules.noticeTitle}
                  en={en.rules.noticeTitle}
                />
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                <LocalizedText ja={ja.rules.notice} en={en.rules.notice} />
              </p>
            </div>
          </aside>
        </Reveal>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ja.rules.items.map((item, index) => {
            const englishItem = getMatchingItem(en.rules.items, item.id);

            return (
              <Reveal delay={index * 0.035} key={item.id}>
                <FeatureCard
                  className="bg-[var(--surface)]"
                  description={
                    <LocalizedText
                      ja={item.description}
                      en={englishItem.description}
                    />
                  }
                  icon={item.icon}
                  important={"important" in item && item.important}
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
      </Container>
    </section>
  );
}
