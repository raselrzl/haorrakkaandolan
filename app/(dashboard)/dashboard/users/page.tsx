
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
    orderBy: { createdAt: "desc" },
  });

  return <UsersClient initialUsers={users} />;
}

function UsersLoading() {
  return (
    <div className="space-y-4 p-5">
      <div className="h-8 w-52 animate-pulse rounded bg-slate-200" />
      <div className="h-24 animate-pulse rounded-xl bg-slate-100" />
      <div className="h-64 animate-pulse rounded-xl bg-slate-100" />
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
