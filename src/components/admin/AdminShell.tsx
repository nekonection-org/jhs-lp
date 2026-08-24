import {
  CircleHelp,
  ClipboardCheck,
  FileClock,
  Gem,
  Home,
  Newspaper,
  ScrollText,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { Container } from "@/components/ui/Container";

interface AdminShellProps {
  actorEmail: string;
  children: ReactNode;
}

export function AdminShell({ actorEmail, children }: AdminShellProps) {
  return (
    <div className="min-h-svh bg-[var(--background)]">
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--header)] backdrop-blur-md">
        <Container className="flex min-h-[4.75rem] items-center gap-4">
          <Link
            className="mr-auto inline-flex min-h-11 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]"
            href="/admin/news"
          >
            <span className="relative size-9 overflow-hidden rounded-lg border border-[var(--border-strong)] bg-[var(--surface)]">
              <Image alt="" fill sizes="36px" src="/icon.png" />
            </span>
            <span className="hidden lg:block">
              <span className="block text-sm font-bold tracking-[-0.025em]">
                JHS 管理画面
              </span>
              <span className="block text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                Content Administration
              </span>
            </span>
          </Link>

          <nav aria-label="管理メニュー" className="flex items-center gap-1">
            <Link
              aria-label="お知らせ管理"
              className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]"
              href="/admin/news"
            >
              <Newspaper aria-hidden="true" className="size-4" />
              <span className="hidden sm:inline">お知らせ</span>
            </Link>
            <Link
              aria-label="FAQ管理"
              className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]"
              href="/admin/faqs"
            >
              <CircleHelp aria-hidden="true" className="size-4" />
              <span className="hidden sm:inline">FAQ</span>
            </Link>
            <Link
              aria-label="サーバールール管理"
              className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]"
              href="/admin/rules"
            >
              <ShieldCheck aria-hidden="true" className="size-4" />
              <span className="hidden xl:inline">ルール</span>
            </Link>
            <Link
              aria-label="VIP管理"
              className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]"
              href="/admin/vip"
            >
              <Gem aria-hidden="true" className="size-4" />
              <span className="hidden sm:inline">VIP</span>
            </Link>
            <Link
              aria-label="モデレーター募集管理"
              className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]"
              href="/admin/moderator"
            >
              <ClipboardCheck aria-hidden="true" className="size-4" />
              <span className="hidden xl:inline">募集</span>
            </Link>
            <Link
              aria-label="操作ログ"
              className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]"
              href="/admin/audit"
            >
              <ScrollText aria-hidden="true" className="size-4" />
              <span className="hidden sm:inline">操作ログ</span>
            </Link>
            <Link
              aria-label="公開サイト"
              className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]"
              href="/"
            >
              <Home aria-hidden="true" className="size-4" />
              <span className="hidden sm:inline">公開サイト</span>
            </Link>
          </nav>
        </Container>
      </header>

      <Container as="main" className="py-10 sm:py-14">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-4 text-xs text-[var(--text-muted)]">
          <span className="inline-flex items-center gap-2">
            <FileClock aria-hidden="true" className="size-4" />
            すべての変更は操作ログへ記録されます
          </span>
          <span className="max-w-full truncate">{actorEmail}</span>
        </div>
        {children}
      </Container>
    </div>
  );
}
