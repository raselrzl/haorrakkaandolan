import type { Metadata } from "next";
import Navbar from "../Navbar";
import { prisma } from "@/app/utils/db";
import ConstitutionPublicView from "./ConstitutionPublicView";

export const metadata: Metadata = {
  title: "গঠনতন্ত্র | Haor Rokkha Andolan",
  description:
    "হাওর রক্ষা আন্দোলনের গঠনতন্ত্র, সাংগঠনিক নীতিমালা ও বাংলা-ইংরেজি PDF নথি।",
};


export default async function ConstitutionPage() {
  const constitutions = await prisma.constitution.findMany({
    where: {
      status: "ACTIVE",
    },
    orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
    select: {
      id: true,
      titleBn: true,
      titleEn: true,
      descriptionBn: true,
      descriptionEn: true,
      pdfUrlBn: true,
      pdfUrlEn: true,
      publishedAt: true,
      lastUpdatedAt: true,
    },
  });

  const documents = constitutions.map((item) => ({
    ...item,
    publishedAt: item.publishedAt.toISOString(),
    lastUpdatedAt: item.lastUpdatedAt.toISOString(),
  }));

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Navbar />
      <ConstitutionPublicView documents={documents} />
    </main>
  );
}