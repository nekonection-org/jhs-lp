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
import { getPublicVipContent } from "@/lib/vip/public";

export async function VipSection() {
  const result = await getPublicVipContent();
  const japaneseContent = result.item?.translations.ja ?? ja.vip;
  const englishContent = result.item?.translations.en ?? en.vip;
  const japanesePurchaseAction = japaneseContent.purchaseAction;
  const englishPurchaseAction = englishContent.purchaseAction;
  const japaneseBenefits: readonly VipBenefit[] = japaneseContent.benefits;
  const englishBenefits: readonly VipBenefit[] = englishContent.benefits;

  return (
    <section className="section-shell" id="vip">
      <Container>
        <Reveal>
          <SectionHeading
            description={
              <LocalizedText
                ja={japaneseContent.description}
                en={englishContent.description}
              />
            }
            eyebrow={
              <LocalizedText
                ja={japaneseContent.eyebrow}
                en={englishContent.eyebrow}
              />
            }
            title={
              <LocalizedText
                ja={japaneseContent.title}
                en={englishContent.title}
              />
            }
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
                  en={en.common.statusLabels[englishContent.status]}
                  ja={ja.common.statusLabels[japaneseContent.status]}
                  status={japaneseContent.status}
                />
              </div>
              <h3 className="mt-6 text-2xl font-bold tracking-[-0.035em]">
                <LocalizedText
                  ja={japaneseContent.statusTitle}
                  en={englishContent.statusTitle}
                />
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                <LocalizedText
                  ja={japaneseContent.statusDescription}
                  en={englishContent.statusDescription}
                />
              </p>

              <dl className="mt-7 grid gap-px overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2">
                {japaneseContent.details.map((detail) => {
                  const englishDetail = getMatchingItem(
                    englishContent.details,
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
                        ja={japaneseContent.purchaseUnavailableMessage}
                        en={englishContent.purchaseUnavailableMessage}
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
                    ja={japaneseContent.benefitsTitle}
                    en={englishContent.benefitsTitle}
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
                      ja={japaneseContent.emptyBenefitsTitle}
                      en={englishContent.emptyBenefitsTitle}
                    />
                  </h4>
                  <p className="mt-2 max-w-lg text-sm leading-6 text-[var(--text-secondary)]">
                    <LocalizedText
                      ja={japaneseContent.emptyBenefitsDescription}
                      en={englishContent.emptyBenefitsDescription}
                    />
                  </p>
                </div>
              )}

              <p className="mt-6 border-t border-[var(--border)] pt-5 text-xs leading-5 text-[var(--text-muted)]">
                <LocalizedText
                  ja={japaneseContent.notice}
                  en={englishContent.notice}
                />
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
