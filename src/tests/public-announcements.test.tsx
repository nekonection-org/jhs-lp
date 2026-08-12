import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { NewsList } from "@/components/sections/NewsList";
import type { AnnouncementRecord } from "@/lib/announcements/types";
import { toPublicAnnouncement } from "@/lib/announcements/public-types";

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

describe("public announcements", () => {
  it("maps a database announcement into its bilingual public representation", () => {
    expect(toPublicAnnouncement(announcement)).toEqual({
      id: "announcement-1",
      category: "notice",
      publishedAt,
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

  it("renders the announcement and safe external link", () => {
    const item = toPublicAnnouncement(announcement);
    expect(item).not.toBeNull();

    render(
      <NewsList result={{ status: "ready", items: item ? [item] : [] }} />,
    );

    const heading = screen.getByRole("heading", { level: 3 });
    expect(within(heading).getByText("公開のお知らせ")).toBeInTheDocument();
    expect(within(heading).getByText("Published notice")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "https://example.com/news",
    );
  });

  it("uses an explicit English pending message instead of Japanese fallback", () => {
    const item = toPublicAnnouncement({
      ...announcement,
      translations: announcement.translations.filter(
        ({ locale }) => locale !== "en",
      ),
    });

    render(
      <NewsList result={{ status: "ready", items: item ? [item] : [] }} />,
    );

    const heading = screen.getByRole("heading", { level: 3 });
    expect(
      within(heading).getByText("English translation in progress"),
    ).toBeInTheDocument();
    expect(within(heading).getAllByText("公開のお知らせ")).toHaveLength(1);
  });

  it("distinguishes an empty result from a database outage", () => {
    const { rerender } = render(
      <NewsList result={{ status: "ready", items: [] }} />,
    );
    expect(
      screen.getByText("現在、掲載中のお知らせはありません"),
    ).toBeInTheDocument();

    rerender(<NewsList result={{ status: "unavailable", items: [] }} />);
    expect(screen.getByText("お知らせを取得できません")).toBeInTheDocument();
  });
});
