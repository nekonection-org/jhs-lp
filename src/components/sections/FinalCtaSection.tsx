import {
  LocalizedExternalAction,
  LocalizedSectionAction,
} from "@/components/ui/ActionLink";
import { Container } from "@/components/ui/Container";
import { LocalizedText } from "@/components/ui/LocalizedText";
import { Reveal } from "@/components/ui/Reveal";
import { en, ja } from "@/content";
import { externalUrls } from "@/lib/constants";

export function FinalCtaSection() {
  return (
    <section aria-labelledby="join-title" className="join-section">
      <Container>
        <Reveal>
          <div className="join-panel">
            <div className="max-w-2xl">
              <p className="section-eyebrow">
                <LocalizedText
                  ja={ja.finalCta.eyebrow}
                  en={en.finalCta.eyebrow}
                />
              </p>
              <h2 className="section-title mt-5" id="join-title">
                <LocalizedText ja={ja.finalCta.title} en={en.finalCta.title} />
              </h2>
              <p className="join-description">
                <LocalizedText
                  ja={ja.finalCta.description}
                  en={en.finalCta.description}
                />
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch">
              <LocalizedExternalAction
                action={{
                  ja: ja.hero.primaryAction,
                  en: en.hero.primaryAction,
                }}
                common={{ ja: ja.common, en: en.common }}
                href={externalUrls.discord}
                className="join-primary min-h-12 px-7"
              />
              <LocalizedSectionAction
                action={{
                  ja: ja.hero.secondaryAction,
                  en: en.hero.secondaryAction,
                }}
                variant="quiet"
                className="join-secondary min-h-12 px-7"
              />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
