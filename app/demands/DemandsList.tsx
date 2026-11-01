"use client";

import { useState } from "react";
import {
  CalendarDays,
  ClipboardList,
  Languages,
  ListChecks,
} from "lucide-react";

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

export default function DemandsList({ demands }: Props) {
  const [language, setLanguage] = useState<Language>("en");
  const isBangla = language === "bn";

  return (
    <main className="min-h-screen bg-[#f7f9f6] text-slate-800">
      <section
        id="published-demands"
        className="mx-auto max-w-6xl px-3 py-7 sm:px-6 sm:py-8 lg:px-8"
      >
        {/* SECTION HEADER */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-amber-200 pb-4">
          <div className="flex min-w-0 items-center gap-2">
            <ListChecks size={19} className="shrink-0 text-amber-700" />

            <div className="min-w-0">
              <h2 className="text-base font-extrabold text-slate-900 sm:text-lg">
                {isBangla ? "প্রকাশিত দাবিসমূহ" : "Published Demands"}
              </h2>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {/* LANGUAGE TOGGLE */}
            <div
              className="inline-flex items-center gap-0.5 rounded-full border border-slate-200 bg-white p-1 shadow-sm"
              role="group"
              aria-label="Select language"
            >
              <Languages size={14} className="ml-1 mr-1 text-amber-700" />

              <button
                type="button"
                onClick={() => setLanguage("bn")}
                aria-pressed={isBangla}
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                  isBangla
                    ? "bg-amber-500 text-amber-950 shadow-sm"
                    : "text-slate-600 hover:bg-amber-50 hover:text-amber-900"
                }`}
              >
                বাংলা
              </button>

              <button
                type="button"
                onClick={() => setLanguage("en")}
                aria-pressed={!isBangla}
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                  !isBangla
                    ? "bg-amber-500 text-amber-950 shadow-sm"
                    : "text-slate-600 hover:bg-amber-50 hover:text-amber-900"
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>

        {/* EMPTY STATE */}
        {demands.length === 0 ? (
          <div className="rounded-xl border border-slate-100 bg-white px-5 py-14 text-center shadow-md shadow-amber-100/70">
            <ClipboardList className="mx-auto text-amber-300" size={36} />

            <h3 className="mt-3 text-sm font-bold text-slate-900">
              {isBangla ? "কোনো দাবি প্রকাশিত হয়নি" : "No demands published"}
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              {isBangla
                ? "প্রকাশিত দাবিসমূহ এখানে দেখা যাবে।"
                : "Published demands will appear here."}
            </p>
          </div>
        ) : (
          /* DEMAND PUBLICATIONS */
          <div className="space-y-4">
            {demands.map((demand, demandIndex) => {
              const title = isBangla ? demand.titleBn : demand.titleEn;
              const description = isBangla
                ? demand.descriptionBn
                : demand.descriptionEn;

              return (
                <article
                  key={demand.id}
                  className="group min-w-0 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-md shadow-amber-100/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-100"
                >
                  {/* PUBLICATION HEADER */}
                  <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-amber-100 bg-amber-50 text-amber-800">
                        <ClipboardList size={19} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="whitespace-pre-wrap break-words text-sm font-extrabold leading-6 text-slate-900 transition-colors group-hover:text-amber-900 sm:text-base">
                          {title || (isBangla ? "দাবিসমূহ" : "Our Demands")}
                        </h3>

                        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500">
                            <CalendarDays
                              size={12}
                              className="text-amber-700"
                            />
                            {formatDate(demand.publishedAt, language)}
                          </span>

                          <span className="rounded-full border border-amber-100 bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-900">
                            {isBangla ? "প্রকাশিত" : "Published"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-semibold text-slate-600">
                      <ListChecks size={13} className="text-amber-700" />
                      {demand.points.length} {isBangla ? "টি দাবি" : "Points"}
                    </span>
                  </div>

                  {/* PUBLICATION DESCRIPTION */}
                  {description && (
                    <div className="border-b border-slate-100 bg-amber-50/30 px-4 py-3 sm:px-5">
                      <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-600">
                        {description}
                      </p>
                    </div>
                  )}

                  {/* DEMAND POINTS */}
                  {demand.points.length > 0 ? (
                    <div className="space-y-2.5 p-3 sm:p-4">
                      {demand.points.map((point) => {
                        const heading = isBangla
                          ? point.headingBn
                          : point.headingEn;

                        const pointDescription = isBangla
                          ? point.descriptionBn
                          : point.descriptionEn;

                        return (
                          <div
                            key={point.id}
                            className="flex min-w-0 flex-col gap-2 rounded-lg border border-slate-100 bg-white p-3 shadow-sm shadow-amber-100/50 transition-colors hover:border-amber-200 hover:bg-amber-50/30 sm:flex-row sm:items-start sm:gap-4 sm:p-4"
                          >
                            {/* POINT NUMBER */}
                            <div className="flex shrink-0 items-center gap-2 sm:w-10 sm:justify-center">
                              <span className="flex size-8 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-xs font-extrabold tabular-nums text-amber-900">
                                {point.pointNumber}
                              </span>

                              <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:hidden">
                                {isBangla ? "দাবি" : "Demand"}
                              </span>
                            </div>

                            {/* HEADING AND DESCRIPTION */}
                            <div className="grid min-w-0 flex-1 grid-cols-1 gap-2 sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.5fr)] sm:gap-5">
                              <div className="min-w-0">
                                <p className="whitespace-pre-wrap break-words text-[13px] font-bold leading-6 text-slate-800">
                                  {heading}
                                </p>
                              </div>

                              <div className="min-w-0 border-t border-slate-100 pt-2 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
                                <p className="whitespace-pre-wrap break-words text-[13px] leading-6 text-slate-600">
                                  {pointDescription}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="px-4 py-7 text-center text-xs text-slate-500">
                      {isBangla
                        ? "এই প্রকাশনায় কোনো দাবি যোগ করা হয়নি।"
                        : "No demand points have been added to this publication."}
                    </p>
                  )}

                  {/* PUBLICATION FOOTER */}
                  <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/70 px-4 py-3 text-[10px] text-slate-400 sm:px-5">
                    <span className="font-medium">
                      {isBangla ? "হাওর রক্ষা আন্দোলন" : "Haor Rokkha Andolan"}
                    </span>

                    <span className="shrink-0 tabular-nums">
                      {isBangla ? "প্রকাশনা" : "Publication"} {demandIndex + 1}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
