"use server";

import { prisma } from "../utils/db";

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
      designation: true,
      startDate: true,
      endDate: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  // Show the designated chairperson first, then other leadership,
  // followed by members.
  return people.sort((a, b) => {
    const aIsChairperson =
      a.designation?.trim().toLowerCase() === "chairperson";
    const bIsChairperson =
      b.designation?.trim().toLowerCase() === "chairperson";

    if (aIsChairperson && !bIsChairperson) return -1;
    if (!aIsChairperson && bIsChairperson) return 1;

    if (a.role === "CHAIRMAN" && b.role !== "CHAIRMAN") return -1;
    if (a.role !== "CHAIRMAN" && b.role === "CHAIRMAN") return 1;

    return a.name.localeCompare(b.name);
  });
}
