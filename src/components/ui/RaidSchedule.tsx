import { LocalizedText } from "@/components/ui/LocalizedText";
import { en, ja } from "@/content";
import { formatRaidHour, raidWindows } from "@/content/server";

export function RaidSchedule() {
  return (
    <figure className="raid-schedule" aria-labelledby="raid-schedule-title">
      <figcaption>
        <h3
          className="text-lg font-semibold tracking-[-0.025em]"
          id="raid-schedule-title"
        >
          <LocalizedText
            ja={ja.server.schedule.title}
            en={en.server.schedule.title}
          />
        </h3>
        <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
          <LocalizedText
            ja={ja.server.schedule.description}
            en={en.server.schedule.description}
          />
        </p>
      </figcaption>
      <table className="raid-schedule-table">
        <caption className="sr-only">
          <LocalizedText
            ja={ja.server.schedule.title}
            en={en.server.schedule.title}
          />
        </caption>
        <colgroup>
          <col className="raid-label-column" />
          <col />
        </colgroup>
        <tbody>
          {Object.entries(raidWindows).map(([day, window]) => {
            const isWeekday = day === "weekdays";
            return (
              <tr key={day}>
                <th scope="row">
                  <LocalizedText
                    ja={
                      isWeekday
                        ? ja.server.schedule.weekdays
                        : ja.server.schedule.weekends
                    }
                    en={
                      isWeekday
                        ? en.server.schedule.weekdays
                        : en.server.schedule.weekends
                    }
                  />
                </th>
                <td>
                  <p className="mb-2 text-right text-xs font-medium tabular-nums">
                    {formatRaidHour(window.start)}–{formatRaidHour(window.end)}{" "}
                    JST
                  </p>
                  <div
                    aria-hidden="true"
                    className="raid-track"
                    style={{
                      gridTemplateColumns: `${window.start}fr ${window.end - window.start}fr ${24 - window.end}fr`,
                    }}
                  >
                    <span />
                    <span className="raid-track-allowed" />
                    <span />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="raid-axis" aria-hidden="true">
        <span>00:00</span>
        <span>12:00</span>
        <span>24:00</span>
      </div>
      <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[var(--text-secondary)]">
        <span className="inline-flex items-center gap-2">
          <span className="size-2.5 bg-[var(--accent)]" aria-hidden="true" />
          <LocalizedText
            ja={ja.server.schedule.allowed}
            en={en.server.schedule.allowed}
          />
        </span>
        <span className="inline-flex items-center gap-2">
          <span
            className="size-2.5 border border-[var(--border-strong)] bg-[var(--surface-secondary)]"
            aria-hidden="true"
          />
          <LocalizedText
            ja={ja.server.schedule.blocked}
            en={en.server.schedule.blocked}
          />
        </span>
      </div>
    </figure>
  );
}
