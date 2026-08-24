import { afterAll, describe, expect, it } from "vitest";

import type { AdminIdentity } from "@/lib/auth/cloudflare-access";
import { getPrismaClient } from "@/lib/database/client";
import { updateManagedSection } from "@/lib/managed-sections/service";
import { findRulesContent } from "@/lib/rules/repository";
import { rulesContentToJson } from "@/lib/rules/stored-content";

const runIntegrationTests = process.env.RUN_DATABASE_INTEGRATION === "true";
const integrationDescribe = runIntegrationTests ? describe : describe.skip;

const identity: AdminIdentity = {
  sub: "rules-integration-test-admin",
  email: "integration-admin@example.com",
  requestId: "rules-integration-request",
};

integrationDescribe("rules content service with MySQL", () => {
  afterAll(async () => {
    await getPrismaClient().$disconnect();
  });

  it("updates both translations and records an audit trail", async () => {
    const original = await findRulesContent();
    if (!original) throw new Error("Seeded rules content is required.");
    const marker = crypto.randomUUID();

    try {
      const updated = await updateManagedSection(
        "rules",
        original.version,
        {
          ja: rulesContentToJson({
            ...original.translations.ja,
            noticeTitle: `ルール統合テスト ${marker}`,
          }),
          en: rulesContentToJson({
            ...original.translations.en,
            noticeTitle: `Rules integration test ${marker}`,
          }),
        },
        identity,
      );

      expect(updated.version).toBe(original.version + 1);
      await expect(
        getPrismaClient().auditLog.findFirst({
          where: { managedSectionId: "rules", actorSub: identity.sub },
          orderBy: { createdAt: "desc" },
        }),
      ).resolves.toMatchObject({ managedSectionId: "rules" });
    } finally {
      const current = await findRulesContent();
      if (current) {
        await updateManagedSection(
          "rules",
          current.version,
          {
            ja: rulesContentToJson(original.translations.ja),
            en: rulesContentToJson(original.translations.en),
          },
          identity,
        );
      }
      await getPrismaClient().auditLog.deleteMany({
        where: { managedSectionId: "rules", actorSub: identity.sub },
      });
    }
  }, 15_000);
});
