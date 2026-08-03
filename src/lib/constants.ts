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

function parseRustServerAddress(value: string | undefined): string | null {
  const address = value?.trim();

  if (
    !address ||
    address.length > 253 ||
    !/^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?::\d{1,5})?$/.test(
      address,
    )
  ) {
    return null;
  }

  const port = address.match(/:(\d{1,5})$/)?.[1];

  if (port && (Number(port) < 1 || Number(port) > 65_535)) {
    return null;
  }

  return address;
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

const rustServerAddress = parseRustServerAddress(
  process.env.NEXT_PUBLIC_RUST_SERVER_ADDRESS,
);

export const rustConnection = rustServerAddress
  ? {
      address: rustServerAddress,
      command: `client.connect ${rustServerAddress}`,
      steamUrl: `steam://run/252490//+connect%20${rustServerAddress}`,
    }
  : null;

export function getExternalUrl(destination: ExternalDestination) {
  return externalUrls[destination];
}
