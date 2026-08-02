"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { ArrowRight, Clock3, ShieldCheck } from "lucide-react";

import {
  LocalizedExternalAction,
  LocalizedSectionAction,
} from "@/components/ui/ActionLink";
import { Container } from "@/components/ui/Container";
import { LocalizedText } from "@/components/ui/LocalizedText";
import { Reveal } from "@/components/ui/Reveal";
import { en, ja } from "@/content";
import { getMatchingItem } from "@/lib/content";
import { externalUrls } from "@/lib/constants";

export function HeroSection() {
  const reduceMotion = useReducedMotion();
  const audienceFeature = ja.server.items[0];
  const audienceFeatureEn = getMatchingItem(
    en.server.items,
    audienceFeature.id,
  );
  const raidFeature = ja.server.items[2];
  const raidFeatureEn = getMatchingItem(en.server.items, raidFeature.id);

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[min(48rem,calc(100svh-4.75rem))] items-center overflow-hidden border-b border-[var(--border)] py-16 sm:py-20 lg:py-24"
      id="top"
    >
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        aria-hidden="true"
        className="absolute inset-0 -z-30"
        initial={reduceMotion ? false : { opacity: 0.55, scale: 1.035 }}
        transition={{ duration: reduceMotion ? 0 : 0.7, ease: "easeOut" }}
      >
        <Image
          alt=""
          className="object-cover object-[62%_center] saturate-[0.72] sm:object-[68%_center] lg:object-[78%_center]"
          fill
          priority
          sizes="100vw"
          src="/main-image.png"
        />
      </motion.div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,var(--background)_0%,color-mix(in_srgb,var(--background)_94%,transparent)_42%,color-mix(in_srgb,var(--background)_58%,transparent)_72%,color-mix(in_srgb,var(--background)_28%,transparent)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--background)_18%,transparent),transparent_42%,var(--background)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-25 [background-image:linear-gradient(color-mix(in_srgb,var(--border)_45%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_srgb,var(--border)_45%,transparent)_1px,transparent_1px)] [background-size:4.5rem_4.5rem] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]"
      />
      <motion.div
        animate={reduceMotion ? undefined : { opacity: 0.42, scale: 1 }}
        aria-hidden="true"
        className="absolute top-[18%] right-[8%] -z-10 size-72 rounded-full bg-[color-mix(in_srgb,var(--accent)_16%,transparent)] blur-3xl sm:size-96"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.88 }}
        transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
      />

      <Container className="relative grid items-center gap-12 lg:grid-cols-[minmax(0,1.16fr)_minmax(19rem,0.84fr)] lg:gap-16">
        <Reveal>
          <p className="section-eyebrow">
            <LocalizedText ja={ja.hero.eyebrow} en={en.hero.eyebrow} />
          </p>
          <h1
            className="mt-5 max-w-4xl text-balance text-[clamp(2.7rem,8vw,5.75rem)] leading-[0.96] font-bold tracking-[-0.06em] text-[var(--text-primary)] [text-shadow:0_2px_30px_color-mix(in_srgb,var(--background)_75%,transparent)]"
            id="hero-title"
          >
            {ja.hero.title}
          </h1>
          <p className="mt-6 max-w-2xl text-balance text-xl leading-8 font-semibold tracking-[-0.025em] text-[var(--text-primary)] sm:text-2xl">
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
          <div className="relative overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--accent)_34%,var(--border))] bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] p-5 shadow-[0_24px_80px_color-mix(in_srgb,var(--background)_55%,transparent)] backdrop-blur-md sm:p-6">
            <motion.span
              animate={{ scaleX: 1 }}
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1 origin-left bg-[var(--accent)]"
              initial={reduceMotion ? false : { scaleX: 0 }}
              transition={{ delay: 0.25, duration: reduceMotion ? 0 : 0.55 }}
            />
            <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] pb-5">
              <div className="flex items-center gap-3">
                <span className="relative size-12 overflow-hidden rounded-lg border border-[var(--border-strong)] bg-[var(--surface-secondary)]">
                  <Image
                    alt=""
                    className="object-cover"
                    fill
                    sizes="48px"
                    src="/icon.png"
                  />
                </span>
                <div>
                  <p className="text-xs font-bold tracking-[0.14em] text-[var(--text-muted)] uppercase">
                    <LocalizedText
                      ja={ja.server.eyebrow}
                      en={en.server.eyebrow}
                    />
                  </p>
                  <p className="mt-1 text-lg font-bold tracking-[-0.025em]">
                    JHS / Japan
                  </p>
                </div>
              </div>
              <span className="grid size-10 place-items-center rounded-lg bg-[color-mix(in_srgb,var(--accent)_12%,var(--surface-secondary))] text-[var(--accent-strong)]">
                <ShieldCheck aria-hidden="true" className="size-5" />
              </span>
            </div>

            <div className="grid gap-3 pt-5">
              <div className="group rounded-lg border border-[var(--border)] bg-[var(--surface-secondary)] p-4 transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--accent)_42%,var(--border))]">
                <div className="flex items-start gap-3">
                  <ArrowRight
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-[var(--accent-strong)] transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                  <div>
                    <p className="font-bold">
                      <LocalizedText
                        ja={audienceFeature.title}
                        en={audienceFeatureEn.title}
                      />
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                      <LocalizedText
                        ja={audienceFeature.description}
                        en={audienceFeatureEn.description}
                      />
                    </p>
                  </div>
                </div>
              </div>
              <div className="group rounded-lg border border-[var(--border)] bg-[var(--surface-secondary)] p-4 transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--accent)_42%,var(--border))]">
                <div className="flex items-start gap-3">
                  <Clock3
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-[var(--accent-strong)] transition-transform duration-200 group-hover:rotate-6"
                  />
                  <div>
                    <p className="font-bold">
                      <LocalizedText
                        ja={raidFeature.title}
                        en={raidFeatureEn.title}
                      />
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                      <LocalizedText
                        ja={raidFeature.description}
                        en={raidFeatureEn.description}
                      />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
