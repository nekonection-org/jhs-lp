import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  AnnouncementForm,
  type AnnouncementFormValues,
} from "@/components/admin/AnnouncementForm";

const values: AnnouncementFormValues = {
  category: "maintenance",
  status: "draft",
  publishedAt: "2026-08-13T18:30",
  externalUrl: "https://example.com/notice",
  titleJa: "メンテナンスのお知らせ",
  descriptionJa: "日本語の概要",
  titleEn: "Maintenance notice",
  descriptionEn: "English description",
  version: 2,
};

describe("AnnouncementForm", () => {
  it("renders the current bilingual announcement values and publication controls", () => {
    const action = vi.fn(async (state) => state);
    render(
      <AnnouncementForm
        action={action}
        submitLabel="変更を保存"
        values={values}
      />,
    );

    expect(screen.getByLabelText("カテゴリ")).toHaveValue("maintenance");
    expect(screen.getByLabelText("公開状態")).toHaveValue("draft");
    expect(
      screen.getByText(
        "公開日時が未来の場合は、その時刻まで予約公開として扱います。",
      ),
    ).toBeVisible();
    expect(screen.getByLabelText("公開日時（日本時間）")).toHaveValue(
      "2026-08-13T18:30",
    );
    expect(
      screen.getByText("公開状態では必須です。時刻はJSTとして保存されます。"),
    ).toBeVisible();
    expect(screen.getByLabelText("タイトル")).toHaveValue(
      "メンテナンスのお知らせ",
    );
    expect(screen.getByLabelText("Title")).toHaveValue("Maintenance notice");
    expect(screen.getByRole("button", { name: "変更を保存" })).toBeEnabled();
  });
});
