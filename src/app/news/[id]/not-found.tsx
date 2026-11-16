import { ArrowLeft, FileQuestion } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { LocalizedText } from "@/components/ui/LocalizedText";
import { LocalizedPageTitle } from "@/components/ui/LocalizedPageTitle";
import { en, ja } from "@/content";

export default function NewsNotFound() {
  return (
    <Container>
      <LocalizedPageTitle
        ja={ja.news.notFoundTitle}
        en={en.news.notFoundTitle}
      />
      <div className="news-article news-detail-status">
        <FileQuestion
          aria-hidden="true"
          className="size-7 text-[var(--accent-strong)]"
        />
        <h1>
          <LocalizedText
            ja={ja.news.notFoundTitle}
            en={en.news.notFoundTitle}
          />
        </h1>
        <p>
          <LocalizedText
            ja={ja.news.notFoundDescription}
            en={en.news.notFoundDescription}
          />
        </p>
        <Link className="news-back-link" href="/#news">
          <ArrowLeft aria-hidden="true" className="size-4" />
          <LocalizedText ja={ja.news.backToList} en={en.news.backToList} />
        </Link>
      </div>
    </Container>
  );
}
