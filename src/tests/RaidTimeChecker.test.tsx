import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { RaidTimeChecker } from "@/components/ui/RaidTimeChecker";

const now = Date.parse("2026-11-16T00:00:00Z");

function setSelection(date: string, time: string) {
  fireEvent.change(screen.getByLabelText(/確認する日付/), {
    target: { value: date },
  });
  fireEvent.change(screen.getByLabelText(/確認する時刻/), {
    target: { value: time },
  });
}

describe("RaidTimeChecker", () => {
  it("uses the Tokyo rule date instead of the local weekday", () => {
    const { container } = render(
      <RaidTimeChecker now={now} timeZone="America/New_York" />,
    );
    setSelection("2026-11-20", "21:59");
    expect(container.querySelector(".raid-check-result")).toHaveAttribute(
      "data-allowed",
      "false",
    );
    setSelection("2026-11-20", "22:00");
    expect(container.querySelector(".raid-check-result")).toHaveAttribute(
      "data-allowed",
      "true",
    );
    expect(
      container.querySelector(".raid-selected-instant time"),
    ).toHaveAttribute("datetime", "2026-11-21T03:00:00.000Z");
  });

  it("rejects midnight and recomputes a preserved wall time when the zone changes", () => {
    const { container, rerender } = render(
      <RaidTimeChecker now={now} timeZone="Asia/Tokyo" />,
    );
    setSelection("2026-11-16", "00:00");
    expect(screen.getByRole("status")).toHaveAttribute("data-allowed", "false");
    setSelection("2026-11-16", "18:00");
    expect(screen.getByRole("status")).toHaveAttribute("data-allowed", "true");
    rerender(<RaidTimeChecker now={now} timeZone="America/New_York" />);
    expect(screen.getByLabelText(/確認する時刻/)).toHaveValue("18:00");
    expect(screen.getByRole("status")).toHaveAttribute("data-allowed", "false");
    expect(
      container.querySelector(".raid-selected-instant time"),
    ).toHaveAttribute("datetime", "2026-11-16T23:00:00.000Z");
  });

  it("distinguishes missing and repeated wall times during DST changes", () => {
    const { container } = render(
      <RaidTimeChecker now={now} timeZone="America/New_York" />,
    );
    setSelection("2026-03-08", "02:30");
    expect(screen.getByRole("status")).toHaveAttribute(
      "data-allowed",
      "unknown",
    );
    expect(screen.getByRole("status")).toHaveTextContent(
      "この日時は存在しません",
    );
    expect(container.querySelector(".raid-selected-instant")).toBeNull();
    setSelection("2026-11-01", "01:30");
    const select = screen.getByLabelText(
      /同じ時刻が2回あります。UTCオフセットを選択/,
    );
    expect(select.querySelectorAll("option")).toHaveLength(2);
    fireEvent.change(select, {
      target: { value: Date.parse("2026-11-01T06:30:00Z") },
    });
    expect(
      container.querySelector(".raid-selected-instant time"),
    ).toHaveAttribute("datetime", "2026-11-01T06:30:00.000Z");
  });

  it("keeps SSR controls disabled and requests a complete date and time", () => {
    const { rerender } = render(
      <RaidTimeChecker now={null} timeZone="Asia/Tokyo" />,
    );
    expect(screen.getByLabelText(/確認する日付/)).toBeDisabled();
    expect(screen.getByLabelText(/確認する時刻/)).toBeDisabled();
    rerender(<RaidTimeChecker now={now} timeZone="Asia/Tokyo" />);
    fireEvent.change(screen.getByLabelText(/確認する日付/), {
      target: { value: "" },
    });
    expect(screen.getByRole("status")).toHaveTextContent(
      "日付と時刻を選択してください",
    );
  });
});
