
import { prisma } from "../utils/db";
import ConstitutionPublicView from "./ConstitutionPublicView";

export const instant = false;

export default async function ConstitutionPage() {
  const constitutions = await prisma.constitution.findMany({
    where: {
      status: "ACTIVE",
    },
    orderBy: {
      publishedAt: "desc",
    },
  });

  const documents = constitutions.map((document) => ({
    ...document,
    publishedAt: document.publishedAt.toISOString(),
    lastUpdatedAt: document.lastUpdatedAt.toISOString(),
  }));

  return <ConstitutionPublicView documents={documents} />;
}