"use client";

import Image from "next/image";
import { Check, Copy, Gamepad2, ArrowDown } from "lucide-react";
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
import { formatRaidHour, raidWindows } from "@/content/server";
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

    if (copyResetTimer.current !== null) {
      window.clearTimeout(copyResetTimer.current);
      copyResetTimer.current = null;
    }

    try {
      await navigator.clipboard.writeText(rustConnection.command);
      setCopyState("copied");
    } catch {
      setCopyState("error");
      return;
    }

    copyResetTimer.current = window.setTimeout(() => {
      setCopyState("idle");
    }, 2_000);
  }

  return (
    <section aria-labelledby="hero-title" className="hero-section" id="top">
      <Container>
        <Reveal className="hero-layout">
          <div className="hero-masthead" data-reveal-item>
            <p className="hero-brand">
              <span aria-hidden="true" />
              <LocalizedText ja={ja.hero.eyebrow} en={en.hero.eyebrow} />
            </p>
            <p className="hero-edition">{ja.hero.title}</p>
          </div>
          <h1 className="hero-headline" id="hero-title">
            <span className="hero-wordmark-first" data-reveal-item>
              {ja.hero.wordmark[0]}
            </span>{" "}
            <span className="hero-wordmark-last" data-reveal-item>
              {ja.hero.wordmark[1]}
              <span className="hero-wordmark-dot" aria-hidden="true">
                .
              </span>
            </span>
          </h1>
          <div className="hero-introduction">
            <p className="hero-tagline" data-reveal-item>
              <LocalizedText
                ja={ja.hero.headline.join(" ")}
                en={en.hero.headline.join(" ")}
              />
            </p>
            <div className="hero-details">
              <p className="hero-description" data-reveal-item>
                <LocalizedText
                  ja={ja.hero.description}
                  en={en.hero.description}
                />
              </p>
              <div className="hero-actions" id="hero-actions" data-reveal-item>
                <LocalizedExternalAction
                  action={{
                    ja: ja.hero.primaryAction,
                    en: en.hero.primaryAction,
                  }}
                  common={{ ja: ja.common, en: en.common }}
                  href={externalUrls.discord}
                  className="min-h-12 px-4 sm:px-5"
                />
                <LocalizedSectionAction
                  action={{
                    ja: ja.hero.secondaryAction,
                    en: en.hero.secondaryAction,
                  }}
                  className="min-h-12 px-4 sm:px-5"
                  variant="secondary"
                />
              </div>
            </div>
          </div>
        </Reveal>
        <Reveal className="hero-visual">
          <div className="hero-cover">
            <div className="hero-media">
              <Image
                alt=""
                className="hero-cover-image object-cover object-[65%_center] lg:object-[center_45%]"
                fill
                priority
                sizes="(min-width: 1200px) 1136px, (min-width: 640px) calc(100vw - 64px), calc(100vw - 40px)"
                src="/main-image.png"
              />
              <div className="hero-scrim" aria-hidden="true" />
              <div className="hero-image-content">
                <a className="hero-explore" href="#server">
                  <LocalizedText ja={ja.server.title} en={en.server.title} />
                  <ArrowDown aria-hidden="true" className="size-4" />
                </a>
                <div className="hero-raid-reference">
                  <p className="hero-window-heading">
                    <LocalizedText
                      ja={ja.server.schedule.allowed}
                      en={en.server.schedule.allowed}
                    />
                    <span>JST</span>
                  </p>
                  <dl className="hero-window-times">
                    {Object.entries(raidWindows).map(([day, window]) => (
                      <div key={day}>
                        <dt>
                          <LocalizedText
                            ja={
                              day === "weekdays"
                                ? ja.server.schedule.weekdays
                                : ja.server.schedule.weekends
                            }
                            en={
                              day === "weekdays"
                                ? en.server.schedule.weekdays
                                : en.server.schedule.weekends
                            }
                          />
                        </dt>
                        <dd>
                          <span>{formatRaidHour(window.start)}</span>
                          <span className="hero-window-dash" aria-hidden="true">
                            —
                          </span>
                          <span>{formatRaidHour(window.end)}</span>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
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
            <div className="connection-controls">
              <p className="text-xs font-bold tracking-[0.08em] text-[var(--text-muted)] uppercase">
                <LocalizedText
                  ja={ja.hero.connection.commandLabel}
                  en={en.hero.connection.commandLabel}
                />
              </p>
              <code className="connection-command" data-copy-state={copyState}>
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
              {copyState === "error" ? (
                <p
                  className="mt-3 text-xs leading-6 text-[var(--text-secondary)]"
                  role="alert"
                >
                  <LocalizedText
                    ja={ja.hero.connection.copyErrorHelp}
                    en={en.hero.connection.copyErrorHelp}
                  />
                </p>
              ) : null}
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
