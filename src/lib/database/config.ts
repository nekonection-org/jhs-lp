import { readFileSync } from "node:fs";

export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

type Environment = Readonly<Record<string, string | undefined>>;
type ReadSecret = (path: string) => string;

function requireValue(environment: Environment, name: string) {
  const value = environment[name]?.trim();

  if (!value) {
    throw new Error(`Missing required database configuration: ${name}`);
  }

  return value;
}

function parsePort(value: string) {
  if (!/^\d{1,5}$/.test(value)) {
    throw new Error("DATABASE_PORT must be a valid TCP port.");
  }

  const port = Number(value);

  if (port < 1 || port > 65_535) {
    throw new Error("DATABASE_PORT must be between 1 and 65535.");
  }

  return port;
}

function readDatabasePassword(
  environment: Environment,
  readSecret: ReadSecret,
) {
  const secretPath = environment.DATABASE_PASSWORD_FILE?.trim();

  if (secretPath) {
    const password = readSecret(secretPath).trimEnd();

    if (!password) {
      throw new Error("DATABASE_PASSWORD_FILE contains an empty value.");
    }

    return password;
  }

  return requireValue(environment, "DATABASE_PASSWORD");
}

export function getDatabaseConfig(
  environment: Environment = process.env,
  readSecret: ReadSecret = (path) => readFileSync(path, "utf8"),
): DatabaseConfig {
  return {
    host: requireValue(environment, "DATABASE_HOST"),
    port: parsePort(environment.DATABASE_PORT?.trim() || "3306"),
    user: requireValue(environment, "DATABASE_USER"),
    password: readDatabasePassword(environment, readSecret),
    database: requireValue(environment, "DATABASE_NAME"),
  };
}
