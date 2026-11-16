import { raidWindows } from "@/content/server";

export type RaidDay = keyof typeof raidWindows;

export function isRaidHourAllowed(day: RaidDay, hour: number): boolean {
  const window = raidWindows[day];
  return Number.isFinite(hour) && hour >= window.start && hour < window.end;
}

const hourMs = 60 * 60 * 1_000;
const dayMs = 24 * hourMs;
const tokyoOffsetMs = 9 * hourMs;

export const raidTimeZones = [
  "Asia/Tokyo",
  "UTC",
  "Asia/Seoul",
  "Asia/Shanghai",
  "Asia/Singapore",
  "Asia/Kolkata",
  "Australia/Sydney",
  "Pacific/Auckland",
  "Europe/London",
  "Europe/Berlin",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Sao_Paulo",
] as const;

export interface RaidWindow {
  /** The calendar date that determines the rule, always in Asia/Tokyo. */
  japanDate: string;
  day: RaidDay;
  start: number;
  end: number;
}

export function isValidTimeZone(value: string): boolean {
  try {
    new Intl.DateTimeFormat("en", { timeZone: value }).format(0);
    return true;
  } catch {
    return false;
  }
}

/** Tokyo has no daylight saving time. Local presentation uses Intl separately. */
function getJapanWindow(midnight: number): RaidWindow {
  const date = new Date(midnight);
  const weekday = date.getUTCDay();
  const day = weekday === 0 || weekday === 6 ? "weekends" : "weekdays";
  const hours = raidWindows[day];
  return {
    japanDate: date.toISOString().slice(0, 10),
    day,
    start: midnight - tokyoOffsetMs + hours.start * hourMs,
    end: midnight - tokyoOffsetMs + hours.end * hourMs,
  };
}

export function getRaidState(now: number) {
  if (!Number.isFinite(now)) throw new RangeError("Invalid raid schedule time");
  const midnight = Math.floor((now + tokyoOffsetMs) / dayMs) * dayMs;
  const today = getJapanWindow(midnight);
  const allowed = now >= today.start && now < today.end;
  const upcoming = Array.from({ length: 8 }, (_, day) =>
    getJapanWindow(midnight + day * dayMs),
  )
    .filter((window) => window.end > now)
    .slice(0, 7);
  return {
    allowed,
    nextTransition: allowed
      ? today.end
      : now < today.start
        ? today.start
        : getJapanWindow(midnight + dayMs).start,
    upcoming,
  };
}

export function formatRaidDateTime(
  time: number,
  timeZone: string,
  locale: string,
): string {
  return new Intl.DateTimeFormat(locale, {
    timeZone,
    month: "short",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(time);
}

export function formatRaidCountdown(milliseconds: number): string {
  const seconds = Math.max(0, Math.ceil(milliseconds / 1_000));
  return [
    Math.floor(seconds / 3_600),
    Math.floor((seconds % 3_600) / 60),
    seconds % 60,
  ]
    .map((part) => String(part).padStart(2, "0"))
    .join(":");
}
