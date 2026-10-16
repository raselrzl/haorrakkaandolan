import { Suspense } from "react";
import DonationsData from "./DonationsData";

export const metadata = {
  title: "Donations | Haor Rokkha Andolan",
  description:
    "Support Haor Rokkha Andolan and help protect the haor environment, communities, and natural resources.",
};

function DonationsLoading() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-7xl animate-pulse space-y-5">
        <div className="h-56 rounded-xl bg-slate-200" />
        <div className="h-8 w-64 rounded bg-slate-200" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-36 rounded-xl bg-slate-200"
            />
          ))}
        </div>
      </div>
    </main>
  );
}

export default function DonationsPage() {
  return (
    <Suspense fallback={<DonationsLoading />}>
      <DonationsData />
    </Suspense>
  );
}