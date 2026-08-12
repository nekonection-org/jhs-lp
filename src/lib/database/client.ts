import "server-only";

import { PrismaMariaDb } from "@prisma/adapter-mariadb";

import { PrismaClient } from "@/generated/prisma/client";
import { getDatabaseConfig } from "@/lib/database/config";

const globalDatabase = globalThis as typeof globalThis & {
  jhsPrisma?: PrismaClient;
};

function createPrismaClient() {
  const config = getDatabaseConfig();
  const adapter = new PrismaMariaDb({
    ...config,
    acquireTimeout: 10_000,
    connectTimeout: 5_000,
    connectionLimit: 5,
    idleTimeout: 300,
    timezone: "Z",
  });

  return new PrismaClient({ adapter });
}

export function getPrismaClient() {
  globalDatabase.jhsPrisma ??= createPrismaClient();
  return globalDatabase.jhsPrisma;
}
