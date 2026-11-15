import { describe, expect, it } from "vitest";

import { isRaidHourAllowed } from "@/lib/raid-schedule";

describe("raid schedule", () => {
  it("includes weekday opening time and excludes the end boundary", () => {
    expect(isRaidHourAllowed("weekdays", 17.99)).toBe(false);
    expect(isRaidHourAllowed("weekdays", 18)).toBe(true);
    expect(isRaidHourAllowed("weekdays", 23.99)).toBe(true);
    expect(isRaidHourAllowed("weekdays", 24)).toBe(false);
  });

  it("opens at noon on weekends and closes at midnight", () => {
    expect(isRaidHourAllowed("weekends", 11.99)).toBe(false);
    expect(isRaidHourAllowed("weekends", 12)).toBe(true);
    expect(isRaidHourAllowed("weekends", 23.99)).toBe(true);
    expect(isRaidHourAllowed("weekends", 24)).toBe(false);
  });

  it("rejects invalid hours", () => {
    for (const hour of [-1, 25, NaN, Infinity, -Infinity]) {
      expect(isRaidHourAllowed("weekdays", hour)).toBe(false);
      expect(isRaidHourAllowed("weekends", hour)).toBe(false);
    }
  });
});
