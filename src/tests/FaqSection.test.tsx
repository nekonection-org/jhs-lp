import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { FaqList } from "@/components/sections/FaqList";
import { toPublicFaq } from "@/lib/faqs/public-types";
import type { FaqRecord } from "@/lib/faqs/types";

const now = new Date("2026-08-20T03:00:00.000Z");
const faq: FaqRecord = {
  id: "faq-1",
  status: "published",
  contentStatus: "pending",
  sortOrder: 10,
  version: 1,
  createdAt: now,
  updatedAt: now,
  translations: [
    {
      locale: "ja",
      question: "参加方法を教えてください。",
      answer: "Discordでサーバー情報をご確認ください。",
    },
    {
      locale: "en",
      question: "How can I join?",
      answer: "See the server information on Discord.",
    },
  ],
};

describe("database-backed FAQ", () => {
  it("maps and renders a bilingual FAQ as native details", () => {
    const item = toPublicFaq(faq);
    expect(item).not.toBeNull();

    const { container } = render(
      <FaqList result={{ status: "ready", items: item ? [item] : [] }} />,
    );

    expect(container.querySelectorAll("details")).toHaveLength(1);
    expect(
      screen.getByText("参加方法を教えてください。").closest("summary"),
    ).not.toBeNull();
    expect(screen.getByText("How can I join?")).toBeInTheDocument();
    expect(screen.getByText("準備中")).toBeInTheDocument();
  });

  it("opens and closes an answer through its summary control", async () => {
    const user = userEvent.setup();
    const item = toPublicFaq(faq);
    render(<FaqList result={{ status: "ready", items: item ? [item] : [] }} />);

    const summary = screen
      .getByText("参加方法を教えてください。")
      .closest("summary");
    const details = summary?.closest("details");

    if (!summary || !details) {
      throw new Error("The FAQ must use native details and summary elements.");
    }

    expect(details).not.toHaveAttribute("open");
    await user.click(summary);
    expect(details).toHaveAttribute("open");
    await user.click(summary);
    expect(details).not.toHaveAttribute("open");
  });

  it("rejects incomplete translations and distinguishes empty from unavailable", () => {
    expect(
      toPublicFaq({
        ...faq,
        translations: faq.translations.filter(({ locale }) => locale !== "en"),
      }),
    ).toBeNull();

    const { rerender } = render(
      <FaqList result={{ status: "ready", items: [] }} />,
    );
    expect(
      screen.getByText("現在、掲載中のFAQはありません"),
    ).toBeInTheDocument();

    rerender(<FaqList result={{ status: "unavailable", items: [] }} />);
    expect(screen.getByText("FAQを取得できません")).toBeInTheDocument();
  });
});
