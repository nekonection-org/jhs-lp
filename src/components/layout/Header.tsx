"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useReducedMotion } from "@/hooks/useReducedMotion";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { LocalizedExternalAction } from "@/components/ui/ActionLink";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { getContent, navigationItemIds } from "@/content";
import { useActiveSection } from "@/hooks/useActiveSection";
import { cn } from "@/lib/cn";
import { externalUrls } from "@/lib/constants";
import { motionTiming } from "@/lib/motion";

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

interface HeaderProps {
  homePath?: "" | "/";
}

export function Header({ homePath = "" }: HeaderProps) {
  const { locale } = useLanguage();
  const content = getContent(locale);
  const japaneseContent = getContent("ja");
  const englishContent = getContent("en");
  const activeSection = useActiveSection(navigationItemIds);
  const reduceMotion = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 1280px)");

    function handleDesktopChange(event: MediaQueryListEvent) {
      if (!event.matches) {
        return;
      }

      const focusWasInsideMenu = mobileMenuRef.current?.contains(
        document.activeElement,
      );

      setMenuOpen(false);

      if (focusWasInsideMenu) {
        document
          .querySelector<HTMLElement>(`header a[href="${homePath}#top"]`)
          ?.focus();
      }
    }

    desktopQuery.addEventListener("change", handleDesktopChange);

    return () => {
      desktopQuery.removeEventListener("change", handleDesktopChange);
    };
  }, [homePath]);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const menu = mobileMenuRef.current;
    const previousOverflow = document.body.style.overflow;
    const firstFocusable = menu?.querySelector<HTMLElement>(focusableSelector);

    document.body.style.overflow = "hidden";
    firstFocusable?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (event.key !== "Tab" || !menu) {
        return;
      }

      const focusable = [
        ...menu.querySelectorAll<HTMLElement>(focusableSelector),
      ];
      const first = focusable.at(0);
      const last = focusable.at(-1);

      if (!first || !last) {
        return;
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  function closeMenu(sectionId: string) {
    setMenuOpen(false);
    const heading = document.getElementById(sectionId)?.querySelector("h2");
    if (heading) {
      heading.tabIndex = -1;
      // Let native anchor navigation finish before placing keyboard focus.
      window.requestAnimationFrame(() =>
        heading.focus({ preventScroll: true }),
      );
    }
  }

  return (
    <header
      data-menu-open={menuOpen}
      className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--header)] backdrop-blur-sm"
    >
      <Container className="flex min-h-[4.75rem] max-w-none items-center gap-3 xl:px-10">
        <a
          className="group mr-auto inline-flex min-h-11 items-center gap-3 rounded-lg pr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]"
          href={`${homePath}#top`}
        >
          <span className="relative size-9 overflow-hidden rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] transition-colors duration-200 group-hover:border-[var(--accent)]">
            <Image
              alt=""
              className="object-cover"
              fill
              sizes="36px"
              src="/icon.png"
            />
          </span>
          <span className="flex flex-col">
            <span className="text-sm font-bold leading-tight tracking-[-0.025em] sm:text-[0.95rem]">
              Japan Hideaway
            </span>
            <span className="text-[0.64rem] font-semibold uppercase leading-tight tracking-[0.14em] text-[var(--text-muted)]">
              Rust Server
            </span>
          </span>
        </a>

        <nav
          aria-label={content.navigation.ariaLabel}
          className="ml-auto hidden items-center gap-0.5 xl:flex"
        >
          {content.navigation.items.map((item) => (
            <a
              aria-current={activeSection === item.id ? "location" : undefined}
              className={cn(
                "header-navigation-link relative rounded-md px-2 py-2 text-[0.8125rem] font-medium whitespace-nowrap text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]",
                activeSection === item.id && "text-[var(--accent-strong)]",
              )}
              href={`${homePath}#${item.id}`}
              key={item.id}
            >
              {item.label}
              {activeSection === item.id ? (
                <motion.span
                  className="absolute inset-x-2 bottom-0 h-px bg-[var(--accent)]"
                  layoutId="active-navigation"
                  transition={{
                    ...motionTiming.interaction,
                    duration: reduceMotion
                      ? 0
                      : motionTiming.interaction.duration,
                  }}
                />
              ) : null}
            </a>
          ))}
        </nav>

        <div className="ml-2 hidden items-center gap-1.5 border-l border-[var(--border)] pl-4 xl:flex">
          <LanguageToggle content={content.language} />
          <ThemeToggle content={content.theme} />
          <LocalizedExternalAction
            action={{
              ja: japaneseContent.navigation.discordAction,
              en: englishContent.navigation.discordAction,
            }}
            className="ml-1"
            common={{ ja: japaneseContent.common, en: englishContent.common }}
            href={externalUrls.discord}
            size="compact"
          />
        </div>

        <Button
          aria-controls="mobile-navigation"
          aria-expanded={menuOpen}
          aria-label={
            menuOpen
              ? content.navigation.closeMenu
              : content.navigation.openMenu
          }
          className="size-11 shrink-0 px-0 xl:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          ref={menuButtonRef}
          variant="quiet"
        >
          {menuOpen ? (
            <X aria-hidden="true" className="size-5" />
          ) : (
            <Menu aria-hidden="true" className="size-5" />
          )}
        </Button>
      </Container>

      <AnimatePresence initial={false}>
        {menuOpen ? (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="absolute inset-x-0 top-full h-[calc(100dvh-4.75rem)] border-t border-[var(--border)] bg-[var(--background)] xl:hidden"
            exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
            initial={reduceMotion ? false : { opacity: 0, y: -6 }}
            ref={mobileMenuRef}
            transition={{
              ...motionTiming.menu,
              duration: reduceMotion ? 0 : motionTiming.menu.duration,
            }}
          >
            <Container className="flex h-full flex-col overflow-y-auto py-6">
              <nav
                aria-label={content.navigation.mobileMenuLabel}
                id="mobile-navigation"
              >
                <ul className="grid gap-1">
                  {content.navigation.items.map((item) => (
                    <li key={item.id}>
                      <a
                        aria-current={
                          activeSection === item.id ? "location" : undefined
                        }
                        className={cn(
                          "flex min-h-12 items-center justify-between rounded-lg border border-transparent px-3 py-2.5 text-base font-semibold text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]",
                          activeSection === item.id &&
                            "border-[var(--border)] bg-[var(--surface)] text-[var(--accent-strong)]",
                        )}
                        href={`${homePath}#${item.id}`}
                        onClick={() => closeMenu(item.id)}
                      >
                        {item.label}
                        <span
                          aria-hidden="true"
                          className="text-sm text-[var(--text-muted)]"
                        >
                          #{item.id}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="mt-auto grid gap-4 border-t border-[var(--border)] pt-6">
                <div className="grid grid-cols-2 gap-3">
                  <LanguageToggle compact content={content.language} />
                  <ThemeToggle content={content.theme} showLabel />
                </div>
                <LocalizedExternalAction
                  action={{
                    ja: japaneseContent.navigation.discordAction,
                    en: englishContent.navigation.discordAction,
                  }}
                  className="w-full"
                  common={{
                    ja: japaneseContent.common,
                    en: englishContent.common,
                  }}
                  href={externalUrls.discord}
                />
              </div>
            </Container>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
