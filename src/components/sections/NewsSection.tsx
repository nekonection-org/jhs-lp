import { NewsList } from "@/components/sections/NewsList";
import { Container } from "@/components/ui/Container";
import { LocalizedText } from "@/components/ui/LocalizedText";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { en, ja } from "@/content";
import { getPublicAnnouncements } from "@/lib/announcements/public";

interface NewsSectionProps {
  page?: number;
}

export async function NewsSection({ page = 1 }: NewsSectionProps) {
  const result = await getPublicAnnouncements(page);

  return (
    <section className="section-shell" id="news">
      <Container className="news-layout">
        <Reveal>
          <SectionHeading
            index="06"
            layout="split"
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

        <div className="news-feed">
          <NewsList result={result} />
        </div>
      </Container>
    </section>
  );
}
