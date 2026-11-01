import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { FileText } from "lucide-react";

import Footer from "../Footer";
import Navbar from "../Navbar";
import LanguageSwitcher from "../LanguageSwitcher";
import { prisma } from "../utils/db";
import ConstitutionPublicView from "./ConstitutionPublicView";

export const metadata: Metadata = {
  title: "Constitution | Haor Rokkha Andolan",
  description:
    "Read and download the published constitution of Haor Rokkha Andolan in English and Bangla.",
};

async function ConstitutionDocuments() {
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

function ConstitutionLoading() {
  return (
    <section className="mx-auto min-h-[350px] max-w-6xl px-5 py-7 sm:px-8 sm:py-9">
      <div className="mb-5 flex items-center gap-3">
        <div className="size-9 animate-pulse rounded-lg bg-slate-200" />
        <div className="space-y-2">
          <div className="h-4 w-36 animate-pulse rounded bg-slate-200" />
          <div className="h-3 w-52 animate-pulse rounded bg-slate-100" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="animate-pulse border border-slate-200 bg-white p-5"
          >
            <div className="flex items-start gap-3">
              <div className="size-9 rounded-lg bg-slate-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 rounded bg-slate-200" />
                <div className="h-3 w-1/3 rounded bg-slate-100" />
              </div>
            </div>

            <div className="mt-5 h-3 w-full rounded bg-slate-100" />
            <div className="mt-2 h-3 w-4/5 rounded bg-slate-100" />

            <div className="mt-6 h-9 rounded-lg bg-slate-100" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function ConstitutionPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative isolate h-[260px] w-full overflow-hidden bg-emerald-950 sm:h-[310px] lg:h-[350px]">
        <Image
          src="/h11.jpg"
          alt="Haor and wetland landscape"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        <div className="absolute inset-0 bg-emerald-950/65" />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/75 via-emerald-950/25 to-emerald-950/35" />

        {/* Yellow accent */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[10px] bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300"
          aria-hidden="true"
        />

        {/* Google Translate */}
        <div className="absolute right-4 top-5 z-30 sm:right-8 sm:top-6">
          <LanguageSwitcher />
        </div>

        <div className="relative z-10 flex h-full items-center justify-center px-5 pt-3 text-center">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Constitution
            </h1>
            <div className="mx-auto mt-5 h-1 w-14 bg-gradient-to-r from-yellow-300 to-amber-400" />
          </div>
        </div>
      </section>

      {/* NAVIGATION */}
      <Navbar />

      {/* DATABASE CONTENT */}
      <Suspense fallback={<ConstitutionLoading />}>
        <ConstitutionDocuments />
      </Suspense>

      {/* GLOBAL FOOTER */}
      <Footer />
    </>
  );
}
