import { MessageCircle } from "lucide-react";

import { LocalizedExternalAction } from "@/components/ui/ActionLink";
import { Container } from "@/components/ui/Container";
import { LocalizedText } from "@/components/ui/LocalizedText";
import { Reveal } from "@/components/ui/Reveal";
import { en, ja } from "@/content";
import { externalUrls } from "@/lib/constants";

export function FinalCtaSection() {
  return (
    <section className="section-shell" aria-labelledby="final-cta-title">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--accent)_35%,var(--border))] bg-[var(--surface)] px-6 py-10 sm:px-10 sm:py-12 lg:px-14">
            <div
              aria-hidden="true"
              className="absolute -top-32 -right-28 size-80 rounded-full border border-[color-mix(in_srgb,var(--accent)_20%,transparent)] bg-[color-mix(in_srgb,var(--accent)_5%,transparent)]"
            />
            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="max-w-3xl">
                <span className="grid size-11 place-items-center rounded-lg border border-[var(--border)] bg-[var(--surface-secondary)] text-[var(--accent-strong)]">
                  <MessageCircle aria-hidden="true" className="size-5" />
                </span>
                <p className="section-eyebrow mt-6">
                  <LocalizedText
                    ja={ja.finalCta.eyebrow}
                    en={en.finalCta.eyebrow}
                  />
                </p>
                <h2
                  className="mt-3 text-balance text-3xl font-bold tracking-[-0.04em] sm:text-4xl"
                  id="final-cta-title"
                >
                  <LocalizedText
                    ja={ja.finalCta.title}
                    en={en.finalCta.title}
                  />
                </h2>
                <p className="mt-4 text-base leading-7 text-[var(--text-secondary)] sm:text-lg">
                  <LocalizedText
                    ja={ja.finalCta.description}
                    en={en.finalCta.description}
                  />
                </p>
              </div>
              <LocalizedExternalAction
                action={{ ja: ja.finalCta.action, en: en.finalCta.action }}
                className="w-full lg:w-auto"
                common={{ ja: ja.common, en: en.common }}
                href={externalUrls.discord}
              />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
