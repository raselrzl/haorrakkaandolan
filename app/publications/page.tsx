import Link from "next/link";
import { connection } from "next/server";
import { prisma } from "@/app/utils/db";
import { BookOpen, CalendarDays, FileText, ArrowRight } from "lucide-react";
import LanguageSwitcher from "../LanguageSwitcher";
import Navbar from "../Navbar";

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
    <main className="min-h-screen bg-[#f5f8f5] text-slate-800">
      <Navbar />

      {/* Page header */}
      <header className="mt-16 bg-[#123b2b] text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
            Haor Rokkha Andolan
          </p>

          <h1 className="mt-3 text-3xl font-black sm:text-4xl">
            Research & Publications
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50/90">
            Research, articles and publications related to haors, rivers,
            agriculture, wetlands and environmental protection.
          </p>

          <div className="mt-5 h-1 w-16 bg-emerald-500" />
        </div>
      </header>

      {/* Publications list */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-emerald-100 pb-4">
          <div>
            <h2 className="text-lg font-extrabold text-[#123b2b]">
              Publications & Research
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Explore our articles, studies and supporting documents.
            </p>
          </div>

          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-semibold text-[#176b45]">
            <BookOpen size={15} />
            {publications.length}{" "}
            {publications.length === 1 ? "Publication" : "Publications"}
          </span>
        </div>

        {publications.length === 0 ? (
          <div className="border border-emerald-100 bg-white px-5 py-16 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-emerald-300" />

            <h2 className="mt-4 font-bold text-[#123b2b]">
              No publications available yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Research and publications will appear here when they are
              published.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-emerald-100 border border-emerald-100 bg-white">
            {publications.map((item) => (
              <article
                key={item.id}
                className="group flex flex-col gap-4 p-4 transition-colors hover:bg-emerald-50/40 sm:flex-row sm:gap-5 sm:p-5"
              >
                {/* Optional fixed-size cover image */}
                {item.coverImageUrl && (
                  <Link
                    href={`/publications/${item.id}`}
                    aria-label={`Read ${item.title}`}
                    className="h-28 w-32 shrink-0 self-start overflow-hidden rounded-lg border border-emerald-100 bg-emerald-50 sm:h-32 sm:w-44"
                  >
                    <img
                      src={item.coverImageUrl}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </Link>
                )}

                {/* Publication information */}
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#176b45]">
                      {item.type === "RESEARCH" ? "Research" : "Publication"}
                    </span>

                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                      <CalendarDays size={13} className="text-[#176b45]" />
                      {formatDate(item.publishedAt)}
                    </span>
                  </div>

                  <h3 className="mt-2 text-lg font-extrabold leading-snug text-[#123b2b] transition-colors group-hover:text-[#176b45] sm:text-xl">
                    <Link
                      href={`/publications/${item.id}`}
                      className="focus-visible:outline-none focus-visible:underline"
                    >
                      {item.title}
                    </Link>
                  </h3>

                  {item.subtitle && (
                    <p className="mt-1 text-sm font-medium text-slate-600">
                      {item.subtitle}
                    </p>
                  )}

                  <p className="mt-2 line-clamp-3 whitespace-pre-line text-sm leading-6 text-slate-600">
                    {item.excerpt || item.content}
                  </p>

                  {/* Actions left; author bottom-right */}
                  <div className="mt-4 flex flex-col gap-4 border-t border-emerald-100 pt-3 sm:mt-auto sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/publications/${item.id}`}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#176b45] px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#123b2b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                      >
                        Read Publication
                        <ArrowRight size={14} />
                      </Link>

                      {item.documentUrl && (
                        <a
                          href={item.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 px-4 py-2.5 text-xs font-bold text-[#176b45] transition-colors hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                        >
                          <FileText size={14} />
                          {item.documentName || "Open Document"}
                        </a>
                      )}
                    </div>

                    {/* Author profile: bottom-right */}
                    <div className="flex min-w-0 max-w-full items-center justify-end gap-2.5 self-end text-right sm:ml-auto">
                      {item.authorImageUrl && (
                        <img
                          src={item.authorImageUrl}
                          alt={item.authorName}
                          className="h-10 w-10 shrink-0 rounded-full border border-emerald-200 object-cover"
                        />
                      )}

                      <div className="min-w-0">
                        <p className="max-w-48 truncate text-xs font-bold text-[#123b2b]">
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

      {/* Floating language switcher */}
      <div className="fixed right-4 top-1/2 z-[9999] -translate-y-1/2">
        <LanguageSwitcher />
      </div>
    </main>
  );
}
