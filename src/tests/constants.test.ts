import { afterEach, describe, expect, it, vi } from "vitest";

const environmentKeys = [
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_DISCORD_INVITE_URL",
  "NEXT_PUBLIC_RUST_SERVER_ADDRESS",
  "NEXT_PUBLIC_TEBEX_URL",
  "NEXT_PUBLIC_MODERATOR_APPLICATION_URL",
  "NEXT_PUBLIC_X_URL",
] as const;

afterEach(() => {
  vi.resetModules();
  vi.unstubAllEnvs();
});

describe("public URL configuration", () => {
  it("uses valid HTTP(S) URLs from the environment", async () => {
    const configuredUrls = {
      NEXT_PUBLIC_SITE_URL: "https://japan-hideaway.example/base",
      NEXT_PUBLIC_DISCORD_INVITE_URL: "https://discord.gg/japan-hideaway",
      NEXT_PUBLIC_RUST_SERVER_ADDRESS: "play.jhs.nekonection.com:28015",
      NEXT_PUBLIC_TEBEX_URL: "https://japan-hideaway.tebex.io",
      NEXT_PUBLIC_MODERATOR_APPLICATION_URL:
        "https://forms.example.test/jhs-moderator",
      NEXT_PUBLIC_X_URL: "https://x.com/japan_hideaway",
    } as const;

    for (const key of environmentKeys) {
      vi.stubEnv(key, configuredUrls[key]);
    }

    const { externalUrls, getExternalUrl, rustConnection, siteUrl } =
      await import("@/lib/constants");

    expect(siteUrl.href).toBe(
      new URL(configuredUrls.NEXT_PUBLIC_SITE_URL).href,
    );
    expect(externalUrls).toEqual({
      discord: new URL(configuredUrls.NEXT_PUBLIC_DISCORD_INVITE_URL).href,
      tebex: new URL(configuredUrls.NEXT_PUBLIC_TEBEX_URL).href,
      moderatorApplication: new URL(
        configuredUrls.NEXT_PUBLIC_MODERATOR_APPLICATION_URL,
      ).href,
      x: new URL(configuredUrls.NEXT_PUBLIC_X_URL).href,
    });
    expect(getExternalUrl("discord")).toBe(externalUrls.discord);
    expect(getExternalUrl("tebex")).toBe(externalUrls.tebex);
    expect(getExternalUrl("moderatorApplication")).toBe(
      externalUrls.moderatorApplication,
    );
    expect(rustConnection).toEqual({
      address: configuredUrls.NEXT_PUBLIC_RUST_SERVER_ADDRESS,
      command: `client.connect ${configuredUrls.NEXT_PUBLIC_RUST_SERVER_ADDRESS}`,
      steamUrl: `steam://run/252490//+connect%20${configuredUrls.NEXT_PUBLIC_RUST_SERVER_ADDRESS}`,
    });
  });

  it("rejects unsafe or malformed public URLs", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "javascript:alert(1)");
    vi.stubEnv("NEXT_PUBLIC_DISCORD_INVITE_URL", "javascript:alert(1)");
    vi.stubEnv("NEXT_PUBLIC_TEBEX_URL", "not a URL");
    vi.stubEnv("NEXT_PUBLIC_MODERATOR_APPLICATION_URL", "data:text/plain,no");
    vi.stubEnv("NEXT_PUBLIC_X_URL", "file:///tmp/account");
    vi.stubEnv(
      "NEXT_PUBLIC_RUST_SERVER_ADDRESS",
      "play.jhs.nekonection.com;quit",
    );

    const { externalUrls, rustConnection, siteUrl } =
      await import("@/lib/constants");

    expect(siteUrl.href).toBe("http://localhost:3000/");
    expect(externalUrls).toEqual({
      discord: null,
      tebex: null,
      moderatorApplication: null,
      x: null,
    });
    expect(rustConnection).toBeNull();
  });
});
