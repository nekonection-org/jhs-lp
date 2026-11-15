import { raidWindows } from "@/content/server";

export type RaidDay = keyof typeof raidWindows;

export function isRaidHourAllowed(day: RaidDay, hour: number): boolean {
  const window = raidWindows[day];
  return Number.isFinite(hour) && hour >= window.start && hour < window.end;
}
