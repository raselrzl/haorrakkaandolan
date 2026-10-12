import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">
          Access denied
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Your account does not have permission to access this page.
        </p>
        <Link
          href="/account"
          className="mt-6 inline-block rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          Go to my account
        </Link>
      </section>
    </main>
  );
}