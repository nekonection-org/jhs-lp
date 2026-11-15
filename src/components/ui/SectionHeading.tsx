import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

interface SectionHeadingProps {
  eyebrow: ReactNode;
  index?: string;
  title: ReactNode;
  description: ReactNode;
  align?: "left" | "center";
  layout?: "split" | "stack";
  className?: string;
}

export function SectionHeading({
  eyebrow,
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
      <p className="section-eyebrow">
        {index ? (
          <span aria-hidden="true" className="section-index">
            {index}
          </span>
        ) : null}
        {eyebrow}
      </p>
      <h2 className="section-title">{title}</h2>
      <p className="section-description">{description}</p>
    </header>
  );
}
