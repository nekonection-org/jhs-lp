"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import { useReducedMotion } from "@/hooks/useReducedMotion";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { LocalizedExternalAction } from "@/components/ui/ActionLink";
import { en, ja } from "@/content";
import { externalUrls } from "@/lib/constants";

export function MobileJoinBar() {
  const { locale } = useLanguage();
  const reduceMotion = useReducedMotion();
  const [heroPassed, setHeroPassed] = useState(false);
  const [finalReached, setFinalReached] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const hero = document.getElementById("hero-actions");
    const final = document.querySelector(".join-section");
    if (!hero || !final) return;

    const observer = new IntersectionObserver(
      () => {
        setHeroPassed(hero.getBoundingClientRect().bottom <= 76);
        setFinalReached(final.getBoundingClientRect().top < window.innerHeight);
      },
      { rootMargin: "-76px 0px 0px 0px", threshold: 0 },
    );
    observer.observe(hero);
    // Section transitions also cover anchor jumps that skip the final CTA.
    document
      .querySelectorAll("main > section")
      .forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <AnimatePresence initial={false}>
      {heroPassed && !finalReached ? (
        <motion.aside
          aria-label={
            locale === "ja"
              ? ja.hero.primaryAction.label
              : en.hero.primaryAction.label
          }
          className="mobile-join-bar xl:hidden"
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: 8 }}
          transition={{ duration: reduceMotion ? 0 : 0.18 }}
        >
          <span className="text-xs font-semibold leading-5">
            Japan Hideaway
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
