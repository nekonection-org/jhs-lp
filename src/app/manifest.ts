import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Japan Hideaway Server",
    short_name: "JHS",
    description:
      "The official website of Japan Hideaway Server, a Rust community server with designated raiding hours.",
    start_url: "/",
    display: "standalone",
    background_color: "#08090b",
    theme_color: "#08090b",
    lang: "ja",
    icons: [
      {
        src: "/icon.png",
        sizes: "1254x1254",
        type: "image/png",
      },
    ],
  };
}
