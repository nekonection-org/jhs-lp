import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Japan Hideaway Server",
    short_name: "JHS",
    description:
      "Japan Hideaway Serverのサーバー情報、ルール、VIP、FAQ、お知らせを案内する公式LPです。",
    start_url: "/",
    display: "standalone",
    background_color: "#090c0a",
    theme_color: "#090c0a",
    lang: "ja",
    icons: [
      {
        src: "/icon",
        sizes: "64x64",
        type: "image/png",
      },
    ],
  };
}
