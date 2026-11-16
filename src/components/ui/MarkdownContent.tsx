import Markdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/cn";

interface MarkdownContentProps {
  children: string;
  className?: string;
  headingLevel?: 3 | 4;
  locale?: "ja" | "en";
}

function safeMarkdownUrl(value: string): string | undefined {
  try {
    // Permit same-page anchors and root-relative paths, not protocol-relative URLs.
    if (value.startsWith("#")) return value;
    if (
      value.startsWith("/") &&
      !value.startsWith("//") &&
      !value.includes("\\")
    ) {
      const url = new URL(value, "https://jhs.invalid");
      return url.origin === "https://jhs.invalid"
        ? `${url.pathname}${url.search}${url.hash}`
        : undefined;
    }
    const url = new URL(value);
    if (["https:", "http:", "mailto:"].includes(url.protocol)) {
      return url.toString();
    }
  } catch {
    // Invalid URLs are rendered as text instead of interactive links.
  }
  return undefined;
}

/** Render stored Markdown as React elements. Raw HTML is kept as escaped text. */
export function MarkdownContent({
  children,
  className,
  headingLevel = 3,
  locale = "ja",
}: MarkdownContentProps) {
  const Heading = headingLevel === 3 ? "h3" : "h4";
  return (
    <div className={cn("markdown-content", className)}>
      <Markdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        urlTransform={safeMarkdownUrl}
        components={{
          h1: Heading,
          h2: headingLevel === 3 ? "h4" : "h5",
          h3: headingLevel === 3 ? "h5" : "h6",
          h4: "h6",
          h5: "h6",
          h6: "h6",
          a: ({ href, children, title }) => {
            if (!href) return <span>{children}</span>;
            const external = /^https?:/.test(href);
            return (
              <a
                href={href}
                title={title}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
              >
                {children}
              </a>
            );
          },
          img: ({ alt }) => <span>{alt}</span>,
          pre: ({ children }) => (
            <pre
              tabIndex={0}
              role="region"
              aria-label={
                locale === "ja"
                  ? "コードブロック（横にスクロールできます）"
                  : "Code block (scroll horizontally)"
              }
            >
              {children}
            </pre>
          ),
          table: ({ children }) => (
            <div
              className="markdown-table-scroll"
              tabIndex={0}
              role="region"
              aria-label={
                locale === "ja"
                  ? "表（横にスクロールできます）"
                  : "Table (scroll horizontally)"
              }
            >
              <table>{children}</table>
            </div>
          ),
        }}
      >
        {children}
      </Markdown>
    </div>
  );
}

interface LocalizedMarkdownProps {
  ja: string;
  en: string;
  className?: string;
  headingLevel?: 3 | 4;
}

export function LocalizedMarkdown({
  ja,
  en,
  className,
  headingLevel,
}: LocalizedMarkdownProps) {
  return (
    <>
      <div data-locale-content="ja">
        <MarkdownContent
          className={className}
          headingLevel={headingLevel}
          locale="ja"
        >
          {ja}
        </MarkdownContent>
      </div>
      <div data-locale-content="en">
        <MarkdownContent
          className={className}
          headingLevel={headingLevel}
          locale="en"
        >
          {en}
        </MarkdownContent>
      </div>
    </>
  );
}
