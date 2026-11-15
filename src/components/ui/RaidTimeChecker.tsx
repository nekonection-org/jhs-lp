"use client";

import { Ban, Check } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";

import { LocalizedText } from "@/components/ui/LocalizedText";
import { en, ja } from "@/content";
import { formatRaidHour } from "@/content/server";
import { useMounted } from "@/hooks/useMounted";
import { isRaidHourAllowed, type RaidDay } from "@/lib/raid-schedule";

export function RaidTimeChecker() {
  const id = useId();
  const mounted = useMounted();
  const reduceMotion = useReducedMotion();
  const [day, setDay] = useState<RaidDay>("weekdays");
  const [hour, setHour] = useState(18);
  const allowed = isRaidHourAllowed(day, hour);
  const ResultIcon = allowed ? Check : Ban;

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
        <span className="sr-only" id={`${id}-days`}>
          <LocalizedText
            ja={ja.server.schedule.dayLabel}
            en={en.server.schedule.dayLabel}
          />
        </span>
        <div
          className="raid-day-switch"
          role="group"
          aria-labelledby={`${id}-days`}
        >
          {(["weekdays", "weekends"] as const).map((value) => (
            <button
              type="button"
              className="raid-day-button"
              aria-pressed={day === value}
              disabled={!mounted}
              key={value}
              onClick={() => setDay(value)}
            >
              {day === value ? (
                <motion.span
                  aria-hidden="true"
                  className="raid-day-indicator"
                  initial={false}
                  layoutId={`${id}-selected-day`}
                  transition={{ duration: reduceMotion ? 0 : 0.18 }}
                />
              ) : null}
              <span className="relative">
                <LocalizedText
                  ja={ja.server.schedule[value]}
                  en={en.server.schedule[value]}
                />
              </span>
            </button>
          ))}
        </div>
        <div className="raid-time-control">
          <div className="mt-5 flex items-baseline justify-between gap-3">
            <label
              htmlFor={`${id}-hour`}
              className="text-xs text-[var(--text-secondary)]"
            >
              <LocalizedText
                ja={ja.server.schedule.timeLabel}
                en={en.server.schedule.timeLabel}
              />
            </label>
            <output
              htmlFor={`${id}-hour`}
              aria-live="off"
              className="text-lg font-semibold tabular-nums"
            >
              {formatRaidHour(hour)}
            </output>
          </div>
          <input
            id={`${id}-hour`}
            type="range"
            min={0}
            max={23}
            step={1}
            value={hour}
            disabled={!mounted}
            aria-describedby={`${id}-description`}
            aria-valuetext={`${formatRaidHour(hour)} JST`}
            className="raid-hour-input"
            onChange={(event) => {
              const value = event.currentTarget.valueAsNumber;
              if (Number.isInteger(value) && value >= 0 && value <= 23)
                setHour(value);
            }}
          />
        </div>
        <div
          className="raid-check-result"
          data-allowed={allowed}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <ResultIcon aria-hidden="true" className="size-4 shrink-0" />
          <span className="font-semibold tabular-nums">
            {formatRaidHour(hour)} JST
          </span>
          <span aria-hidden="true" className="text-[var(--text-muted)]">
            /
          </span>
          <LocalizedText
            ja={
              allowed ? ja.server.schedule.allowed : ja.server.schedule.blocked
            }
            en={
              allowed ? en.server.schedule.allowed : en.server.schedule.blocked
            }
          />
        </div>
      </div>
    </section>
  );
}
