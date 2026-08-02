"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

const themeColors = {
  dark: "#08090b",
  light: "#f4f5f6",
} as const;

export function ThemeColorSync() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const themeColor =
      resolvedTheme === "light" ? themeColors.light : themeColors.dark;
    const metadata = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]',
    );

    metadata?.setAttribute("content", themeColor);
  }, [resolvedTheme]);

  return null;
}
