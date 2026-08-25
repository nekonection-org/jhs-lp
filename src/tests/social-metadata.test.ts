import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { socialPreviewImage } from "@/lib/social-metadata";

describe("social preview metadata", () => {
  it("references the committed public banner with its actual dimensions", () => {
    const banner = readFileSync(join(process.cwd(), "public/banner.png"));

    expect(banner.subarray(1, 4).toString("ascii")).toBe("PNG");
    expect(banner.readUInt32BE(16)).toBe(socialPreviewImage.width);
    expect(banner.readUInt32BE(20)).toBe(socialPreviewImage.height);
    expect(socialPreviewImage.url).toBe("/banner.png");
  });
});
