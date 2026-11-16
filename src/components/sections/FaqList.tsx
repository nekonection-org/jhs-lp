import { CircleHelp, Plus, WifiOff } from "lucide-react";

import { LocalizedMarkdown } from "@/components/ui/MarkdownContent";
import { LocalizedText } from "@/components/ui/LocalizedText";
import { Reveal } from "@/components/ui/Reveal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { en, ja } from "@/content";
import type { PublicFaqsResult } from "@/lib/faqs/public-types";

interface FaqListProps {
  result: PublicFaqsResult;
}

export function FaqList({ result }: FaqListProps) {
  if (result.status === "unavailable") {
    return (
      <FaqPlaceholder
        descriptionEn={en.faq.unavailableDescription}
        descriptionJa={ja.faq.unavailableDescription}
        icon="unavailable"
        titleEn={en.faq.unavailableTitle}
        titleJa={ja.faq.unavailableTitle}
      />
    );
  }

  if (result.items.length === 0) {
    return (
      <FaqPlaceholder
        descriptionEn={en.faq.emptyDescription}
        descriptionJa={ja.faq.emptyDescription}
        icon="empty"
        titleEn={en.faq.emptyTitle}
        titleJa={ja.faq.emptyTitle}
      />
    );
  }

  return (
    <div className="border-b border-[var(--border)]">
      {result.items.map((item, index) => (
        <Reveal delay={Math.min(index * 0.025, 0.15)} key={item.id}>
          <details className="faq-item group overflow-hidden border-t border-[var(--border)]">
            <summary className="flex min-h-16 cursor-pointer items-center gap-4 px-1 py-5 font-bold tracking-[-0.015em] text-[var(--text-primary)] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--focus)] sm:px-2">
              <span className="flex-1">
                <LocalizedText
                  en={item.translations.en.question}
                  ja={item.translations.ja.question}
                />
              </span>
              <span className="grid size-8 shrink-0 place-items-center text-[var(--accent-strong)]">
                <Plus
                  aria-hidden="true"
                  className="size-4 transition-transform duration-150"
                  data-faq-icon
                />
              </span>
            </summary>
            <div className="px-1 pb-6 sm:px-2">
              <LocalizedMarkdown
                en={item.translations.en.answer}
                ja={item.translations.ja.answer}
              />
              <StatusBadge
                className="mt-4"
                en={en.common.statusLabels[item.contentStatus]}
                ja={ja.common.statusLabels[item.contentStatus]}
                status={item.contentStatus}
              />
            </div>
          </details>
        </Reveal>
      ))}
    </div>
  );
}

interface FaqPlaceholderProps {
  icon: "empty" | "unavailable";
  titleJa: string;
  titleEn: string;
  descriptionJa: string;
  descriptionEn: string;
}

function FaqPlaceholder({
  icon,
  titleJa,
  titleEn,
  descriptionJa,
  descriptionEn,
}: FaqPlaceholderProps) {
  const Icon = icon === "unavailable" ? WifiOff : CircleHelp;

  return (
    <Reveal>
      <div className="flex flex-col items-start border-t border-[var(--border)] py-8">
        <span className="text-[var(--text-muted)]">
          <Icon aria-hidden="true" className="size-6" />
        </span>
        <h3 className="mt-5 text-xl font-bold tracking-[-0.025em]">
          <LocalizedText en={titleEn} ja={titleJa} />
        </h3>
        <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--text-secondary)]">
          <LocalizedText en={descriptionEn} ja={descriptionJa} />
        </p>
      </div>
    </Reveal>
  );
}
