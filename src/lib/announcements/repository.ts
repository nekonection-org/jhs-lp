import "server-only";

import {
  AnnouncementCategory as DatabaseCategory,
  AnnouncementLocale as DatabaseLocale,
  AnnouncementStatus as DatabaseStatus,
} from "@/generated/prisma/enums";
import type { Prisma } from "@/generated/prisma/client";
import type {
  AnnouncementCategory,
  AnnouncementLocale,
  AnnouncementRecord,
  AnnouncementStatus,
} from "@/lib/announcements/types";
import { getPrismaClient } from "@/lib/database/client";

export const announcementWithTranslations = {
  translations: {
    orderBy: { locale: "asc" },
  },
} satisfies Prisma.AnnouncementInclude;

export type DatabaseAnnouncementWithTranslations =
  Prisma.AnnouncementGetPayload<{
    include: typeof announcementWithTranslations;
  }>;

const categoryFromDatabase: Readonly<
  Record<DatabaseCategory, AnnouncementCategory>
> = {
  NOTICE: "notice",
  MAINTENANCE: "maintenance",
  UPDATE: "update",
  EVENT: "event",
  IMPORTANT: "important",
  INCIDENT: "incident",
};

const statusFromDatabase: Readonly<Record<DatabaseStatus, AnnouncementStatus>> =
  {
    DRAFT: "draft",
    PUBLISHED: "published",
    ARCHIVED: "archived",
  };

const localeFromDatabase: Readonly<Record<DatabaseLocale, AnnouncementLocale>> =
  {
    JA: "ja",
    EN: "en",
  };

export function mapAnnouncementRecord(
  announcement: DatabaseAnnouncementWithTranslations,
): AnnouncementRecord {
  return {
    id: announcement.id,
    category: categoryFromDatabase[announcement.category],
    status: statusFromDatabase[announcement.status],
    publishedAt: announcement.publishedAt,
    externalUrl: announcement.externalUrl,
    version: announcement.version,
    createdAt: announcement.createdAt,
    updatedAt: announcement.updatedAt,
    translations: announcement.translations.map((translation) => ({
      locale: localeFromDatabase[translation.locale],
      title: translation.title,
      description: translation.description,
    })),
  };
}

export async function listAdminAnnouncements() {
  const announcements = await getPrismaClient().announcement.findMany({
    include: announcementWithTranslations,
    orderBy: { updatedAt: "desc" },
    take: 100,
  });

  return announcements.map(mapAnnouncementRecord);
}

export async function findAdminAnnouncement(id: string) {
  const announcement = await getPrismaClient().announcement.findUnique({
    where: { id },
    include: announcementWithTranslations,
  });

  return announcement ? mapAnnouncementRecord(announcement) : null;
}

interface ListPublishedAnnouncementsOptions {
  now?: Date;
  page?: number;
  pageSize?: number;
}

export async function listPublishedAnnouncements({
  now = new Date(),
  page = 1,
  pageSize = 5,
}: ListPublishedAnnouncementsOptions = {}) {
  const database = getPrismaClient();
  const where = {
    status: DatabaseStatus.PUBLISHED,
    publishedAt: { lte: now },
  } satisfies Prisma.AnnouncementWhereInput;
  const normalizedPageSize = Math.max(1, Math.trunc(pageSize));
  const requestedPage = Math.max(1, Math.trunc(page));
  const totalItems = await database.announcement.count({ where });
  const totalPages = Math.max(1, Math.ceil(totalItems / normalizedPageSize));
  const currentPage = Math.min(requestedPage, totalPages);
  const announcements = await database.announcement.findMany({
    where,
    include: announcementWithTranslations,
    orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
    skip: (currentPage - 1) * normalizedPageSize,
    take: normalizedPageSize,
  });

  return {
    items: announcements.map(mapAnnouncementRecord),
    page: currentPage,
    pageSize: normalizedPageSize,
    totalItems,
    totalPages,
  };
}
