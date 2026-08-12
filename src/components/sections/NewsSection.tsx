import { NewsList } from "@/components/sections/NewsList";
import { Container } from "@/components/ui/Container";
import { LocalizedText } from "@/components/ui/LocalizedText";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { en, ja } from "@/content";
import { getPublicAnnouncements } from "@/lib/announcements/public";

export async function NewsSection() {
  const result = await getPublicAnnouncements();

  return (
    <section
      className="section-shell border-y border-[var(--border)] bg-[linear-gradient(145deg,var(--surface-secondary),color-mix(in_srgb,var(--surface)_62%,var(--surface-secondary)))]"
      id="news"
    >
      <Container>
        <Reveal>
          <SectionHeading
            description={
              <LocalizedText
                ja={ja.news.description}
                en={en.news.description}
              />
            }
            eyebrow={
              <LocalizedText ja={ja.news.eyebrow} en={en.news.eyebrow} />
            }
            title={<LocalizedText ja={ja.news.title} en={en.news.title} />}
          />
        </Reveal>

        <NewsList result={result} />
      </Container>
    </section>
  );
}
