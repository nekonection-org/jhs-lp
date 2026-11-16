"use client";

import { useEffect } from "react";

import { useLanguage } from "@/components/providers/LanguageProvider";

export function LocalizedPageTitle({ ja, en }: { ja: string; en: string }) {
  const { locale } = useLanguage();
  const title = locale === "ja" ? ja : en;

  useEffect(() => {
    function syncTitle() {
      if (document.title !== title) document.title = title;
    }

    syncTitle();
    const observer = new MutationObserver(syncTitle);
    observer.observe(document.head, {
      childList: true,
      characterData: true,
      subtree: true,
    });
    return () => observer.disconnect();
  }, [title]);

  return null;
}
