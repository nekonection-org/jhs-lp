import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { NewsArticle } from "@/components/news/NewsArticle";
import { Container } from "@/components/ui/Container";
import { ja } from "@/content";
import { getPublicAnnouncement } from "@/lib/announcements/public";
import { parsePublicAnnouncementsPage } from "@/lib/announcements/public-types";
import { socialPreviewImage } from "@/lib/social-metadata";

export const dynamic = "force-dynamic";

interface NewsPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ newsPage?: string | string[] }>;
}

export async function generateMetadata({
  params,
}: NewsPageProps): Promise<Metadata> {
  const { id } = await params;
  const announcement = await getPublicAnnouncement(id);
  if (!announcement) notFound();

  const title = `${announcement.translations.ja.title} | ${ja.common.siteName}`;
  const description = announcement.translations.ja.description;
  const url = `/news/${encodeURIComponent(announcement.id)}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      siteName: ja.common.siteName,
      locale: "ja_JP",
      publishedTime: announcement.publishedAt,
      images: [{ ...socialPreviewImage, alt: ja.metadata.openGraphImageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialPreviewImage.url],
    },
  };
}

export default async function NewsPage({
  params,
  searchParams,
}: NewsPageProps) {
  const { id } = await params;
  const announcement = await getPublicAnnouncement(id);
  if (!announcement) notFound();

  const page = parsePublicAnnouncementsPage((await searchParams).newsPage);
  const backHref = page > 1 ? `/?newsPage=${page}#news` : "/#news";

  return (
    <Container>
      <NewsArticle announcement={announcement} backHref={backHref} />
    </Container>
  );
}
