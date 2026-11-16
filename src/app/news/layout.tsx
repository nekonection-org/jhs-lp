import type { ReactNode } from "react";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { LocalizedText } from "@/components/ui/LocalizedText";
import { en, ja } from "@/content";

export default function NewsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="news-detail-page">
      <a className="skip-link" href="#main-content">
        <LocalizedText
          ja={ja.common.skipToContent}
          en={en.common.skipToContent}
        />
      </a>
      <Header homePath="/" />
      <main
        className="landing-page news-detail-main"
        id="main-content"
        tabIndex={-1}
      >
        {children}
      </main>
      <Footer homePath="/" />
    </div>
  );
}
