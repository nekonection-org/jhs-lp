const requiredVariables = [
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_DISCORD_INVITE_URL",
];

const optionalVariables = [
  "NEXT_PUBLIC_TEBEX_URL",
  "NEXT_PUBLIC_MODERATOR_APPLICATION_URL",
  "NEXT_PUBLIC_X_URL",
];
const reservedHostnames = new Set(["localhost", "127.0.0.1", "::1"]);
const reservedSuffixes = [".example", ".invalid", ".localhost", ".test"];
const documentationDomains = ["example.com", "example.net", "example.org"];
const errors = [];

function validatePublicUrl(name, required) {
  const value = process.env[name]?.trim();

  if (!value) {
    if (required) {
      errors.push(`${name} is required.`);
    }

    return;
  }

  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();

    if (url.protocol !== "https:") {
      errors.push(`${name} must use HTTPS.`);
    }

    if (
      reservedHostnames.has(hostname) ||
      reservedSuffixes.some((suffix) => hostname.endsWith(suffix)) ||
      documentationDomains.some(
        (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
      )
    ) {
      errors.push(`${name} must use a public production hostname.`);
    }
  } catch {
    errors.push(`${name} must be a valid absolute URL.`);
  }
}

for (const name of requiredVariables) {
  validatePublicUrl(name, true);
}

for (const name of optionalVariables) {
  validatePublicUrl(name, false);
}

if (errors.length > 0) {
  console.error("Public environment validation failed:");

  for (const error of errors) {
    console.error(`- ${error}`);
  }

  process.exitCode = 1;
} else {
  console.log("Public environment validation passed.");
}
