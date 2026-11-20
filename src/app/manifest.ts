import type { MetadataRoute } from "next";

import { brandColors, brandIcon } from "@/lib/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Japan Hideaway Server",
    short_name: "JHS",
    description:
      "The official website of Japan Hideaway Server, a Rust community server with designated raiding hours.",
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
