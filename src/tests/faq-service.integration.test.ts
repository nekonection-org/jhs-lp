import { afterAll, describe, expect, it } from "vitest";

import { AuditAction, FaqStatus } from "@/generated/prisma/enums";
import type { AdminIdentity } from "@/lib/auth/cloudflare-access";
import { getPrismaClient } from "@/lib/database/client";
import { listPublishedFaqs } from "@/lib/faqs/repository";
import { archiveFaq, createFaq, updateFaq } from "@/lib/faqs/service";
import type { FaqInput } from "@/lib/faqs/types";

const runIntegrationTests = process.env.RUN_DATABASE_INTEGRATION === "true";
const integrationDescribe = runIntegrationTests ? describe : describe.skip;

const identity: AdminIdentity = {
  sub: "faq-integration-test-admin",
  email: "integration-admin@example.com",
  requestId: "faq-integration-request",
};

function draftInput(marker: string): FaqInput {
  return {
    status: "draft",
    contentStatus: "confirmed",
    sortOrder: 9876,
    translations: {
      ja: {
        question: `統合テストの質問 ${marker}`,
        answer: "統合テスト用の回答です。",
      },
      en: null,
    },
  };
}

async function removeIntegrationFaq(id: string) {
  const database = getPrismaClient();
  await database.$transaction([
    database.auditLog.deleteMany({ where: { faqItemId: id } }),
    database.faqItem.deleteMany({ where: { id } }),
  ]);
}

integrationDescribe("FAQ service with MySQL", () => {
  afterAll(async () => {
    await getPrismaClient().$disconnect();
  });

  it("persists draft, publication, ordering, archive, and audit trail", async () => {
    const database = getPrismaClient();
    const marker = crypto.randomUUID();
    let faqId: string | null = null;

    try {
      const draft = await createFaq(draftInput(marker), identity);
      faqId = draft.id;
      expect(draft.status).toBe("draft");
      expect(draft.translations).toHaveLength(1);

      const published = await updateFaq(
        draft.id,
        draft.version,
        {
          ...draftInput(marker),
          status: "published",
          contentStatus: "pending",
          sortOrder: 1,
          translations: {
            ...draftInput(marker).translations,
            en: {
              question: `Integration FAQ ${marker}`,
              answer: "Database integration answer.",
            },
          },
        },
        identity,
      );

      expect(published.status).toBe("published");
      expect(published.contentStatus).toBe("pending");
      const publicFaqs = await listPublishedFaqs();
      expect(publicFaqs[0]?.id).toBe(published.id);

      const archived = await archiveFaq(
        published.id,
        published.version,
        identity,
      );
      expect(archived.status).toBe("archived");
      await expect(
        database.faqItem.findUnique({ where: { id: published.id } }),
      ).resolves.toMatchObject({ status: FaqStatus.ARCHIVED });

      const auditLogs = await database.auditLog.findMany({
        where: { faqItemId: draft.id },
        orderBy: { createdAt: "asc" },
      });
      expect(auditLogs.map(({ action }) => action)).toEqual([
        AuditAction.CREATE,
        AuditAction.UPDATE,
        AuditAction.ARCHIVE,
      ]);
      expect(
        auditLogs.every(({ actorEmail }) => actorEmail === identity.email),
      ).toBe(true);
    } finally {
      if (faqId) {
        await removeIntegrationFaq(faqId);
      }
    }
  }, 15_000);

  it("rolls back the FAQ when its audit insert fails", async () => {
    const database = getPrismaClient();
    const beforeCount = await database.faqItem.count();

    await expect(
      createFaq(draftInput(crypto.randomUUID()), {
        ...identity,
        sub: "x".repeat(256),
      }),
    ).rejects.toThrow();

    await expect(database.faqItem.count()).resolves.toBe(beforeCount);
  }, 15_000);
});
