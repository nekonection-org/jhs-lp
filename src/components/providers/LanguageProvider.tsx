"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";

import { getContent } from "@/content";
import { locales, type Locale } from "@/content/types";

const storageKey = "jhs-locale";

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

function getServerLocaleSnapshot(): Locale {
  return "ja";
}

function createLocaleStore() {
  let currentLocale: Locale | null = null;
  const listeners = new Set<() => void>();

  function notifyListeners() {
    for (const listener of listeners) {
      listener();
    }
  }

  return {
    getSnapshot(): Locale {
      if (currentLocale === null) {
        try {
          const storedLocale = window.localStorage.getItem(storageKey);
          currentLocale = isLocale(storedLocale) ? storedLocale : "ja";
        } catch {
          currentLocale = "ja";
        }
      }

      return currentLocale;
    },
    subscribe(onStoreChange: () => void) {
      function handleStorage(event: StorageEvent) {
        if (event.key === storageKey || event.key === null) {
          currentLocale = isLocale(event.newValue) ? event.newValue : "ja";
          notifyListeners();
        }
      }

      listeners.add(onStoreChange);
      window.addEventListener("storage", handleStorage);

      return () => {
        listeners.delete(onStoreChange);
        window.removeEventListener("storage", handleStorage);
      };
    },
    setLocale(nextLocale: Locale) {
      currentLocale = nextLocale;
      applyDocumentLocale(nextLocale);

      try {
        window.localStorage.setItem(storageKey, nextLocale);
      } catch {
        // The in-memory selection still works when persistence is unavailable.
      }

      notifyListeners();
    },
  };
}

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [store] = useState(createLocaleStore);
  const locale = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    getServerLocaleSnapshot,
  );

  useEffect(() => {
    applyDocumentLocale(locale);
    const expectedTitle = getContent(locale).metadata.title;

    function syncTitle() {
      if (document.title !== expectedTitle) {
        document.title = expectedTitle;
      }
    }

    syncTitle();

    const observer = new MutationObserver(syncTitle);
    observer.observe(document.head, {
      childList: true,
      characterData: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale: store.setLocale }}>
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
