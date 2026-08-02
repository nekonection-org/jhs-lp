import { ArrowUp, ExternalLink } from "lucide-react";
import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { LocalizedText } from "@/components/ui/LocalizedText";
import { en, ja } from "@/content";
import { getMatchingItem } from "@/lib/content";
import { externalUrls } from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <Container className="py-10 sm:py-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
          <div className="max-w-xl">
            <a
              className="inline-flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]"
              href="#top"
            >
              <span className="relative size-9 overflow-hidden rounded-lg border border-[var(--border-strong)] bg-[var(--surface-secondary)]">
                <Image
                  alt=""
                  className="object-cover"
                  fill
                  sizes="36px"
                  src="/icon.png"
                />
              </span>
              <span className="font-bold tracking-[-0.025em]">
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
            <span className="sr-only" id="footer-navigation-label">
              <LocalizedText
                ja={ja.footer.navigationLabel}
                en={en.footer.navigationLabel}
              />
            </span>
            <nav aria-labelledby="footer-navigation-label">
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
                        href={`#${item.id}`}
                      >
                        <LocalizedText ja={item.label} en={englishItem.label} />
                      </a>
                    </li>
                  );
                })}
                {externalUrls.x ? (
                  <li>
                    <a
                      className="inline-flex items-center gap-1 rounded-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]"
                      href={externalUrls.x}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      X
                      <span className="sr-only">
                        {" "}
                        (
                        <LocalizedText
                          ja={ja.common.opensInNewTab}
                          en={en.common.opensInNewTab}
                        />
                        )
                      </span>
                      <ExternalLink aria-hidden="true" className="size-3.5" />
                    </a>
                  </li>
                ) : null}
              </ul>
            </nav>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-[var(--border)] pt-6 text-xs text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {ja.footer.copyrightName}
          </p>
          <a
            className="inline-flex w-fit items-center gap-1.5 rounded-sm font-semibold text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]"
            href="#top"
          >
            <LocalizedText
              ja={ja.footer.backToTopLabel}
              en={en.footer.backToTopLabel}
            />
            <ArrowUp aria-hidden="true" className="size-3.5" />
          </a>
        </div>
      </Container>
    </footer>
  );
}
