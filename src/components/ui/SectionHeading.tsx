import type { ReactNode } from "react";

import { ContentIcon } from "@/components/ui/ContentIcon";
import type { ContentIcon as ContentIconName } from "@/content/types";

import { cn } from "@/lib/cn";

interface SectionHeadingProps {
  eyebrow: ReactNode;
  icon?: ContentIconName;
  index?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  layout?: "split" | "stack";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  icon,
  index,
  title,
  description,
  align = "left",
  layout = "split",
  className,
}: SectionHeadingProps) {
  return (
    <header
      className={cn(
        "section-heading",
        layout === "split" && align !== "center" && "section-heading-split",
        align === "center" && "mx-auto max-w-2xl text-center",
        className,
      )}
    >
      <p className="section-eyebrow" data-reveal-item>
        {index ? (
          <span aria-hidden="true" className="section-index">
            {index}
          </span>
        ) : null}
        {eyebrow}
        {align !== "center" ? (
          <span
            className="section-heading-line"
            aria-hidden="true"
            data-reveal-line
          />
        ) : null}
      </p>
      <h2 className="section-title" data-reveal-item>
        {icon ? (
          <ContentIcon name={icon} className="section-title-icon" />
        ) : null}
        <span>{title}</span>
      </h2>
      {description ? (
        <p className="section-description" data-reveal-item>
          {description}
        </p>
      ) : null}
    </header>
  );
}
