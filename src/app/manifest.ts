import type { MetadataRoute } from "next";

import { en } from "@/content";
import { brandColors, brandIcon, brandName } from "@/lib/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: brandName,
    short_name: brandName,
    description: en.metadata.description,
    start_url: "/",
    display: "standalone",
    background_color: brandColors.background,
    theme_color: brandColors.background,
    lang: "ja",
    icons: [
      {
        src: brandIcon.src,
        sizes: `${brandIcon.width}x${brandIcon.height}`,
        type: "image/png",
      },
    ],
  };
}
