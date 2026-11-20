import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import manifest from "@/app/manifest";
import { brandIcon } from "@/lib/brand";
import { socialPreviewImage } from "@/lib/social-metadata";

describe("social preview metadata", () => {
  it("references the committed public banner with its actual dimensions", () => {
    const banner = readFileSync(join(process.cwd(), "public/banner.png"));

    expect(banner.subarray(1, 4).toString("ascii")).toBe("PNG");
    expect(banner.readUInt32BE(16)).toBe(socialPreviewImage.width);
    expect(banner.readUInt32BE(20)).toBe(socialPreviewImage.height);
    expect(socialPreviewImage.url).toBe("/banner.png");
  });

  it("keeps the app icon aligned with the public icon and manifest", () => {
    const icon = readFileSync(join(process.cwd(), "public/icon.png"));
    const revision = createHash("sha256")
      .update(icon)
      .digest("hex")
      .slice(0, 12);

    expect(icon.subarray(1, 4).toString("ascii")).toBe("PNG");
    expect(icon.readUInt32BE(16)).toBe(brandIcon.width);
    expect(icon.readUInt32BE(20)).toBe(brandIcon.height);
    expect(brandIcon.src).toBe(`/icon.png?v=${revision}`);
    expect(manifest().icons).toContainEqual({
      src: brandIcon.src,
      sizes: `${icon.readUInt32BE(16)}x${icon.readUInt32BE(20)}`,
      type: "image/png",
    });
  });
});
