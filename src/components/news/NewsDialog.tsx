"use client";

import { Newspaper, X } from "lucide-react";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { Button } from "@/components/ui/Button";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { LocalizedText } from "@/components/ui/LocalizedText";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { en, getContent, ja } from "@/content";

interface NewsDialogProps {
  href: string;
  titleId: string;
  trigger: ReactNode;
  children: ReactNode;
}

export function NewsDialog({
  href,
  titleId,
  trigger,
  children,
}: NewsDialogProps) {
  const { locale } = useLanguage();
  const content = getContent(locale);
  const dialogId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pageScrollRef = useRef({ left: 0, top: 0 });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const previousGutter = document.documentElement.style.scrollbarGutter;
    document.documentElement.style.scrollbarGutter = "stable";
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.scrollbarGutter = previousGutter;
      window.scrollTo({ ...pageScrollRef.current, behavior: "instant" });
    };
  }, [open]);

  function openNews(event: MouseEvent<HTMLAnchorElement>) {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    const dialog = dialogRef.current;
    // Keep a normal article link available without JavaScript or dialog support.
    if (!dialog || typeof dialog.showModal !== "function") return;
    event.preventDefault();
    if (dialog.open) return;
    pageScrollRef.current = { left: window.scrollX, top: window.scrollY };
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    dialog.showModal();
    setOpen(true);
    document.getElementById(titleId)?.focus({ preventScroll: true });
  }

  function closeNews() {
    dialogRef.current?.close();
  }

  function handleClose() {
    setOpen(false);
    triggerRef.current?.focus({ preventScroll: true });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab") return;
    const controls = [
      ...event.currentTarget.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ].filter((element) => element.getClientRects().length > 0);
    const first = controls[0];
    const last = controls.at(-1);
    const focused = document.activeElement;
    if (!first || !last) {
      event.preventDefault();
      return;
    }
    if (
      !controls.some((element) => element === focused) ||
      (event.shiftKey && focused === first) ||
      (!event.shiftKey && focused === last)
    ) {
      event.preventDefault();
      (event.shiftKey ? last : first).focus();
    }
  }

  return (
    <>
      <a
        aria-controls={dialogId}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="news-summary"
        href={href}
        onClick={openNews}
        ref={triggerRef}
      >
        {trigger}
      </a>
      <dialog
        aria-labelledby={titleId}
        className="news-dialog"
        id={dialogId}
        onCancel={(event) => {
          event.preventDefault();
          closeNews();
        }}
        onClose={handleClose}
        onKeyDown={handleKeyDown}
        ref={dialogRef}
      >
        <div className="news-dialog-panel">
          <div className="news-dialog-bar">
            <div className="news-dialog-label">
              <Newspaper aria-hidden="true" className="size-5 shrink-0" />
              <LocalizedText ja={ja.news.title} en={en.news.title} />
            </div>
            <div className="news-dialog-controls">
              <LanguageToggle compact content={content.language} />
              <ThemeToggle content={content.theme} />
              <Button
                aria-label={content.news.closeLabel}
                className="size-11 shrink-0 px-0"
                onClick={closeNews}
                variant="quiet"
              >
                <X aria-hidden="true" className="size-5" />
              </Button>
            </div>
          </div>
          <div className="news-dialog-scroll" ref={scrollRef}>
            {children}
          </div>
        </div>
      </dialog>
    </>
  );
}
