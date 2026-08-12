import { describe, expect, it } from "vitest";

import { getOperationalStatus } from "@/lib/announcements/types";

describe("getOperationalStatus", () => {
  const now = new Date("2026-08-13T09:00:00Z");

  it("distinguishes drafts, scheduled publications, live publications, and archives", () => {
    expect(
      getOperationalStatus({ status: "draft", publishedAt: null }, now),
    ).toBe("draft");
    expect(
      getOperationalStatus(
        { status: "published", publishedAt: new Date("2026-08-13T10:00:00Z") },
        now,
      ),
    ).toBe("scheduled");
    expect(
      getOperationalStatus(
        { status: "published", publishedAt: new Date("2026-08-13T08:00:00Z") },
        now,
      ),
    ).toBe("published");
    expect(
      getOperationalStatus({ status: "archived", publishedAt: null }, now),
    ).toBe("archived");
  });
});
