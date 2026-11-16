import { describe, expect, it } from "vitest";
import {
  formatUtcOffset,
  getZonedDate,
  resolveZonedDateTime,
} from "@/lib/zoned-date-time";

describe("wall-clock time conversion", () => {
  it.each([
    ["2026-11-16", "18:00", "Asia/Tokyo", "2026-11-16T09:00:00.000Z"],
    ["2026-11-16", "14:45", "Asia/Kathmandu", "2026-11-16T09:00:00.000Z"],
    ["2026-11-16", "14:30", "Asia/Kolkata", "2026-11-16T09:00:00.000Z"],
    ["2026-11-20", "22:00", "America/New_York", "2026-11-21T03:00:00.000Z"],
    ["2026-11-16", "00:00", "Australia/Sydney", "2026-11-15T13:00:00.000Z"],
  ])("resolves %s %s in %s", (date, time, zone, expected) => {
    expect(
      resolveZonedDateTime(date, time, zone).map((instant) =>
        new Date(instant).toISOString(),
      ),
    ).toEqual([expected]);
  });
  it("returns no instant for a skipped summer-time hour or calendar date", () => {
    expect(
      resolveZonedDateTime("2026-03-08", "02:30", "America/New_York"),
    ).toEqual([]);
    expect(resolveZonedDateTime("2011-12-30", "12:00", "Pacific/Apia")).toEqual(
      [],
    );
  });
  it("returns both occurrences of a repeated local hour, in chronological order", () => {
    expect(
      resolveZonedDateTime("2026-11-01", "01:30", "America/New_York").map(
        (instant) => new Date(instant).toISOString(),
      ),
    ).toEqual(["2026-11-01T05:30:00.000Z", "2026-11-01T06:30:00.000Z"]);
  });
  it("handles a thirty-minute summer-time transition", () => {
    expect(
      resolveZonedDateTime("2026-04-05", "01:45", "Australia/Lord_Howe").map(
        (instant) => new Date(instant).toISOString(),
      ),
    ).toEqual(["2026-04-04T14:45:00.000Z", "2026-04-04T15:15:00.000Z"]);
  });
  it("rejects malformed selections and invalid zones", () => {
    for (const [date, time, zone] of [
      ["2026-02-30", "18:00", "UTC"],
      ["2026-11-16", "24:00", "UTC"],
      ["", "18:00", "UTC"],
      ["2026-11-16", "12:00", "Invalid/Zone"],
      ["2026-11-16", "9:00", "UTC"],
    ]) {
      expect(resolveZonedDateTime(date ?? "", time ?? "", zone ?? "")).toEqual(
        [],
      );
    }
  });
  it("formats the selected zone's calendar date and seasonal UTC offset", () => {
    const instant = Date.parse("2026-11-16T00:00:00Z");
    expect(getZonedDate(instant, "America/New_York")).toBe("2026-11-15");
    expect(formatUtcOffset(instant, "America/New_York")).toBe("GMT-05:00");
  });
});
