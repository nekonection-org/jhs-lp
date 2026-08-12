import { formatAuditSnapshot } from "@/lib/audit/presentation";

interface AuditSnapshotDetailsProps {
  beforeData: unknown | null;
  afterData: unknown | null;
}

export function AuditSnapshotDetails({
  beforeData,
  afterData,
}: AuditSnapshotDetailsProps) {
  const before = formatAuditSnapshot(beforeData);
  const after = formatAuditSnapshot(afterData);

  if (before === null && after === null) {
    return null;
  }

  return (
    <details className="group border-t border-[var(--border)] pt-4">
      <summary className="min-h-10 cursor-pointer rounded-lg py-2 text-sm font-semibold text-[var(--text-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]">
        変更内容を確認
      </summary>
      <div className="mt-3 grid gap-4 lg:grid-cols-2">
        {before !== null ? (
          <section aria-label="変更前">
            <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
              変更前
            </h3>
            <pre className="max-h-96 overflow-auto rounded-lg border border-[var(--border)] bg-[var(--background)] p-4 text-xs leading-5 text-[var(--text-secondary)]">
              {before}
            </pre>
          </section>
        ) : null}
        {after !== null ? (
          <section aria-label="変更後">
            <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
              変更後
            </h3>
            <pre className="max-h-96 overflow-auto rounded-lg border border-[var(--border)] bg-[var(--background)] p-4 text-xs leading-5 text-[var(--text-secondary)]">
              {after}
            </pre>
          </section>
        ) : null}
      </div>
    </details>
  );
}
