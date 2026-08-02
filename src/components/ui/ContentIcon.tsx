import {
  BadgeCheck,
  CalendarDays,
  Clock3,
  CreditCard,
  Flag,
  Handshake,
  MessageCircle,
  MessagesSquare,
  RefreshCw,
  Settings2,
  ShieldCheck,
  UserCheck,
  Users,
  ClipboardList,
} from "lucide-react";

import type { ContentIcon as ContentIconName } from "@/content/types";

const icons = {
  users: Users,
  community: Handshake,
  clock: Clock3,
  settings: Settings2,
  shield: ShieldCheck,
  message: MessageCircle,
  report: Flag,
  refresh: RefreshCw,
  calendar: CalendarDays,
  "credit-card": CreditCard,
  badge: BadgeCheck,
  clipboard: ClipboardList,
  "user-check": UserCheck,
} satisfies Record<ContentIconName, typeof Users>;

interface ContentIconProps {
  name: ContentIconName;
  className?: string;
}

export function ContentIcon({ name, className }: ContentIconProps) {
  const Icon = icons[name] ?? MessagesSquare;

  return <Icon aria-hidden="true" className={className} strokeWidth={1.8} />;
}
