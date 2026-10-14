import { Suspense } from "react";
import { connection } from "next/server";
import { prisma } from "@/app/utils/db";
import UsersClient from "./UsersClient";

async function UsersData() {
  await connection();

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      designation: true,
      imageUrl: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <UsersClient
      initialUsers={users.map((user) => ({
        ...user,
        createdAt: user.createdAt.toISOString(),
      }))}
    />
  );
}

function UsersLoading() {
  return (
    <div className="min-h-screen bg-slate-50/70 p-4 sm:p-6">
      <div className="mx-auto w-full max-w-7xl space-y-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-200" />

          <div className="space-y-2">
            <div className="h-6 w-48 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-64 max-w-full animate-pulse rounded bg-slate-100" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-xl border border-slate-200 bg-white"
            />
          ))}
        </div>

        <div className="h-20 animate-pulse rounded-xl border border-slate-200 bg-white" />

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="h-12 animate-pulse border-b border-slate-100 bg-slate-50" />

          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-16 animate-pulse border-b border-slate-100 last:border-0"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function UsersPage() {
  return (
    <Suspense fallback={<UsersLoading />}>
      <UsersData />
    </Suspense>
  );
}