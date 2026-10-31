
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

function validateDocumentDate(value: string): Date {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error("A valid document date is required.");
  }

  const date = new Date(`${value}T12:00:00.000Z`);

  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  ) {
    throw new Error("A valid document date is required.");
  }

  return date;
}

function validateMediaType(value: string): DocumentMediaType {
  if (
    !Object.values(DocumentMediaType).includes(
      value as DocumentMediaType,
    )
  ) {
    throw new Error("Select a valid document type.");
  }

  return value as DocumentMediaType;
}

function revalidateDocumentPages() {
  revalidatePath(DASHBOARD_PATH);
  revalidatePath("/documents");
}

export async function createDocumentAction(formData: FormData) {
  await requireAdmin();

  const heading = cleanText(formData.get("heading"));
  const documentDate = cleanText(formData.get("documentDate"));
  const documentUrl = validateDocumentUrl(
    cleanText(formData.get("documentUrl")),
  );
  const documentName = cleanText(formData.get("documentName"));
  const mediaType = validateMediaType(
    cleanText(formData.get("mediaType")),
  );

  if (!heading) {
    throw new Error("Heading is required.");
  }

  if (heading.length > 200) {
    throw new Error("Heading cannot exceed 200 characters.");
  }

  if (!documentName) {
    throw new Error("Document name is required.");
  }

  await prisma.document.create({
    data: {
      heading,
      documentDate: validateDocumentDate(documentDate),
      documentUrl,
      documentName,
      mediaType,
    },
  });

  revalidateDocumentPages();

  return {
    success: true,
    message: "Document added successfully.",
  };
}

export async function updateDocumentAction(
  id: string,
  formData: FormData,
) {
  await requireAdmin();

  if (!id?.trim()) {
    throw new Error("A valid document must be selected.");
  }

  const existingDocument = await prisma.document.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existingDocument) {
    throw new Error("Document not found.");
  }

  const heading = cleanText(formData.get("heading"));
  const documentDate = cleanText(formData.get("documentDate"));
  const documentUrl = validateDocumentUrl(
    cleanText(formData.get("documentUrl")),
  );
  const documentName = cleanText(formData.get("documentName"));
  const mediaType = validateMediaType(
    cleanText(formData.get("mediaType")),
  );

  if (!heading) {
    throw new Error("Heading is required.");
  }

  if (heading.length > 200) {
    throw new Error("Heading cannot exceed 200 characters.");
  }

  if (!documentName) {
    throw new Error("Document name is required.");
  }

  await prisma.document.update({
    where: { id },
    data: {
      heading,
      documentDate: validateDocumentDate(documentDate),
      documentUrl,
      documentName,
      mediaType,
    },
  });

  revalidateDocumentPages();

  return {
    success: true,
    message: "Document updated successfully.",
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

  revalidateDocumentPages();

  return {
    success: true,
    message: "Document deleted successfully.",
  };
}

export async function deleteSelectedDocumentsAction(ids: string[]) {
  await requireAdmin();

  const selectedIds = [
    ...new Set(
      ids.filter(
        (id) => typeof id === "string" && id.trim().length > 0,
      ),
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

  revalidateDocumentPages();

  return {
    success: true,
    count: result.count,
    message: `${result.count} document(s) deleted successfully.`,
  };
}
