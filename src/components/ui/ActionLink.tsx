import { ArrowDown, ExternalLink, LockKeyhole } from "lucide-react";

import type {
  CommonContent,
  ExternalActionContent,
  SectionActionContent,
} from "@/content/types";
import { buttonStyles } from "@/components/ui/Button";
import { LocalizedText } from "@/components/ui/LocalizedText";
import { cn } from "@/lib/cn";

interface LocalizedCommon {
  ja: CommonContent;
  en: CommonContent;
}

interface LocalizedExternalActionProps {
  action: {
    ja: ExternalActionContent;
    en: ExternalActionContent;
  };
  common: LocalizedCommon;
  href: string | null;
  variant?: "primary" | "secondary" | "quiet";
  size?: "default" | "compact";
  className?: string;
}

export function LocalizedExternalAction({
  action,
  common,
  href,
  variant = "primary",
  size = "default",
  className,
}: LocalizedExternalActionProps) {
  const content = (
    <>
      <LocalizedText ja={action.ja.label} en={action.en.label} />
      {href ? (
        <ExternalLink aria-hidden="true" className="size-4" />
      ) : (
        <LockKeyhole aria-hidden="true" className="size-4" />
      )}
      {href ? (
        <span className="sr-only">
          {" "}
          (
          <LocalizedText
            ja={common.ja.opensInNewTab}
            en={common.en.opensInNewTab}
          />
          )
        </span>
      ) : null}
    </>
  );

  if (!href) {
    return (
      <span
        aria-disabled="true"
        className={cn(
          buttonStyles({ variant: "secondary", size, className }),
          "cursor-not-allowed opacity-60 hover:translate-y-0",
        )}
        role="link"
      >
        {content}
      </span>
    );
  }

  return (
    <a
      className={buttonStyles({ variant, size, className })}
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      {content}
    </a>
  );
}

interface LocalizedSectionActionProps {
  action: {
    ja: SectionActionContent;
    en: SectionActionContent;
  };
  variant?: "primary" | "secondary" | "quiet";
  className?: string;
}

export function LocalizedSectionAction({
  action,
  variant = "secondary",
  className,
}: LocalizedSectionActionProps) {
  return (
    <a
      className={buttonStyles({ variant, className })}
      href={`#${action.ja.destination}`}
    >
      <LocalizedText ja={action.ja.label} en={action.en.label} />
      <ArrowDown aria-hidden="true" className="size-4" />
    </a>
  );
}
