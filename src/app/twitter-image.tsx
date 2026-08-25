import { ImageResponse } from "next/og";

import {
  SocialPreview,
  socialPreviewAlt,
  socialPreviewSize,
} from "@/app/social-preview";

export const alt = socialPreviewAlt;
export const size = socialPreviewSize;
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(<SocialPreview />, size);
}
