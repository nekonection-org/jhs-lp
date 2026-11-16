"use client";

import { ArrowDown, ChevronDown } from "lucide-react";
import { useState, useSyncExternalStore } from "react";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { LocalizedText } from "@/components/ui/LocalizedText";
import { en, ja } from "@/content";
import { formatRaidHour, raidWindows } from "@/content/server";
import {
  formatRaidCountdown,
  formatRaidDateTime,
  getRaidState,
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

function createRaidClockStore() {
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

export function RaidClock() {
  const { locale } = useLanguage();
  const schedule = locale === "ja" ? ja.server.schedule : en.server.schedule;
  const copy = schedule.live;
  const [store] = useState(createRaidClockStore);
  const { now, timeZone, deviceZone } = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    () => initialSnapshot,
  );
  const state = now === null ? null : getRaidState(now);
  const zones = [...new Set([...raidTimeZones, deviceZone, timeZone])];
  const dateTime = (time: number) =>
    formatRaidDateTime(time, timeZone, locale === "ja" ? "ja-JP" : "en-GB");

  return (
    <section className="raid-clock" aria-labelledby="raid-clock-title">
      <div className="raid-clock-heading">
        <h2 id="raid-clock-title">{copy.title}</h2>
        <a className="hero-explore" href="#server">
          <LocalizedText ja={ja.server.title} en={en.server.title} />
          <ArrowDown aria-hidden="true" className="size-4" />
        </a>
      </div>
      <div className="raid-clock-layout">
        <div className="raid-clock-current">
          <p
            className="raid-live-status"
            data-allowed={state?.allowed}
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            <span aria-hidden="true" className="raid-status-dot" />
            {state
              ? state.allowed
                ? schedule.allowed
                : schedule.blocked
              : copy.loading}
          </p>
          <div className="raid-next-transition">
            <p>{state?.allowed ? copy.closes : copy.opens}</p>
            <time
              dateTime={
                state ? new Date(state.nextTransition).toISOString() : undefined
              }
            >
              {state ? dateTime(state.nextTransition) : "—"}
            </time>
          </div>
          <p className="raid-countdown" aria-hidden="true">
            <span>{state?.allowed ? copy.untilClose : copy.untilOpen}</span>
            <span>
              {state && now !== null
                ? formatRaidCountdown(state.nextTransition - now)
                : "—"}
            </span>
          </p>
        </div>
        <div className="raid-clock-controls">
          <label htmlFor="raid-time-zone">{copy.timeZone}</label>
          <select
            id="raid-time-zone"
            value={timeZone}
            onChange={(event) => store.setTimeZone(event.target.value)}
            disabled={now === null}
          >
            {zones.map((zone) => (
              <option key={zone} value={zone}>
                {zone === deviceZone ? `${zone} · ${copy.deviceZone}` : zone}
              </option>
            ))}
          </select>
          <p className="raid-current-time">
            <span>{copy.now}</span>
            <time
              dateTime={now === null ? undefined : new Date(now).toISOString()}
            >
              {now === null
                ? "—"
                : new Intl.DateTimeFormat(locale === "ja" ? "ja-JP" : "en-GB", {
                    timeZone,
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hourCycle: "h23",
                    timeZoneName: "shortOffset",
                  }).format(now)}
            </time>
          </p>
          <div className="hero-raid-reference">
            <p className="hero-window-heading">
              <LocalizedText
                ja={ja.server.schedule.live.reference}
                en={en.server.schedule.live.reference}
              />
              <span>JST / UTC+09:00</span>
            </p>
            <dl className="hero-window-times">
              {Object.entries(raidWindows).map(([day, window]) => (
                <div key={day}>
                  <dt>
                    <LocalizedText
                      ja={
                        day === "weekdays"
                          ? ja.server.schedule.weekdays
                          : ja.server.schedule.weekends
                      }
                      en={
                        day === "weekdays"
                          ? en.server.schedule.weekdays
                          : en.server.schedule.weekends
                      }
                    />
                  </dt>
                  <dd>
                    {formatRaidHour(window.start)}
                    <span className="hero-window-dash" aria-hidden="true">
                      —
                    </span>
                    {formatRaidHour(window.end)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
      <details className="raid-upcoming">
        <summary>
          {copy.upcoming}
          <ChevronDown aria-hidden="true" className="size-4" />
        </summary>
        {state ? (
          <ol aria-label={copy.upcoming}>
            {state.upcoming.map((window) => (
              <li key={window.japanDate}>
                <p className="raid-japan-date">
                  <span>{copy.japanDate}</span>
                  <time dateTime={window.japanDate}>{window.japanDate}</time>
                </p>
                <div className="raid-upcoming-times">
                  <p>
                    <span>{copy.starts}</span>
                    <time dateTime={new Date(window.start).toISOString()}>
                      {dateTime(window.start)}
                    </time>
                  </p>
                  <span aria-hidden="true">→</span>
                  <p>
                    <span>{copy.ends}</span>
                    <time dateTime={new Date(window.end).toISOString()}>
                      {dateTime(window.end)}
                    </time>
                  </p>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="raid-clock-note">{copy.loading}</p>
        )}
      </details>
      <p className="raid-clock-note">{copy.note}</p>
    </section>
  );
}
