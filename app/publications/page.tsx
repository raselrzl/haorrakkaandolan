import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { prisma } from "@/app/utils/db";
import { BookOpen, CalendarDays, FileText, ArrowRight } from "lucide-react";
import LanguageSwitcher from "../LanguageSwitcher";
import Navbar from "../Navbar";
import Footer from "../Footer";

export const instant = false;

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(value);
}

export default async function PublicationsPage() {
  await connection();

  const now = new Date();

  const publications = await prisma.publication.findMany({
    where: {
      status: "ACTIVE",
      publishedAt: {
        lte: now,
      },
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });

  return (
    <main className="min-h-screen bg-[#f7f9f6] text-slate-800">
      {/* RESEARCH & PUBLICATIONS HERO */}
      <section className="relative isolate h-[260px] w-full overflow-hidden bg-emerald-950 sm:h-[310px] lg:h-[350px]">
        <Image
          src="/monu.jpg"
          alt="Rivers and wetlands of Moulvibazar"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Dark overlays */}
        <div className="absolute inset-0 bg-emerald-950/65" />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/75 via-emerald-950/25 to-emerald-950/35" />

        {/* Top yellow accent */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[10px] bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300"
          aria-hidden="true"
        />

        {/* Hero content */}
        <div className="relative z-10 flex h-full items-center justify-center px-4 pt-2 text-center">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Research & Publications
            </h1>

            <div className="mx-auto mt-5 h-1 w-14 bg-gradient-to-r from-yellow-300 to-amber-400" />
          </div>
        </div>
      </section>

      {/* NAVIGATION */}
      <Navbar />

      {/* PUBLICATIONS LIST */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* EMPTY STATE */}
        {publications.length === 0 ? (
          <div className="rounded-xl border border-slate-100 bg-white px-5 py-16 text-center shadow-md shadow-amber-100/70">
            <BookOpen className="mx-auto h-10 w-10 text-amber-300" />

            <h2 className="mt-4 font-bold text-slate-900">
              No publications available yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Research and publications will appear here when they are
              published.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {publications.map((item) => (
              <article
                key={item.id}
                className="group flex min-w-0 flex-col gap-4 overflow-hidden rounded-xl border border-slate-100 bg-white p-4 shadow-md shadow-amber-100/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-100 hover:shadow-xl hover:shadow-amber-100 sm:flex-row sm:gap-5 sm:p-5"
              >
                {/* COVER IMAGE */}
                {item.coverImageUrl && (
                  <Link
                    href={`/publications/${item.id}`}
                    aria-label={`Read ${item.title}`}
                    className="relative h-44 w-full shrink-0 self-start overflow-hidden rounded-lg border border-slate-100 bg-slate-100 sm:h-36 sm:w-44"
                  >
                    <img
                      src={item.coverImageUrl}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>
                )}

                {/* PUBLICATION INFORMATION */}
                <div className="flex min-w-0 flex-1 flex-col">
                  {/* CATEGORY AND DATE */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-900">
                      {item.type === "RESEARCH" ? "Research" : "Publication"}
                    </span>

                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                      <CalendarDays size={13} className="text-amber-700" />
                      {formatDate(item.publishedAt)}
                    </span>
                  </div>

                  {/* TITLE */}
                  <h3 className="mt-2 text-lg font-extrabold leading-snug text-slate-900 transition-colors group-hover:text-amber-900 sm:text-xl">
                    <Link
                      href={`/publications/${item.id}`}
                      className="focus-visible:outline-none focus-visible:underline"
                    >
                      {item.title}
                    </Link>
                  </h3>

                  {/* SUBTITLE */}
                  {item.subtitle && (
                    <p className="mt-1 text-sm font-medium text-slate-600">
                      {item.subtitle}
                    </p>
                  )}

                  {/* EXCERPT */}
                  <p className="mt-2 line-clamp-3 whitespace-pre-line text-sm leading-6 text-slate-600">
                    {item.excerpt || item.content}
                  </p>

                  {/* ACTIONS AND AUTHOR */}
                  <div className="mt-4 flex flex-col gap-4 border-t border-slate-100 pt-3 sm:mt-auto sm:flex-row sm:items-end sm:justify-between">
                    {/* ACTION BUTTONS */}
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/publications/${item.id}`}
                        className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-5 py-2.5 text-xs font-bold text-amber-950 transition-colors hover:bg-amber-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                      >
                        Read Details
                        <ArrowRight size={14} />
                      </Link>

                      {item.documentUrl && (
                        <a
                          href={item.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition-colors hover:border-amber-400 hover:bg-amber-50 hover:text-amber-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                        >
                          <FileText size={14} />
                          {item.documentName || "Open Document"}
                        </a>
                      )}
                    </div>

                    {/* AUTHOR PROFILE */}
                    <div className="flex min-w-0 max-w-full items-center justify-end gap-2.5 self-end text-right sm:ml-auto">
                      {item.authorImageUrl && (
                        <img
                          src={item.authorImageUrl}
                          alt={item.authorName}
                          className="h-10 w-10 shrink-0 rounded-full border border-amber-200 object-cover"
                        />
                      )}

                      <div className="min-w-0">
                        <p className="max-w-48 truncate text-xs font-bold text-slate-900">
                          {item.authorName}
                        </p>

                        <p className="max-w-48 truncate text-[11px] text-slate-500">
                          {item.authorDesignation || "Author"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      <Footer />
      {/* FLOATING LANGUAGE SWITCHER */}
      <div className="fixed right-4 top-1/2 z-[9999] -translate-y-1/2">
        <LanguageSwitcher />
      </div>
    </main>
  );
}
