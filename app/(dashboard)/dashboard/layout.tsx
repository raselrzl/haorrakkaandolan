import type { ReactNode } from "react";
import Link from "next/link";
import { requireAdmin } from "@/app/utils/auth";
import { logoutAction } from "@/app/(login)/login/loginActions";


export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-emerald-900 bg-emerald-950 text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div>
            <Link href="/dashboard" className="font-bold">
              Haor Rokkha Andolan
            </Link>
            <p className="mt-1 text-xs text-emerald-100">
              Administration · {user.name}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/account"
              className="text-sm text-emerald-100 hover:text-white"
            >
              My account
            </Link>

            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/20"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {children}
      </main>
    </div>
  );
}