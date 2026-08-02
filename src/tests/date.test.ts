import { describe, expect, it } from "vitest";

import { formatPublishedDate } from "@/lib/date";

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
