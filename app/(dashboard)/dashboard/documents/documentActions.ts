"use server";

import { revalidatePath } from "next/cache";
import { DocumentMediaType } from "@/app/generated/prisma/client";
import { requireAdmin } from "@/app/utils/auth";
import { prisma } from "@/app/utils/db";

const DASHBOARD_PATH = "/dashboard/documents";

function cleanText(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

function validateDocumentUrl(value: string): string {
  try {
    const url = new URL(value);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error();
    }

    return url.toString();
  } catch {
    throw new Error("Please provide a valid document URL.");
  }
}

export async function createDocumentAction(formData: FormData) {
  await requireAdmin();

  const heading = cleanText(formData.get("heading"));
  const documentDate = cleanText(formData.get("documentDate"));
  const documentUrl = validateDocumentUrl(
    cleanText(formData.get("documentUrl")),
  );
  const documentName = cleanText(formData.get("documentName"));
  const mediaType = cleanText(formData.get("mediaType"));

  if (!heading) throw new Error("Heading is required.");

  if (!documentDate || isNaN(new Date(documentDate).getTime())) {
    throw new Error("A valid document date is required.");
  }

  if (
    !Object.values(DocumentMediaType).includes(mediaType as DocumentMediaType)
  ) {
    throw new Error("Select a valid document type.");
  }

  await prisma.document.create({
    data: {
      heading,
      documentDate: new Date(`${documentDate}T12:00:00.000Z`),
      documentUrl,
      documentName: documentName || null,
      mediaType: mediaType as DocumentMediaType,
    },
  });

  revalidatePath(DASHBOARD_PATH);
  revalidatePath("/documents");

  return {
    success: true,
    message: "Document added successfully.",
  };
}

export async function getDocumentsAction() {
  await requireAdmin();

  return prisma.document.findMany({
    orderBy: [{ documentDate: "desc" }, { createdAt: "desc" }],
  });
}

export async function deleteDocumentAction(id: string) {
  await requireAdmin();

  if (!id?.trim()) {
    throw new Error("A document must be selected.");
  }

  await prisma.document.delete({
    where: { id },
  });

  revalidatePath(DASHBOARD_PATH);
  revalidatePath("/documents");

  return {
    success: true,
    message: "Document deleted successfully.",
  };
}

export async function deleteSelectedDocumentsAction(ids: string[]) {
  await requireAdmin();

  const selectedIds = [
    ...new Set(
      ids.filter((id) => typeof id === "string" && id.trim().length > 0),
    ),
  ];

  if (selectedIds.length === 0) {
    throw new Error("Select at least one document.");
  }

  const result = await prisma.document.deleteMany({
    where: {
      id: { in: selectedIds },
    },
  });

  revalidatePath(DASHBOARD_PATH);
  revalidatePath("/documents");

  return {
    success: true,
    count: result.count,
    message: `${result.count} document(s) deleted successfully.`,
  };
}
