"use server";

import { prisma } from "@/app/utils/db";

export async function getPublicNewsById(id: string) {
  if (!id || typeof id !== "string") {
    return null;
  }

  try {
    return await prisma.news.findUnique({
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
      },
    });
  } catch (error) {
    console.error("Failed to load public news:", error);
    return null;
  }
}

export async function getRelatedPublicNews(
  currentId: string,
  riverOrHaor: "RIVER" | "HAOR",
  type: "NEWS" | "ACTIVITY",
) {
  if (!currentId || typeof currentId !== "string") {
    return [];
  }

  try {
    const related = await prisma.news.findMany({
      where: {
        id: { not: currentId },
        OR: [{ riverOrHaor }, { type }],
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 4,
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
    });

    if (related.length >= 4) {
      return related;
    }

    const existingIds = [
      currentId,
      ...related.map((item) => item.id),
    ];

    const additional = await prisma.news.findMany({
      where: {
        id: { notIn: existingIds },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 4 - related.length,
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
    });

    return [...related, ...additional];
  } catch (error) {
    console.error("Failed to load related public news:", error);
    return [];
  }
}