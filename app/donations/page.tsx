
import { Suspense } from "react";
import DonationsData from "./DonationsData";

export const metadata = {
  title: "Donate | Haor Rokkha Andolan",
  description:
    "Support Haor Rokkha Andolan in protecting the haors, wetlands, rivers, and natural environment of Bangladesh.",
};

function DonationsLoading() {
  return (
    <main className="min-h-screen bg-white px-4 py-12 sm:px-8">
      <div className="mx-auto max-w-5xl animate-pulse">
        <div className="h-8 w-64 rounded bg-slate-200" />
        <div className="mt-4 h-4 max-w-md rounded bg-slate-100" />

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="rounded-xl border border-slate-200 p-5"
            >
              <div className="h-5 w-40 rounded bg-slate-200" />
              <div className="mt-6 h-4 w-28 rounded bg-slate-100" />
              <div className="mt-3 h-12 rounded-lg bg-slate-100" />
              <div className="mt-5 h-4 w-28 rounded bg-slate-100" />
              <div className="mt-3 h-12 rounded-lg bg-slate-100" />
            </div>
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
