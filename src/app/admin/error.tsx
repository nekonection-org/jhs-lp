"use client";

import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/ui/Button";

interface AdminErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminError({ error, reset }: AdminErrorProps) {
  useEffect(() => {
    console.error("Admin page failed.", { digest: error.digest ?? null });
  }, [error]);

  return (
    <div className="surface-card mx-auto max-w-2xl p-6 text-center sm:p-10">
      <p className="section-eyebrow">Error</p>
      <h1 className="mt-3 text-2xl font-bold">
        管理画面を読み込めませんでした
      </h1>
      <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
        データベース接続を確認し、時間を置いてからもう一度お試しください。
      </p>
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <Button onClick={reset}>再試行</Button>
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--border-strong)] px-5 text-sm font-semibold"
          href="/"
        >
          公開サイトへ戻る
        </Link>
      </div>
    </div>
  );
}
