import { FaqList } from "@/components/sections/FaqList";
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
      className="section-shell border-y border-[var(--border)] bg-[linear-gradient(225deg,var(--surface-secondary),color-mix(in_srgb,var(--accent)_4%,var(--surface-secondary)))]"
      id="faq"
    >
      <Container className="grid gap-10 lg:grid-cols-[minmax(16rem,0.72fr)_minmax(0,1.28fr)] lg:gap-16">
        <Reveal>
          <SectionHeading
            className="lg:sticky lg:top-28"
            description={
              <LocalizedText ja={ja.faq.description} en={en.faq.description} />
            }
            eyebrow={<LocalizedText ja={ja.faq.eyebrow} en={en.faq.eyebrow} />}
            title={<LocalizedText ja={ja.faq.title} en={en.faq.title} />}
          />
        </Reveal>

        <FaqList result={result} />
      </Container>
    </section>
  );
}
