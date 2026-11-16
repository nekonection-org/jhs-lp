import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { ServerSection } from "@/components/sections/ServerSection";

describe("ServerSection", () => {
  it("renders each server setting as a separate description-list item", () => {
    const { container } = render(
      <LanguageProvider>
        <ServerSection />
      </LanguageProvider>,
    );

    expect(screen.getByText("設定").closest("h3")).not.toBeNull();
    expect(container.querySelectorAll("#server dl > div")).toHaveLength(6);
    expect(screen.getByText("チーム上限").closest("div")).toHaveTextContent(
      "最大4人（Solo / Duo / Trio / Quad）",
    );
    expect(screen.getByText("マップサイズ").closest("div")).toHaveTextContent(
      "3500",
    );
    expect(
      screen.getByText("マップ・BPワイプ").closest("div"),
    ).toHaveTextContent("毎週金曜日 18:00 JST");
    expect(
      screen.getByText("デイリーリスタート").closest("div"),
    ).toHaveTextContent("毎日 04:00 JST");
    expect(
      screen.getByText("レイド可能時間（平日）").closest("div"),
    ).toHaveTextContent("18:00〜24:00 JST");
    expect(
      screen.getByText("レイド可能時間（土・日）").closest("div"),
    ).toHaveTextContent("12:00〜24:00 JST");
    expect(screen.queryByText("前哨基地統合")).not.toBeInTheDocument();
    expect(screen.getByText("サーバー情報").closest("h2")).not.toBeNull();
    expect(screen.getByText(/基本方針と/)).toBeInTheDocument();
  });

  it("exposes weekday and weekend raid windows as a labeled table", () => {
    render(
      <LanguageProvider>
        <ServerSection />
      </LanguageProvider>,
    );
    const table = screen.getByRole("table", {
      name: /レイド時間を、ひと目で。/,
    });
    expect(within(table).getByRole("row", { name: /平日/ })).toHaveTextContent(
      "18:00–24:00 JST",
    );
    expect(
      within(table).getByRole("row", { name: /土・日/ }),
    ).toHaveTextContent("12:00–24:00 JST");
    const figure = screen.getByRole("figure", {
      name: /レイド時間を、ひと目で。/,
    });
    expect(
      within(figure).getByText("レイド可能", { exact: true }),
    ).toBeInTheDocument();
    expect(
      within(figure).getByText("レイド禁止", { exact: true }),
    ).toBeInTheDocument();
  });
});
