"use client";

import { useState } from "react";
import {
  CalendarDays,
  Download,
  ExternalLink,
  FileText,
  Languages,
} from "lucide-react";

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
  const [language, setLanguage] = useState<Language>("en");
  const isBangla = language === "bn";

  return (
    <main className="min-h-screen bg-[#faf9f6] text-slate-800">
      <section className="mx-auto max-w-6xl px-4 py-9 sm:px-6 sm:py-12 lg:px-8">
        {/* PAGE HEADER */}
        <div className="border-b border-amber-200 pb-7">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-700">
                <span className="h-px w-8 bg-amber-500" />
                {isBangla ? "গঠনতন্ত্র ও প্রকাশনা" : "CONSTITUTION & PUBLICATIONS"}
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                {isBangla ? "প্রকাশিত নথি" : "Published Documents"}
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
                {isBangla
                  ? "হাওর রক্ষা আন্দোলনের গঠনতন্ত্র ও প্রকাশিত গুরুত্বপূর্ণ দলিলসমূহ পড়ুন এবং সংগ্রহ করুন।"
                  : "Explore and access the constitution and important documents published by Haor Rokkha Andolan."}
              </p>
            </div>

            {/* LANGUAGE SWITCH */}
            <div className="flex flex-wrap items-center gap-3">
              <div
                className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-white p-1"
                role="group"
                aria-label="Select document language"
              >
                <Languages size={14} className="ml-2 mr-1 text-amber-700" />

                <button
                  type="button"
                  onClick={() => setLanguage("bn")}
                  aria-pressed={isBangla}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 ${
                    isBangla
                      ? "bg-amber-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-amber-50 hover:text-amber-800"
                  }`}
                >
                  বাংলা
                </button>

                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  aria-pressed={!isBangla}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 ${
                    !isBangla
                      ? "bg-amber-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-amber-50 hover:text-amber-800"
                  }`}
                >
                  English
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* DOCUMENT OVERVIEW */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 py-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-700">
              {isBangla ? "নথির তালিকা" : "DOCUMENT REGISTER"}
            </p>

            <h2 className="mt-1 text-lg font-bold text-slate-900">
              {isBangla ? "সকল প্রকাশিত দলিল" : "Available publications"}
            </h2>
          </div>

          <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs font-bold text-amber-800">
            <FileText size={14} />
            {documents.length}{" "}
            {isBangla
              ? "টি নথি"
              : documents.length === 1
                ? "document"
                : "documents"}
          </span>
        </div>

        {/* EMPTY STATE */}
        {documents.length === 0 ? (
          <div className="py-20 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-amber-50 text-amber-700">
              <FileText size={25} strokeWidth={1.5} />
            </div>

            <h3 className="mt-5 text-base font-bold text-slate-900">
              {isBangla
                ? "কোনো নথি প্রকাশিত হয়নি"
                : "No documents published"}
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              {isBangla
                ? "নতুন নথি প্রকাশিত হলে এখানে দেখা যাবে।"
                : "Published documents will appear here."}
            </p>
          </div>
        ) : (
          /* EDITORIAL DOCUMENT REGISTER */
          <div className="divide-y divide-slate-200">
            {documents.map((document, index) => {
              const title = isBangla ? document.titleBn : document.titleEn;

              const description = isBangla
                ? document.descriptionBn
                : document.descriptionEn;

              const pdfUrl = isBangla
                ? document.pdfUrlBn
                : document.pdfUrlEn;

              return (
                <article
                  key={document.id}
                  className="group grid gap-5 py-7 transition-colors hover:bg-amber-50/40 sm:grid-cols-[72px_minmax(0,1fr)] sm:gap-7 sm:px-4"
                >
                  {/* DOCUMENT NUMBER */}
                  <div className="flex items-start justify-between sm:block">
                    <span className="text-3xl font-light leading-none tracking-tight text-amber-600/75 transition-colors group-hover:text-amber-700 sm:text-4xl">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="flex size-10 items-center justify-center rounded-full border border-amber-200 bg-white text-amber-700 sm:mt-5">
                      <FileText size={19} strokeWidth={1.6} />
                    </div>
                  </div>

                  {/* DOCUMENT INFORMATION */}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                        <CalendarDays size={13} className="text-amber-600" />
                        {formatDate(document.publishedAt, language)}
                      </span>

                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                        <span className="size-1.5 rounded-full bg-amber-500" />
                        {isBangla ? "প্রকাশিত" : "PUBLISHED"}
                      </span>
                    </div>

                    <h3 className="mt-3 text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-amber-800 sm:text-xl">
                      {title || (isBangla ? "গঠনতন্ত্র" : "Constitution")}
                    </h3>

                    {description && (
                      <p className="mt-2 max-w-3xl whitespace-pre-wrap wrap-break-words text-sm leading-7 text-slate-600">
                        {description}
                      </p>
                    )}

                    {/* DOCUMENT ACTIONS */}
                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      {pdfUrl ? (
                        <>
                          <a
                            href={pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-amber-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all duration-200 hover:bg-amber-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
                          >
                            <ExternalLink size={14} />
                            {isBangla ? "নথি পড়ুন" : "Read document"}
                          </a>

                          <a
                            href={pdfUrl}
                            download
                            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-amber-200 bg-white px-5 py-2.5 text-xs font-bold text-amber-800 transition-all duration-200 hover:border-amber-400 hover:bg-amber-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
                          >
                            <Download size={14} />
                            {isBangla ? "ডাউনলোড" : "Download"}
                          </a>
                        </>
                      ) : (
                        <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-2.5 text-xs font-medium text-slate-500">
                          <FileText size={13} />
                          {isBangla
                            ? "এই ভাষায় PDF পাওয়া যাচ্ছে না"
                            : "PDF is not available in this language"}
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* FOOTER NOTE */}
        {documents.length > 0 && (
          <div className="mt-5 border-t border-amber-200 pt-5">
            <p className="text-xs leading-6 text-slate-500">
              {isBangla
                ? "প্রকাশিত নথিগুলো সংশ্লিষ্ট ভাষায় পড়ুন। অন্য ভাষায় নথি পাওয়া না গেলে ভাষা পরিবর্তন করে উপলব্ধ সংস্করণ যাচাই করুন।"
                : "Select your preferred language to access available document versions. If a document is unavailable in one language, switch languages to check the available version."}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}