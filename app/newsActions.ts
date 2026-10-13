"use server";

import { prisma } from "./utils/db";

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
    orderBy: {
      createdAt: "desc",
    },
  });
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
