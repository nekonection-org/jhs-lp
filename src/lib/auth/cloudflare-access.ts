import { createRemoteJWKSet, errors as joseErrors, jwtVerify } from "jose";

type Environment = Readonly<Record<string, string | undefined>>;
type RequestHeaders = Pick<Headers, "get">;
type VerificationKey = Parameters<typeof jwtVerify>[1];

export interface AdminIdentity {
  sub: string;
  email: string;
  requestId: string | null;
}

export interface CloudflareAccessConfig {
  teamDomain: string;
  audience: string;
  allowedEmails: ReadonlySet<string>;
}

export type AdminAccessFailure =
  "unauthenticated" | "forbidden" | "unavailable";

export class AdminAccessError extends Error {
  readonly status: 401 | 403 | 503;
  readonly failure: AdminAccessFailure;

  constructor(failure: AdminAccessFailure) {
    const status =
      failure === "unauthenticated" ? 401 : failure === "forbidden" ? 403 : 503;

    super("Admin access denied.");
    this.name = "AdminAccessError";
    this.failure = failure;
    this.status = status;
  }
}

const remoteKeySets = new Map<string, ReturnType<typeof createRemoteJWKSet>>();

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function parseAllowedEmails(environment: Environment) {
  const values = (environment.ADMIN_ALLOWED_EMAILS ?? "")
    .split(",")
    .map(normalizeEmail)
    .filter(Boolean);

  if (values.length === 0) {
    throw new AdminAccessError("unavailable");
  }

  if (
    values.some(
      (value) =>
        value.length > 320 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    )
  ) {
    throw new AdminAccessError("unavailable");
  }

  return new Set(values);
}

function parseTeamDomain(value: string | undefined) {
  if (!value) {
    throw new AdminAccessError("unavailable");
  }

  try {
    const url = new URL(value);
    const validHostname = /^[a-z0-9-]+\.cloudflareaccess\.com$/i.test(
      url.hostname,
    );

    if (
      url.protocol !== "https:" ||
      !validHostname ||
      url.username ||
      url.password ||
      url.port ||
      (url.pathname !== "/" && url.pathname !== "") ||
      url.search ||
      url.hash
    ) {
      throw new Error("Invalid team domain.");
    }

    return url.origin;
  } catch {
    throw new AdminAccessError("unavailable");
  }
}

export function getCloudflareAccessConfig(
  environment: Environment = process.env,
): CloudflareAccessConfig {
  const audience = environment.CLOUDFLARE_ACCESS_AUD?.trim();

  if (!audience) {
    throw new AdminAccessError("unavailable");
  }

  return {
    teamDomain: parseTeamDomain(
      environment.CLOUDFLARE_ACCESS_TEAM_DOMAIN?.trim(),
    ),
    audience,
    allowedEmails: parseAllowedEmails(environment),
  };
}

function getRemoteKeySet(teamDomain: string) {
  let keySet = remoteKeySets.get(teamDomain);

  if (!keySet) {
    keySet = createRemoteJWKSet(new URL(`${teamDomain}/cdn-cgi/access/certs`), {
      timeoutDuration: 5_000,
    });
    remoteKeySets.set(teamDomain, keySet);
  }

  return keySet;
}

function isKeyServiceFailure(error: unknown) {
  return (
    error instanceof TypeError ||
    (error instanceof joseErrors.JOSEError && error.code === "ERR_JWKS_TIMEOUT")
  );
}

export async function verifyCloudflareAccessToken(
  token: string,
  config: CloudflareAccessConfig,
  verificationKey: VerificationKey = getRemoteKeySet(config.teamDomain),
): Promise<Omit<AdminIdentity, "requestId">> {
  try {
    const { payload } = await jwtVerify(token, verificationKey, {
      algorithms: ["RS256"],
      audience: config.audience,
      issuer: config.teamDomain,
    });

    if (
      payload.type !== "app" ||
      typeof payload.sub !== "string" ||
      !payload.sub.trim() ||
      typeof payload.email !== "string" ||
      !payload.email.trim()
    ) {
      throw new AdminAccessError("unauthenticated");
    }

    const email = normalizeEmail(payload.email);

    if (!config.allowedEmails.has(email)) {
      throw new AdminAccessError("forbidden");
    }

    return {
      sub: payload.sub,
      email,
    };
  } catch (error) {
    if (error instanceof AdminAccessError) {
      throw error;
    }

    if (isKeyServiceFailure(error)) {
      throw new AdminAccessError("unavailable");
    }

    throw new AdminAccessError("unauthenticated");
  }
}

function getRequestId(headers: RequestHeaders) {
  const value = headers.get("cf-ray") ?? headers.get("x-request-id");
  return value ? value.slice(0, 128) : null;
}

function getDevelopmentIdentity(
  headers: RequestHeaders,
  environment: Environment,
): AdminIdentity | null {
  if (
    environment.NODE_ENV !== "development" ||
    environment.ADMIN_DEV_BYPASS !== "true"
  ) {
    return null;
  }

  const allowedEmails = parseAllowedEmails(environment);
  const email = normalizeEmail(environment.ADMIN_DEV_EMAIL ?? "");

  if (!email || !allowedEmails.has(email)) {
    throw new AdminAccessError("forbidden");
  }

  return {
    sub: `development:${email}`,
    email,
    requestId: getRequestId(headers),
  };
}

export async function authenticateAdminRequest(
  headers: RequestHeaders,
  environment: Environment = process.env,
  verificationKey?: VerificationKey,
): Promise<AdminIdentity> {
  const developmentIdentity = getDevelopmentIdentity(headers, environment);

  if (developmentIdentity) {
    return developmentIdentity;
  }

  const config = getCloudflareAccessConfig(environment);
  const token = headers.get("cf-access-jwt-assertion")?.trim();

  if (!token) {
    throw new AdminAccessError("unauthenticated");
  }

  const identity = await verifyCloudflareAccessToken(
    token,
    config,
    verificationKey,
  );

  return {
    ...identity,
    requestId: getRequestId(headers),
  };
}
