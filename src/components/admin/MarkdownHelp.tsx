interface MarkdownHelpProps {
  id: string;
  locale: "ja" | "en";
}

export function MarkdownHelp({ id, locale }: MarkdownHelpProps) {
  return (
    <p
      className="text-xs font-normal leading-6 text-[var(--text-secondary)]"
      id={id}
    >
      {locale === "ja"
        ? "Markdown対応：Enterで改行、空行で段落、**太字**、*斜体*、~~取り消し線~~、- 箇条書き、[リンク名](https://...)、`コード`。見出し・引用・表も使えます。タイトル・質問は通常のテキストです。"
        : "Markdown supported: Enter for a line break, a blank line for a paragraph, **bold**, *italic*, ~~strikethrough~~, - lists, [label](https://...), and `code`. Headings, quotes and tables also work. Titles and questions use plain text."}
    </p>
  );
}
