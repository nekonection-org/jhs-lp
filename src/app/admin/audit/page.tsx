import { AuditSnapshotDetails } from "@/components/admin/AuditSnapshotDetails";
import { requireAdmin } from "@/lib/auth/admin";
import { auditActionLabels, formatAuditDate } from "@/lib/audit/presentation";
import { AUDIT_LOG_LIMIT, listLatestAuditLogs } from "@/lib/audit/repository";

export default async function AdminAuditPage() {
  await requireAdmin();
  const auditLogs = await listLatestAuditLogs();

  return (
    <div className="grid gap-8">
      <div>
        <p className="section-eyebrow">Audit log</p>
        <h1 className="mt-3 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
          操作ログ
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
          お知らせの作成、更新、アーカイブを新しい順に表示します。最新
          {AUDIT_LOG_LIMIT}件まで確認できます。
        </p>
      </div>

      {auditLogs.length > 0 ? (
        <div className="grid gap-3">
          {auditLogs.map((auditLog) => {
            const action = auditActionLabels[auditLog.action];

            return (
              <article
                className="surface-card grid gap-4 p-5 sm:p-6"
                key={auditLog.id}
              >
                <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md border border-[color-mix(in_srgb,var(--accent)_45%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_9%,var(--surface))] px-2 py-1 text-xs font-bold text-[var(--accent-strong)]">
                      {action.label}
                    </span>
                    <span className="font-mono text-xs text-[var(--text-muted)]">
                      {action.code}
                    </span>
                  </div>
                  <time
                    className="text-xs text-[var(--text-muted)]"
                    dateTime={auditLog.createdAt.toISOString()}
                  >
                    {formatAuditDate(auditLog.createdAt)}
                  </time>
                </header>

                <dl className="grid gap-3 text-sm sm:grid-cols-2">
                  <div className="min-w-0">
                    <dt className="text-xs font-semibold text-[var(--text-muted)]">
                      操作者
                    </dt>
                    <dd className="mt-1 break-all font-medium">
                      {auditLog.actorEmail}
                    </dd>
                  </div>
                  <div className="min-w-0">
                    <dt className="text-xs font-semibold text-[var(--text-muted)]">
                      対象のお知らせID
                    </dt>
                    <dd className="mt-1 break-all font-mono text-xs text-[var(--text-secondary)]">
                      {auditLog.announcementId ?? "対象なし"}
                    </dd>
                  </div>
                </dl>

                <AuditSnapshotDetails
                  afterData={auditLog.afterData}
                  beforeData={auditLog.beforeData}
                />
              </article>
            );
          })}
        </div>
      ) : (
        <div className="surface-card grid min-h-56 place-items-center p-8 text-center">
          <div>
            <h2 className="text-xl font-bold">操作ログはまだありません</h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              お知らせを作成または変更すると、ここに記録されます。
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
