"use client";

import { Newspaper, X } from "lucide-react";
import { useAnimate } from "motion/react";
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
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { motionTiming } from "@/lib/motion";

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
  const [dialogRef, animate] = useAnimate<HTMLDialogElement>();
  const animationRef = useRef<ReturnType<typeof animate> | null>(null);
  const closingRef = useRef(false);
  const reduceMotion = useReducedMotion();
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pageScrollRef = useRef({ left: 0, top: 0 });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (reduceMotion) animationRef.current?.complete();
  }, [reduceMotion]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    const gutter = window.innerWidth - document.documentElement.clientWidth;
    const stableGutter = getComputedStyle(document.documentElement)
      .getPropertyValue("scrollbar-gutter")
      .includes("stable");
    if (gutter > 0 && !stableGutter) {
      const padding =
        parseFloat(getComputedStyle(document.body).paddingRight) || 0;
      document.body.style.paddingRight = `${padding + gutter}px`;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
      const root = document.documentElement;
      const previousScrollBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      window.scrollTo(pageScrollRef.current.left, pageScrollRef.current.top);
      root.style.scrollBehavior = previousScrollBehavior;
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
    closingRef.current = false;
    pageScrollRef.current = { left: window.scrollX, top: window.scrollY };
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    dialog.dataset.closing = "false";
    dialog.showModal();
    animationRef.current = animate(
      dialog,
      { opacity: [0, 1] },
      {
        ...motionTiming.menu,
        duration: reduceMotion ? 0 : motionTiming.menu.duration,
      },
    );
    setOpen(true);
    document.getElementById(titleId)?.focus({ preventScroll: true });
  }

  async function closeNews() {
    const dialog = dialogRef.current;
    if (!dialog?.open || closingRef.current) return;
    closingRef.current = true;
    dialog.dataset.closing = "true";
    animationRef.current = animate(
      dialog,
      { opacity: 0 },
      {
        ...motionTiming.interaction,
        duration: reduceMotion ? 0 : motionTiming.interaction.duration,
      },
    );
    await animationRef.current;
    if (dialog.isConnected && dialog.open) dialog.close();
  }

  function handleClose() {
    if (dialogRef.current?.open) return;
    closingRef.current = false;
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
          void closeNews();
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
                onClick={() => {
                  void closeNews();
                }}
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
