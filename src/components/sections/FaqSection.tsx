import { FaqList } from "@/components/sections/FaqList";
import { LocalizedExternalAction } from "@/components/ui/ActionLink";
import { externalUrls } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { LocalizedText } from "@/components/ui/LocalizedText";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { en, ja } from "@/content";
import { getPublicFaqs } from "@/lib/faqs/public";

export async function FaqSection() {
  const result = await getPublicFaqs();

  return (
    <section
      className="section-shell faq-section border-y border-[var(--border)] bg-[var(--surface)]"
      id="faq"
    >
      <Container className="faq-layout">
        <div className="faq-heading">
          <Reveal>
            <SectionHeading
              index="04"
              layout="stack"
              description={
                <LocalizedText
                  ja={ja.faq.description}
                  en={en.faq.description}
                />
              }
              eyebrow={
                <LocalizedText ja={ja.faq.eyebrow} en={en.faq.eyebrow} />
              }
              title={<LocalizedText ja={ja.faq.title} en={en.faq.title} />}
            />
          </Reveal>

          <LocalizedExternalAction
            action={{ ja: ja.hero.primaryAction, en: en.hero.primaryAction }}
            common={{ ja: ja.common, en: en.common }}
            href={externalUrls.discord}
            variant="secondary"
            className="mt-7"
          />
        </div>

        <div className="faq-answers">
          <FaqList result={result} />
        </div>
      </Container>
    </section>
  );
}
