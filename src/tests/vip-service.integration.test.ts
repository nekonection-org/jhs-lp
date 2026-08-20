import { afterAll, describe, expect, it } from "vitest";

import type { AdminIdentity } from "@/lib/auth/cloudflare-access";
import { getPrismaClient } from "@/lib/database/client";
import { updateManagedSection } from "@/lib/managed-sections/service";
import { findVipContent } from "@/lib/vip/repository";
import { vipContentToJson } from "@/lib/vip/stored-content";

const runIntegrationTests = process.env.RUN_DATABASE_INTEGRATION === "true";
const integrationDescribe = runIntegrationTests ? describe : describe.skip;

const identity: AdminIdentity = {
  sub: "vip-integration-test-admin",
  email: "integration-admin@example.com",
  requestId: "vip-integration-request",
};

integrationDescribe("VIP service with MySQL", () => {
  afterAll(async () => {
    await getPrismaClient().$disconnect();
  });

  it("updates both translations and records an audit trail", async () => {
    const original = await findVipContent();
    if (!original) throw new Error("Seeded VIP content is required.");
    const marker = crypto.randomUUID();

    try {
      const updated = await updateManagedSection(
        "vip",
        original.version,
        {
          ja: vipContentToJson({
            ...original.translations.ja,
            statusTitle: `VIP統合テスト ${marker}`,
          }),
          en: vipContentToJson({
            ...original.translations.en,
            statusTitle: `VIP integration test ${marker}`,
          }),
        },
        identity,
      );

      expect(updated.version).toBe(original.version + 1);
      await expect(
        getPrismaClient().auditLog.findFirst({
          where: { managedSectionId: "vip", actorSub: identity.sub },
          orderBy: { createdAt: "desc" },
        }),
      ).resolves.toMatchObject({ managedSectionId: "vip" });
    } finally {
      const current = await findVipContent();
      if (current) {
        await updateManagedSection(
          "vip",
          current.version,
          {
            ja: vipContentToJson(original.translations.ja),
            en: vipContentToJson(original.translations.en),
          },
          identity,
        );
      }
      await getPrismaClient().auditLog.deleteMany({
        where: { managedSectionId: "vip", actorSub: identity.sub },
      });
    }
  }, 15_000);

  it("rolls back content changes when the audit insert fails", async () => {
    const before = await findVipContent();
    if (!before) throw new Error("Seeded VIP content is required.");

    await expect(
      updateManagedSection(
        "vip",
        before.version,
        {
          ja: vipContentToJson(before.translations.ja),
          en: vipContentToJson(before.translations.en),
        },
        { ...identity, sub: "x".repeat(256) },
      ),
    ).rejects.toThrow();

    await expect(findVipContent()).resolves.toMatchObject({
      version: before.version,
    });
  }, 15_000);
});
