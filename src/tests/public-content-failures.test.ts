import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  findModeratorContent,
  findRulesContent,
  findVipContent,
  listPublishedAnnouncements,
  listPublishedFaqs,
} = vi.hoisted(() => ({
  findModeratorContent: vi.fn(),
  findRulesContent: vi.fn(),
  findVipContent: vi.fn(),
  listPublishedAnnouncements: vi.fn(),
  listPublishedFaqs: vi.fn(),
}));

vi.mock("next/cache", () => ({
  unstable_cache: (callback: () => unknown) => callback,
}));

vi.mock("@/lib/announcements/repository", () => ({
  listPublishedAnnouncements,
}));

vi.mock("@/lib/faqs/repository", () => ({ listPublishedFaqs }));
vi.mock("@/lib/vip/repository", () => ({ findVipContent }));
vi.mock("@/lib/moderator/repository", () => ({ findModeratorContent }));
vi.mock("@/lib/rules/repository", () => ({ findRulesContent }));

import { getPublicAnnouncements } from "@/lib/announcements/public";
import { getPublicFaqs } from "@/lib/faqs/public";
import { getPublicVipContent } from "@/lib/vip/public";
import { getPublicModeratorContent } from "@/lib/moderator/public";
import { getPublicRulesContent } from "@/lib/rules/public";

describe("public database failure handling", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  it("returns an unavailable FAQ result without rejecting the cache callback", async () => {
    listPublishedFaqs.mockRejectedValueOnce(
      new Error("Missing required database configuration: DATABASE_HOST"),
    );

    await expect(getPublicFaqs()).resolves.toEqual({
      status: "unavailable",
      items: [],
    });
    expect(console.error).toHaveBeenCalledWith("Public FAQs are unavailable.", {
      errorName: "Error",
    });
  });

  it("returns an unavailable announcement result without rejecting the cache callback", async () => {
    listPublishedAnnouncements.mockRejectedValueOnce(
      new Error("Missing required database configuration: DATABASE_HOST"),
    );

    await expect(getPublicAnnouncements()).resolves.toEqual({
      status: "unavailable",
      items: [],
    });
    expect(console.error).toHaveBeenCalledWith(
      "Public announcements are unavailable.",
      { errorName: "Error" },
    );
  });

  it("requests public announcements in fixed pages of five", async () => {
    listPublishedAnnouncements.mockResolvedValueOnce({
      items: [],
      page: 2,
      pageSize: 5,
      totalItems: 8,
      totalPages: 2,
    });

    await expect(getPublicAnnouncements(2)).resolves.toEqual({
      status: "ready",
      items: [],
      pagination: {
        page: 2,
        pageSize: 5,
        totalItems: 8,
        totalPages: 2,
      },
    });
    expect(listPublishedAnnouncements).toHaveBeenCalledWith({
      page: 2,
      pageSize: 5,
    });
  });

  it("returns an unavailable VIP result without removing the static fallback", async () => {
    findVipContent.mockRejectedValueOnce(
      new Error("Missing required database configuration: DATABASE_HOST"),
    );

    await expect(getPublicVipContent()).resolves.toEqual({
      status: "unavailable",
      item: null,
    });
    expect(console.error).toHaveBeenCalledWith(
      "Public VIP content is unavailable.",
      { errorName: "Error" },
    );
  });

  it("returns an unavailable moderator result without removing the static fallback", async () => {
    findModeratorContent.mockRejectedValueOnce(
      new Error("Missing required database configuration: DATABASE_HOST"),
    );

    await expect(getPublicModeratorContent()).resolves.toEqual({
      status: "unavailable",
      item: null,
    });
    expect(console.error).toHaveBeenCalledWith(
      "Public moderator content is unavailable.",
      { errorName: "Error" },
    );
  });

  it("returns an unavailable rules result without removing the static fallback", async () => {
    findRulesContent.mockRejectedValueOnce(
      new Error("Missing required database configuration: DATABASE_HOST"),
    );

    await expect(getPublicRulesContent()).resolves.toEqual({
      status: "unavailable",
      item: null,
    });
    expect(console.error).toHaveBeenCalledWith(
      "Public rules content is unavailable.",
      { errorName: "Error" },
    );
  });
});
