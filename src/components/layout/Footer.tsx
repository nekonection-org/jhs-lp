import { ArrowUp } from "lucide-react";
import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { LocalizedText } from "@/components/ui/LocalizedText";
import { TermsDialog } from "@/components/ui/TermsDialog";
import { en, ja } from "@/content";
import { brandIcon } from "@/lib/brand";
import { getMatchingItem } from "@/lib/content";

interface FooterProps {
  homePath?: "" | "/";
  idPrefix?: string;
}

export function Footer({ homePath = "", idPrefix = "" }: FooterProps) {
  const year = new Date().getFullYear();
  const navigationLabelId = `${idPrefix}footer-navigation-label`;

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <Container className="py-10 sm:py-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
          <div className="max-w-lg">
            <a
              className="inline-flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]"
              href={`${homePath}#top`}
            >
              <span className="relative size-9 overflow-hidden rounded-lg border border-[var(--border-strong)] bg-[var(--brand-icon-background)]">
                <Image
                  alt=""
                  className="object-contain"
                  fill
                  sizes="36px"
                  src={brandIcon.src}
                />
              </span>
              <span className="text-lg font-semibold tracking-[-0.035em] sm:text-2xl">
                Japan Hideaway Server
              </span>
            </a>
            <p className="mt-4 text-sm leading-6 text-[var(--text-secondary)]">
              <LocalizedText
                ja={ja.footer.description}
                en={en.footer.description}
              />
            </p>
            <p className="mt-3 text-xs leading-5 text-[var(--text-muted)]">
              <LocalizedText
                ja={ja.footer.communityDisclaimer}
                en={en.footer.communityDisclaimer}
              />
            </p>
          </div>

          <div>
            <span className="sr-only" id={navigationLabelId}>
              <LocalizedText
                ja={ja.footer.navigationLabel}
                en={en.footer.navigationLabel}
              />
            </span>
            <nav aria-labelledby={navigationLabelId}>
              <ul className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm sm:grid-cols-3">
                {ja.navigation.items.map((item) => {
                  const englishItem = getMatchingItem(
                    en.navigation.items,
                    item.id,
                  );

                  return (
                    <li key={item.id}>
                      <a
                        className="rounded-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]"
                        href={`${homePath}#${item.id}`}
                      >
                        <LocalizedText ja={item.label} en={englishItem.label} />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-[var(--border)] pt-6 text-xs text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {ja.footer.copyrightName}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <TermsDialog idPrefix={idPrefix} />
            <a
              className="inline-flex min-h-11 w-fit items-center gap-1.5 rounded-sm font-semibold text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]"
              href={`${homePath}#top`}
            >
              <LocalizedText
                ja={ja.footer.backToTopLabel}
                en={en.footer.backToTopLabel}
              />
              <ArrowUp aria-hidden="true" className="size-3.5" />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
