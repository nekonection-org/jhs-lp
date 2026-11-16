"use client";

import { Ban, Check, CircleAlert } from "lucide-react";
import { motion } from "motion/react";
import { useId, useMemo, useState } from "react";

import { useReducedMotion } from "@/hooks/useReducedMotion";

import { LocalizedText } from "@/components/ui/LocalizedText";
import { en, ja } from "@/content";
import { formatRaidDateTime, getRaidState } from "@/lib/raid-schedule";
import {
  formatUtcOffset,
  getZonedDate,
  resolveZonedDateTime,
} from "@/lib/zoned-date-time";

interface RaidTimeCheckerProps {
  timeZone: string;
  now: number | null;
}

export function RaidTimeChecker({ timeZone, now }: RaidTimeCheckerProps) {
  const id = useId();
  const reduceMotion = useReducedMotion();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [time, setTime] = useState("18:00");
  const [occurrence, setOccurrence] = useState<number | null>(null);
  const date =
    selectedDate ?? (now === null ? "" : getZonedDate(now, timeZone));
  const candidates = useMemo(
    () => resolveZonedDateTime(date, time, timeZone),
    [date, time, timeZone],
  );
  const instant =
    occurrence !== null && candidates.includes(occurrence)
      ? occurrence
      : candidates[0];
  const allowed = instant === undefined ? null : getRaidState(instant).allowed;
  const ResultIcon = allowed === null ? CircleAlert : allowed ? Check : Ban;
  const complete = Boolean(date && time);

  return (
    <section className="raid-checker" aria-labelledby={`${id}-title`}>
      <div className="raid-checker-intro">
        <h3 className="text-base font-semibold" id={`${id}-title`}>
          <LocalizedText
            ja={ja.server.schedule.checkerTitle}
            en={en.server.schedule.checkerTitle}
          />
        </h3>
        <p
          className="mt-2 text-xs leading-6 text-[var(--text-secondary)]"
          id={`${id}-description`}
        >
          <LocalizedText
            ja={ja.server.schedule.checkerDescription}
            en={en.server.schedule.checkerDescription}
          />
        </p>
      </div>
      <div className="raid-checker-controls">
        <div className="raid-date-time-fields">
          <div>
            <label htmlFor={`${id}-date`}>
              <LocalizedText
                ja={ja.server.schedule.dateLabel}
                en={en.server.schedule.dateLabel}
              />
            </label>
            <input
              id={`${id}-date`}
              type="date"
              value={date}
              disabled={now === null}
              onChange={(event) => setSelectedDate(event.target.value)}
              aria-describedby={`${id}-description`}
            />
          </div>
          <div>
            <label htmlFor={`${id}-time`}>
              <LocalizedText
                ja={ja.server.schedule.timeLabel}
                en={en.server.schedule.timeLabel}
              />
            </label>
            <input
              id={`${id}-time`}
              type="time"
              step={60}
              value={time}
              disabled={now === null}
              onChange={(event) => {
                setSelectedDate(date);
                setTime(event.target.value);
              }}
              aria-describedby={`${id}-description`}
            />
          </div>
        </div>
        <p className="raid-check-zone">{timeZone}</p>
        {candidates.length > 1 ? (
          <div className="raid-time-occurrence">
            <label htmlFor={`${id}-occurrence`}>
              <LocalizedText
                ja={ja.server.schedule.repeatedTime}
                en={en.server.schedule.repeatedTime}
              />
            </label>
            <select
              id={`${id}-occurrence`}
              value={instant}
              onChange={(event) => setOccurrence(Number(event.target.value))}
            >
              {candidates.map((value) => (
                <option key={value} value={value}>
                  {time} · {formatUtcOffset(value, timeZone)}
                </option>
              ))}
            </select>
          </div>
        ) : null}
        <div
          className="raid-check-result"
          data-allowed={allowed === null ? "unknown" : allowed}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <motion.span
            key={allowed === null ? "unknown" : String(allowed)}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
          >
            <ResultIcon aria-hidden="true" className="size-5 shrink-0" />
          </motion.span>
          <div>
            <p className="font-semibold">
              <LocalizedText
                ja={
                  allowed === null
                    ? complete
                      ? ja.server.schedule.invalidTime
                      : ja.server.schedule.chooseDateTime
                    : allowed
                      ? ja.server.schedule.allowed
                      : ja.server.schedule.blocked
                }
                en={
                  allowed === null
                    ? complete
                      ? en.server.schedule.invalidTime
                      : en.server.schedule.chooseDateTime
                    : allowed
                      ? en.server.schedule.allowed
                      : en.server.schedule.blocked
                }
              />
            </p>
            {instant !== undefined ? (
              <p className="raid-selected-instant">
                <time dateTime={new Date(instant).toISOString()}>
                  <LocalizedText
                    ja={formatRaidDateTime(instant, timeZone, "ja-JP")}
                    en={formatRaidDateTime(instant, timeZone, "en-GB")}
                  />{" "}
                  · {formatUtcOffset(instant, timeZone)}
                </time>
              </p>
            ) : null}
          </div>
        </div>
        {instant !== undefined ? (
          <motion.p
            className="raid-japan-equivalent"
            key={`${instant}-${timeZone}`}
            initial={reduceMotion ? false : { opacity: 0.4, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.24 }}
          >
            <LocalizedText
              ja={ja.server.schedule.japanEquivalent}
              en={en.server.schedule.japanEquivalent}
            />{" "}
            <LocalizedText
              ja={formatRaidDateTime(instant, "Asia/Tokyo", "ja-JP")}
              en={formatRaidDateTime(instant, "Asia/Tokyo", "en-GB")}
            />{" "}
            JST
          </motion.p>
        ) : null}
      </div>
    </section>
  );
}
