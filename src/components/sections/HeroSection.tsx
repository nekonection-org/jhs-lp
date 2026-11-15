"use client";

import Image from "next/image";
import { Check, Copy, Gamepad2, ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useLanguage } from "@/components/providers/LanguageProvider";
import {
  LocalizedExternalAction,
  LocalizedSectionAction,
} from "@/components/ui/ActionLink";
import { Container } from "@/components/ui/Container";
import { Button, buttonStyles } from "@/components/ui/Button";
import { LocalizedText } from "@/components/ui/LocalizedText";
import { Reveal } from "@/components/ui/Reveal";
import { en, ja } from "@/content";
import { getMatchingItem } from "@/lib/content";
import { externalUrls, rustConnection } from "@/lib/constants";

type CopyState = "idle" | "copied" | "error";

export function HeroSection() {
  const { locale } = useLanguage();
  const featuredSettings = [
    "team-limit",
    "map-bp-wipe",
    "weekday-raids",
  ] as const;
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const copyResetTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (copyResetTimer.current !== null) {
        window.clearTimeout(copyResetTimer.current);
      }
    },
    [],
  );

  async function copyConnectionCommand() {
    if (!rustConnection) return;

    try {
      await navigator.clipboard.writeText(rustConnection.command);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }

    if (copyResetTimer.current !== null) {
      window.clearTimeout(copyResetTimer.current);
    }

    copyResetTimer.current = window.setTimeout(() => {
      setCopyState("idle");
    }, 2_000);
  }

  return (
    <section aria-labelledby="hero-title" className="hero-section" id="top">
      <Container>
        <div className="hero-masthead">
          <p className="hero-brand">
            <span aria-hidden="true" />
            {ja.hero.title}
          </p>
          <a href="#server" className="hero-audience">
            <LocalizedText
              ja={ja.server.highlights[0].title}
              en={en.server.highlights[0].title}
            />
            <ArrowUpRight aria-hidden="true" className="size-3.5" />
          </a>
        </div>
        <div className="hero-layout">
          <Reveal className="hero-copy">
            <h1 className="hero-headline" id="hero-title">
              <span className="block">
                <LocalizedText
                  ja={ja.hero.headline[0]}
                  en={en.hero.headline[0]}
                />
              </span>{" "}
              <span className="block">
                <LocalizedText
                  ja={ja.hero.headline[1]}
                  en={en.hero.headline[1]}
                />
              </span>
            </h1>
          </Reveal>
          <Reveal className="hero-introduction">
            <p className="text-base font-semibold leading-8 sm:text-lg">
              <LocalizedText ja={ja.hero.subtitle} en={en.hero.subtitle} />
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
              <LocalizedText
                ja={ja.hero.description}
                en={en.hero.description}
              />
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <LocalizedExternalAction
                action={{
                  ja: ja.hero.primaryAction,
                  en: en.hero.primaryAction,
                }}
                common={{ ja: ja.common, en: en.common }}
                href={externalUrls.discord}
                className="min-h-12 px-6"
              />
              <LocalizedSectionAction
                action={{
                  ja: ja.hero.secondaryAction,
                  en: en.hero.secondaryAction,
                }}
                className="min-h-12 px-6"
              />
            </div>
          </Reveal>
        </div>
        <div className="hero-preview">
          <figure className="hero-figure">
            <div className="hero-image">
              <Image
                alt=""
                className="object-cover object-[72%_52%] sm:object-[center_36%]"
                fill
                priority
                sizes="(min-width: 1280px) 1200px, 100vw"
                src="/main-image.png"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[var(--hero-overlay)]"
              />
            </div>
            <figcaption className="hero-image-caption">
              <span className="text-[0.625rem] font-semibold tracking-[0.03em] whitespace-nowrap sm:text-xs">
                {ja.hero.title}
              </span>
              <span className="text-right text-[0.625rem] font-medium tracking-[0.08em] whitespace-nowrap uppercase">
                <LocalizedText ja={ja.hero.eyebrow} en={en.hero.eyebrow} />
              </span>
            </figcaption>
          </figure>
          <dl className="hero-facts">
            {featuredSettings.map((id) => {
              const setting = getMatchingItem(ja.server.settings, id);
              const english = getMatchingItem(en.server.settings, id);
              return (
                <div key={id}>
                  <dt className="text-xs font-medium text-[var(--text-muted)]">
                    <LocalizedText ja={setting.label} en={english.label} />
                  </dt>
                  <dd className="mt-2 text-sm font-semibold leading-6 sm:text-base">
                    <LocalizedText ja={setting.value} en={english.value} />
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
        <div className="connection-strip">
          <div>
            <h2 className="text-base font-semibold">
              <LocalizedText
                ja={ja.hero.connection.title}
                en={en.hero.connection.title}
              />
            </h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-[var(--text-secondary)]">
              <LocalizedText
                ja={ja.hero.connection.description}
                en={en.hero.connection.description}
              />
            </p>
          </div>
          {rustConnection ? (
            <div className="min-w-0 lg:col-span-2">
              <p className="text-xs font-bold tracking-[0.08em] text-[var(--text-muted)] uppercase">
                <LocalizedText
                  ja={ja.hero.connection.commandLabel}
                  en={en.hero.connection.commandLabel}
                />
              </p>
              <code className="connection-command">
                {rustConnection.command}
              </code>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <Button
                  aria-live="polite"
                  className="w-full sm:w-auto"
                  onClick={copyConnectionCommand}
                  size="compact"
                  variant="secondary"
                >
                  {copyState === "copied" ? (
                    <Check aria-hidden="true" className="size-4" />
                  ) : (
                    <Copy aria-hidden="true" className="size-4" />
                  )}
                  <LocalizedText
                    ja={
                      copyState === "copied"
                        ? ja.hero.connection.copiedLabel
                        : copyState === "error"
                          ? ja.hero.connection.copyErrorLabel
                          : ja.hero.connection.copyLabel
                    }
                    en={
                      copyState === "copied"
                        ? en.hero.connection.copiedLabel
                        : copyState === "error"
                          ? en.hero.connection.copyErrorLabel
                          : en.hero.connection.copyLabel
                    }
                  />
                </Button>
                <a
                  aria-label={
                    locale === "ja"
                      ? ja.hero.connection.steamAriaLabel
                      : en.hero.connection.steamAriaLabel
                  }
                  className={buttonStyles({
                    className: "w-full sm:w-auto",
                    variant: "secondary",
                    size: "compact",
                  })}
                  href={rustConnection.steamUrl}
                >
                  <Gamepad2 aria-hidden="true" className="size-4" />
                  <LocalizedText
                    ja={ja.hero.connection.steamLabel}
                    en={en.hero.connection.steamLabel}
                  />
                </a>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-xs leading-5 text-[var(--text-muted)]">
              <LocalizedText
                ja={ja.hero.connection.unavailable}
                en={en.hero.connection.unavailable}
              />
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
