import { describe, expect, it } from "vitest";

import { formatRaidDateTime } from "@/lib/raid-schedule";
import { getNextWipe, getWipeCountdown } from "@/lib/wipe-schedule";

describe("weekly wipe schedule", () => {
  it.each([
    ["2026-11-16T00:00:00Z", "2026-11-20T09:00:00.000Z"],
    ["2026-11-20T08:59:59.999Z", "2026-11-20T09:00:00.000Z"],
    ["2026-11-20T09:00:00Z", "2026-11-27T09:00:00.000Z"],
    ["2026-11-20T15:00:00Z", "2026-11-27T09:00:00.000Z"],
    ["2026-12-31T15:00:00Z", "2027-01-01T09:00:00.000Z"],
  ])("calculates the next Friday 18:00 JST after %s", (now, expected) => {
    expect(new Date(getNextWipe(Date.parse(now))).toISOString()).toBe(expected);
  });

  it("converts the same wipe to a local date in a different time zone", () => {
    const next = getNextWipe(Date.parse("2026-11-16T00:00:00Z"));
    expect(formatRaidDateTime(next, "Pacific/Honolulu", "en-GB")).toContain(
      "Thu 19 Nov, 23:00",
    );
    expect(formatRaidDateTime(next, "Asia/Tokyo", "en-GB")).toContain(
      "Fri 20 Nov, 18:00",
    );
  });

  it("applies daylight saving time to the display rather than the weekly rule", () => {
    const before = getNextWipe(Date.parse("2026-10-29T00:00:00Z"));
    const after = getNextWipe(Date.parse("2026-11-05T00:00:00Z"));
    expect(formatRaidDateTime(before, "America/New_York", "en-GB")).toContain(
      "05:00",
    );
    expect(formatRaidDateTime(after, "America/New_York", "en-GB")).toContain(
      "04:00",
    );
    expect(after - before).toBe(7 * 24 * 60 * 60 * 1_000);
  });

  it("shows whole days and rounded-up remaining seconds without negative values", () => {
    expect(
      getWipeCountdown(4 * 24 * 60 * 60 * 1_000 + 9 * 60 * 60 * 1_000),
    ).toEqual({ days: 4, time: "09:00:00" });
    expect(getWipeCountdown(24 * 60 * 60 * 1_000 - 1)).toEqual({
      days: 1,
      time: "00:00:00",
    });
    expect(getWipeCountdown(-1)).toEqual({ days: 0, time: "00:00:00" });
    expect(() => getNextWipe(NaN)).toThrow(RangeError);
  });
});
