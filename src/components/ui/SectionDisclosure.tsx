import { Plus } from "lucide-react";
import type { ReactNode } from "react";

import { LocalizedText } from "@/components/ui/LocalizedText";
import { cn } from "@/lib/cn";

interface SectionDisclosureProps {
  label: { ja: string; en: string };
  children: ReactNode;
  className?: string;
}

export function SectionDisclosure({
  label,
  children,
  className,
}: SectionDisclosureProps) {
  return (
    <details className={cn("section-details", className)}>
      <summary>
        <LocalizedText ja={label.ja} en={label.en} />
        <Plus aria-hidden="true" className="size-5 shrink-0" />
      </summary>
      <div className="section-details-body">{children}</div>
    </details>
  );
}
