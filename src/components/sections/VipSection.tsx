import { BadgeCheck, Gem, LockKeyhole } from "lucide-react";

import type { VipBenefit } from "@/content";
import { LocalizedExternalAction } from "@/components/ui/ActionLink";
import { Container } from "@/components/ui/Container";
import { ContentIcon } from "@/components/ui/ContentIcon";
import { LocalizedText } from "@/components/ui/LocalizedText";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { en, ja } from "@/content";
import { getMatchingItem } from "@/lib/content";
import { externalUrls } from "@/lib/constants";

export function VipSection() {
  const japanesePurchaseAction = ja.vip.purchaseAction;
  const englishPurchaseAction = en.vip.purchaseAction;
  const japaneseBenefits: readonly VipBenefit[] = ja.vip.benefits;
  const englishBenefits: readonly VipBenefit[] = en.vip.benefits;

  return (
    <section className="section-shell" id="vip">
      <Container>
        <Reveal>
          <SectionHeading
            description={
              <LocalizedText ja={ja.vip.description} en={en.vip.description} />
            }
            eyebrow={<LocalizedText ja={ja.vip.eyebrow} en={en.vip.eyebrow} />}
            title={<LocalizedText ja={ja.vip.title} en={en.vip.title} />}
          />
        </Reveal>

        <div className="mt-10 grid gap-6 lg:mt-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <Reveal>
            <div className="surface-card flex h-full flex-col p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <span className="grid size-12 place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] text-[var(--accent-strong)]">
                  <Gem
                    aria-hidden="true"
                    className="size-6"
                    strokeWidth={1.7}
                  />
                </span>
                <StatusBadge
                  en={en.common.statusLabels[en.vip.status]}
                  ja={ja.common.statusLabels[ja.vip.status]}
                  status={ja.vip.status}
                />
              </div>
              <h3 className="mt-6 text-2xl font-bold tracking-[-0.035em]">
                <LocalizedText
                  ja={ja.vip.statusTitle}
                  en={en.vip.statusTitle}
                />
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                <LocalizedText
                  ja={ja.vip.statusDescription}
                  en={en.vip.statusDescription}
                />
              </p>

              <dl className="mt-7 grid gap-px overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2">
                {ja.vip.details.map((detail) => {
                  const englishDetail = getMatchingItem(
                    en.vip.details,
                    detail.id,
                  );

                  return (
                    <div
                      className="bg-[var(--surface-secondary)] p-4"
                      key={detail.id}
                    >
                      <dt className="text-xs font-semibold uppercase tracking-[0.09em] text-[var(--text-muted)]">
                        <LocalizedText
                          ja={detail.label}
                          en={englishDetail.label}
                        />
                      </dt>
                      <dd className="mt-2 font-bold text-[var(--text-primary)]">
                        <LocalizedText
                          ja={detail.value}
                          en={englishDetail.value}
                        />
                      </dd>
                    </div>
                  );
                })}
              </dl>

              <div className="mt-auto pt-7">
                {japanesePurchaseAction && englishPurchaseAction ? (
                  <LocalizedExternalAction
                    action={{
                      ja: japanesePurchaseAction,
                      en: englishPurchaseAction,
                    }}
                    common={{ ja: ja.common, en: en.common }}
                    href={externalUrls.tebex}
                  />
                ) : (
                  <div className="flex items-start gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-secondary)] p-4 text-sm leading-6 text-[var(--text-secondary)]">
                    <LockKeyhole
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0"
                    />
                    <p>
                      <LocalizedText
                        ja={ja.vip.purchaseUnavailableMessage}
                        en={en.vip.purchaseUnavailableMessage}
                      />
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="surface-card flex h-full flex-col p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <BadgeCheck
                  aria-hidden="true"
                  className="size-5 text-[var(--accent-strong)]"
                />
                <h3 className="text-xl font-bold tracking-[-0.025em]">
                  <LocalizedText
                    ja={ja.vip.benefitsTitle}
                    en={en.vip.benefitsTitle}
                  />
                </h3>
              </div>

              {japaneseBenefits.length > 0 ? (
                <div className="mt-6 grid gap-3">
                  {japaneseBenefits.map((benefit) => {
                    const englishBenefit = getMatchingItem(
                      englishBenefits,
                      benefit.id,
                    );

                    return (
                      <div
                        className="rounded-lg border border-[var(--border)] bg-[var(--surface-secondary)] p-4"
                        key={benefit.id}
                      >
                        <div className="flex items-start gap-3">
                          {benefit.icon ? (
                            <ContentIcon
                              className="mt-0.5 size-5 shrink-0 text-[var(--accent-strong)]"
                              name={benefit.icon}
                            />
                          ) : null}
                          <div>
                            <h4 className="font-bold">
                              <LocalizedText
                                ja={benefit.title}
                                en={englishBenefit.title}
                              />
                            </h4>
                            <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                              <LocalizedText
                                ja={benefit.description}
                                en={englishBenefit.description}
                              />
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-6 flex flex-1 flex-col items-start justify-center rounded-xl border border-dashed border-[var(--border-strong)] bg-[var(--surface-secondary)] p-6 sm:p-8">
                  <span className="grid size-11 place-items-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)]">
                    <LockKeyhole aria-hidden="true" className="size-5" />
                  </span>
                  <h4 className="mt-5 text-lg font-bold">
                    <LocalizedText
                      ja={ja.vip.emptyBenefitsTitle}
                      en={en.vip.emptyBenefitsTitle}
                    />
                  </h4>
                  <p className="mt-2 max-w-lg text-sm leading-6 text-[var(--text-secondary)]">
                    <LocalizedText
                      ja={ja.vip.emptyBenefitsDescription}
                      en={en.vip.emptyBenefitsDescription}
                    />
                  </p>
                </div>
              )}

              <p className="mt-6 border-t border-[var(--border)] pt-5 text-xs leading-5 text-[var(--text-muted)]">
                <LocalizedText ja={ja.vip.notice} en={en.vip.notice} />
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
