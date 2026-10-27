import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/app/utils/auth";
import PublicationManager from "./PublicationManager";

async function PublicationsContent() {
  await connection();

  const admin = await requireAdmin();

  if (admin.status !== "ACTIVE") {
    redirect("/login");
  }

  return <PublicationManager />;
}

function PublicationsLoading() {
  return (
    <div className="flex min-h-64 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-600 border-t-transparent" />
    </div>
  );
}

export default function PublicationsPage() {
  return (
    <Suspense fallback={<PublicationsLoading />}>
      <PublicationsContent />
    </Suspense>
  );
}