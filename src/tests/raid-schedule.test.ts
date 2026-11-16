import { describe, expect, it } from "vitest";

import {
  formatRaidCountdown,
  formatRaidDateTime,
  getRaidState,
  isRaidHourAllowed,
  isValidTimeZone,
} from "@/lib/raid-schedule";

describe("raid schedule", () => {
  it("includes weekday opening time and excludes the end boundary", () => {
    expect(isRaidHourAllowed("weekdays", 17.99)).toBe(false);
    expect(isRaidHourAllowed("weekdays", 18)).toBe(true);
    expect(isRaidHourAllowed("weekdays", 23.99)).toBe(true);
    expect(isRaidHourAllowed("weekdays", 24)).toBe(false);
  });

  it("opens at noon on weekends and closes at midnight", () => {
    expect(isRaidHourAllowed("weekends", 11.99)).toBe(false);
    expect(isRaidHourAllowed("weekends", 12)).toBe(true);
    expect(isRaidHourAllowed("weekends", 23.99)).toBe(true);
    expect(isRaidHourAllowed("weekends", 24)).toBe(false);
  });

  it("rejects invalid hours", () => {
    for (const hour of [-1, 25, NaN, Infinity, -Infinity]) {
      expect(isRaidHourAllowed("weekdays", hour)).toBe(false);
      expect(isRaidHourAllowed("weekends", hour)).toBe(false);
    }
  });
});

function getWindow(state: ReturnType<typeof getRaidState>, index = 0) {
  const window = state.upcoming[index];
  if (!window) throw new Error("Expected a dated raid window");
  return window;
}

describe("live raid schedule", () => {
  it("opens exactly at 18:00 JST on a weekday and closes at midnight", () => {
    expect(getRaidState(Date.parse("2026-11-16T08:59:59.999Z")).allowed).toBe(
      false,
    );
    const open = getRaidState(Date.parse("2026-11-16T09:00:00Z"));
    expect(open.allowed).toBe(true);
    expect(new Date(open.nextTransition).toISOString()).toBe(
      "2026-11-16T15:00:00.000Z",
    );
    expect(getRaidState(Date.parse("2026-11-16T14:59:59.999Z")).allowed).toBe(
      true,
    );
    const closed = getRaidState(Date.parse("2026-11-16T15:00:00Z"));
    expect(closed.allowed).toBe(false);
    expect(new Date(closed.nextTransition).toISOString()).toBe(
      "2026-11-17T09:00:00.000Z",
    );
  });

  it("uses the Tokyo calendar when UTC and overseas calendars are still Friday", () => {
    const saturday = getRaidState(Date.parse("2026-11-20T15:00:00Z"));
    expect(getWindow(saturday).japanDate).toBe("2026-11-21");
    expect(getWindow(saturday).day).toBe("weekends");
    expect(new Date(saturday.nextTransition).toISOString()).toBe(
      "2026-11-21T03:00:00.000Z",
    );
    expect(getRaidState(Date.parse("2026-11-21T02:59:59Z")).allowed).toBe(
      false,
    );
    expect(getRaidState(Date.parse("2026-11-21T03:00:00Z")).allowed).toBe(true);
  });

  it("resumes weekday rules after Sunday and returns seven dated windows", () => {
    const monday = getRaidState(Date.parse("2026-11-22T15:00:00Z"));
    expect(monday.upcoming).toHaveLength(7);
    expect(getWindow(monday).day).toBe("weekdays");
    expect(new Date(monday.nextTransition).toISOString()).toBe(
      "2026-11-23T09:00:00.000Z",
    );
  });

  it("converts each endpoint with its date, including a local midnight crossing", () => {
    const state = getRaidState(Date.parse("2026-11-16T00:00:00Z"));
    expect(
      formatRaidDateTime(getWindow(state).start, "Australia/Sydney", "en-GB"),
    ).toContain("20:00");
    const end = formatRaidDateTime(
      getWindow(state).end,
      "Australia/Sydney",
      "en-GB",
    );
    expect(end).toContain("17 Nov");
    expect(end).toContain("02:00");
  });

  it("applies US summer time per date without shifting the Japanese rules", () => {
    const state = getRaidState(Date.parse("2026-10-31T00:00:00Z"));
    const saturday = getWindow(state);
    const sunday = getWindow(state, 1);
    expect(
      formatRaidDateTime(saturday.start, "America/New_York", "en-GB"),
    ).toContain("23:00");
    expect(
      formatRaidDateTime(sunday.end, "America/New_York", "en-GB"),
    ).toContain("10:00");
    expect(sunday.start - saturday.start).toBe(24 * 60 * 60 * 1_000);
  });

  it("supports fractional offsets and validates saved zones", () => {
    const state = getRaidState(Date.parse("2026-11-16T00:00:00Z"));
    expect(
      formatRaidDateTime(state.nextTransition, "Asia/Kathmandu", "en-GB"),
    ).toContain("14:45");
    expect(isValidTimeZone("Asia/Kathmandu")).toBe(true);
    expect(isValidTimeZone("Invalid/Zone")).toBe(false);
    expect(() => getRaidState(NaN)).toThrow(RangeError);
  });

  it("formats a nonnegative second-accurate countdown", () => {
    expect(formatRaidCountdown(6 * 60 * 60 * 1_000)).toBe("06:00:00");
    expect(formatRaidCountdown(1)).toBe("00:00:01");
    expect(formatRaidCountdown(-1)).toBe("00:00:00");
  });
});
