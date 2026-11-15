// Shared by the localized settings list and the visual raid schedule.
export const raidWindows = {
  weekdays: { start: 18, end: 24 },
  weekends: { start: 12, end: 24 },
} as const;

export function formatRaidHour(hour: number): string {
  return `${String(hour).padStart(2, "0")}:00`;
}
