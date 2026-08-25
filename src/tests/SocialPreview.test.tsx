import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  SocialPreview,
  socialPreviewAlt,
  socialPreviewSize,
} from "@/app/social-preview";
import { brandColors } from "@/lib/brand";

describe("SocialPreview", () => {
  it("uses the JHS palette and social sharing dimensions", () => {
    render(<SocialPreview />);

    expect(screen.getByTestId("social-preview")).toHaveStyle({
      backgroundColor: brandColors.background,
      color: brandColors.text,
    });
    expect(screen.getByText("Rust Server")).toBeInTheDocument();
    expect(screen.getByText("Designated raid hours")).toBeInTheDocument();
    expect(socialPreviewSize).toEqual({ width: 1200, height: 630 });
    expect(socialPreviewAlt).toContain("Japan Hideaway Server");
  });
});
