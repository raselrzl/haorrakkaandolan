"use server";
import { prisma } from "./utils/db";


export type PublicNewsFilter =
  | "ALL"
  | "NEWS"
  | "ACTIVITY"
  | "RIVER"
  | "HAOR";

const PAGE_SIZE = 20;

/**
 * Existing action.
 * Kept for compatibility with other pages that use it.
 */
export async function getPublicNewsAction() {
  return prisma.news.findMany({
    select: {
      id: true,
      heading: true,
      details: true,
      mediaUrl: true,
      mediaType: true,
      riverOrHaor: true,
      type: true,
      createdAt: true,
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  });
}

/**
 * Paginated public news and activities.
 * Fetches at most 21 rows to determine whether another page exists.
 * Returns only 20 rows to the client.
 */
export async function getPublicNewsPageAction({
  page = 1,
  filter = "ALL",
  search = "",
}: {
  page?: number;
  filter?: PublicNewsFilter;
  search?: string;
}) {
  const currentPage = Math.max(
    1,
    Math.floor(Number.isFinite(page) ? page : 1),
  );

  const query = search.trim().slice(0, 150);

  const where = {
    ...(filter === "NEWS" || filter === "ACTIVITY"
      ? { type: filter }
      : {}),

    ...(filter === "RIVER" || filter === "HAOR"
      ? { riverOrHaor: filter }
      : {}),

    ...(query
      ? {
          OR: [
            {
              heading: {
                contains: query,
                mode: "insensitive" as const,
              },
            },
            {
              details: {
                contains: query,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),
  };

  const results = await prisma.news.findMany({
    where,
    select: {
      id: true,
      heading: true,
      details: true,
      mediaUrl: true,
      mediaType: true,
      riverOrHaor: true,
      type: true,
      createdAt: true,
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    skip: (currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE + 1,
  });

  return {
    items: results.slice(0, PAGE_SIZE),
    hasMore: results.length > PAGE_SIZE,
    page: currentPage,
    pageSize: PAGE_SIZE,
  };
}



export type HomepageNewsItem = {
  id: string;
  heading: string;
  createdAt: string;
  type: "NEWS" | "ACTIVITY";
  riverOrHaor: "RIVER" | "HAOR";
};

export type NewsDetailsItem = {
  id: string;
  heading: string;
  details: string;
  mediaUrl: string | null;
  mediaType: "IMAGE" | "VIDEO" | null;
  riverOrHaor: "RIVER" | "HAOR";
  type: "NEWS" | "ACTIVITY";
  createdAt: string;
  updatedAt: string;
  author: string;
};

export async function getHomepageNews(): Promise<{
  updates: HomepageNewsItem[];
  news: HomepageNewsItem[];
}> {
  const [updates, news] = await Promise.all([
    prisma.news.findMany({
      where: { type: "ACTIVITY" },
      orderBy: { createdAt: "desc" },
      take: 4,
      select: {
        id: true,
        heading: true,
        createdAt: true,
        type: true,
        riverOrHaor: true,
      },
    }),

    prisma.news.findMany({
      where: { type: "NEWS" },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        heading: true,
        createdAt: true,
        type: true,
        riverOrHaor: true,
      },
    }),
  ]);

  return {
    updates: updates.map((item) => ({
      ...item,
      createdAt: item.createdAt.toISOString(),
    })),
    news: news.map((item) => ({
      ...item,
      createdAt: item.createdAt.toISOString(),
    })),
  };
}

export async function getNewsById(
  id: string,
): Promise<NewsDetailsItem | null> {
  if (!id || id.length > 100) {
    return null;
  }

  const item = await prisma.news.findUnique({
    where: { id },
    select: {
      id: true,
      heading: true,
      details: true,
      mediaUrl: true,
      mediaType: true,
      riverOrHaor: true,
      type: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!item) {
    return null;
  }

  return {
    id: item.id,
    heading: item.heading,
    details: item.details,
    mediaUrl: item.mediaUrl,
    mediaType: item.mediaType,
    riverOrHaor: item.riverOrHaor,
    type: item.type,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
    author: item.user.name,
  };
}
