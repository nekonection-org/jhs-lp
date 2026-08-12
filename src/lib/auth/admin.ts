import "server-only";

import { headers } from "next/headers";

import { authenticateAdminRequest } from "@/lib/auth/cloudflare-access";

export async function requireAdmin() {
  return authenticateAdminRequest(await headers());
}
