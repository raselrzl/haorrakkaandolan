import { Suspense } from "react";
import Image from "next/image";
import { Waves } from "lucide-react";
import { prisma } from "../utils/db";
import DemandsList from "./DemandsList";
import Navbar from "../Navbar";
import Footer from "../Footer";

export const instant = false;

async function PublishedDemands() {
  const demands = await prisma.demand.findMany({
    where: {
      status: "ACTIVE",
    },
    orderBy: [
      {
        publishedAt: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
    include: {
      points: {
        orderBy: {
          pointNumber: "asc",
        },
      },
    },
  });

  const documents = demands.map((demand) => ({
    ...demand,
    publishedAt: demand.publishedAt.toISOString(),
    updatedAt: demand.updatedAt.toISOString(),
    createdAt: demand.createdAt.toISOString(),
    points: demand.points.map((point) => ({
      ...point,
      createdAt: point.createdAt.toISOString(),
      updatedAt: point.updatedAt.toISOString(),
    })),
  }));

  return <DemandsList demands={documents} />;
}

function DemandsLoading() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl space-y-4 px-5 py-7 sm:px-8">
        <div className="h-5 w-40 animate-pulse rounded-lg bg-slate-200" />

        <div className="grid gap-4 lg:grid-cols-2">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="h-48 animate-pulse rounded-xl border border-slate-200 bg-white"
            />
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}

export default function DemandsPage() {
  return (
    <>
      {/* HERO — SAME SIZE AS LEGAL DOCUMENTS */}
      <section className="relative isolate h-[260px] w-full overflow-hidden bg-emerald-950 sm:h-[310px] lg:h-[350px]">
        <Image
          src="/monu.jpg"
          alt="Rivers and wetlands of Moulvibazar"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        <div className="absolute inset-0 bg-emerald-950/65" />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/75 via-emerald-950/25 to-emerald-950/35" />

        {/* Yellow top accent */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[10px] bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300"
          aria-hidden="true"
        />

        <div className="relative z-10 flex h-full items-center justify-center px-4 pt-2 text-center">
          <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Our Demands
            </h1>

            <div className="mx-auto mt-5 h-1 w-14 bg-gradient-to-r from-yellow-300 to-amber-400" />
          </div>
        </div>
      </section>

      {/* NAVIGATION — AFTER HERO */}
      <Navbar />

      {/* DEMANDS CONTENT */}
      <Suspense fallback={<DemandsLoading />}>
        <PublishedDemands />
         <Footer />
      </Suspense>
    </>
  );
}