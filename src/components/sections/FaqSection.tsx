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
      className="section-shell border-y border-[var(--border)] bg-[var(--surface)]"
      id="faq"
    >
      <Container className="max-w-[60rem]">
        <Reveal>
          <SectionHeading
            align="center"
            layout="stack"
            description={
              <LocalizedText ja={ja.faq.description} en={en.faq.description} />
            }
            eyebrow={<LocalizedText ja={ja.faq.eyebrow} en={en.faq.eyebrow} />}
            title={<LocalizedText ja={ja.faq.title} en={en.faq.title} />}
          />
        </Reveal>

        <div className="mt-10 sm:mt-14">
          <FaqList result={result} />
        </div>
      </Container>
    </section>
  );
}
