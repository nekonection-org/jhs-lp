import { render, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

const { getPublicRulesContent } = vi.hoisted(() => ({
  getPublicRulesContent: vi.fn(),
}));

vi.mock("@/lib/rules/public", () => ({ getPublicRulesContent }));

import { RulesSection } from "@/components/sections/RulesSection";
import { en, ja } from "@/content";

describe("RulesSection", () => {
  it("exposes the complete server rules in a native details element", async () => {
    const user = userEvent.setup();
    getPublicRulesContent.mockResolvedValueOnce({
      status: "ready",
      item: { version: 1, translations: { ja: ja.rules, en: en.rules } },
    });
    const { container } = render(await RulesSection());
    const rulebook = container.querySelector<HTMLDetailsElement>(
      "#rules details.rulebook",
    );

    expect(rulebook).not.toBeNull();
    if (!rulebook) {
      throw new Error("The rulebook details element must be rendered");
    }

    expect(rulebook).not.toHaveAttribute("open");
    await user.click(
      within(rulebook)
        .getByText(ja.rules.rulebook.openLabel)
        .closest("summary")!,
    );
    expect(rulebook).toHaveAttribute("open");
    expect(rulebook.querySelector("h3")).toHaveTextContent(
      ja.rules.rulebook.title,
    );
    expect(
      within(rulebook).queryByText(/参加前とプレイ中に適用されるルール/),
    ).not.toBeInTheDocument();
    expect(
      within(rulebook).queryByRole("heading", { name: "サーバー仕様" }),
    ).not.toBeInTheDocument();
    expect(
      within(rulebook).getAllByText("永久BAN", { exact: true }).length,
    ).toBeGreaterThan(0);
    expect(
      within(rulebook).getByText(/野外設置物（ターレットなど）の破壊/),
    ).toBeInTheDocument();
    expect(
      within(rulebook).getByText(/Discord の #claim-ticket/),
    ).toBeInTheDocument();
    expect(
      within(rulebook).queryByText(/1346782812912750654/),
    ).not.toBeInTheDocument();
  });
});
