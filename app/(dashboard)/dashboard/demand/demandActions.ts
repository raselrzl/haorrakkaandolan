"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/utils/db";
import { requireAdmin } from "@/app/utils/auth";

const DEMAND_PATH = "/dashboard/demand";

function requiredText(value: unknown, field: string) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${field} is required.`);
  }

  return value.trim();
}

function optionalText(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function publicationDate(value: unknown) {
  if (typeof value !== "string" || !value.trim()) {
    return new Date();
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid publication date.");
  }

  return date;
}

function refreshDemandPage() {
  revalidatePath(DEMAND_PATH);
  revalidatePath("/demands");
}

export async function getDemandsAction() {
  try {
    await requireAdmin();

    const demands = await prisma.demand.findMany({
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      include: {
        points: {
          orderBy: { pointNumber: "asc" },
        },
      },
    });

    return {
      success: true as const,
      demands: demands.map((demand) => ({
        ...demand,
        publishedAt: demand.publishedAt.toISOString(),
        updatedAt: demand.updatedAt.toISOString(),
        createdAt: demand.createdAt.toISOString(),
        points: demand.points.map((point) => ({
          ...point,
          createdAt: point.createdAt.toISOString(),
          updatedAt: point.updatedAt.toISOString(),
        })),
      })),
    };
  } catch (error) {
    return {
      success: false as const,
      message:
        error instanceof Error ? error.message : "Could not load demands.",
    };
  }
}

type PointInput = {
  headingBn: string;
  headingEn: string;
  descriptionBn: string;
  descriptionEn: string;
};

type DemandInput = {
  titleBn: string;
  titleEn: string;
  descriptionBn?: string;
  descriptionEn?: string;
  publishedAt?: string;
  points: PointInput[];
};

function validatePoints(points: PointInput[]) {
  if (!Array.isArray(points) || points.length === 0) {
    throw new Error("Add at least one demand point.");
  }

  return points.map((point, index) => ({
    pointNumber: index + 1,
    headingBn: requiredText(
      point.headingBn,
      `Point ${index + 1} Bangla heading`,
    ),
    headingEn: requiredText(
      point.headingEn,
      `Point ${index + 1} English heading`,
    ),
    descriptionBn: requiredText(
      point.descriptionBn,
      `Point ${index + 1} Bangla description`,
    ),
    descriptionEn: requiredText(
      point.descriptionEn,
      `Point ${index + 1} English description`,
    ),
  }));
}

export async function createDemandAction(input: DemandInput) {
  try {
    const user = await requireAdmin();

    const points = validatePoints(input.points);

    const demand = await prisma.demand.create({
      data: {
        titleBn: requiredText(input.titleBn, "Bangla title"),
        titleEn: requiredText(input.titleEn, "English title"),
        descriptionBn: optionalText(input.descriptionBn),
        descriptionEn: optionalText(input.descriptionEn),
        publishedAt: publicationDate(input.publishedAt),
        createdById: user.id,
        points: {
          create: points,
        },
      },
    });

    refreshDemandPage();

    return {
      success: true as const,
      message: "Demand document created successfully.",
      id: demand.id,
    };
  } catch (error) {
    return {
      success: false as const,
      message:
        error instanceof Error ? error.message : "Could not create demand.",
    };
  }
}

type UpdateDemandInput = {
  id: string;
  titleBn: string;
  titleEn: string;
  descriptionBn?: string;
  descriptionEn?: string;
  publishedAt: string;
  status: "ACTIVE" | "INACTIVE";
};

export async function updateDemandAction(input: UpdateDemandInput) {
  try {
    await requireAdmin();

    if (input.status !== "ACTIVE" && input.status !== "INACTIVE") {
      throw new Error("Invalid demand status.");
    }

    await prisma.demand.update({
      where: { id: requiredText(input.id, "Demand ID") },
      data: {
        titleBn: requiredText(input.titleBn, "Bangla title"),
        titleEn: requiredText(input.titleEn, "English title"),
        descriptionBn: optionalText(input.descriptionBn),
        descriptionEn: optionalText(input.descriptionEn),
        publishedAt: publicationDate(input.publishedAt),
        status: input.status,
      },
    });

    refreshDemandPage();

    return {
      success: true as const,
      message: "Demand document updated successfully.",
    };
  } catch (error) {
    return {
      success: false as const,
      message:
        error instanceof Error ? error.message : "Could not update demand.",
    };
  }
}

export async function deleteDemandAction(id: string) {
  try {
    await requireAdmin();

    await prisma.demand.delete({
      where: { id: requiredText(id, "Demand ID") },
    });

    refreshDemandPage();

    return {
      success: true as const,
      message: "Demand document deleted successfully.",
    };
  } catch (error) {
    return {
      success: false as const,
      message:
        error instanceof Error ? error.message : "Could not delete demand.",
    };
  }
}

type PointUpdateInput = PointInput & {
  id: string;
  demandId: string;
};

export async function updateDemandPointAction(input: PointUpdateInput) {
  try {
    await requireAdmin();

    const id = requiredText(input.id, "Point ID");
    const demandId = requiredText(input.demandId, "Demand ID");

    const point = await prisma.demandPoint.findFirst({
      where: { id, demandId },
      select: { id: true },
    });

    if (!point) {
      throw new Error("Demand point not found.");
    }

    await prisma.demandPoint.update({
      where: { id },
      data: {
        headingBn: requiredText(input.headingBn, "Bangla heading"),
        headingEn: requiredText(input.headingEn, "English heading"),
        descriptionBn: requiredText(input.descriptionBn, "Bangla description"),
        descriptionEn: requiredText(input.descriptionEn, "English description"),
      },
    });

    refreshDemandPage();

    return {
      success: true as const,
      message: "Demand point updated successfully.",
    };
  } catch (error) {
    return {
      success: false as const,
      message:
        error instanceof Error ? error.message : "Could not update point.",
    };
  }
}

export async function addDemandPointAction(
  demandId: string,
  input: PointInput,
) {
  try {
    await requireAdmin();

    const id = requiredText(demandId, "Demand ID");

    const demand = await prisma.demand.findUnique({
      where: { id },
      select: {
        id: true,
        points: {
          select: { pointNumber: true },
        },
      },
    });

    if (!demand) {
      throw new Error("Demand document not found.");
    }

    const nextNumber =
      demand.points.reduce(
        (highest, point) => Math.max(highest, point.pointNumber),
        0,
      ) + 1;

    await prisma.demandPoint.create({
      data: {
        demandId: id,
        pointNumber: nextNumber,
        headingBn: requiredText(input.headingBn, "Bangla heading"),
        headingEn: requiredText(input.headingEn, "English heading"),
        descriptionBn: requiredText(input.descriptionBn, "Bangla description"),
        descriptionEn: requiredText(input.descriptionEn, "English description"),
      },
    });

    refreshDemandPage();

    return {
      success: true as const,
      message: `Point ${nextNumber} added successfully.`,
    };
  } catch (error) {
    return {
      success: false as const,
      message: error instanceof Error ? error.message : "Could not add point.",
    };
  }
}

export async function deleteDemandPointAction(
  demandId: string,
  pointId: string,
) {
  try {
    await requireAdmin();

    const point = await prisma.demandPoint.findFirst({
      where: {
        id: requiredText(pointId, "Point ID"),
        demandId: requiredText(demandId, "Demand ID"),
      },
      select: { id: true },
    });

    if (!point) {
      throw new Error("Demand point not found.");
    }

    await prisma.demandPoint.delete({
      where: { id: point.id },
    });

    refreshDemandPage();

    return {
      success: true as const,
      message: "Demand point deleted successfully.",
    };
  } catch (error) {
    return {
      success: false as const,
      message:
        error instanceof Error ? error.message : "Could not delete point.",
    };
  }
}
