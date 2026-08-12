// @vitest-environment node

import { unstable_doesMiddlewareMatch } from "next/experimental/testing/server";
import { describe, expect, it } from "vitest";

import { config } from "@/proxy";

describe("admin proxy matcher", () => {
  it.each(["/admin", "/admin/", "/admin/news", "/admin/audit"])(
    "protects %s",
    (pathname) => {
      expect(
        unstable_doesMiddlewareMatch({
          config,
          nextConfig: {},
          url: `https://jhs.example${pathname}`,
        }),
      ).toBe(true);
    },
  );

  it.each(["/", "/news", "/api/public"])("leaves %s public", (pathname) => {
    expect(
      unstable_doesMiddlewareMatch({
        config,
        nextConfig: {},
        url: `https://jhs.example${pathname}`,
      }),
    ).toBe(false);
  });
});
