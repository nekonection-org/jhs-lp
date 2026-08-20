import { beforeEach, describe, expect, it, vi } from "vitest";

const { findVipContent, listPublishedAnnouncements, listPublishedFaqs } =
  vi.hoisted(() => ({
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

import { getPublicAnnouncements } from "@/lib/announcements/public";
import { getPublicFaqs } from "@/lib/faqs/public";
import { getPublicVipContent } from "@/lib/vip/public";

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
});
