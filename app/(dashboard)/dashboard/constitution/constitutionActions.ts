"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/utils/db";
import { requireAdmin } from "@/app/utils/auth";
import { Status } from "@/app/generated/prisma/enums";

const DASHBOARD_PATH = "/dashboard/constitution";

type ConstitutionInput = {
  id?: string;
  titleBn: string;
  titleEn: string;
  descriptionBn?: string;
  descriptionEn?: string;
  pdfUrlBn?: string;
  pdfUrlEn?: string;
  publishedAt: string;
  status: Status;
};

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function validUrl(value: string) {
  if (!value) return true;

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function validateInput(input: ConstitutionInput) {
  const titleBn = cleanText(input.titleBn);
  const titleEn = cleanText(input.titleEn);
  const descriptionBn = cleanText(input.descriptionBn);
  const descriptionEn = cleanText(input.descriptionEn);
  const pdfUrlBn = cleanText(input.pdfUrlBn);
  const pdfUrlEn = cleanText(input.pdfUrlEn);

  if (!titleBn || !titleEn) {
    throw new Error("Bangla and English titles are required.");
  }

  if (!pdfUrlBn && !pdfUrlEn) {
    throw new Error("Upload at least one PDF.");
  }

  if (!validUrl(pdfUrlBn) || !validUrl(pdfUrlEn)) {
    throw new Error("Please provide valid PDF URLs.");
  }

  const publishedAt = new Date(`${input.publishedAt}T12:00:00`);

  if (!input.publishedAt || Number.isNaN(publishedAt.getTime())) {
    throw new Error("Please select a valid publication date.");
  }

  if (!Object.values(Status).includes(input.status)) {
    throw new Error("Invalid publication status.");
  }

  return {
    titleBn,
    titleEn,
    descriptionBn: descriptionBn || null,
    descriptionEn: descriptionEn || null,
    pdfUrlBn: pdfUrlBn || null,
    pdfUrlEn: pdfUrlEn || null,
    publishedAt,
    status: input.status,
  };
}

export async function getConstitutionsAction() {
  await requireAdmin();

  const records = await prisma.constitution.findMany({
    orderBy: [{ updatedAt: "desc" }],
  });

  return records.map((record) => ({
    ...record,
    publishedAt: record.publishedAt.toISOString(),
    lastUpdatedAt: record.lastUpdatedAt.toISOString(),
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  }));
}

export async function createConstitutionAction(input: ConstitutionInput) {
  await requireAdmin();

  try {
    const data = validateInput(input);

    const record = await prisma.constitution.create({
      data,
    });

    revalidatePath(DASHBOARD_PATH);
    revalidatePath("/constitution");

    return {
      success: true,
      message: "Constitution created successfully.",
      id: record.id,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Failed to create the constitution.");
  }
}

export async function updateConstitutionAction(input: ConstitutionInput) {
  await requireAdmin();

  if (!input.id) {
    throw new Error("Constitution ID is required.");
  }

  try {
    const data = validateInput(input);

    await prisma.constitution.update({
      where: { id: input.id },
      data,
    });

    revalidatePath(DASHBOARD_PATH);
    revalidatePath("/constitution");

    return {
      success: true,
      message: "Constitution updated successfully.",
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Failed to update the constitution.");
  }
}

export async function updateConstitutionStatusAction(
  id: string,
  status: Status,
) {
  await requireAdmin();

  if (!id || !Object.values(Status).includes(status)) {
    throw new Error("Invalid constitution or status.");
  }

  await prisma.constitution.update({
    where: { id },
    data: { status },
  });

  revalidatePath(DASHBOARD_PATH);
  revalidatePath("/constitution");

  return { success: true };
}

export async function deleteConstitutionAction(id: string) {
  await requireAdmin();

  if (!id?.trim()) {
    throw new Error("Constitution ID is required.");
  }

  await prisma.constitution.delete({
    where: { id },
  });

  revalidatePath(DASHBOARD_PATH);
  revalidatePath("/constitution");

  return {
    success: true,
    message: "Constitution deleted successfully.",
  };
}