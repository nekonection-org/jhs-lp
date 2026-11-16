"use client";

import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { LocalizedText } from "@/components/ui/LocalizedText";
import { LocalizedPageTitle } from "@/components/ui/LocalizedPageTitle";
import { en, ja } from "@/content";

export default function NewsError({ reset }: { reset: () => void }) {
  return (
    <Container>
      <LocalizedPageTitle
        ja={ja.news.unavailableTitle}
        en={en.news.unavailableTitle}
      />
      <div className="news-article news-detail-status">
        <h1>
          <LocalizedText
            ja={ja.news.unavailableTitle}
            en={en.news.unavailableTitle}
          />
        </h1>
        <p>
          <LocalizedText
            ja={ja.news.unavailableDescription}
            en={en.news.unavailableDescription}
          />
        </p>
        <div className="flex flex-wrap items-center gap-5">
          <Button onClick={reset} variant="secondary">
            <LocalizedText ja={ja.news.retryLabel} en={en.news.retryLabel} />
          </Button>
          <Link className="news-back-link" href="/#news">
            <LocalizedText ja={ja.news.backToList} en={en.news.backToList} />
          </Link>
        </div>
      </div>
    </Container>
  );
}
