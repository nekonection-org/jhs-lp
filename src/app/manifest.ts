import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Japan Hideaway Server",
    short_name: "JHS",
    description:
      "Japan Hideaway Serverのサーバー情報、ルール、VIP、FAQ、お知らせを案内する公式LPです。",
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
