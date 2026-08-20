import { Info, Settings2, Sparkles } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { LocalizedText } from "@/components/ui/LocalizedText";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { en, ja } from "@/content";
import { getMatchingItem } from "@/lib/content";

export function ServerSection() {
  return (
    <section className="section-shell" id="server">
      <Container>
        <Reveal>
          <SectionHeading
            description={
              <LocalizedText
                ja={ja.server.description}
                en={en.server.description}
              />
            }
            eyebrow={
              <LocalizedText ja={ja.server.eyebrow} en={en.server.eyebrow} />
            }
            title={<LocalizedText ja={ja.server.title} en={en.server.title} />}
          />
        </Reveal>

        <Reveal className="mt-10 lg:mt-12">
          <div className="surface-card overflow-hidden p-5 sm:p-6 lg:p-8">
            <div className="flex items-start gap-3.5">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-[color-mix(in_srgb,var(--accent)_35%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_10%,var(--surface-secondary))] text-[var(--accent-strong)]">
                <Settings2 aria-hidden="true" className="size-4.5" />
              </span>
              <div>
                <h3 className="text-lg font-bold tracking-[-0.025em] text-[var(--text-primary)]">
                  <LocalizedText
                    ja={ja.server.settingsTitle}
                    en={en.server.settingsTitle}
                  />
                </h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--text-secondary)]">
                  <LocalizedText
                    ja={ja.server.settingsDescription}
                    en={en.server.settingsDescription}
                  />
                </p>
              </div>
            </div>

            <dl className="mt-6 grid gap-2.5 md:grid-cols-2">
              {ja.server.settings.map((setting) => {
                const englishSetting = getMatchingItem(
                  en.server.settings,
                  setting.id,
                );

                return (
                  <div
                    className="grid gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-secondary)] px-4 py-3.5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-4"
                    key={setting.id}
                  >
                    <dt className="text-xs font-semibold tracking-[0.02em] text-[var(--text-muted)]">
                      <LocalizedText
                        ja={setting.label}
                        en={englishSetting.label}
                      />
                    </dt>
                    <dd className="text-sm font-bold tracking-[-0.01em] text-[var(--accent-strong)] sm:text-right">
                      <LocalizedText
                        ja={setting.value}
                        en={englishSetting.value}
                      />
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>
        </Reveal>

        <Reveal className="mt-6">
          <article className="surface-card flex items-start gap-4 border-[color-mix(in_srgb,var(--accent)_28%,var(--border))] p-5 sm:p-6">
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[color-mix(in_srgb,var(--accent)_12%,var(--surface-secondary))] text-[var(--accent-strong)]">
              <Sparkles aria-hidden="true" className="size-5" />
            </span>
            <div>
              <h3 className="text-xl font-bold tracking-[-0.03em] text-[var(--text-primary)]">
                <LocalizedText
                  ja={ja.server.welcomeTitle}
                  en={en.server.welcomeTitle}
                />
              </h3>
              <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--text-secondary)] sm:text-base sm:leading-7">
                <LocalizedText
                  ja={ja.server.welcomeDescription}
                  en={en.server.welcomeDescription}
                />
              </p>
            </div>
          </article>
        </Reveal>

        <Reveal className="mt-6">
          <div className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] p-4 text-sm leading-6 text-[var(--text-secondary)] sm:p-5">
            <Info
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-[var(--accent-strong)]"
            />
            <p>
              <LocalizedText
                ja={ja.server.pendingNotice}
                en={en.server.pendingNotice}
              />
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
