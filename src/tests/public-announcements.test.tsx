import type { ReactElement } from "react";
import {
  render as renderWithDefaults,
  screen,
  within,
} from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { NewsArticle } from "@/components/news/NewsArticle";
import { LanguageProvider } from "@/components/providers/LanguageProvider";

import { NewsArchiveLink, NewsList } from "@/components/sections/NewsList";
import type { AnnouncementRecord } from "@/lib/announcements/types";
import type { PublicAnnouncement } from "@/lib/announcements/public-types";
import {
  parsePublicAnnouncementsPage,
  toPublicAnnouncement,
} from "@/lib/announcements/public-types";

function render(
  ui: ReactElement,
  options?: Parameters<typeof renderWithDefaults>[1],
) {
  return renderWithDefaults(ui, { wrapper: LanguageProvider, ...options });
}

const publishedAt = new Date("2026-08-13T09:30:00Z");

const announcement: AnnouncementRecord = {
  id: "announcement-1",
  category: "notice",
  status: "published",
  publishedAt,
  externalUrl: "https://example.com/news",
  version: 1,
  createdAt: publishedAt,
  updatedAt: publishedAt,
  translations: [
    { locale: "ja", title: "公開のお知らせ", description: "日本語の概要" },
    { locale: "en", title: "Published notice", description: "English summary" },
  ],
};

function readyResult(
  items: readonly PublicAnnouncement[],
  pagination: Partial<{
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  }> = {},
) {
  return {
    status: "ready" as const,
    items,
    pagination: {
      page: 1,
      pageSize: 5,
      totalItems: items.length,
      totalPages: 1,
      ...pagination,
    },
  };
}

describe("public announcements", () => {
  it("maps a database announcement into its bilingual public representation", () => {
    expect(toPublicAnnouncement(announcement)).toEqual({
      id: "announcement-1",
      category: "notice",
      publishedAt: publishedAt.toISOString(),
      externalUrl: "https://example.com/news",
      translations: {
        ja: { title: "公開のお知らせ", description: "日本語の概要" },
        en: { title: "Published notice", description: "English summary" },
      },
    });
  });

  it("rejects malformed records without Japanese content or publication time", () => {
    expect(
      toPublicAnnouncement({
        ...announcement,
        translations: announcement.translations.filter(
          ({ locale }) => locale !== "ja",
        ),
      }),
    ).toBeNull();
    expect(
      toPublicAnnouncement({ ...announcement, publishedAt: null }),
    ).toBeNull();
  });

  it("keeps a fallback link and hides the pre-rendered article until it is opened", () => {
    const item = toPublicAnnouncement(announcement);
    if (!item) throw new Error("Expected a published announcement");
    render(<NewsList result={readyResult([item])} />);
    const heading = screen.getByRole("heading", { level: 3 });
    expect(within(heading).getByText("公開のお知らせ")).toBeInTheDocument();
    expect(within(heading).getByText("Published notice")).toBeInTheDocument();
    expect(heading.closest("a")).toHaveAttribute(
      "href",
      "/news/announcement-1",
    );
    expect(screen.getByText("日本語の概要")).not.toBeVisible();
    expect(
      screen.queryByRole("link", { name: /関連リンク/ }),
    ).not.toBeInTheDocument();
  });

  it("renders the full article and a safe related link with external attributes", () => {
    const item = toPublicAnnouncement(announcement);
    if (!item) throw new Error("Expected a published announcement");
    render(<NewsArticle announcement={item} backHref="/#news" />, {
      wrapper: LanguageProvider,
    });
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "公開のお知らせ",
    );
    expect(screen.getByText("日本語の概要")).toBeVisible();
    const relatedLink = screen.getByRole("link", { name: /関連リンク/ });
    expect(relatedLink).toHaveAttribute("href", "https://example.com/news");
    expect(relatedLink).toHaveAttribute("target", "_blank");
    expect(relatedLink).toHaveAttribute("rel", "noopener noreferrer");
    expect(
      screen.getByRole("link", { name: /お知らせ一覧へ戻る/ }),
    ).toHaveAttribute("href", "/#news");
  });

  it.each(["javascript:alert(1)", "data:text/html,example", "not-a-url"])(
    "does not render an unsafe related URL: %s",
    (externalUrl) => {
      const item = toPublicAnnouncement({ ...announcement, externalUrl });
      if (!item) throw new Error("Expected a published announcement");
      render(<NewsArticle announcement={item} backHref="/#news" />, {
        wrapper: LanguageProvider,
      });
      expect(
        screen.queryByRole("link", { name: /関連リンク/ }),
      ).not.toBeInTheDocument();
    },
  );

  it("uses an explicit English pending message instead of Japanese fallback", () => {
    const item = toPublicAnnouncement({
      ...announcement,
      translations: announcement.translations.filter(
        ({ locale }) => locale !== "en",
      ),
    });

    render(<NewsList result={readyResult(item ? [item] : [])} />);

    const heading = screen.getByRole("heading", { level: 3 });
    expect(
      within(heading).getByText("English translation in progress"),
    ).toBeInTheDocument();
    expect(within(heading).getAllByText("公開のお知らせ")).toHaveLength(1);
  });

  it("distinguishes an empty result from a database outage", () => {
    const { rerender } = render(<NewsList result={readyResult([])} />);
    expect(
      screen.getByText("現在、掲載中のお知らせはありません"),
    ).toBeInTheDocument();

    rerender(<NewsList result={{ status: "unavailable", items: [] }} />);
    expect(screen.getByText("お知らせを取得できません")).toBeInTheDocument();
  });

  it("shows the past-announcements entry only when more than five items exist", () => {
    const item = toPublicAnnouncement(announcement);
    expect(item).not.toBeNull();

    const { rerender } = render(
      <NewsArchiveLink
        result={readyResult(item ? [item] : [], {
          totalItems: 6,
          totalPages: 2,
        })}
      />,
    );

    expect(
      screen.getByRole("link", { name: /過去のお知らせを見る/ }),
    ).toHaveAttribute("href", "/?newsPage=2#news");

    rerender(<NewsArchiveLink result={readyResult(item ? [item] : [])} />);
    expect(
      screen.queryByRole("link", { name: /過去のお知らせを見る/ }),
    ).not.toBeInTheDocument();
  });

  it("renders an archive header and page navigation for past announcements", () => {
    const item = toPublicAnnouncement(announcement);
    expect(item).not.toBeNull();

    render(
      <NewsList
        result={readyResult(item ? [item] : [], {
          page: 2,
          totalItems: 11,
          totalPages: 3,
        })}
      />,
    );

    expect(screen.getByText("過去のお知らせ")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /最新のお知らせに戻る/ }),
    ).toHaveAttribute("href", "/#news");
    expect(screen.getByRole("link", { name: /前のページ/ })).toHaveAttribute(
      "href",
      "/#news",
    );
    expect(screen.getByRole("link", { name: /次のページ/ })).toHaveAttribute(
      "href",
      "/?newsPage=3#news",
    );
    expect(screen.getByText("2 / 3 ページ")).toBeInTheDocument();
  });

  it("normalizes missing and invalid announcement page query values", () => {
    expect(parsePublicAnnouncementsPage(undefined)).toBe(1);
    expect(parsePublicAnnouncementsPage("2")).toBe(2);
    expect(parsePublicAnnouncementsPage(["3", "4"])).toBe(3);
    expect(parsePublicAnnouncementsPage("0")).toBe(1);
    expect(parsePublicAnnouncementsPage("2.5")).toBe(1);
    expect(parsePublicAnnouncementsPage("invalid")).toBe(1);
  });
  it("preserves Markdown and line breaks on the full article page", () => {
    const item = toPublicAnnouncement({
      ...announcement,
      translations: [
        {
          locale: "ja",
          title: "更新",
          description: "最初の行\n**重要**\n\n- 手順",
        },
        {
          locale: "en",
          title: "Update",
          description: "First line\n**Important**",
        },
      ],
    });
    if (!item) throw new Error("Expected a published announcement");
    const { container } = render(
      <NewsArticle announcement={item} backHref="/#news" />,
      { wrapper: LanguageProvider },
    );
    expect(container.querySelector(".markdown-content")).toBeVisible();
    expect(container.querySelectorAll(".markdown-content br")).toHaveLength(2);
    expect(container.querySelectorAll(".markdown-content strong")).toHaveLength(
      2,
    );
    expect(container.querySelectorAll(".markdown-content li")).toHaveLength(1);
  });
});
