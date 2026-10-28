"use client";

import Link from "next/link";
import { Home, ArrowLeft, Search, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-slate-50 px-4 py-16">
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-sky-100/70 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-blue-100/70 blur-3xl" />

      <div className="relative w-full max-w-xl text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 shadow-sm">
          <FileQuestion size={40} strokeWidth={1.7} />
        </div>

        <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-sky-700">
          Page Not Found
        </p>

        <h1 className="text-7xl font-black tracking-tight text-slate-900 sm:text-9xl">
          404
        </h1>

        <h2 className="mt-5 text-2xl font-bold text-slate-800 sm:text-3xl">
          Oops! This page is missing.
        </h2>

        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-500 sm:text-base">
          The page you are looking for may have been moved, deleted, or the
          address may be incorrect. Let&apos;s get you back to the latest news.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-700 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-sky-700/20 transition hover:bg-sky-800"
          >
            <Home size={17} />
            Go to Homepage
          </Link>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50"
          >
            <ArrowLeft size={17} />
            Go Back
          </button>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-5">
          <p className="text-sm text-slate-500">
            Still looking for something?
          </p>
          <Link
            href="/"
            className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-900"
          >
            <Search size={15} />
            Explore the latest news
          </Link>
        </div>
      </div>
    </main>
  );
}