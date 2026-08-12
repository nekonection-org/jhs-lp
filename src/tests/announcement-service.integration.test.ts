import { afterAll, describe, expect, it } from "vitest";

import { AuditAction } from "@/generated/prisma/enums";
import {
  archiveAnnouncement,
  createAnnouncement,
  updateAnnouncement,
} from "@/lib/announcements/service";
import type { AnnouncementInput } from "@/lib/announcements/types";
import type { AdminIdentity } from "@/lib/auth/cloudflare-access";
import { getPrismaClient } from "@/lib/database/client";

const runIntegrationTests = process.env.RUN_DATABASE_INTEGRATION === "true";
const integrationDescribe = runIntegrationTests ? describe : describe.skip;

const identity: AdminIdentity = {
  sub: "integration-test-admin",
  email: "integration-admin@example.com",
  requestId: "integration-request",
};

function draftInput(marker: string): AnnouncementInput {
  return {
    category: "notice",
    status: "draft",
    publishedAt: null,
    externalUrl: null,
    translations: {
      ja: {
        title: `統合テスト ${marker}`,
        description: "統合テスト用のお知らせです。",
      },
      en: null,
    },
  };
}

async function removeIntegrationAnnouncement(id: string) {
  const database = getPrismaClient();

  await database.$transaction([
    database.auditLog.deleteMany({ where: { announcementId: id } }),
    database.announcement.deleteMany({ where: { id } }),
  ]);
}

integrationDescribe("announcement service with MySQL", () => {
  afterAll(async () => {
    await getPrismaClient().$disconnect();
  });

  it("persists draft, scheduled publication, archive, and their audit trail", async () => {
    const database = getPrismaClient();
    const marker = crypto.randomUUID();
    let announcementId: string | null = null;

    try {
      const draft = await createAnnouncement(draftInput(marker), identity);
      announcementId = draft.id;

      expect(draft.status).toBe("draft");
      expect(draft.translations).toHaveLength(1);

      const scheduledAt = new Date(Date.now() + 60 * 60 * 1000);
      const scheduled = await updateAnnouncement(
        draft.id,
        draft.version,
        {
          ...draftInput(marker),
          status: "published",
          publishedAt: scheduledAt,
          externalUrl: "https://example.com/integration-announcement",
          translations: {
            ...draftInput(marker).translations,
            en: {
              title: `Integration test ${marker}`,
              description: "Database integration announcement.",
            },
          },
        },
        identity,
      );

      expect(scheduled.status).toBe("published");
      expect(scheduled.publishedAt).toEqual(scheduledAt);

      const notYetPublic = await database.announcement.findMany({
        where: {
          id: draft.id,
          status: "PUBLISHED",
          publishedAt: { lte: new Date() },
        },
      });
      expect(notYetPublic).toHaveLength(0);

      const archived = await archiveAnnouncement(
        scheduled.id,
        scheduled.version,
        identity,
      );
      expect(archived.status).toBe("archived");

      const auditLogs = await database.auditLog.findMany({
        where: { announcementId: draft.id },
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
      expect(auditLogs[1]?.beforeData).not.toBeNull();
      expect(auditLogs[1]?.afterData).not.toBeNull();
    } finally {
      if (announcementId) {
        await removeIntegrationAnnouncement(announcementId);
      }
    }
  }, 15_000);

  it("rolls back the announcement when its audit insert fails", async () => {
    const database = getPrismaClient();
    const beforeCount = await database.announcement.count();

    await expect(
      createAnnouncement(draftInput(crypto.randomUUID()), {
        ...identity,
        sub: "x".repeat(256),
      }),
    ).rejects.toThrow();

    await expect(database.announcement.count()).resolves.toBe(beforeCount);
  }, 15_000);
});
