import { Suspense } from "react";
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
    <main className="min-h-screen bg-slate-50 pt-16">
      <div className="h-36 animate-pulse bg-emerald-950" />
      <section className="mx-auto max-w-6xl space-y-4 px-5 py-7 sm:px-8">
        <div className="h-5 w-40 animate-pulse rounded-lg bg-slate-200" />
        <div className="grid gap-4 lg:grid-cols-2">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="h-48 animate-pulse rounded-xl border border-slate-200 bg-white"
            />
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}

export default function DemandsPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<DemandsLoading />}>
        <PublishedDemands />
      </Suspense>
    </>
  );
}
