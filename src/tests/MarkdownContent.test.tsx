import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  LocalizedMarkdown,
  MarkdownContent,
} from "@/components/ui/MarkdownContent";

describe("MarkdownContent", () => {
  it("preserves Enter line breaks, CRLF, blank paragraphs and inline formatting", () => {
    const { container } = render(
      <MarkdownContent>
        {"最初の行\r\n次の行\n\n**重要**と*斜体*、~~取消~~、`client.connect`"}
      </MarkdownContent>,
    );
    expect(container.querySelectorAll("p")).toHaveLength(2);
    expect(container.querySelectorAll("br")).toHaveLength(1);
    expect(container.querySelector("strong")).toHaveTextContent("重要");
    expect(container.querySelector("em")).toHaveTextContent("斜体");
    expect(container.querySelector("del")).toHaveTextContent("取消");
    expect(container.querySelector("code")).toHaveTextContent("client.connect");
  });

  it("supports scoped headings, lists, quotes, tables and fenced code without creating an h1", () => {
    const { container } = render(
      <MarkdownContent headingLevel={4}>
        {
          "# お知らせ\n\n- 項目1\n- 項目2\n\n1. 手順\n\n> 引用\n\n| 日 | 時間 |\n| --- | --- |\n| 金 | 18:00 |\n\n```text\nfirst\nsecond\n```"
        }
      </MarkdownContent>,
    );
    expect(
      screen.getByRole("heading", { level: 4, name: "お知らせ" }),
    ).toBeInTheDocument();
    expect(container.querySelector("h1")).toBeNull();
    expect(container.querySelectorAll("li")).toHaveLength(3);
    expect(container.querySelector("blockquote")).toHaveTextContent("引用");
    expect(screen.getByRole("table")).toHaveTextContent("18:00");
    expect(screen.getByRole("region", { name: /表/ })).toHaveAttribute(
      "tabindex",
      "0",
    );
    expect(container.querySelector("pre code")).toHaveTextContent(
      "first second",
    );
  });

  it("renders HTML as text and blocks executable links and remote images", () => {
    const { container } = render(
      <MarkdownContent>
        {
          "<script>alert(1)</script>\n\n<img src=x onerror=alert(1)>\n\n[bad](javascript:alert%281%29)\n\n[data](data:text/html,evil)\n\n![image label](https://example.com/tracker.png)"
        }
      </MarkdownContent>,
    );
    expect(container.querySelector("script, img, iframe")).toBeNull();
    expect(container.textContent).toContain("<script>alert(1)</script>");
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText("image label")).toBeInTheDocument();
  });

  it("keeps internal anchors and safe external links with appropriate target and rel", () => {
    render(
      <MarkdownContent>
        {
          "[ルール](#rules)\n\n[Discord](https://discord.gg/example)\n\n[連絡](mailto:hello@example.com)\n\n[絶対パス](/?newsPage=2#news)"
        }
      </MarkdownContent>,
    );
    expect(screen.getByRole("link", { name: "ルール" })).toHaveAttribute(
      "href",
      "#rules",
    );
    expect(screen.getByRole("link", { name: "ルール" })).not.toHaveAttribute(
      "target",
    );
    expect(screen.getByRole("link", { name: "Discord" })).toHaveAttribute(
      "target",
      "_blank",
    );
    expect(screen.getByRole("link", { name: "Discord" })).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );
    expect(screen.getByRole("link", { name: "連絡" })).toHaveAttribute(
      "href",
      "mailto:hello@example.com",
    );
    expect(screen.getByRole("link", { name: "絶対パス" })).toHaveAttribute(
      "href",
      "/?newsPage=2#news",
    );
  });

  it("emits both translations and formatted content in server-rendered HTML", () => {
    const html = renderToStaticMarkup(
      <LocalizedMarkdown
        ja={"日本語\n**重要**"}
        en={"English\n**Important**"}
      />,
    );
    expect(html).toContain('data-locale-content="ja"');
    expect(html).toContain('data-locale-content="en"');
    expect(html).toContain("<br/>");
    expect(html).toContain("<strong>重要</strong>");
    expect(html).toContain("<strong>Important</strong>");
  });
});
