function dateTimeFormatter(timeZone: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
}

function wallTimeKey(formatter: Intl.DateTimeFormat, instant: number) {
  const parts = Object.fromEntries(
    formatter.formatToParts(instant).map(({ type, value }) => [type, value]),
  );
  return `${parts.year?.padStart(4, "0")}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`;
}

export function getZonedDate(instant: number, timeZone: string): string {
  return wallTimeKey(dateTimeFormatter(timeZone), instant).slice(0, 10);
}

/** Resolve a wall-clock selection to zero, one, or two instants across DST changes. */
export function resolveZonedDateTime(
  date: string,
  time: string,
  timeZone: string,
): number[] {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time))
    return [];
  const key = `${date}T${time}:00`;
  const wallTime = Date.parse(`${key}Z`);
  if (
    !Number.isFinite(wallTime) ||
    new Date(wallTime).toISOString().slice(0, 19) !== key
  )
    return [];
  try {
    const formatter = dateTimeFormatter(timeZone);
    const offsets = new Set<number>();
    // Sample both sides of transitions; offsets may include 30 or 45 minutes.
    for (const hours of [-48, -24, -12, 0, 12, 24, 48]) {
      const sample = wallTime + hours * 60 * 60 * 1_000;
      offsets.add(Date.parse(`${wallTimeKey(formatter, sample)}Z`) - sample);
    }
    return [...offsets]
      .map((offset) => wallTime - offset)
      .filter((instant) => wallTimeKey(formatter, instant) === key)
      .sort((a, b) => a - b);
  } catch {
    return [];
  }
}

export function formatUtcOffset(instant: number, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone,
    timeZoneName: "longOffset",
  }).formatToParts(instant);
  return parts.find(({ type }) => type === "timeZoneName")?.value ?? timeZone;
}
