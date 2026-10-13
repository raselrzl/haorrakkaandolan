import { Suspense } from "react";
import Link from "next/link";
import {
  prisma
} from "@/app/utils/db";
import {
  Users,
  UserCheck,
  ShieldCheck,
  UserRound,
  Newspaper,
  Waves,
  Image as ImageIcon,
  Video,
  Clock3,
  ArrowUpRight,
  Activity,
  MapPin,
} from "lucide-react";

function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse">
        <div className="h-7 w-56 rounded bg-slate-200" />
        <div className="mt-2 h-4 w-72 max-w-full rounded bg-slate-100" />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="rounded-lg border border-slate-200 bg-white p-4"
          >
            <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
            <div className="mt-4 h-8 w-16 animate-pulse rounded bg-slate-200" />
            <div className="mt-3 h-3 w-28 animate-pulse rounded bg-slate-100" />
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {[0, 1].map((item) => (
          <div
            key={item}
            className="h-64 animate-pulse rounded-lg border border-slate-200 bg-white"
          />
        ))}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  description,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number;
  description: string;
  icon: React.ElementType;
  accent: string;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-200 hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-500 sm:text-sm">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {value.toLocaleString()}
          </p>
        </div>

        <div className={`rounded-lg p-2.5 ${accent}`}>
          <Icon size={19} />
        </div>
      </div>

      <p className="mt-3 text-[11px] text-slate-500 sm:text-xs">
        {description}
      </p>
    </section>
  );
}

function DistributionRow({
  label,
  value,
  total,
}: {
  label: string;
  value: number;
  total: number;
}) {
  const percentage = total > 0 ? (value / total) * 100 : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="font-bold tabular-nums text-slate-900">
          {value.toLocaleString()}
          <span className="ml-2 text-xs font-medium text-slate-400">
            {percentage.toFixed(1)}%
          </span>
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-emerald-700 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

async function DashboardContent() {
  const [
    totalUsers,
    activeUsers,
    inactiveUsers,
    admins,
    members,
    chairmen,
    regularUsers,
    totalNews,
    totalActivities,
    riverNews,
    haorNews,
    imageNews,
    videoNews,
    recentNews,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { status: "ACTIVE" } }),
    prisma.user.count({ where: { status: "INACTIVE" } }),
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.user.count({ where: { role: "MEMBER" } }),
    prisma.user.count({ where: { role: "CHAIRMAN" } }),
    prisma.user.count({ where: { role: "USER" } }),
    prisma.news.count(),
    prisma.news.count({ where: { type: "ACTIVITY" } }),
    prisma.news.count({ where: { riverOrHaor: "RIVER" } }),
    prisma.news.count({ where: { riverOrHaor: "HAOR" } }),
    prisma.news.count({ where: { mediaType: "IMAGE" } }),
    prisma.news.count({ where: { mediaType: "VIDEO" } }),
    prisma.news.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        heading: true,
        type: true,
        riverOrHaor: true,
        mediaType: true,
        createdAt: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    }),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    }),
  ]);

  const newsOnly = await prisma.news.count({
    where: { type: "NEWS" },
  });

  const stats = [
    {
      label: "Total accounts",
      value: totalUsers,
      description: "All registered accounts",
      icon: Users,
      accent: "bg-sky-50 text-sky-700",
    },
    {
      label: "Active accounts",
      value: activeUsers,
      description: "Currently marked active",
      icon: UserCheck,
      accent: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Administrators",
      value: admins,
      description: "Admin role accounts",
      icon: ShieldCheck,
      accent: "bg-violet-50 text-violet-700",
    },
    {
      label: "Members",
      value: members,
      description: "Registered members",
      icon: UserRound,
      accent: "bg-amber-50 text-amber-700",
    },
    {
      label: "Total news",
      value: newsOnly,
      description: "News entries",
      icon: Newspaper,
      accent: "bg-indigo-50 text-indigo-700",
    },
    {
      label: "Activities",
      value: totalActivities,
      description: "Recorded activities",
      icon: Activity,
      accent: "bg-teal-50 text-teal-700",
    },
    {
      label: "River coverage",
      value: riverNews,
      description: "River-related stories",
      icon: Waves,
      accent: "bg-cyan-50 text-cyan-700",
    },
    {
      label: "Haor coverage",
      value: haorNews,
      description: "Haor-related stories",
      icon: MapPin,
      accent: "bg-green-50 text-green-700",
    },
  ];

  const roleDistribution = [
    { label: "Administrators", value: admins },
    { label: "Chairmen", value: chairmen },
    { label: "Members", value: members },
    { label: "Users", value: regularUsers },
  ];

  return (
    <main className="min-h-screen space-y-5 bg-slate-50/70 p-3 sm:p-5 lg:p-6">
      {/* Header */}
      <header className="overflow-hidden rounded-lg bg-gradient-to-r from-emerald-950 via-emerald-900 to-green-900 text-white shadow-sm">
        <div className="flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300">
              Haor Rokkha Andolan
            </p>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-xs text-emerald-100/80 sm:text-sm">
              Accounts, news, activities and environmental coverage.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/activities"
              className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
            >
              View website
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      {/* Main statistics */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800 sm:text-base">
            Overview
          </h2>
          <span className="text-[10px] font-medium text-slate-400">
            Live database counts
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      {/* Account and media summary */}
      <section className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 sm:text-base">
                Account distribution
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Breakdown by account role
              </p>
            </div>
            <Users size={19} className="text-emerald-800" />
          </div>

          <div className="space-y-5">
            {roleDistribution.map((role) => (
              <DistributionRow
                key={role.label}
                label={role.label}
                value={role.value}
                total={totalUsers}
              />
            ))}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
            <div className="rounded-md bg-emerald-50 p-3">
              <p className="text-xs font-medium text-emerald-800">
                Active accounts
              </p>
              <p className="mt-1 text-xl font-bold text-emerald-950">
                {activeUsers.toLocaleString()}
              </p>
            </div>

            <div className="rounded-md bg-slate-100 p-3">
              <p className="text-xs font-medium text-slate-600">
                Inactive accounts
              </p>
              <p className="mt-1 text-xl font-bold text-slate-900">
                {inactiveUsers.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 sm:text-base">
                News &amp; media
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Content records in the database
              </p>
            </div>
            <Newspaper size={19} className="text-emerald-800" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-slate-100 p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <Newspaper size={16} />
                <span className="text-xs font-medium">News</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {newsOnly.toLocaleString()}
              </p>
            </div>

            <div className="rounded-lg border border-slate-100 p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <Activity size={16} />
                <span className="text-xs font-medium">Activities</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {totalActivities.toLocaleString()}
              </p>
            </div>

            <div className="rounded-lg border border-slate-100 p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <ImageIcon size={16} />
                <span className="text-xs font-medium">Images</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {imageNews.toLocaleString()}
              </p>
            </div>

            <div className="rounded-lg border border-slate-100 p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <Video size={16} />
                <span className="text-xs font-medium">Videos</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {videoNews.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-md bg-emerald-50 p-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-emerald-950">
                  Total published records
                </p>
                <p className="mt-1 text-[11px] text-emerald-800/80">
                  All news and activity entries
                </p>
              </div>
              <p className="text-2xl font-bold text-emerald-900">
                {(newsOnly + totalActivities).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent news and users */}
      <section className="grid gap-4 xl:grid-cols-2">
        <div className="min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 sm:text-base">
                Recent news &amp; activities
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Latest content added
              </p>
            </div>
            <Clock3 size={18} className="text-emerald-800" />
          </div>

          {recentNews.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {recentNews.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 px-4 py-3 transition hover:bg-slate-50"
                >
                  <div className="mt-0.5 rounded-md bg-emerald-50 p-2 text-emerald-800">
                    {item.type === "ACTIVITY" ? (
                      <Activity size={16} />
                    ) : (
                      <Newspaper size={16} />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-semibold text-slate-800">
                      {item.heading}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[10px] text-slate-500">
                      <span className="font-semibold text-emerald-800">
                        {item.type === "ACTIVITY" ? "Activity" : "News"}
                      </span>
                      <span>•</span>
                      <span>
                        {item.riverOrHaor === "HAOR" ? "Haor" : "River"}
                      </span>
                      <span>•</span>
                      <span>{formatDate(item.createdAt)}</span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-400">
                      By {item.user.name}
                    </p>
                  </div>

                  {item.mediaType && (
                    <span className="shrink-0 rounded bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600">
                      {item.mediaType}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="px-4 py-12 text-center">
              <Newspaper
                size={28}
                className="mx-auto mb-2 text-slate-300"
              />
              <p className="text-sm font-semibold text-slate-700">
                No content yet
              </p>
              <p className="mt-1 text-xs text-slate-500">
                News and activities will appear here.
              </p>
            </div>
          )}
        </div>

        <div className="min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 sm:text-base">
                Recently registered accounts
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Latest user registrations
              </p>
            </div>
            <Users size={18} className="text-emerald-800" />
          </div>

          {recentUsers.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 px-4 py-3 transition hover:bg-slate-50"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-900">
                    {user.name.trim().charAt(0).toUpperCase() || "U"}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {user.email}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-400">
                      Joined {formatDate(user.createdAt)}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <span className="rounded bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-700">
                      {user.role.replaceAll("_", " ")}
                    </span>
                    <span
                      className={`rounded px-2 py-1 text-[10px] font-semibold ${
                        user.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-800"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {user.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-4 py-12 text-center">
              <Users size={28} className="mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-semibold text-slate-700">
                No accounts yet
              </p>
              <p className="mt-1 text-xs text-slate-500">
                New registrations will appear here.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Database coverage footer */}
      <footer className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span className="h-2 w-2 rounded-full bg-emerald-600" />
          Dashboard connected to the database
        </div>
        <p className="text-[10px] text-slate-400">
          Haor Rokkha Andolan · Administration
        </p>
      </footer>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  );
}