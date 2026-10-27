"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/app/utils/auth";
import { prisma } from "@/app/utils/db";

type PublicationKind = "RESEARCH" | "PUBLICATION";
type PublicationStatus = "ACTIVE" | "INACTIVE";

type ActionResult = {
  success: boolean;
  message: string;
};

async function authorizeAdmin() {
  const admin = await requireAdmin();

  if (admin.status !== "ACTIVE") {
    throw new Error("An active administrator account is required.");
  }

  return admin;
}

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getOptionalText(formData: FormData, key: string) {
  return getText(formData, key) || null;
}

function validateUrl(value: string, label: string): string | null {
  if (!value) return null;

  try {
    const url = new URL(value);

    if (url.protocol !== "https:" && url.protocol !== "http:") {
      throw new Error();
    }

    return url.toString();
  } catch {
    throw new Error(`${label} must be a valid HTTP or HTTPS URL.`);
  }
}

function getPublicationData(formData: FormData) {
  const title = getText(formData, "title");
  const authorName = getText(formData, "authorName");
  const content = getText(formData, "content");
  const type = getText(formData, "type");
  const status = getText(formData, "status");
  const publishedAtInput = getText(formData, "publishedAt");

  if (!title) {
    throw new Error("Publication title is required.");
  }

  if (title.length > 250) {
    throw new Error("Title cannot exceed 250 characters.");
  }

  if (!authorName) {
    throw new Error("Author name is required.");
  }

  if (!content) {
    throw new Error("Publication content is required.");
  }

  if (type !== "RESEARCH" && type !== "PUBLICATION") {
    throw new Error("Invalid publication type.");
  }

  if (status !== "ACTIVE" && status !== "INACTIVE") {
    throw new Error("Invalid publication status.");
  }

  let publishedAt = new Date();

  if (publishedAtInput) {
    publishedAt = new Date(
      `${publishedAtInput}T12:00:00+06:00`,
    );

    if (Number.isNaN(publishedAt.getTime())) {
      throw new Error("Please provide a valid publication date.");
    }
  }

  return {
    title,
    subtitle: getOptionalText(formData, "subtitle"),
    type: type as PublicationKind,
    excerpt: getOptionalText(formData, "excerpt"),
    content,

    coverImageUrl: validateUrl(
      getText(formData, "coverImageUrl"),
      "Cover image",
    ),

    documentUrl: validateUrl(
      getText(formData, "documentUrl"),
      "Document URL",
    ),

    documentName: getOptionalText(formData, "documentName"),
    authorName,
    authorDesignation: getOptionalText(
      formData,
      "authorDesignation",
    ),

    authorImageUrl: validateUrl(
      getText(formData, "authorImageUrl"),
      "Author image",
    ),

    authorBio: getOptionalText(formData, "authorBio"),
    publishedAt,
    status: status as PublicationStatus,
  };
}

function refreshPublicationPages(id?: string) {
  revalidatePath("/dashboard/publications");
  revalidatePath("/publications");

  if (id) {
    revalidatePath(`/publications/${id}`);
  }
}

export async function getAdminPublicationsAction() {
  await authorizeAdmin();

  const publications = await prisma.publication.findMany({
    orderBy: [
      { publishedAt: "desc" },
      { createdAt: "desc" },
    ],
  });

  return publications.map((publication) => ({
    ...publication,
    publishedAt: publication.publishedAt.toISOString(),
    createdAt: publication.createdAt.toISOString(),
    updatedAt: publication.updatedAt.toISOString(),
  }));
}

export async function createPublicationAction(
  formData: FormData,
): Promise<ActionResult> {
  const admin = await authorizeAdmin();
  const data = getPublicationData(formData);

  const publication = await prisma.publication.create({
    data: {
      ...data,
      createdById: admin.id,
    },
  });

  refreshPublicationPages(publication.id);

  return {
    success: true,
    message: "Publication created successfully.",
  };
}

export async function updatePublicationAction(
  formData: FormData,
): Promise<ActionResult> {
  await authorizeAdmin();

  const id = getText(formData, "id");

  if (!id) {
    throw new Error("Publication ID is required.");
  }

  const data = getPublicationData(formData);

  const publication = await prisma.publication.update({
    where: { id },
    data,
  });

  refreshPublicationPages(publication.id);

  return {
    success: true,
    message: "Publication updated successfully.",
  };
}

export async function deletePublicationAction(
  id: string,
): Promise<ActionResult> {
  await authorizeAdmin();

  if (!id?.trim()) {
    throw new Error("Publication ID is required.");
  }

  await prisma.publication.delete({
    where: { id },
  });

  refreshPublicationPages(id);

  return {
    success: true,
    message: "Publication deleted successfully.",
  };
}