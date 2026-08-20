import "server-only";

import { AuditAction as DatabaseAuditAction } from "@/generated/prisma/enums";
import type { AuditLog } from "@/generated/prisma/client";
import type { AuditLogAction, AuditLogRecord } from "@/lib/audit/types";
import { getPrismaClient } from "@/lib/database/client";

export const AUDIT_LOG_LIMIT = 100;

const actionFromDatabase: Readonly<
  Record<DatabaseAuditAction, AuditLogAction>
> = {
  CREATE: "create",
  UPDATE: "update",
  ARCHIVE: "archive",
};

function mapAuditLogRecord(auditLog: AuditLog): AuditLogRecord {
  return {
    id: auditLog.id,
    action: actionFromDatabase[auditLog.action],
    actorEmail: auditLog.actorEmail,
    announcementId: auditLog.announcementId,
    faqItemId: auditLog.faqItemId,
    managedSectionId: auditLog.managedSectionId,
    beforeData: auditLog.beforeData,
    afterData: auditLog.afterData,
    createdAt: auditLog.createdAt,
  };
}

export async function listLatestAuditLogs() {
  const auditLogs = await getPrismaClient().auditLog.findMany({
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: AUDIT_LOG_LIMIT,
  });

  return auditLogs.map(mapAuditLogRecord);
}
