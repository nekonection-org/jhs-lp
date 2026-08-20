import { describe, expect, it } from "vitest";

import nextConfig from "../../next.config";

describe("Next.js configuration", () => {
  it("allows only the configured Tailscale host to load development resources", () => {
    expect(nextConfig.allowedDevOrigins).toEqual(["10.96.0.36"]);
    expect(nextConfig.allowedDevOrigins).not.toContain("*");
  });
});
