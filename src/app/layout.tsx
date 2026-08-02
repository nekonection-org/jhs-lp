import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";

import "./globals.css";

import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { ThemeColorSync } from "@/components/providers/ThemeColorSync";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ja } from "@/content";
import { siteUrl } from "@/lib/constants";

const geist = localFont({
  src: "./fonts/Geist-Variable.woff2",
  variable: "--font-geist",
  display: "swap",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: ja.metadata.title,
  description: ja.metadata.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    alternateLocale: ["en_US"],
    siteName: ja.common.siteName,
    title: ja.metadata.title,
    description: ja.metadata.description,
    url: "/",
    images: [
      {
        url: "/icon.png",
        width: 1254,
        height: 1254,
        alt: ja.metadata.openGraphImageAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: ja.metadata.title,
    description: ja.metadata.description,
    images: [
      {
        url: "/icon.png",
        alt: ja.metadata.openGraphImageAlt,
      },
    ],
  },
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/icon.png", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: "#08090b",
  width: "device-width",
  initialScale: 1,
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={geist.variable}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ThemeColorSync />
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
