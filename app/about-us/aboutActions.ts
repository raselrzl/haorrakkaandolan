"use server";

import { prisma } from "../utils/db";

const designationPriority: Record<string, number> = {
  SOVAPOTI: 1,
  SADHARONSOMPADOK: 2,
  SOHOSOVAPOTI: 3,
  SOHOSADHARONSOMPADOK: 4,
  SANGOTONIKSOMPADOK: 5,
  SOHOSANGOTONIKSOMPADOK: 6,
  ARTHOSOMPADOK: 7,
  PROCHARSOMPADOK: 8,
  DOPTORSOMPADOK: 9,
  SANGSKRITIKSOMPADOK: 10,
  MOHILASOMPADOK: 11,
  AINBISHOYOKSOMPADOK: 12,
  CHATROOJUBOSOMPADOK: 13,
  UPODESTAPORISHOD: 14,
  KARJONIRBAHISODOSSHO: 15,
  MEMBER: 16,
  CHAIRMAN: 17,
};

export async function getPublicTeamAction() {
  const now = new Date();

  const people = await prisma.user.findMany({
    where: {
      role: {
        in: ["CHAIRMAN", "MEMBER"],
      },
      status: "ACTIVE",
      AND: [
        {
          OR: [
            { startDate: null },
            { startDate: { lte: now } },
          ],
        },
        {
          OR: [
            { endDate: null },
            { endDate: { gte: now } },
          ],
        },
      ],
    },
    select: {
      id: true,
      name: true,
      phone: true,
      imageUrl: true,
      role: true,
      biography: true,
      designation: true,
      startDate: true,
      endDate: true,
    },
  });

  return people.sort((a, b) => {
    const aDesignation =
      a.designation?.trim().toUpperCase() ||
      (a.role === "CHAIRMAN" ? "CHAIRMAN" : "MEMBER");

    const bDesignation =
      b.designation?.trim().toUpperCase() ||
      (b.role === "CHAIRMAN" ? "CHAIRMAN" : "MEMBER");

    const aPriority = designationPriority[aDesignation] ?? 99;
    const bPriority = designationPriority[bDesignation] ?? 99;

    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }

    if (a.role === "CHAIRMAN" && b.role !== "CHAIRMAN") {
      return -1;
    }

    if (a.role !== "CHAIRMAN" && b.role === "CHAIRMAN") {
      return 1;
    }

    return a.name.localeCompare(b.name);
  });
}