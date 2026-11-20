import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth/admin";
import { brandName } from "@/lib/brand";

export const metadata: Metadata = {
  title: `コンテンツ管理 | ${brandName}`,
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nocache: true,
  },
};

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const identity = await requireAdmin();

  return <AdminShell actorEmail={identity.email}>{children}</AdminShell>;
}
