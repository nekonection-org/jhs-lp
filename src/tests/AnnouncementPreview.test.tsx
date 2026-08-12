import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AnnouncementPreview } from "@/components/admin/AnnouncementPreview";
import type { AnnouncementRecord } from "@/lib/announcements/types";

function createAnnouncement(
  overrides: Partial<AnnouncementRecord> = {},
): AnnouncementRecord {
  return {
    id: "announcement-id",
    category: "maintenance",
    status: "published",
    publishedAt: new Date("2099-08-13T09:30:00.000Z"),
    externalUrl: "https://example.com/notice",
    version: 1,
    createdAt: new Date("2026-08-13T00:00:00.000Z"),
    updatedAt: new Date("2026-08-13T00:00:00.000Z"),
    translations: [
      {
        locale: "ja",
        title: "メンテナンスのお知らせ",
        description: "日本語の概要です。",
      },
      {
        locale: "en",
        title: "Maintenance notice",
        description: "English description.",
      },
    ],
    ...overrides,
  };
}

describe("AnnouncementPreview", () => {
  it.each([
    ["draft", null, "下書き"],
    ["published", new Date("2099-08-13T09:30:00.000Z"), "予約公開"],
    ["published", new Date("2020-08-13T09:30:00.000Z"), "公開中"],
    ["archived", new Date("2020-08-13T09:30:00.000Z"), "アーカイブ"],
  ] as const)(
    "renders the %s operational state as %s",
    (status, publishedAt, label) => {
      render(
        <AnnouncementPreview
          announcement={createAnnouncement({ status, publishedAt })}
        />,
      );

      expect(screen.getByText(label)).toBeInTheDocument();
    },
  );

  it("renders both translations and the scheduled publication state", () => {
    render(<AnnouncementPreview announcement={createAnnouncement()} />);

    expect(screen.getByText("予約公開")).toBeInTheDocument();
    expect(screen.getByText("メンテナンスのお知らせ")).toBeInTheDocument();
    expect(screen.getByText("Maintenance notice")).toBeInTheDocument();
    expect(screen.getByText("メンテナンス")).toBeInTheDocument();
    expect(screen.getByText("Maintenance")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "関連リンクを開く" }),
    ).toHaveAttribute("href", "https://example.com/notice");
  });

  it("shows an explicit empty state when a draft has no English translation", () => {
    const announcement = createAnnouncement({
      status: "draft",
      publishedAt: null,
      externalUrl: "javascript:alert(1)",
      translations: [
        {
          locale: "ja",
          title: "下書きのお知らせ",
          description: "日本語のみ入力済みです。",
        },
      ],
    });

    render(<AnnouncementPreview announcement={announcement} />);

    expect(screen.getByText("下書き")).toBeInTheDocument();
    expect(
      screen.getByText("English content has not been entered yet."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
