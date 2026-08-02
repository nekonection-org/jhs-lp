import { ArrowRight, Clock3, ShieldCheck } from "lucide-react";

import {
  LocalizedExternalAction,
  LocalizedSectionAction,
} from "@/components/ui/ActionLink";
import { Container } from "@/components/ui/Container";
import { LocalizedText } from "@/components/ui/LocalizedText";
import { Reveal } from "@/components/ui/Reveal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { en, ja } from "@/content";
import { getMatchingItem } from "@/lib/content";
import { externalUrls } from "@/lib/constants";

export function HeroSection() {
  const confirmedFeature = ja.server.items[0];
  const confirmedFeatureEn = getMatchingItem(
    en.server.items,
    confirmedFeature.id,
  );
  const pendingFeature = ja.server.items[2];
  const pendingFeatureEn = getMatchingItem(en.server.items, pendingFeature.id);

  return (
    <section
      aria-labelledby="hero-title"
      className="hero-atmosphere relative flex min-h-[min(46rem,calc(100svh-4.75rem))] items-center overflow-hidden border-b border-[var(--border)] py-16 sm:py-20 lg:py-24"
      id="top"
    >
      <Container className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(19rem,0.8fr)] lg:gap-16">
        <Reveal>
          <p className="section-eyebrow">
            <LocalizedText ja={ja.hero.eyebrow} en={en.hero.eyebrow} />
          </p>
          <h1
            className="mt-5 max-w-4xl text-balance text-[clamp(2.7rem,8vw,5.75rem)] font-bold leading-[0.96] tracking-[-0.06em] text-[var(--text-primary)]"
            id="hero-title"
          >
            {ja.hero.title}
          </h1>
          <p className="mt-6 max-w-2xl text-balance text-xl font-semibold leading-8 tracking-[-0.025em] text-[var(--text-primary)] sm:text-2xl">
            <LocalizedText ja={ja.hero.subtitle} en={en.hero.subtitle} />
          </p>
          <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-[var(--text-secondary)] sm:text-lg sm:leading-8">
            <LocalizedText ja={ja.hero.description} en={en.hero.description} />
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <LocalizedExternalAction
              action={{ ja: ja.hero.primaryAction, en: en.hero.primaryAction }}
              className="w-full sm:w-auto"
              common={{ ja: ja.common, en: en.common }}
              href={externalUrls.discord}
            />
            <LocalizedSectionAction
              action={{
                ja: ja.hero.secondaryAction,
                en: en.hero.secondaryAction,
              }}
              className="w-full sm:w-auto"
            />
          </div>
          {!externalUrls.discord ? (
            <p className="mt-3 max-w-xl text-xs leading-5 text-[var(--text-muted)]">
              <LocalizedText
                ja="Discord招待URLの設定後に参加ボタンが有効になります。"
                en="The join button will be enabled after the Discord invite URL is configured."
              />
            </p>
          ) : null}
        </Reveal>

        <Reveal className="relative" delay={0.12}>
          <div className="surface-card relative overflow-hidden p-5 sm:p-6">
            <div className="absolute inset-x-0 top-0 h-1 bg-[var(--accent)]" />
            <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] pb-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                  <LocalizedText
                    ja={ja.server.eyebrow}
                    en={en.server.eyebrow}
                  />
                </p>
                <p className="mt-1 text-lg font-bold tracking-[-0.025em]">
                  JHS / Japan
                </p>
              </div>
              <span className="grid size-10 place-items-center rounded-lg bg-[var(--surface-secondary)] text-[var(--accent-strong)]">
                <ShieldCheck aria-hidden="true" className="size-5" />
              </span>
            </div>

            <div className="grid gap-3 pt-5">
              <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-secondary)] p-4">
                <div className="flex items-start gap-3">
                  <ArrowRight
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-[var(--accent-strong)]"
                  />
                  <div>
                    <p className="font-bold">
                      <LocalizedText
                        ja={confirmedFeature.title}
                        en={confirmedFeatureEn.title}
                      />
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                      <LocalizedText
                        ja={confirmedFeature.description}
                        en={confirmedFeatureEn.description}
                      />
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-secondary)] p-4">
                <div className="flex items-start gap-3">
                  <Clock3
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-[var(--accent-strong)]"
                  />
                  <div>
                    <p className="font-bold">
                      <LocalizedText
                        ja={pendingFeature.title}
                        en={pendingFeatureEn.title}
                      />
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                      <LocalizedText
                        ja={pendingFeature.description}
                        en={pendingFeatureEn.description}
                      />
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <StatusBadge
              className="mt-5"
              en={en.common.statusLabels.pending}
              ja={ja.common.statusLabels.pending}
              status="pending"
            />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
