import { Info } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { LocalizedText } from "@/components/ui/LocalizedText";
import { ServerSchedule } from "@/components/ui/ServerSchedule";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { en, ja } from "@/content";
import { getMatchingItem } from "@/lib/content";

export function ServerSection() {
  return (
    <section className="section-shell server-section" id="server">
      <Container>
        <div className="server-overview">
          <Reveal className="server-introduction">
            <SectionHeading
              icon="settings"
              index="01"
              layout="stack"
              description={
                <LocalizedText
                  ja={ja.server.description}
                  en={en.server.description}
                />
              }
              eyebrow={
                <LocalizedText ja={ja.server.eyebrow} en={en.server.eyebrow} />
              }
              title={
                <LocalizedText ja={ja.server.title} en={en.server.title} />
              }
            />
          </Reveal>
        </div>
        <Reveal className="server-planner-reveal" variant="split">
          <ServerSchedule />
        </Reveal>
        <div className="server-reference">
          <div className="server-reference-grid">
            <Reveal className="settings-panel" variant="wipe">
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
              <dl className="server-specifications">
                {ja.server.settings.map((setting) => {
                  const englishSetting = getMatchingItem(
                    en.server.settings,
                    setting.id,
                  );

                  return (
                    <div
                      className="server-specification"
                      key={setting.id}
                      data-reveal-item
                    >
                      <dt className="text-sm text-[var(--text-secondary)]">
                        <LocalizedText
                          ja={setting.label}
                          en={englishSetting.label}
                        />
                      </dt>
                      <dd className="text-sm font-semibold tracking-[-0.01em] text-[var(--text-primary)]">
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
        </div>
      </Container>
    </section>
  );
}
