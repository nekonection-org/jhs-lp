import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { FaqActionState } from "@/app/admin/faqs/action-state";
import { FaqForm, type FaqFormValues } from "@/components/admin/FaqForm";

const values: FaqFormValues = {
  status: "published",
  contentStatus: "pending",
  sortOrder: "30",
  questionJa: "VIPはどこで購入できますか？",
  answerJa: "正式な購入ページは準備中です。",
  questionEn: "Where can I purchase VIP?",
  answerEn: "The official purchase page is in preparation.",
  version: 2,
};

describe("FaqForm", () => {
  it("renders the current bilingual FAQ and publication controls", () => {
    const action = vi.fn(async (state: FaqActionState) => state);
    render(
      <FaqForm action={action} submitLabel="変更を保存" values={values} />,
    );

    expect(screen.getByLabelText("公開状態")).toHaveValue("published");
    expect(screen.getByLabelText("内容の確認状態")).toHaveValue("pending");
    expect(screen.getByLabelText("表示順")).toHaveValue(30);
    expect(screen.getByLabelText("質問")).toHaveValue(
      "VIPはどこで購入できますか？",
    );
    expect(screen.getByLabelText("Question")).toHaveValue(
      "Where can I purchase VIP?",
    );
    expect(screen.getByRole("button", { name: "変更を保存" })).toBeEnabled();
  });
});
