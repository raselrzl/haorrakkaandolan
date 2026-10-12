
import { Suspense, type ReactNode } from "react";
import Link from "next/link";
import { requireAdmin } from "@/app/utils/auth";
import { logoutAction } from "@/app/(login)/login/loginActions";
import DashboardSidebar from "./DashboardSidebar";

// Skip instant-navigation validation for this segment.
export const instant = false;

function DashboardLoading() {
  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl animate-pulse space-y-5">
        <div className="h-16 rounded-xl bg-white" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-28 rounded-xl bg-white" />
          ))}
        </div>
        <div className="h-64 rounded-xl bg-white" />
      </div>
    </div>
  );
}

async function DashboardContent({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="sticky top-0 z-40 border-b border-emerald-900 bg-emerald-950 text-white shadow-sm">
        <div className="flex min-h-16 items-center justify-between gap-3 px-4 sm:px-6">
          <div className="min-w-0">
            <Link
              href="/dashboard"
              className="block truncate text-base font-bold tracking-tight sm:text-lg"
            >
              Haor Rokkha Andolan
            </Link>
            <p className="mt-0.5 truncate text-xs text-emerald-200">
              Administration Portal
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="hidden text-right sm:block">
              <p className="max-w-48 truncate text-sm font-semibold">
                {user.name}
              </p>
              <p className="text-xs text-emerald-200">
                Administrator
              </p>
            </div>

            <Link
              href="/account"
              className="rounded-lg border border-white/15 px-3 py-2 text-sm font-medium text-emerald-50 transition hover:bg-white/10"
            >
              My account
            </Link>

            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-950"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px] items-start">
        <DashboardSidebar />

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent>{children}</DashboardContent>
    </Suspense>
  );
}
