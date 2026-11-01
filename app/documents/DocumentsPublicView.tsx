"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Download,
  FileText,
  Waves,
} from "lucide-react";
import Navbar from "../Navbar";
import LanguageSwitcher from "../LanguageSwitcher";

type LegalDocument = {
  id: string;
  heading: string;
  documentDate: string;
  documentUrl: string;
  documentName: string | null;
  mediaType: "PDF" | "IMAGE";
  createdAt: string;
  updatedAt: string;
};

type Props = {
  documents: LegalDocument[];
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(new Date(date));
}

export default function DocumentsPublicView({ documents }: Props) {
  return (
    <>
      {/* HERO */}
      <section className="relative isolate h-[260px] w-full overflow-hidden bg-emerald-950 sm:h-[310px] lg:h-[350px]">
        <Image
          src="/legal.jpg"
          alt="Legal documents of Haor Rokkha Andolan"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        <div className="absolute inset-0 bg-emerald-950/65" />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/75 via-emerald-950/25 to-emerald-950/35" />

        {/* Yellow top accent */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[10px] bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300"
          aria-hidden="true"
        />

        <div className="relative z-10 flex h-full items-center justify-center px-4 pt-2 text-center">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Legal Documents
            </h1>
            <div className="mx-auto mt-5 h-1 w-14 bg-gradient-to-r from-yellow-300 to-amber-400" />
          </div>
        </div>
      </section>

      {/* NAVIGATION */}
      <Navbar />

      <main className="min-h-screen bg-[#f7f9f6] text-slate-800">
        <section className="mx-auto max-w-6xl px-3 py-7 sm:px-6 sm:py-9 lg:px-8">
             {/* DOCUMENT LIST */}
          {documents.length === 0 ? (
            <div className="rounded-xl border border-slate-100 bg-white px-5 py-16 text-center shadow-md shadow-amber-100/70">
              <FileText className="mx-auto text-amber-300" size={36} />

              <h3 className="mt-3 text-sm font-bold text-slate-900">
                No legal documents published
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Published documents will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((document, index) => (
                <article
                  key={document.id}
                  className="group flex min-w-0 flex-col gap-3 rounded-xl border border-slate-100 bg-white p-3 shadow-md shadow-amber-100/60 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-100 sm:flex-row sm:items-center sm:gap-4 sm:px-4 sm:py-3.5"
                >
                  {/* SERIAL NUMBER */}
         {/*          <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-100 bg-slate-50 text-xs font-bold tabular-nums text-slate-500 sm:flex">
                    {String(index + 1).padStart(2, "0")}
                  </div> */}

                  {/* DOCUMENT ICON */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-amber-100 bg-amber-50 text-amber-800">
                    <FileText size={19} />
                  </div>

                  {/* DOCUMENT DETAILS */}
                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-start gap-2">
                      <span className="mt-0.5 shrink-0 text-[11px] font-bold tabular-nums text-slate-400 sm:hidden">
                        {String(index + 1).padStart(2, "0")}.
                      </span>

                      <h3 className="min-w-0 whitespace-pre-wrap break-words text-sm font-bold leading-6 text-slate-800 transition-colors group-hover:text-amber-900">
                        {document.heading}
                      </h3>
                    </div>

                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500">
                        <CalendarDays size={12} className="text-amber-700" />
                        {formatDate(document.documentDate)}
                      </span>
{/* 
                      <span className="inline-flex items-center rounded-full border border-slate-100 bg-slate-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-slate-500">
                        {document.mediaType}
                      </span> */}
                    </div>
                  </div>

                  {/* DOWNLOAD ACTION */}
                  <div className="flex shrink-0 items-center justify-end border-t border-slate-100 pt-3 sm:border-0 sm:pt-0">
                    <a
                      href={document.documentUrl}
                      download={document.documentName || true}
                      className="inline-flex min-h-9 items-center justify-center gap-2 rounded-full bg-amber-500 px-4 py-2 text-[11px] font-bold text-amber-950 shadow-sm transition-all hover:bg-amber-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 sm:min-w-28"
                    >
                      <Download size={14} />
                      Download
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* LANGUAGE SWITCHER */}
      <div className="fixed right-4 top-1/2 z-[9999] -translate-y-1/2">
        <LanguageSwitcher />
      </div>
    </>
  );
}
