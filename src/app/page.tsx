import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileJoinBar } from "@/components/layout/MobileJoinBar";
import { FaqSection } from "@/components/sections/FaqSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ModeratorSection } from "@/components/sections/ModeratorSection";
import { NewsSection } from "@/components/sections/NewsSection";
import { RulesSection } from "@/components/sections/RulesSection";
import { ServerSection } from "@/components/sections/ServerSection";
import { VipSection } from "@/components/sections/VipSection";
import { LocalizedText } from "@/components/ui/LocalizedText";
import { en, ja } from "@/content";
import { parsePublicAnnouncementsPage } from "@/lib/announcements/public-types";

export const dynamic = "force-dynamic";

interface HomeProps {
  searchParams: Promise<{ newsPage?: string | string[] }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const query = await searchParams;
  const newsPage = parsePublicAnnouncementsPage(query.newsPage);

  return (
    <>
      <a className="skip-link" href="#main-content">
        <LocalizedText
          ja={ja.common.skipToContent}
          en={en.common.skipToContent}
        />
      </a>
      <Header />
      <main className="landing-page relative" id="main-content" tabIndex={-1}>
        <HeroSection />
        <ServerSection />
        <RulesSection />
        <VipSection />
        <FaqSection />
        <ModeratorSection />
        <NewsSection page={newsPage} />
      </main>
      <Footer />
      <MobileJoinBar />
    </>
  );
}
