"use client";

import Link from "next/link";
import { ArrowLeft, CalendarDays, Download, FileText } from "lucide-react";
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
      <Navbar />
      <main className="mt-16 min-h-screen bg-slate-50 text-slate-900">
        {/* Hero */}
        <section
          className="relative isolate mt-16 overflow-hidden border-b border-emerald-950 bg-emerald-950 bg-cover bg-center"
          style={{ backgroundImage: "url('/legal.jpg')" }}
        >
          <div className="absolute inset-0 bg-emerald-950/65" />

          <div className="relative mx-auto flex min-h-72 max-w-6xl items-center px-5 py-10 sm:px-8">
            <div>
              <Link
                href="/"
                className="mb-5 inline-flex items-center gap-1.5 text-xs font-medium text-white/75 transition hover:text-white"
              >
                <ArrowLeft size={14} />
                Home
              </Link>

              <div className="flex items-center gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white backdrop-blur-sm">
                  <FileText size={22} />
                </div>

                <div>
                  <p className="mb-1 text-[10px] font-semibold tracking-[0.14em] text-emerald-200 uppercase">
                    Haor Rokkha Andolan / হাওর রক্ষা আন্দোলন
                  </p>

                  <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    Legal Documents
                  </h1>
                </div>
              </div>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/80">
                Official legal documents, applications, notices and records.
              </p>
            </div>
          </div>
        </section>

        {/* Document Table */}
        <section className="mx-auto max-w-6xl px-4 py-7 sm:px-8 sm:py-9">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-800">
                Published Documents
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Browse and download official documents.
              </p>
            </div>

            <span className="shrink-0 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
              {documents.length} Documents
            </span>
          </div>

          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            {documents.length === 0 ? (
              <div className="px-5 py-14 text-center">
                <FileText className="mx-auto text-slate-300" size={34} />
                <h3 className="mt-3 text-sm font-semibold text-slate-800">
                  No legal documents published
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Published documents will appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-150 border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-100">
                      <th className="w-16 px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wide text-slate-600">
                        SL
                      </th>

                      <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-slate-600">
                        Document Heading
                      </th>

                      <th className="w-40 px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-slate-600">
                        Date
                      </th>

                      <th className="w-32 px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wide text-slate-600">
                        Download
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {documents.map((document, index) => (
                      <tr
                        key={document.id}
                        className="transition-colors hover:bg-emerald-50/40"
                      >
                        <td className="px-4 py-3.5 text-center text-xs font-semibold tabular-nums text-slate-500">
                          {index + 1}
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="flex items-start gap-2.5">
                            <FileText
                              size={17}
                              className="mt-0.5 shrink-0 text-emerald-700"
                            />

                            <span className="whitespace-pre-wrap wrap-break-words text-sm font-semibold leading-6 text-slate-800">
                              {document.heading}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs text-slate-600">
                            <CalendarDays
                              size={14}
                              className="text-slate-400"
                            />
                            {formatDate(document.documentDate)}
                          </span>
                        </td>

                        <td className="px-4 py-3.5 text-center">
                          <a
                            href={document.documentUrl}
                            download={document.documentName || true}
                            className="inline-flex min-h-8 items-center justify-center gap-1.5 rounded-md bg-emerald-800 px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2"
                          >
                            <Download size={13} />
                            Download
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="fixed right-4 top-1/2 z-9999 -translate-y-1/2">
            <LanguageSwitcher />
          </div>
          <footer className="mt-8 border-t border-slate-200 pt-4 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} Haor Rokkha Andolan
          </footer>
        </section>
      </main>
    </>
  );
}
