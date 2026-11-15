import { Info } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { LocalizedText } from "@/components/ui/LocalizedText";
import { RaidTimeChecker } from "@/components/ui/RaidTimeChecker";
import { RaidSchedule } from "@/components/ui/RaidSchedule";
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
            index="01"
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

        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-20">
          <Reveal>
            <article className="server-welcome">
              <h3 className="text-xl font-semibold leading-8">
                <LocalizedText
                  ja={ja.server.welcomeTitle}
                  en={en.server.welcomeTitle}
                />
              </h3>
              <p className="mt-5 text-base leading-8 text-[var(--text-secondary)]">
                <LocalizedText
                  ja={ja.server.welcomeDescription}
                  en={en.server.welcomeDescription}
                />
              </p>
            </article>
            <RaidSchedule />
          </Reveal>
          <Reveal className="settings-panel">
            <h3 className="text-lg font-semibold">
              <LocalizedText
                ja={ja.server.settingsTitle}
                en={en.server.settingsTitle}
              />
            </h3>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              <LocalizedText
                ja={ja.server.settingsDescription}
                en={en.server.settingsDescription}
              />
            </p>
            <dl className="mt-5 divide-y divide-[var(--border)] border-y border-[var(--border)]">
              {ja.server.settings.map((setting) => {
                const englishSetting = getMatchingItem(
                  en.server.settings,
                  setting.id,
                );

                return (
                  <div
                    className="grid gap-2 py-4 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] sm:items-baseline sm:gap-4"
                    key={setting.id}
                  >
                    <dt className="text-sm text-[var(--text-secondary)]">
                      <LocalizedText
                        ja={setting.label}
                        en={englishSetting.label}
                      />
                    </dt>
                    <dd className="text-sm font-semibold tracking-[-0.01em] text-[var(--text-primary)] sm:text-right">
                      <LocalizedText
                        ja={setting.value}
                        en={englishSetting.value}
                      />
                    </dd>
                  </div>
                );
              })}
            </dl>
          </Reveal>
        </div>

        <Reveal>
          <RaidTimeChecker />
        </Reveal>

        <Reveal className="mt-6">
          <div className="flex items-start gap-3 text-xs leading-6 text-[var(--text-muted)]">
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
