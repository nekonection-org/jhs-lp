import "dotenv/config";

import { readFileSync } from "node:fs";

import { defineConfig } from "prisma/config";

const placeholderDatabaseUrl =
  "mysql://jhs_local:local-placeholder@127.0.0.1:3306/jhs";

function requireEnvironmentValue(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required Prisma database configuration: ${name}`);
  }

  return value;
}

function readDatabasePassword() {
  const secretPath = process.env.DATABASE_PASSWORD_FILE?.trim();

  if (secretPath) {
    const password = readFileSync(secretPath, "utf8").trimEnd();

    if (!password) {
      throw new Error("DATABASE_PASSWORD_FILE contains an empty value.");
    }

    return password;
  }

  return requireEnvironmentValue("DATABASE_PASSWORD");
}

function buildDatabaseUrl() {
  const explicitUrl = process.env.DATABASE_URL?.trim();

  if (explicitUrl) {
    return explicitUrl;
  }

  const hasSplitConfiguration = [
    "DATABASE_HOST",
    "DATABASE_PORT",
    "DATABASE_USER",
    "DATABASE_PASSWORD",
    "DATABASE_PASSWORD_FILE",
    "DATABASE_NAME",
  ].some((name) => Boolean(process.env[name]?.trim()));

  if (
    !hasSplitConfiguration &&
    process.env.PRISMA_REQUIRE_DATABASE_CONFIG !== "true"
  ) {
    return placeholderDatabaseUrl;
  }

  const host = requireEnvironmentValue("DATABASE_HOST");
  const port = process.env.DATABASE_PORT?.trim() || "3306";

  if (!/^\d{1,5}$/.test(port) || Number(port) < 1 || Number(port) > 65_535) {
    throw new Error("DATABASE_PORT must be between 1 and 65535.");
  }

  const user = encodeURIComponent(requireEnvironmentValue("DATABASE_USER"));
  const password = encodeURIComponent(readDatabasePassword());
  const database = encodeURIComponent(requireEnvironmentValue("DATABASE_NAME"));

  return `mysql://${user}:${password}@${host}:${port}/${database}`;
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: buildDatabaseUrl(),
  },
});
