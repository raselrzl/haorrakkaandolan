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
