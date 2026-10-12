
import { Suspense } from "react";
import { logoutAction } from "@/app/(login)/login/loginActions";
import { getCurrentUser } from "@/app/utils/auth";
import { redirect } from "next/navigation";

function AccountLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-2xl animate-pulse rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="h-4 w-48 rounded bg-slate-200" />
        <div className="mt-4 h-8 w-40 rounded bg-slate-200" />
        <div className="mt-8 space-y-5">
          <div className="h-12 rounded bg-slate-100" />
          <div className="h-12 rounded bg-slate-100" />
          <div className="h-12 rounded bg-slate-100" />
          <div className="h-12 rounded bg-slate-100" />
        </div>
      </section>
    </main>
  );
}

async function AccountContent() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role === "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <section className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold text-emerald-700">
          HAOR ROKKHA ANDOLAN
        </p>

        <h1 className="mt-2 text-2xl font-bold text-slate-900">
          My account
        </h1>

        <div className="mt-6 divide-y divide-slate-100">
          <div className="py-3">
            <p className="text-xs text-slate-500">Full name</p>
            <p className="mt-1 font-medium text-slate-900">
              {user.name}
            </p>
          </div>

          <div className="py-3">
            <p className="text-xs text-slate-500">Email</p>
            <p className="mt-1 font-medium text-slate-900">
              {user.email || "Not provided"}
            </p>
          </div>

          <div className="py-3">
            <p className="text-xs text-slate-500">Phone</p>
            <p className="mt-1 font-medium text-slate-900">
              {user.phone || "Not provided"}
            </p>
          </div>

          <div className="py-3">
            <p className="text-xs text-slate-500">Role</p>
            <p className="mt-1 font-medium text-slate-900">
              {user.role}
            </p>
          </div>
        </div>

        <form action={logoutAction} className="mt-6">
          <button
            type="submit"
            className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
          >
            Sign out
          </button>
        </form>
      </section>
    </main>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<AccountLoading />}>
      <AccountContent />
    </Suspense>
  );
}
