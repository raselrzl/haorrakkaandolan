"use server";

import { revalidatePath } from "next/cache";
import {
  MediaType,
  NewsType,
  WaterBodyType,
} from "@/app/generated/prisma/client";
import { requireAdmin } from "@/app/utils/auth";
import { prisma } from "@/app/utils/db";

const DASHBOARD_PATH = "/dashboard/newactivity";

function cleanText(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

function validateMediaUrl(value: string): string | null {
  if (!value) return null;

  try {
    const url = new URL(value);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error("Use a valid HTTP or HTTPS media URL.");
    }

    return url.toString();
  } catch {
    throw new Error("Please provide a valid image or video URL.");
  }
}

function detectMediaType(url: string): MediaType {
  if (
    /\.(mp4|webm|ogg|mov|m4v)(\?.*)?(#.*)?$/i.test(url) ||
    /(^|\.)youtube\.com$|(^|\.)youtu\.be$|(^|\.)vimeo\.com$/i.test(
      new URL(url).hostname,
    )
  ) {
    return MediaType.VIDEO;
  }

  return MediaType.IMAGE;
}

function validateNewsData(formData: FormData) {
  const heading = cleanText(formData.get("heading"));
  const details = cleanText(formData.get("details"));
  const mediaUrl = validateMediaUrl(cleanText(formData.get("mediaUrl")));
  const submittedMediaType = cleanText(formData.get("mediaType"));
  const riverOrHaor = cleanText(formData.get("riverOrHaor"));
  const type = cleanText(formData.get("type"));

  if (!heading) throw new Error("Heading is required.");
  if (!details) throw new Error("Details are required.");

  if (!Object.values(WaterBodyType).includes(riverOrHaor as WaterBodyType)) {
    throw new Error("Select either River or Haor.");
  }

  if (!Object.values(NewsType).includes(type as NewsType)) {
    throw new Error("Select either News or Activity.");
  }

  let mediaType: MediaType | null = null;

  if (mediaUrl) {
    mediaType = Object.values(MediaType).includes(
      submittedMediaType as MediaType,
    )
      ? (submittedMediaType as MediaType)
      : detectMediaType(mediaUrl);
  }

  return {
    heading,
    details,
    mediaUrl,
    mediaType,
    riverOrHaor: riverOrHaor as WaterBodyType,
    type: type as NewsType,
  };
}

// CREATE NEWS / ACTIVITY
export async function createNewsAction(formData: FormData) {
  const user = await requireAdmin();
  const data = validateNewsData(formData);

  await prisma.news.create({
    data: {
      userId: user.id,
      ...data,
    },
  });

  revalidatePath(DASHBOARD_PATH);
  revalidatePath("/news");

  return {
    success: true,
    message: "News or activity published successfully.",
  };
}

// EDIT / UPDATE NEWS / ACTIVITY
export async function updateNewsAction(id: string, formData: FormData) {
  await requireAdmin();

  if (!id?.trim()) {
    throw new Error("A news record must be selected.");
  }

  const data = validateNewsData(formData);

  const existingNews = await prisma.news.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existingNews) {
    throw new Error("News or activity record not found.");
  }

  await prisma.news.update({
    where: { id },
    data,
  });

  revalidatePath(DASHBOARD_PATH);
  revalidatePath("/news");

  return {
    success: true,
    message: "News or activity updated successfully.",
  };
}

// GET NEWS / ACTIVITIES
export async function getNewsAction() {
  await requireAdmin();

  return prisma.news.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { name: true },
      },
    },
  });
}

// DELETE SINGLE RECORD
export async function deleteNewsAction(id: string) {
  await requireAdmin();

  if (!id?.trim()) {
    throw new Error("A news record must be selected.");
  }

  await prisma.news.delete({
    where: { id },
  });

  revalidatePath(DASHBOARD_PATH);
  revalidatePath("/news");

  return {
    success: true,
    message: "Record deleted successfully.",
  };
}

// DELETE SELECTED RECORDS
export async function deleteSelectedNewsAction(ids: string[]) {
  await requireAdmin();

  const selectedIds = [
    ...new Set(
      ids.filter((id) => typeof id === "string" && id.trim().length > 0),
    ),
  ];

  if (selectedIds.length === 0) {
    throw new Error("Select at least one record.");
  }

  const result = await prisma.news.deleteMany({
    where: {
      id: { in: selectedIds },
    },
  });

  revalidatePath(DASHBOARD_PATH);
  revalidatePath("/news");

  return {
    success: true,
    count: result.count,
    message: `${result.count} record(s) deleted successfully.`,
  };
}
