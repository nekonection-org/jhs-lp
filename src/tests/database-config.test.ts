import { describe, expect, it, vi } from "vitest";

import { getDatabaseConfig } from "@/lib/database/config";

const baseEnvironment = {
  DATABASE_HOST: "mysql",
  DATABASE_NAME: "jhs",
  DATABASE_PASSWORD: "secret-value",
  DATABASE_PORT: "3306",
  DATABASE_USER: "jhs_app",
} as const;

describe("getDatabaseConfig", () => {
  it("reads validated MySQL connection settings", () => {
    expect(getDatabaseConfig(baseEnvironment)).toEqual({
      host: "mysql",
      port: 3306,
      user: "jhs_app",
      password: "secret-value",
      database: "jhs",
    });
  });

  it("prefers the Docker secret file over a plain environment value", () => {
    const readSecret = vi.fn(() => "file-secret\n");

    expect(
      getDatabaseConfig(
        {
          ...baseEnvironment,
          DATABASE_PASSWORD_FILE: "/run/secrets/mysql_password",
        },
        readSecret,
      ).password,
    ).toBe("file-secret");
    expect(readSecret).toHaveBeenCalledWith("/run/secrets/mysql_password");
  });

  it("fails closed when required values are missing or invalid", () => {
    expect(() =>
      getDatabaseConfig({ ...baseEnvironment, DATABASE_HOST: "" }),
    ).toThrow("DATABASE_HOST");
    expect(() =>
      getDatabaseConfig({ ...baseEnvironment, DATABASE_PORT: "70000" }),
    ).toThrow("between 1 and 65535");
    expect(() =>
      getDatabaseConfig(
        {
          ...baseEnvironment,
          DATABASE_PASSWORD_FILE: "/run/secrets/mysql_password",
        },
        () => "\n",
      ),
    ).toThrow("empty value");
  });
});
