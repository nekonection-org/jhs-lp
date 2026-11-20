import type { NextConfig } from "next";

import { brandIcon } from "./src/lib/brand";

const iconUrl = new URL(brandIcon.src, "http://localhost");

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.96.0.36"],
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    localPatterns: [
      { pathname: "/**", search: "" },
      { pathname: iconUrl.pathname, search: iconUrl.search },
    ],
  },
};

export default nextConfig;
