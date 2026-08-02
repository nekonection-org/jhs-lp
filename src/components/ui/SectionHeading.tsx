import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

interface SectionHeadingProps {
  eyebrow: ReactNode;
  title: ReactNode;
  description: ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <header
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <p className="section-eyebrow">{eyebrow}</p>
      <h2 className="mt-3 text-balance text-3xl font-bold tracking-[-0.035em] text-[var(--text-primary)] sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-pretty text-base leading-7 text-[var(--text-secondary)] sm:text-lg">
        {description}
      </p>
    </header>
  );
}
