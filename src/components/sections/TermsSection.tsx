"use client";

import { FileText, X } from "lucide-react";
import { useEffect, useRef, useState, type MouseEvent } from "react";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { LocalizedText } from "@/components/ui/LocalizedText";
import { Reveal } from "@/components/ui/Reveal";
import { en, getContent, ja } from "@/content";
import { getMatchingItem } from "@/lib/content";

export function TermsSection() {
  const { locale } = useLanguage();
  const content = getContent(locale);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  function openTerms() {
    const dialog = dialogRef.current;

    if (!dialog || dialog.open) {
      return;
    }

    dialog.showModal();
    setOpen(true);
  }

  function closeTerms() {
    dialogRef.current?.close();
  }

  function handleClose() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) {
      closeTerms();
    }
  }

  return (
    <section
      aria-labelledby="terms-section-title"
      className="border-t border-[var(--border)] py-8 sm:py-10"
    >
      <Container>
        <Reveal>
          <div className="surface-card flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex max-w-3xl items-start gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-lg border border-[var(--border)] bg-[var(--surface-secondary)] text-[var(--accent-strong)]">
                <FileText aria-hidden="true" className="size-5" />
              </span>
              <div>
                <p className="section-eyebrow">
                  <LocalizedText ja={ja.terms.eyebrow} en={en.terms.eyebrow} />
                </p>
                <h2
                  className="mt-1 text-xl font-bold tracking-[-0.025em]"
                  id="terms-section-title"
                >
                  <LocalizedText ja={ja.terms.title} en={en.terms.title} />
                </h2>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                  <LocalizedText
                    ja={ja.terms.description}
                    en={en.terms.description}
                  />
                </p>
              </div>
            </div>
            <Button
              className="w-full shrink-0 sm:w-auto"
              onClick={openTerms}
              ref={triggerRef}
              variant="secondary"
            >
              <FileText aria-hidden="true" className="size-4" />
              <LocalizedText ja={ja.terms.openLabel} en={en.terms.openLabel} />
            </Button>
          </div>
        </Reveal>
      </Container>

      <dialog
        aria-describedby="terms-dialog-description"
        aria-labelledby="terms-dialog-title"
        className="m-auto max-h-[min(88dvh,56rem)] w-[min(calc(100%-2rem),58rem)] overflow-hidden rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] p-0 text-[var(--text-primary)] shadow-[0_28px_90px_rgba(0,0,0,0.55)] backdrop:bg-black/80 backdrop:backdrop-blur-sm"
        onClick={handleBackdropClick}
        onClose={handleClose}
        ref={dialogRef}
      >
        <div className="flex max-h-[min(88dvh,56rem)] flex-col">
          <header className="flex items-center justify-between gap-4 border-b border-[var(--border)] bg-[var(--surface)] px-5 py-4 sm:px-7">
            <div>
              <p className="text-xs font-bold tracking-[0.12em] text-[var(--accent-strong)] uppercase">
                <LocalizedText ja={ja.terms.eyebrow} en={en.terms.eyebrow} />
              </p>
              <h2
                className="mt-1 text-xl font-bold tracking-[-0.025em] sm:text-2xl"
                id="terms-dialog-title"
              >
                <LocalizedText
                  ja={ja.terms.dialogLabel}
                  en={en.terms.dialogLabel}
                />
              </h2>
            </div>
            <Button
              aria-label={content.terms.closeLabel}
              className="size-11 shrink-0 px-0"
              onClick={closeTerms}
              variant="quiet"
            >
              <X aria-hidden="true" className="size-5" />
            </Button>
          </header>

          <div className="overscroll-contain overflow-y-auto px-5 py-6 sm:px-7 sm:py-8">
            <div
              className="space-y-4 text-sm leading-7 text-[var(--text-secondary)] sm:text-base"
              id="terms-dialog-description"
            >
              {ja.terms.introduction.map((paragraph, index) => (
                <p key={paragraph}>
                  <LocalizedText
                    ja={paragraph}
                    en={en.terms.introduction[index] ?? ""}
                  />
                </p>
              ))}
            </div>

            <div className="mt-8 divide-y divide-[var(--border)] border-y border-[var(--border)]">
              {ja.terms.articles.map((article) => {
                const englishArticle = getMatchingItem(
                  en.terms.articles,
                  article.id,
                );

                return (
                  <section
                    className="py-7 first:pt-0 last:pb-0"
                    key={article.id}
                  >
                    <h3 className="text-lg font-bold tracking-[-0.02em] text-[var(--text-primary)] sm:text-xl">
                      <LocalizedText
                        ja={article.title}
                        en={englishArticle.title}
                      />
                    </h3>
                    <div className="mt-3 space-y-3 text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
                      {article.paragraphs.map((paragraph, index) => (
                        <p key={paragraph}>
                          <LocalizedText
                            ja={paragraph}
                            en={englishArticle.paragraphs[index] ?? ""}
                          />
                        </p>
                      ))}
                    </div>
                    {article.items && englishArticle.items ? (
                      <ul className="mt-4 grid gap-2 pl-5 text-sm leading-7 text-[var(--text-secondary)] marker:text-[var(--accent)] sm:text-base">
                        {article.items.map((item, index) => (
                          <li className="list-disc pl-1" key={item}>
                            <LocalizedText
                              ja={item}
                              en={englishArticle.items?.[index] ?? ""}
                            />
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </section>
                );
              })}
            </div>

            <aside className="mt-8 rounded-lg border border-[var(--border)] bg-[var(--surface-secondary)] p-4 text-sm leading-6 text-[var(--text-secondary)]">
              <LocalizedText
                ja={ja.terms.supplementaryNote}
                en={en.terms.supplementaryNote}
              />
            </aside>
            <p className="mt-5 text-xs text-[var(--text-muted)]">
              <LocalizedText
                ja={`${ja.terms.lastUpdatedLabel}: ${ja.terms.lastUpdated}`}
                en={`${en.terms.lastUpdatedLabel}: ${en.terms.lastUpdated}`}
              />
            </p>
          </div>

          <footer className="border-t border-[var(--border)] bg-[var(--surface)] px-5 py-4 sm:px-7">
            <Button
              className="w-full sm:ml-auto sm:w-auto"
              onClick={closeTerms}
            >
              <LocalizedText
                ja={ja.terms.closeLabel}
                en={en.terms.closeLabel}
              />
            </Button>
          </footer>
        </div>
      </dialog>
    </section>
  );
}
