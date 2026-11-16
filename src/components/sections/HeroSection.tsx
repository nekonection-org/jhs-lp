"use client";

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
import { HeroScrollScene } from "@/components/ui/HeroScrollScene";
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
        <HeroScrollScene>
          <Reveal className="hero-layout" sequence="hero">
            <p className="hero-brand" data-reveal-item>
              {ja.hero.title}
            </p>
            <h1 className="hero-headline" id="hero-title">
              {(["ja", "en"] as const).map((language) => (
                <span data-locale-content={language} key={language}>
                  {(language === "ja" ? ja : en).hero.headline.map((line) => (
                    <span
                      className="hero-headline-line"
                      key={line}
                      data-reveal-item
                      data-reveal-kind="heading"
                    >
                      {line}{" "}
                    </span>
                  ))}
                </span>
              ))}
            </h1>
            <div className="hero-introduction">
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
                />
                <LocalizedSectionAction
                  action={{
                    ja: ja.hero.secondaryAction,
                    en: en.hero.secondaryAction,
                  }}
                  variant="secondary"
                />
              </div>
            </div>
          </Reveal>
        </HeroScrollScene>
        <div className="hero-utilities">
          <section
            className="connection-guide"
            aria-labelledby="connection-title"
          >
            <div className="connection-strip">
              <div>
                <h2 className="text-xl font-semibold" id="connection-title">
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
                  <code
                    className="connection-command"
                    data-copy-state={copyState}
                  >
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
          </section>
          <a className="hero-explore" href="#server">
            <LocalizedText ja={ja.server.title} en={en.server.title} />
            <ArrowDown aria-hidden="true" className="size-4" />
          </a>
        </div>
      </Container>
    </section>
  );
}
