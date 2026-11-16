import { describe, expect, it, vi } from "vitest";

const { findFirst } = vi.hoisted(() => ({ findFirst: vi.fn() }));
vi.mock("@/lib/database/client", () => ({
  getPrismaClient: () => ({ announcement: { findFirst } }),
}));

import { findPublishedAnnouncement } from "@/lib/announcements/repository";

describe("public announcement lookup", () => {
  it("requires the requested ID, a published status, and an elapsed publication time", async () => {
    const now = new Date("2026-08-06T09:00:00.000Z");
    findFirst.mockResolvedValueOnce(null);
    await expect(
      findPublishedAnnouncement("unpublished", now),
    ).resolves.toBeNull();
    expect(findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: "unpublished",
          status: "PUBLISHED",
          publishedAt: { lte: now },
        },
      }),
    );
  });

  it("propagates an unavailable database so the page can show a retry state", async () => {
    findFirst.mockRejectedValueOnce(new Error("Database unavailable"));
    await expect(findPublishedAnnouncement("notice")).rejects.toThrow(
      "Database unavailable",
    );
  });
});
