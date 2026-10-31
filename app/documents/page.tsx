import Footer from "../Footer";
import { prisma } from "../utils/db";
import DocumentsPublicView from "./DocumentsPublicView";

export const instant = false;

export default async function DocumentsPage() {
  const documents = await prisma.document.findMany({
    where: {
      status: "ACTIVE",
    },
    orderBy: {
      documentDate: "desc",
    },
  });

  const publicDocuments = documents.map((document) => ({
    ...document,
    documentDate: document.documentDate.toISOString(),
    createdAt: document.createdAt.toISOString(),
    updatedAt: document.updatedAt.toISOString(),
  }));

  return (
    <>
      <DocumentsPublicView documents={publicDocuments} />
      <Footer />
    </>
  );
}