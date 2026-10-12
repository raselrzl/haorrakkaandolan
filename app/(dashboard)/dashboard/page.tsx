
import { Suspense } from "react";
import { prisma } from "@/app/utils/db";

function DashboardLoading() {
  return (
    <div>
      <div className="mb-6 animate-pulse">
        <div className="h-7 w-56 rounded bg-slate-200" />
        <div className="mt-2 h-4 w-72 max-w-full rounded bg-slate-100" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {["total", "active", "admins", "members"].map((item) => (
          <section
            key={item}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="h-4 w-32 animate-pulse rounded bg-slate-100" />
            <div className="mt-3 h-9 w-20 animate-pulse rounded bg-slate-200" />
          </section>
        ))}
      </div>
    </div>
  );
}

async function DashboardContent() {
  const [totalUsers, activeUsers, admins, members] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { status: "ACTIVE" } }),
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.user.count({ where: { role: "MEMBER" } }),
  ]);

  const stats = [
    { label: "Total accounts", value: totalUsers },
    { label: "Active accounts", value: activeUsers },
    { label: "Administrators", value: admins },
    { label: "Members", value: members },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Admin dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Account overview and management summary.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <section
            key={stat.label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-500">
              {stat.label}
            </p>
            <p className="mt-2 text-3xl font-bold text-emerald-800">
              {stat.value.toLocaleString()}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  );
}
