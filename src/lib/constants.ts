import type { ExternalDestination } from "@/content/types";

const defaultSiteUrl = "http://localhost:3000";

function parseHttpUrl(value: string | undefined): string | null {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);

    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

export const siteUrl = new URL(
  parseHttpUrl(process.env.NEXT_PUBLIC_SITE_URL) ?? defaultSiteUrl,
);

export const externalUrls = {
  discord: parseHttpUrl(process.env.NEXT_PUBLIC_DISCORD_INVITE_URL),
  tebex: parseHttpUrl(process.env.NEXT_PUBLIC_TEBEX_URL),
  moderatorApplication: parseHttpUrl(
    process.env.NEXT_PUBLIC_MODERATOR_APPLICATION_URL,
  ),
  x: parseHttpUrl(process.env.NEXT_PUBLIC_X_URL),
} as const;

export function getExternalUrl(destination: ExternalDestination) {
  return externalUrls[destination];
}
