
import { Suspense } from "react";
import { connection } from "next/server";
import { prisma } from "@/app/utils/db";
import MembersPageClient from "./MembersPageClient";

async function MembersData() {
  await connection();

  const members = await prisma.user.findMany({
    where: {
      role: "MEMBER",
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      designation: true,
      imageUrl: true,
      biography: true,
      status: true,
      startDate: true,
      endDate: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <MembersPageClient initialMembers={members} />;
}

function MembersLoading() {
  return (
    <div className="space-y-4 p-4 sm:p-6">
      <div className="h-8 w-56 animate-pulse rounded-md bg-slate-200" />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-xl border border-slate-200 bg-slate-100"
          />
        ))}
      </div>

      <div className="h-12 animate-pulse rounded-xl bg-slate-100" />

      <div className="overflow-hidden rounded-xl border border-slate-200">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-14 animate-pulse border-b border-slate-100 last:border-0"
          />
        ))}
      </div>

      <p className="text-center text-sm text-slate-500">
        Loading members…
      </p>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<MembersLoading />}>
      <MembersData />
    </Suspense>
  );
}
