"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";

import { getContent } from "@/content";
import { locales, type Locale } from "@/content/types";

const storageKey = "jhs-locale";
const localeChangeEvent = "jhs:locale-change";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function isLocale(value: string | null): value is Locale {
  return locales.some((locale) => locale === value);
}

function applyDocumentLocale(locale: Locale) {
  document.documentElement.lang = locale;
  document.documentElement.dataset.locale = locale;
}

function getLocaleSnapshot(): Locale {
  const storedLocale = window.localStorage.getItem(storageKey);
  return isLocale(storedLocale) ? storedLocale : "ja";
}

function getServerLocaleSnapshot(): Locale {
  return "ja";
}

function subscribeToLocale(onStoreChange: () => void) {
  function handleStorage(event: StorageEvent) {
    if (event.key === storageKey) {
      onStoreChange();
    }
  }

  window.addEventListener("storage", handleStorage);
  window.addEventListener(localeChangeEvent, onStoreChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(localeChangeEvent, onStoreChange);
  };
}

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const locale = useSyncExternalStore(
    subscribeToLocale,
    getLocaleSnapshot,
    getServerLocaleSnapshot,
  );

  useEffect(() => {
    applyDocumentLocale(locale);

    const frameId = window.requestAnimationFrame(() => {
      document.title = getContent(locale).metadata.title;
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [locale]);

  function setLocale(nextLocale: Locale) {
    applyDocumentLocale(nextLocale);
    window.localStorage.setItem(storageKey, nextLocale);
    window.dispatchEvent(new Event(localeChangeEvent));
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }

  return context;
}
