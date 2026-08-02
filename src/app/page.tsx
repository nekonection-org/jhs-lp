import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { FaqSection } from "@/components/sections/FaqSection";
import { FinalCtaSection } from "@/components/sections/FinalCtaSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ModeratorSection } from "@/components/sections/ModeratorSection";
import { NewsSection } from "@/components/sections/NewsSection";
import { RulesSection } from "@/components/sections/RulesSection";
import { ServerSection } from "@/components/sections/ServerSection";
import { VipSection } from "@/components/sections/VipSection";
import { LocalizedText } from "@/components/ui/LocalizedText";
import { en, ja } from "@/content";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        <LocalizedText
          ja={ja.common.skipToContent}
          en={en.common.skipToContent}
        />
      </a>
      <Header />
      <main
        className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_8%_22%,color-mix(in_srgb,var(--accent)_7%,transparent),transparent_28rem),radial-gradient(circle_at_94%_70%,color-mix(in_srgb,var(--accent)_6%,transparent),transparent_32rem)]"
        id="main-content"
        tabIndex={-1}
      >
        <HeroSection />
        <ServerSection />
        <RulesSection />
        <VipSection />
        <FaqSection />
        <ModeratorSection />
        <NewsSection />
        <FinalCtaSection />
      </main>
      <Footer />
    </>
  );
}
