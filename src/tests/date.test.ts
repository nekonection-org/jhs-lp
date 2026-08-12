import { describe, expect, it } from "vitest";

import { formatAnnouncementDate, formatPublishedDate } from "@/lib/date";

describe("formatPublishedDate", () => {
  it("formats a calendar date for Japanese without a timezone shift", () => {
    expect(formatPublishedDate("2026-08-02", "ja")).toBe("2026年8月2日");
  });

  it("formats the same date for English", () => {
    expect(formatPublishedDate("2026-08-02", "en")).toBe("Aug 2, 2026");
  });

  it("returns an invalid source value unchanged", () => {
    expect(formatPublishedDate("not-a-date", "ja")).toBe("not-a-date");
  });
});

describe("formatAnnouncementDate", () => {
  it("formats a database timestamp using the Japan calendar date", () => {
    expect(formatAnnouncementDate(new Date("2026-08-12T16:00:00Z"), "ja")).toBe(
      "2026年8月13日",
    );
    expect(formatAnnouncementDate(new Date("2026-08-12T16:00:00Z"), "en")).toBe(
      "Aug 13, 2026",
    );
  });
});
