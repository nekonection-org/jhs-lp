import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ServerSection } from "@/components/sections/ServerSection";

describe("ServerSection", () => {
  it("renders each server setting as a separate description-list item", () => {
    const { container } = render(<ServerSection />);

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
    expect(
      screen.getByText("Japan Hideaway Serverへようこそ！").closest("h3"),
    ).not.toBeNull();
    expect(screen.getByText(/初心者から上級者まで/)).toBeInTheDocument();
  });
});
