import { readFileSync } from "node:fs";
import { join } from "node:path";

import { afterAll, describe, expect, it } from "vitest";

import type { Prisma } from "@/generated/prisma/client";
import { getPrismaClient } from "@/lib/database/client";

const integrationDescribe =
  process.env.RUN_DATABASE_INTEGRATION === "true" ? describe : describe.skip;
const announcementId = "d4e01c44-e829-4bb5-93c8-ffae42c0a106";
const statements = readFileSync(
  join(
    process.cwd(),
    "prisma/migrations/20261120050000_rename_japan_hideaway/migration.sql",
  ),
  "utf8",
)
  .replace(/^--.*$/gm, "")
  .split(";")
  .map((statement) => statement.trim())
  .filter(
    (statement) =>
      statement && statement !== "START TRANSACTION" && statement !== "COMMIT",
  );

async function renameBrand(transaction: Prisma.TransactionClient) {
  for (const statement of statements) {
    await transaction.$executeRawUnsafe(statement);
  }
}

integrationDescribe("brand rename migration with MySQL", () => {
  afterAll(async () => {
    await getPrismaClient().$disconnect();
  });

  it("renames seeded content once, preserves custom content and keeps audit history", async () => {
    const rollback = new Error("Rollback migration test fixtures");

    await expect(
      getPrismaClient().$transaction(async (transaction) => {
        const rulesBefore = await transaction.managedSection.findUniqueOrThrow({
          where: { id: "rules" },
        });
        const announcementBefore =
          await transaction.announcement.findUniqueOrThrow({
            where: { id: announcementId },
          });
        const auditCount = await transaction.auditLog.count();

        await transaction.$executeRaw`
          UPDATE managed_section_translations
          SET content = JSON_SET(content, '$.rulebook.title',
            CASE locale WHEN 'ja' THEN 'Japan Hideaway Server サーバールール'
                        WHEN 'en' THEN 'Japan Hideaway Server Rules' END)
          WHERE managed_section_id = 'rules'
        `;
        await transaction.$executeRaw`
          UPDATE announcement_translations
          SET description = CASE locale
            WHEN 'ja' THEN 'Japan Hideaway Serverの公式Webサイトを公開しました。'
            WHEN 'en' THEN 'The official website for Japan Hideaway Server is now live.' END
          WHERE announcement_id = ${announcementId}
        `;

        await renameBrand(transaction);

        const rulesAfter = await transaction.managedSection.findUniqueOrThrow({
          where: { id: "rules" },
          include: { translations: true },
        });
        expect(rulesAfter.version).toBe(rulesBefore.version + 1);
        expect(rulesAfter.translations).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              locale: "JA",
              content: expect.objectContaining({
                rulebook: expect.objectContaining({
                  title: "JapanHideaway.com サーバールール",
                }),
              }),
            }),
            expect.objectContaining({
              locale: "EN",
              content: expect.objectContaining({
                rulebook: expect.objectContaining({
                  title: "JapanHideaway.com Rules",
                }),
              }),
            }),
          ]),
        );
        const announcementAfter =
          await transaction.announcement.findUniqueOrThrow({
            where: { id: announcementId },
            include: { translations: true },
          });
        expect(announcementAfter.version).toBe(announcementBefore.version + 1);
        expect(announcementAfter.translations).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              locale: "JA",
              description: "JapanHideaway.comの公式Webサイトを公開しました。",
            }),
            expect.objectContaining({
              locale: "EN",
              description:
                "The official website for JapanHideaway.com is now live.",
            }),
          ]),
        );

        await renameBrand(transaction);
        await expect(
          transaction.managedSection.findUnique({ where: { id: "rules" } }),
        ).resolves.toMatchObject({ version: rulesAfter.version });
        await expect(
          transaction.announcement.findUnique({
            where: { id: announcementId },
          }),
        ).resolves.toMatchObject({ version: announcementAfter.version });

        await transaction.$executeRaw`
          UPDATE managed_section_translations
          SET content = JSON_SET(content, '$.rulebook.title', '管理者が設定した見出し')
          WHERE managed_section_id = 'rules'
        `;
        await transaction.announcementTranslation.updateMany({
          where: { announcementId },
          data: { description: "管理者が編集した告知本文" },
        });
        const customRules = await transaction.managedSection.findUnique({
          where: { id: "rules" },
          include: { translations: true },
        });
        const customAnnouncement = await transaction.announcement.findUnique({
          where: { id: announcementId },
          include: { translations: true },
        });

        await renameBrand(transaction);
        await expect(
          transaction.managedSection.findUnique({
            where: { id: "rules" },
            include: { translations: true },
          }),
        ).resolves.toEqual(customRules);
        await expect(
          transaction.announcement.findUnique({
            where: { id: announcementId },
            include: { translations: true },
          }),
        ).resolves.toEqual(customAnnouncement);
        expect(await transaction.auditLog.count()).toBe(auditCount);

        throw rollback;
      }),
    ).rejects.toBe(rollback);
  }, 15_000);
});
