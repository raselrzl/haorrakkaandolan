"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  Languages,
  ListChecks,
} from "lucide-react";
import Navbar from "../Navbar";

type DemandPoint = {
  id: string;
  demandId: string;
  pointNumber: number;
  headingBn: string;
  headingEn: string;
  descriptionBn: string;
  descriptionEn: string;
  createdAt: string;
  updatedAt: string;
};

type DemandDocument = {
  id: string;
  titleBn: string;
  titleEn: string;
  descriptionBn: string | null;
  descriptionEn: string | null;
  publishedAt: string;
  updatedAt: string;
  createdAt: string;
  points: DemandPoint[];
};

type Props = {
  demands: DemandDocument[];
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

export default function DemandsPublicView({ demands }: Props) {
  const [language, setLanguage] = useState<Language>("bn");
  const isBangla = language === "bn";

  return (
    <>
      <Navbar />

      <main className="mt-16 min-h-screen bg-slate-50 text-slate-900">
        {/* Hero */}
        <section
          className="relative overflow-hidden border-b border-emerald-950 bg-emerald-950 bg-cover bg-center"
          style={{ backgroundImage: "url('/monu1.jpg')" }}
        >
          <div className="absolute inset-0 bg-emerald-950/75" />

          <div className="relative mx-auto max-w-6xl px-5 py-7 sm:px-8 sm:py-9">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <Link
                  href="/"
                  className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-white/75 transition hover:text-white"
                >
                  <ArrowLeft size={14} />
                  {isBangla ? "হোম" : "Home"}
                </Link>

                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white backdrop-blur-sm">
                    <ClipboardList size={21} />
                  </div>

                  <div className="min-w-0">
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-200">
                      Haor Rokkha Andolan / হাওর রক্ষা আন্দোলন
                    </p>

                    <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                      {isBangla ? "আমাদের দাবিসমূহ" : "Our Demands"}
                    </h1>
                  </div>
                </div>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75">
                  {isBangla
                    ? "হাওর, জলাভূমি, জীববৈচিত্র্য ও স্থানীয় মানুষের অধিকার রক্ষায় আমাদের প্রকাশিত দাবিসমূহ।"
                    : "Our published demands to protect the haors, wetlands, biodiversity, and the rights of local communities."}
                </p>
              </div>

              {/* Language toggle */}
              <div
                className="inline-flex w-fit shrink-0 items-center gap-0.5 self-start rounded-lg border border-white/20 bg-black/20 p-0.5 backdrop-blur-sm sm:self-center"
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

        {/* Tabular demand list */}
        <section
          id="published-demands"
          className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-8"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <ListChecks size={18} className="shrink-0 text-emerald-800" />

              <h2 className="text-base font-bold text-slate-800">
                {isBangla ? "প্রকাশিত দাবিসমূহ" : "Published Demands"}
              </h2>
            </div>

            <span className="shrink-0 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-500">
              {demands.length}{" "}
              {isBangla
                ? "টি প্রকাশনা"
                : demands.length === 1
                  ? "document"
                  : "documents"}
            </span>
          </div>

          {demands.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
              <ClipboardList className="mx-auto text-slate-300" size={32} />

              <h3 className="mt-3 text-sm font-semibold text-slate-800">
                {isBangla ? "কোনো দাবি প্রকাশিত হয়নি" : "No demands published"}
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                {isBangla
                  ? "প্রকাশিত দাবিসমূহ এখানে দেখা যাবে।"
                  : "Published demands will appear here."}
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {demands.map((demand, demandIndex) => {
                const title = isBangla ? demand.titleBn : demand.titleEn;
                const description = isBangla
                  ? demand.descriptionBn
                  : demand.descriptionEn;

                return (
                  <article
                    key={demand.id}
                    className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                  >
                    {/* Table title and metadata */}
                    <div className="flex flex-col gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800">
                          <ClipboardList size={19} />
                        </div>

                        <div className="min-w-0">
                          <h3 className="whitespace-pre-wrap wrap-break-words text-sm font-bold leading-6 text-slate-900 sm:text-base">
                            {title || (isBangla ? "দাবিসমূহ" : "Our Demands")}
                          </h3>

                          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                            <span className="inline-flex items-center gap-1.5">
                              <CalendarDays size={12} />
                              {formatDate(demand.publishedAt, language)}
                            </span>

                            <span className="rounded bg-emerald-50 px-2 py-0.5 font-medium text-emerald-800">
                              {isBangla ? "প্রকাশিত" : "Published"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                        <ListChecks size={13} />
                        {demand.points.length} {isBangla ? "টি দাবি" : "points"}
                      </span>
                    </div>

                    {description && (
                      <div className="border-b border-slate-200 px-4 py-3 sm:px-5">
                        <p className="whitespace-pre-wrap wrap-break-words text-sm leading-6 text-slate-600">
                          {description}
                        </p>
                      </div>
                    )}

                    {demand.points.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-135 border-collapse text-left text-sm">
                          <thead>
                            <tr className="bg-emerald-900 text-white">
                              <th className="w-16 border-r border-white/10 px-3 py-2.5 text-center text-[11px] font-semibold">
                                {isBangla ? "ক্রম" : "No."}
                              </th>

                              <th className="w-[32%] border-r border-white/10 px-4 py-2.5 text-[11px] font-semibold">
                                {isBangla ? "দাবির শিরোনাম" : "Demand"}
                              </th>

                              <th className="px-4 py-2.5 text-[11px] font-semibold">
                                {isBangla ? "বিস্তারিত" : "Description"}
                              </th>
                            </tr>
                          </thead>

                          <tbody className="divide-y divide-slate-100">
                            {demand.points.map((point, pointIndex) => {
                              const heading = isBangla
                                ? point.headingBn
                                : point.headingEn;

                              const pointDescription = isBangla
                                ? point.descriptionBn
                                : point.descriptionEn;

                              return (
                                <tr
                                  key={point.id}
                                  className={`align-top transition hover:bg-emerald-50/60 ${
                                    pointIndex % 2 === 0
                                      ? "bg-white"
                                      : "bg-slate-50/70"
                                  }`}
                                >
                                  <td className="border-r border-slate-100 px-3 py-3 text-center">
                                    <span className="inline-flex size-7 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-800">
                                      {point.pointNumber}
                                    </span>
                                  </td>

                                  <td className="border-r border-slate-100 px-4 py-3">
                                    <p className="whitespace-pre-wrap wrap-break-words text-[13px] font-semibold leading-6 text-slate-800">
                                      {heading}
                                    </p>
                                  </td>

                                  <td className="px-4 py-3">
                                    <p className="whitespace-pre-wrap wrap-break-words text-[13px] leading-6 text-slate-600">
                                      {pointDescription}
                                    </p>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="px-4 py-6 text-center text-xs text-slate-500">
                        {isBangla
                          ? "এই প্রকাশনায় কোনো দাবি যোগ করা হয়নি।"
                          : "No demand points have been added to this publication."}
                      </p>
                    )}

                    <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-4 py-2 text-[10px] text-slate-400 sm:px-5">
                      <span>
                        {isBangla
                          ? "হাওর রক্ষা আন্দোলন"
                          : "Haor Rokkha Andolan"}
                      </span>
                      <span>
                        {isBangla ? "প্রকাশনা" : "Publication"}{" "}
                        {demandIndex + 1}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          <footer className="mt-7 border-t border-slate-200 pt-4 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} Haor Rokkha Andolan
          </footer>
        </section>
      </main>
    </>
  );
}
