// Shared by the localized settings list and the raid-time checker.
export const raidWindows = {
  weekdays: { start: 18, end: 24 },
  weekends: { start: 12, end: 24 },
} as const;

export function formatRaidHour(hour: number): string {
  return `${String(hour).padStart(2, "0")}:00`;
}

// JavaScript weekday numbering: Sunday = 0. All wipe rules use Japan time.
export const wipeSchedule = {
  weekday: 5,
  hour: 18,
} as const;
