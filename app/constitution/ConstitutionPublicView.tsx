"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Download,
  ExternalLink,
  FileText,
  Languages,
} from "lucide-react";
import Navbar from "../Navbar";

type ConstitutionDocument = {
  id: string;
  titleBn: string;
  titleEn: string;
  descriptionBn: string | null;
  descriptionEn: string | null;
  pdfUrlBn: string | null;
  pdfUrlEn: string | null;
  publishedAt: string;
  lastUpdatedAt: string;
};

type Props = {
  documents: ConstitutionDocument[];
};

type Language = "bn" | "en";

function formatDate(date: string, language: Language) {
  return new Intl.DateTimeFormat(language === "bn" ? "bn-BD" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(new Date(date));
}

export default function ConstitutionPublicView({ documents }: Props) {
  const [language, setLanguage] = useState<Language>("bn");
  const isBangla = language === "bn";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 text-slate-900 mt-16">
        {/* Hero */}
        <section
          className="relative isolate mt-16 overflow-hidden border-b border-emerald-950 bg-emerald-950 bg-cover bg-center"
          style={{ backgroundImage: "url('/h11.jpg')" }}
        >
          {/* Dark overlay for readable text */}
          <div className="absolute inset-0 bg-emerald-950/75" />

          <div className="relative mx-auto flex min-h-72.5 max-w-6xl items-center px-5 py-10 sm:min-h-82.5 sm:px-8">
            <div className="flex w-full flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <Link
                  href="/"
                  className="mb-5 inline-flex items-center gap-1.5 text-xs font-medium text-white/75 transition hover:text-white"
                >
                  <ArrowLeft size={14} />
                  {isBangla ? "হোম" : "Home"}
                </Link>

                <div className="flex items-center gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white backdrop-blur-sm">
                    <FileText size={22} />
                  </div>

                  <div className="min-w-0">
                    <p className="mb-1 text-[10px] font-semibold tracking-[0.14em] text-emerald-200 uppercase">
                      Haor Rokkha Andolan / হাওর রক্ষা আন্দোলন
                    </p>

                    <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                      {isBangla ? "গঠনতন্ত্র" : "Constitution"}
                    </h1>
                  </div>
                </div>
              </div>

              {/* Compact language toggle */}
              <div
                className="inline-flex w-fit shrink-0 items-center gap-0.5 rounded-lg border border-white/20 bg-black/20 p-0.5 backdrop-blur-sm"
                role="group"
                aria-label="Select language"
              >
                <Languages size={14} className="ml-1.5 mr-1 text-white/60" />

                <button
                  type="button"
                  onClick={() => setLanguage("bn")}
                  aria-pressed={isBangla}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                    isBangla
                      ? "bg-white text-emerald-950 shadow-sm"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  বাংলা
                </button>

                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  aria-pressed={!isBangla}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                    !isBangla
                      ? "bg-white text-emerald-950 shadow-sm"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  EN
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Document list */}
        <section className="mx-auto max-w-6xl px-5 py-7 sm:px-8 sm:py-9">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-base font-bold text-slate-800">
              {isBangla ? "প্রকাশিত নথি" : "Published Documents"}
            </h2>

            <span className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-500">
              {documents.length}{" "}
              {isBangla
                ? "টি নথি"
                : documents.length === 1
                  ? "document"
                  : "documents"}
            </span>
          </div>

          {documents.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
              <FileText className="mx-auto text-slate-300" size={32} />

              <h3 className="mt-3 text-sm font-semibold text-slate-800">
                {isBangla
                  ? "কোনো নথি প্রকাশিত হয়নি"
                  : "No documents published"}
              </h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {documents.map((document) => {
                const title = isBangla ? document.titleBn : document.titleEn;
                const description = isBangla
                  ? document.descriptionBn
                  : document.descriptionEn;
                const pdfUrl = isBangla ? document.pdfUrlBn : document.pdfUrlEn;

                return (
                  <article
                    key={document.id}
                    className="flex min-w-0 flex-col rounded-xl border border-slate-200 bg-white p-4 transition hover:border-emerald-200 hover:shadow-md sm:p-5"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800">
                        <FileText size={19} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="whitespace-pre-wrap wrap-break-words text-base font-bold leading-6 text-slate-900">
                          {title || (isBangla ? "গঠনতন্ত্র" : "Constitution")}
                        </h3>

                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-slate-500">
                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays size={13} />
                            {formatDate(document.publishedAt, language)}
                          </span>

                          <span className="rounded bg-emerald-50 px-2 py-0.5 font-medium text-emerald-800">
                            {isBangla ? "প্রকাশিত" : "Published"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {description && (
                      <p className="mt-3 whitespace-pre-wrap wrap-break-words text-sm leading-7 text-slate-600">
                        {description}
                      </p>
                    )}

                    <div className="mt-4 border-t border-slate-100 pt-3">
                      {pdfUrl ? (
                        <div className="flex flex-col gap-2 sm:flex-row">
                          <a
                            href={pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-9 flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-800 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2"
                          >
                            <ExternalLink size={14} />
                            {isBangla ? "নথি পড়ুন" : "Read document"}
                          </a>

                          <a
                            href={pdfUrl}
                            download
                            className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2"
                          >
                            <Download size={14} />
                            {isBangla ? "ডাউনলোড" : "Download"}
                          </a>
                        </div>
                      ) : (
                        <p className="rounded-lg bg-slate-50 px-3 py-2.5 text-xs text-slate-500">
                          {isBangla
                            ? "এই ভাষায় PDF পাওয়া যাচ্ছে না"
                            : "PDF is not available in this language"}
                        </p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          <footer className="mt-8 border-t border-slate-200 pt-4 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} Haor Rokkha Andolan
          </footer>
        </section>
      </main>
    </>
  );
}
