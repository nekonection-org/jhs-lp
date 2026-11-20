import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { getPublicAnnouncement } = vi.hoisted(() => ({
  getPublicAnnouncement: vi.fn(),
}));

vi.mock("@/lib/announcements/public", () => ({ getPublicAnnouncement }));
vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

import NewsPage, { generateMetadata } from "@/app/news/[id]/page";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import type { PublicAnnouncement } from "@/lib/announcements/public-types";

const announcement: PublicAnnouncement = {
  id: "public-notice",
  category: "notice",
  publishedAt: "2026-08-06T09:00:00.000Z",
  externalUrl: null,
  translations: {
    ja: {
      title: "公開のお知らせ",
      description: "# 詳細\n\n本文を表示します。",
    },
    en: {
      title: "Published notice",
      description: "# Details\n\nRead the full announcement.",
    },
  },
};

function props(newsPage?: string) {
  return {
    params: Promise.resolve({ id: announcement.id }),
    searchParams: Promise.resolve({ newsPage }),
  };
}

describe("public announcement page", () => {
  beforeEach(() => getPublicAnnouncement.mockResolvedValue(announcement));

  it("renders the complete article with one h1 and properly scoped body headings", async () => {
    render(await NewsPage(props()), { wrapper: LanguageProvider });
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "公開のお知らせ",
    );
    expect(
      screen.getByRole("heading", { level: 2, name: "詳細" }),
    ).toBeVisible();
    expect(screen.getByText("本文を表示します。")).toBeVisible();
    expect(
      screen.getByRole("link", { name: /お知らせ一覧へ戻る/ }),
    ).toHaveAttribute("href", "/#news");
  });

  it("returns readers to the original archive page", async () => {
    render(await NewsPage(props("2")), { wrapper: LanguageProvider });
    expect(
      screen.getByRole("link", { name: /お知らせ一覧へ戻る/ }),
    ).toHaveAttribute("href", "/?newsPage=2#news");
  });

  it("ignores an invalid return page rather than accepting an arbitrary URL", async () => {
    render(await NewsPage(props("https://example.com")), {
      wrapper: LanguageProvider,
    });
    expect(
      screen.getByRole("link", { name: /お知らせ一覧へ戻る/ }),
    ).toHaveAttribute("href", "/#news");
  });

  it("uses the article URL and title for metadata", async () => {
    const metadata = await generateMetadata(props("2"));
    expect(metadata.title).toBe("公開のお知らせ | JapanHideaway.com");
    expect(metadata.alternates?.canonical).toBe("/news/public-notice");
    expect(metadata.openGraph).toMatchObject({
      type: "article",
      publishedTime: announcement.publishedAt,
    });
  });

  it("returns not-found for both the page and its metadata when not publicly available", async () => {
    getPublicAnnouncement.mockResolvedValue(null);
    await expect(NewsPage(props())).rejects.toThrow("NEXT_NOT_FOUND");
    await expect(generateMetadata(props())).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
