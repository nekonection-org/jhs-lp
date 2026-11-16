import { wipeSchedule } from "@/content/server";
import { formatRaidCountdown } from "@/lib/raid-schedule";

const dayMs = 24 * 60 * 60 * 1_000;
const tokyoOffsetMs = 9 * 60 * 60 * 1_000;

/** Return the next scheduled wipe, strictly after now, on the Tokyo calendar. */
export function getNextWipe(now: number): number {
  if (!Number.isFinite(now)) throw new RangeError("Invalid wipe schedule time");
  const japanTime = new Date(now + tokyoOffsetMs);
  const midnight = Math.floor((now + tokyoOffsetMs) / dayMs) * dayMs;
  const daysUntilWipe = (wipeSchedule.weekday - japanTime.getUTCDay() + 7) % 7;
  const candidate =
    midnight +
    daysUntilWipe * dayMs -
    tokyoOffsetMs +
    wipeSchedule.hour * 60 * 60 * 1_000;
  return candidate > now ? candidate : candidate + 7 * dayMs;
}

export function getWipeCountdown(milliseconds: number) {
  const remaining = Math.max(0, Math.ceil(milliseconds / 1_000)) * 1_000;
  return {
    days: Math.floor(remaining / dayMs),
    time: formatRaidCountdown(remaining % dayMs),
  };
}
