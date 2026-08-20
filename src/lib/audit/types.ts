export type AuditLogAction = "create" | "update" | "archive";

export interface AuditLogRecord {
  id: string;
  action: AuditLogAction;
  actorEmail: string;
  announcementId: string | null;
  faqItemId: string | null;
  managedSectionId: string | null;
  beforeData: unknown | null;
  afterData: unknown | null;
  createdAt: Date;
}
