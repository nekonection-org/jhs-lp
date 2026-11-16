"use client";

import { useState, useSyncExternalStore } from "react";

import { useReducedMotion } from "@/hooks/useReducedMotion";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { motion } from "motion/react";
import { RaidTimeChecker } from "@/components/ui/RaidTimeChecker";
import { getMatchingItem } from "@/lib/content";
import { getNextWipe, getWipeCountdown } from "@/lib/wipe-schedule";
import { en, ja } from "@/content";
import {
  formatRaidDateTime,
  isValidTimeZone,
  raidTimeZones,
} from "@/lib/raid-schedule";

const storageKey = "jhs-raid-time-zone";
interface ClockSnapshot {
  now: number | null;
  timeZone: string;
  deviceZone: string;
}

const initialSnapshot: ClockSnapshot = {
  now: null,
  timeZone: "Asia/Tokyo",
  deviceZone: "Asia/Tokyo",
};

function createScheduleStore() {
  let snapshot = initialSnapshot;
  const listeners = new Set<() => void>();
  function publish() {
    for (const listener of listeners) listener();
  }
  function syncClock() {
    snapshot = { ...snapshot, now: Date.now() };
    publish();
  }
  return {
    getSnapshot: () => snapshot,
    subscribe(listener: () => void) {
      listeners.add(listener);
      const deviceZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      let timeZone = snapshot.timeZone;
      try {
        const saved = window.localStorage.getItem(storageKey);
        if (saved && isValidTimeZone(saved)) timeZone = saved;
      } catch {
        // Time zone selection remains available without browser storage.
      }
      snapshot = { now: Date.now(), timeZone, deviceZone };
      publish();
      const interval = window.setInterval(syncClock, 1_000);
      document.addEventListener("visibilitychange", syncClock);
      window.addEventListener("pageshow", syncClock);
      window.addEventListener("focus", syncClock);
      return () => {
        listeners.delete(listener);
        window.clearInterval(interval);
        document.removeEventListener("visibilitychange", syncClock);
        window.removeEventListener("pageshow", syncClock);
        window.removeEventListener("focus", syncClock);
      };
    },
    setTimeZone(timeZone: string) {
      if (!isValidTimeZone(timeZone)) return;
      snapshot = { ...snapshot, timeZone, now: Date.now() };
      try {
        window.localStorage.setItem(storageKey, timeZone);
      } catch {
        // Keep the in-memory selection when persistence is unavailable.
      }
      publish();
    },
  };
}

export function ServerSchedule() {
  const { locale } = useLanguage();
  const reduceMotion = useReducedMotion();
  const schedule = locale === "ja" ? ja.server.schedule : en.server.schedule;
  const copy = schedule.live;
  const [store] = useState(createScheduleStore);
  const { now, timeZone, deviceZone } = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    () => initialSnapshot,
  );
  const nextWipe = now === null ? null : getNextWipe(now);
  const wipeCountdown =
    now !== null && nextWipe !== null ? getWipeCountdown(nextWipe - now) : null;
  const wipeReference = getMatchingItem(
    locale === "ja" ? ja.server.settings : en.server.settings,
    "map-bp-wipe",
  ).value;
  const zones = [...new Set([...raidTimeZones, deviceZone, timeZone])];
  const dateTime = (time: number) =>
    formatRaidDateTime(time, timeZone, locale === "ja" ? "ja-JP" : "en-GB");

  return (
    <div className="server-planner">
      <div className="server-planner-panels">
        <div className="wipe-countdown-block" data-reveal-item>
          <h3>{copy.nextWipe}</h3>
          <motion.time
            key={`${nextWipe}-${timeZone}`}
            initial={
              reduceMotion || now === null ? false : { opacity: 0.4, y: 8 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.24 }}
            dateTime={
              nextWipe === null ? undefined : new Date(nextWipe).toISOString()
            }
          >
            {nextWipe === null ? "—" : dateTime(nextWipe)}
          </motion.time>
          <p className="wipe-time-zone">{timeZone}</p>
          <p className="wipe-countdown">
            <span>{copy.untilWipe}</span>
            <span className="wipe-countdown-value">
              <span className="wipe-countdown-days">
                {wipeCountdown?.days ?? "—"}
                <span>{copy.days}</span>
              </span>{" "}
              <span className="wipe-countdown-time">
                {wipeCountdown?.time ?? "—"}
              </span>
            </span>
          </p>
          <p className="wipe-reference">{wipeReference}</p>
        </div>
        <div className="server-planner-tools" data-reveal-item>
          <div className="server-planner-checker">
            <RaidTimeChecker
              timeZone={timeZone}
              now={now}
              timeZoneControl={
                <>
                  <div className="server-planner-toolbar">
                    <label htmlFor="raid-time-zone">{copy.timeZone}</label>
                    <select
                      id="raid-time-zone"
                      value={timeZone}
                      onChange={(event) =>
                        store.setTimeZone(event.target.value)
                      }
                      disabled={now === null}
                    >
                      {zones.map((zone) => (
                        <option key={zone} value={zone}>
                          {zone === deviceZone
                            ? `${zone} · ${copy.deviceZone}`
                            : zone}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              }
            />
          </div>
        </div>
      </div>
      <p className="server-schedule-note">{copy.note}</p>
    </div>
  );
}
