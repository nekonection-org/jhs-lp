import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { RulesActionState } from "@/app/admin/rules/action-state";
import { RulesForm } from "@/components/admin/RulesForm";
import { en, ja } from "@/content";

describe("RulesForm", () => {
  it("renders current bilingual rules and supports adding a rule entry", async () => {
    const user = userEvent.setup();
    const action = vi.fn(async (state: RulesActionState) => state);
    render(
      <RulesForm
        action={action}
        values={{
          version: 3,
          translations: { ja: ja.rules, en: en.rules },
        }}
      />,
    );

    expect(screen.getByLabelText("注意見出し")).toHaveValue(
      ja.rules.noticeTitle,
    );
    expect(screen.getByLabelText("Notice title")).toHaveValue(
      en.rules.noticeTitle,
    );
    expect(
      screen.getByDisplayValue(
        "Admin / Moderator への DM 直接対応は行いません。Discord の #claim-ticket にて対応いたします。",
      ),
    ).toBeInTheDocument();
    expect(document.querySelector('input[name="blockCount"]')).toHaveValue(
      String(ja.rules.rulebook.blocks.length),
    );

    await user.click(screen.getByRole("button", { name: "ルール項目を追加" }));
    expect(document.querySelector('input[name="blockCount"]')).toHaveValue(
      String(ja.rules.rulebook.blocks.length + 1),
    );
    expect(
      screen.getByRole("button", { name: "サーバールールを保存" }),
    ).toBeEnabled();
  });
});
