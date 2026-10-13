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
