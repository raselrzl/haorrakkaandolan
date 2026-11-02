"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Play,
  Waves,
} from "lucide-react";

export type RiverActivityItem = {
  id: string;
  title: string;
  description: string;
  image?: string | null;
  mediaType?: "IMAGE" | "VIDEO" | null;
  date: string | Date;
  category: string;
  href?: string | null;
};

type RiverSectionProps = {
  activities: RiverActivityItem[];
  fallbackImage?: string;
};

function formatActivityDate(date: string | Date) {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

export default function RiverSection({
  activities,
  fallbackImage = "/monu1.jpg",
}: RiverSectionProps) {
  return (
    <section id="river" className="scroll-mt-20 bg-white py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-center justify-between border-b border-slate-200 pb-3">
        {/*   <div className="flex items-center gap-3">
            <svg
              viewBox="0 0 100 60"
              fill="none"
              className="h-12 w-20 shrink-0 overflow-visible"
              aria-hidden="true"
            >
              <path
                d="M3 18C20 2 34 36 51 19C67 3 79 9 97 22"
                stroke="#38bdf8"
                strokeWidth="7"
                strokeLinecap="round"
                className="animate-river-flow"
              />
              <path
                d="M2 30C19 14 34 47 52 31C69 15 81 22 98 34"
                stroke="#0284c7"
                strokeWidth="5"
                strokeLinecap="round"
                className="animate-river-flow-reverse"
              />
              <path
                d="M5 43C22 28 36 57 54 43C70 30 83 36 96 46"
                stroke="#7dd3fc"
                strokeWidth="3"
                strokeLinecap="round"
                className="animate-river-flow"
              />
              <path
                d="M8 18C24 5 35 36 51 19C67 4 80 10 94 21"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray="5 8"
                className="animate-river-flow-reverse"
              />
            </svg>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                River Activities
              </h2>
            </div>
          </div> */}
        </div>

        {activities.length > 0 ? (
          <>
            {/* Two-column news grid */}
            <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              {activities.slice(0, 4).map((item) => {
                const href = item.href || "/activities";

                return (
                  <article
                    key={item.id}
                    className="group flex min-w-0 gap-3 border-b border-slate-200 pb-4 last:border-b-0 sm:border-b-0 sm:pb-2"
                  >
                    {/* News thumbnail */}
                    <Link
                      href={href}
                      aria-label={`Read ${item.title}`}
                      className="relative h-24 w-28 shrink-0 overflow-hidden rounded-md bg-slate-100 sm:h-28 sm:w-32"
                    >
                      {item.image && item.mediaType === "VIDEO" ? (
                        <span className="relative block h-full w-full">
                          <video
                            src={item.image}
                            preload="metadata"
                            muted
                            playsInline
                            className="h-full w-full object-cover"
                          />

                          <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black">
                              <Play size={14} fill="currentColor" />
                            </span>
                          </span>
                        </span>
                      ) : item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : fallbackImage ? (
                        <img
                          src={fallbackImage}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center bg-slate-100">
                          <Waves size={26} className="text-slate-500" />
                        </span>
                      )}
                    </Link>

                    {/* News details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-slate-500">
                        <span className="font-semibold uppercase tracking-wide text-black">
                          {item.category}
                        </span>

                        {item.mediaType === "VIDEO" && item.image && (
                          <span className="inline-flex items-center gap-1 text-slate-600">
                            <Play size={10} />
                            Video
                          </span>
                        )}

                        <span className="inline-flex items-center gap-1">
                          <CalendarDays size={11} />
                          {formatActivityDate(item.date)}
                        </span>
                      </div>

                      <h3 className="mt-1 text-sm font-bold leading-5 text-black transition-colors group-hover:text-slate-600">
                        <Link href={href}>{item.title}</Link>
                      </h3>

                      <p className="mt-1 line-clamp-2 text-xs leading-[1.15rem] text-slate-600">
                        {item.description}
                      </p>

                      <Link
                        href={href}
                        className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-black transition-colors hover:text-slate-500"
                      >
                        Read more
                        <ChevronRight size={13} />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Waves size={28} className="text-slate-500" />

            <h3 className="mt-3 text-sm font-bold text-black">
              River Activities Coming Soon
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              নদী সংরক্ষণ কার্যক্রম শিগগিরই প্রকাশিত হবে।
            </p>

            <Link
              href="/activities"
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-black transition hover:text-slate-500"
            >
              View All Activities
              <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
