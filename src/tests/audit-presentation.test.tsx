import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AuditSnapshotDetails } from "@/components/admin/AuditSnapshotDetails";
import {
  auditActionLabels,
  formatAuditDate,
  formatAuditSnapshot,
  getAuditTarget,
} from "@/lib/audit/presentation";

describe("audit presentation", () => {
  it("formats audit dates in Japan Standard Time", () => {
    expect(formatAuditDate(new Date("2026-08-13T09:34:56.000Z"))).toBe(
      "2026/08/13 18:34:56 JST",
    );
  });

  it("provides labels for every supported action", () => {
    expect(auditActionLabels.create.label).toBe("作成");
    expect(auditActionLabels.update.label).toBe("更新");
    expect(auditActionLabels.archive.label).toBe("アーカイブ");
  });

  it("distinguishes announcement and FAQ audit targets", () => {
    expect(
      getAuditTarget({ announcementId: "announcement-1", faqItemId: null }),
    ).toEqual({ label: "お知らせ", id: "announcement-1" });
    expect(
      getAuditTarget({ announcementId: null, faqItemId: "faq-1" }),
    ).toEqual({ label: "FAQ", id: "faq-1" });
  });

  it("renders snapshots as escaped text", () => {
    const unsafeTitle =
      '</pre><script data-testid="injected">alert(1)</script>';

    render(
      <AuditSnapshotDetails
        afterData={{ title: unsafeTitle }}
        beforeData={null}
      />,
    );

    expect(screen.getByText(/data-testid/)).toBeInTheDocument();
    expect(document.querySelector("script")).not.toBeInTheDocument();
    expect(formatAuditSnapshot(null)).toBeNull();
  });
});
