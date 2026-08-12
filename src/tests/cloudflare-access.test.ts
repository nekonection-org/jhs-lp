// @vitest-environment node

import { generateKeyPair, SignJWT } from "jose";
import { beforeAll, describe, expect, it } from "vitest";

import {
  AdminAccessError,
  authenticateAdminRequest,
  getCloudflareAccessConfig,
  verifyCloudflareAccessToken,
  type CloudflareAccessConfig,
} from "@/lib/auth/cloudflare-access";

const teamDomain = "https://jhs-test.cloudflareaccess.com";
const audience = "jhs-admin-audience";
const allowedEmail = "admin@example.com";

const accessConfig: CloudflareAccessConfig = {
  teamDomain,
  audience,
  allowedEmails: new Set([allowedEmail]),
};

let privateKey: CryptoKey;
let publicKey: CryptoKey;

beforeAll(async () => {
  const keyPair = await generateKeyPair("RS256");
  privateKey = keyPair.privateKey;
  publicKey = keyPair.publicKey;
});

interface TokenOverrides {
  issuer?: string;
  audience?: string;
  email?: string;
  subject?: string;
  type?: string;
  expiration?: string | number;
  notBefore?: string | number;
}

function createToken(overrides: TokenOverrides = {}) {
  let token = new SignJWT({
    email: overrides.email ?? allowedEmail,
    type: overrides.type ?? "app",
  })
    .setProtectedHeader({ alg: "RS256", kid: "test-key" })
    .setIssuer(overrides.issuer ?? teamDomain)
    .setAudience(overrides.audience ?? audience)
    .setSubject(overrides.subject ?? "cloudflare-user-id")
    .setIssuedAt()
    .setExpirationTime(overrides.expiration ?? "5m");

  if (overrides.notBefore !== undefined) {
    token = token.setNotBefore(overrides.notBefore);
  }

  return token.sign(privateKey);
}

async function expectAccessFailure(
  operation: Promise<unknown>,
  failure: AdminAccessError["failure"],
) {
  await expect(operation).rejects.toMatchObject({
    name: "AdminAccessError",
    failure,
  });
}

describe("Cloudflare Access configuration", () => {
  it("normalizes the team domain and administrator allowlist", () => {
    const config = getCloudflareAccessConfig({
      CLOUDFLARE_ACCESS_TEAM_DOMAIN: `${teamDomain}/`,
      CLOUDFLARE_ACCESS_AUD: audience,
      ADMIN_ALLOWED_EMAILS: " Admin@Example.com , second@example.com ",
    });

    expect(config.teamDomain).toBe(teamDomain);
    expect(config.allowedEmails).toEqual(
      new Set([allowedEmail, "second@example.com"]),
    );
  });

  it.each([
    ["http://jhs-test.cloudflareaccess.com", "insecure protocol"],
    ["https://example.com", "untrusted hostname"],
    [`${teamDomain}/unexpected`, "unexpected path"],
  ])("rejects an invalid team domain: %s (%s)", (value) => {
    expect(() =>
      getCloudflareAccessConfig({
        CLOUDFLARE_ACCESS_TEAM_DOMAIN: value,
        CLOUDFLARE_ACCESS_AUD: audience,
        ADMIN_ALLOWED_EMAILS: allowedEmail,
      }),
    ).toThrow(AdminAccessError);
  });

  it("fails closed when authentication configuration is missing", () => {
    expect(() => getCloudflareAccessConfig({})).toThrow(
      expect.objectContaining({ failure: "unavailable", status: 503 }),
    );
  });
});

describe("Cloudflare Access JWT verification", () => {
  it("accepts a valid application token and normalizes its email", async () => {
    const token = await createToken({ email: "Admin@Example.com" });

    await expect(
      verifyCloudflareAccessToken(token, accessConfig, publicKey),
    ).resolves.toEqual({
      sub: "cloudflare-user-id",
      email: allowedEmail,
    });
  });

  it("rejects a valid identity that is outside the application allowlist", async () => {
    const token = await createToken({ email: "unknown@example.com" });
    await expectAccessFailure(
      verifyCloudflareAccessToken(token, accessConfig, publicKey),
      "forbidden",
    );
  });

  it.each([
    { overrides: { audience: "wrong-audience" }, caseName: "wrong audience" },
    {
      overrides: { issuer: "https://other.cloudflareaccess.com" },
      caseName: "wrong issuer",
    },
    { overrides: { expiration: 0 }, caseName: "expired token" },
    { overrides: { notBefore: "5m" }, caseName: "future token" },
    { overrides: { type: "org" }, caseName: "wrong token type" },
    { overrides: { subject: "" }, caseName: "missing subject" },
    { overrides: { email: "" }, caseName: "missing email" },
  ] as const)("rejects $caseName", async ({ overrides }) => {
    const token = await createToken(overrides);
    await expectAccessFailure(
      verifyCloudflareAccessToken(token, accessConfig, publicKey),
      "unauthenticated",
    );
  });
});

describe("administrator request authentication", () => {
  it("permits the explicit development bypass only for an allowed email", async () => {
    await expect(
      authenticateAdminRequest(new Headers({ "cf-ray": "test-ray" }), {
        NODE_ENV: "development",
        ADMIN_DEV_BYPASS: "true",
        ADMIN_DEV_EMAIL: "Admin@Example.com",
        ADMIN_ALLOWED_EMAILS: allowedEmail,
      }),
    ).resolves.toEqual({
      sub: `development:${allowedEmail}`,
      email: allowedEmail,
      requestId: "test-ray",
    });
  });

  it("never honors the development bypass in production", async () => {
    await expectAccessFailure(
      authenticateAdminRequest(new Headers(), {
        NODE_ENV: "production",
        ADMIN_DEV_BYPASS: "true",
        ADMIN_DEV_EMAIL: allowedEmail,
        ADMIN_ALLOWED_EMAILS: allowedEmail,
        CLOUDFLARE_ACCESS_AUD: audience,
        CLOUDFLARE_ACCESS_TEAM_DOMAIN: teamDomain,
      }),
      "unauthenticated",
    );
  });
});
