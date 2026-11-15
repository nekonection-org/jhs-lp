"use client";

import Image from "next/image";
import { Check, Copy, Gamepad2 } from "lucide-react";
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
import { externalUrls, rustConnection } from "@/lib/constants";

type CopyState = "idle" | "copied" | "error";

export function HeroSection() {
  const { locale } = useLanguage();
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
    <section
      aria-labelledby="hero-title"
      className="border-b border-[var(--border)] pt-8 sm:pt-16 lg:pt-20"
      id="top"
    >
      <Container>
        <Reveal>
          <p className="section-eyebrow">
            <LocalizedText ja={ja.hero.eyebrow} en={en.hero.eyebrow} />
          </p>
          <div className="mt-6 grid items-end gap-6 sm:gap-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:gap-14">
            <h1
              className="max-w-3xl text-[clamp(2.6rem,6.4vw,5.6rem)] leading-[1.03] font-semibold tracking-[-0.055em]"
              id="hero-title"
            >
              {ja.hero.title}
            </h1>
            <div className="max-w-lg pb-1">
              <p className="text-lg leading-8 font-semibold sm:text-xl">
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
                />
                <LocalizedSectionAction
                  action={{
                    ja: ja.hero.secondaryAction,
                    en: en.hero.secondaryAction,
                  }}
                />
              </div>
            </div>
          </div>
        </Reveal>
        <div
          aria-hidden="true"
          className="relative mt-6 h-32 sm:mt-10 overflow-hidden bg-[var(--surface)] sm:h-52 lg:mt-12 lg:h-64"
        >
          <Image
            alt=""
            className="object-cover object-[65%_55%] saturate-[0.65] sm:object-[center_55%]"
            fill
            priority
            sizes="(min-width: 1280px) 1200px, 100vw"
            src="/main-image.png"
          />
          <div className="absolute inset-0 bg-[var(--hero-overlay)]" />
        </div>
        <div className="grid gap-6 py-7 lg:grid-cols-3 lg:gap-12 lg:py-8">
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
              <code className="mt-2 block overflow-x-auto rounded-md border border-[var(--border)] bg-[var(--surface-secondary)] px-3 py-2.5 text-sm text-[var(--text-primary)]">
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
