import { Plus } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { LocalizedText } from "@/components/ui/LocalizedText";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { en, ja } from "@/content";
import { getMatchingItem } from "@/lib/content";

export function FaqSection() {
  return (
    <section
      className="section-shell border-y border-[var(--border)] bg-[var(--surface-secondary)]"
      id="faq"
    >
      <Container className="grid gap-10 lg:grid-cols-[minmax(16rem,0.72fr)_minmax(0,1.28fr)] lg:gap-16">
        <Reveal>
          <SectionHeading
            className="lg:sticky lg:top-28"
            description={
              <LocalizedText ja={ja.faq.description} en={en.faq.description} />
            }
            eyebrow={<LocalizedText ja={ja.faq.eyebrow} en={en.faq.eyebrow} />}
            title={<LocalizedText ja={ja.faq.title} en={en.faq.title} />}
          />
        </Reveal>

        <div className="grid gap-3">
          {ja.faq.items.map((item, index) => {
            const englishItem = getMatchingItem(en.faq.items, item.id);

            return (
              <Reveal delay={Math.min(index * 0.025, 0.15)} key={item.id}>
                <details className="faq-item surface-card group overflow-hidden">
                  <summary className="flex min-h-16 cursor-pointer items-center gap-4 px-5 py-4 font-bold tracking-[-0.015em] text-[var(--text-primary)] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--focus)] sm:px-6">
                    <span className="flex-1">
                      <LocalizedText
                        ja={item.question}
                        en={englishItem.question}
                      />
                    </span>
                    <span className="grid size-8 shrink-0 place-items-center rounded-md border border-[var(--border)] bg-[var(--surface-secondary)] text-[var(--accent-strong)]">
                      <Plus
                        aria-hidden="true"
                        className="size-4 transition-transform duration-150"
                        data-faq-icon
                      />
                    </span>
                  </summary>
                  <div className="border-t border-[var(--border)] px-5 py-5 sm:px-6">
                    <p className="text-sm leading-7 text-[var(--text-secondary)]">
                      <LocalizedText ja={item.answer} en={englishItem.answer} />
                    </p>
                    <StatusBadge
                      className="mt-4"
                      en={en.common.statusLabels[englishItem.status]}
                      ja={ja.common.statusLabels[item.status]}
                      status={item.status}
                    />
                  </div>
                </details>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
