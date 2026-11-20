"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import { useReducedMotion } from "@/hooks/useReducedMotion";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { LocalizedExternalAction } from "@/components/ui/ActionLink";
import { en, ja } from "@/content";
import { externalUrls } from "@/lib/constants";
import { motionTiming } from "@/lib/motion";

export function MobileJoinBar() {
  const { locale } = useLanguage();
  const reduceMotion = useReducedMotion();
  const [heroPassed, setHeroPassed] = useState(false);
  const [footerReached, setFooterReached] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const hero = document.getElementById("hero-actions");
    const footer = document.querySelector("footer");
    if (!hero || !footer) return;

    const observer = new IntersectionObserver(
      () => {
        setHeroPassed(hero.getBoundingClientRect().bottom <= 76);
        setFooterReached(
          footer.getBoundingClientRect().top < window.innerHeight,
        );
      },
      { rootMargin: "-76px 0px 0px 0px", threshold: 0 },
    );
    observer.observe(hero);
    observer.observe(footer);
    // Section transitions also cover anchor jumps to and from the footer.
    document
      .querySelectorAll("main > section")
      .forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <AnimatePresence initial={false}>
      {heroPassed && !footerReached ? (
        <motion.aside
          aria-label={
            locale === "ja"
              ? ja.hero.primaryAction.label
              : en.hero.primaryAction.label
          }
          className="mobile-join-bar xl:hidden"
          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: 6 }}
          transition={{
            ...motionTiming.interaction,
            duration: reduceMotion ? 0 : motionTiming.interaction.duration,
          }}
        >
          <span className="text-xs font-semibold leading-5">
            {ja.common.siteName}
            <span className="block text-[0.625rem] font-medium tracking-widest text-[var(--text-muted)] uppercase">
              Rust Server
            </span>
          </span>
          <LocalizedExternalAction
            action={{ ja: ja.hero.primaryAction, en: en.hero.primaryAction }}
            common={{ ja: ja.common, en: en.common }}
            href={externalUrls.discord}
            size="compact"
          />
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
