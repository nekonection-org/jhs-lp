import { Info } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { LocalizedText } from "@/components/ui/LocalizedText";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { en, ja } from "@/content";
import { getMatchingItem } from "@/lib/content";

export function ServerSection() {
  return (
    <section className="section-shell" id="server">
      <Container>
        <Reveal>
          <SectionHeading
            description={
              <LocalizedText
                ja={ja.server.description}
                en={en.server.description}
              />
            }
            eyebrow={
              <LocalizedText ja={ja.server.eyebrow} en={en.server.eyebrow} />
            }
            title={<LocalizedText ja={ja.server.title} en={en.server.title} />}
          />
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
          {ja.server.items.map((item, index) => {
            const englishItem = getMatchingItem(en.server.items, item.id);

            return (
              <Reveal delay={index * 0.04} key={item.id}>
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
          <div className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] p-4 text-sm leading-6 text-[var(--text-secondary)] sm:p-5">
            <Info
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-[var(--accent-strong)]"
            />
            <p>
              <LocalizedText
                ja={ja.server.pendingNotice}
                en={en.server.pendingNotice}
              />
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
