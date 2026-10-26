import { Suspense } from "react";
import { connection } from "next/server";

import { prisma } from "@/app/utils/db";
import UsersClient from "./UsersClient";

async function UsersContent() {
  await connection();

  const users = await prisma.user.findMany({
    where: {
      role: {
        in: ["ADMIN", "USER"],
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      designation: true,
      imageUrl: true,
      status: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // The Prisma query above filters out all other roles.
  // Convert the date to a serializable string for the client component.
  const initialUsers = users.map((user) => ({
    ...user,
    role: user.role as "ADMIN" | "USER",
    designation: user.designation as string | null,
    status: user.status as "ACTIVE" | "INACTIVE",
    createdAt: user.createdAt.toISOString(),
  }));

  return <UsersClient initialUsers={initialUsers} />;
}

function UsersLoading() {
  return (
    <div className="flex min-h-64 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-600 border-t-transparent" />
    </div>
  );
}

export default function UsersPage() {
  return (
    <Suspense fallback={<UsersLoading />}>
      <UsersContent />
    </Suspense>
  );
}
