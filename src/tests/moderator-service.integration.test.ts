import { afterAll, describe, expect, it } from "vitest";

import type { AdminIdentity } from "@/lib/auth/cloudflare-access";
import { getPrismaClient } from "@/lib/database/client";
import { updateManagedSection } from "@/lib/managed-sections/service";
import { findModeratorContent } from "@/lib/moderator/repository";
import { moderatorContentToJson } from "@/lib/moderator/stored-content";

const runIntegrationTests = process.env.RUN_DATABASE_INTEGRATION === "true";
const integrationDescribe = runIntegrationTests ? describe : describe.skip;

const identity: AdminIdentity = {
  sub: "moderator-integration-test-admin",
  email: "integration-admin@example.com",
  requestId: "moderator-integration-request",
};

integrationDescribe("moderator content service with MySQL", () => {
  afterAll(async () => {
    await getPrismaClient().$disconnect();
  });

  it("updates both translations and records an audit trail", async () => {
    const original = await findModeratorContent();
    if (!original) throw new Error("Seeded moderator content is required.");
    const marker = crypto.randomUUID();

    try {
      const updated = await updateManagedSection(
        "moderator",
        original.version,
        {
          ja: moderatorContentToJson({
            ...original.translations.ja,
            statusTitle: `募集統合テスト ${marker}`,
          }),
          en: moderatorContentToJson({
            ...original.translations.en,
            statusTitle: `Recruitment integration test ${marker}`,
          }),
        },
        identity,
      );

      expect(updated.version).toBe(original.version + 1);
      await expect(
        getPrismaClient().auditLog.findFirst({
          where: { managedSectionId: "moderator", actorSub: identity.sub },
          orderBy: { createdAt: "desc" },
        }),
      ).resolves.toMatchObject({ managedSectionId: "moderator" });
    } finally {
      const current = await findModeratorContent();
      if (current) {
        await updateManagedSection(
          "moderator",
          current.version,
          {
            ja: moderatorContentToJson(original.translations.ja),
            en: moderatorContentToJson(original.translations.en),
          },
          identity,
        );
      }
      await getPrismaClient().auditLog.deleteMany({
        where: { managedSectionId: "moderator", actorSub: identity.sub },
      });
    }
  }, 15_000);
});
