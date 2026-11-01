import Link from "next/link";
import {
  CalendarDays,
  ChevronRight,
  Leaf,
  Play,
  ArrowUpRight,
} from "lucide-react";

export type HaorActivityItem = {
  id: string;
  title: string;
  description: string;
  image?: string | null;
  mediaType?: "IMAGE" | "VIDEO" | null;
  date: string | Date;
  category: string;
  href?: string | null;
};

type HaorActivitiesProps = {
  activities: HaorActivityItem[];
  fallbackImage?: string;
};

function formatActivityDate(date: string | Date) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

export default function HaorActivities({
  activities,
  fallbackImage,
}: HaorActivitiesProps) {
  return (
    <section
      id="haor-activities"
      className="relative scroll-mt-20 overflow-hidden bg-white py-12 sm:py-16"
    >
      {/* SUBTLE AMBER DECORATION */}
      <div className="pointer-events-none absolute -right-24 -top-20 h-64 w-64 rounded-full bg-amber-100/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-amber-50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* SECTION HEADER */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            {/* Haor water illustration */}
            <svg
              viewBox="0 0 64 52"
              fill="none"
              className="h-12 w-14 shrink-0"
              aria-hidden="true"
            >
              {/* Distant wetland hills */}
              <path
                d="M3 23C12 17 19 19 27 22C37 15 48 17 61 23"
                stroke="#a1a1aa"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Water */}
              <path
                d="M4 30C13 25 19 35 29 30C39 25 47 35 60 29"
                stroke="#0ea5e9"
                strokeWidth="3"
                strokeLinecap="round"
                className="animate-river-flow"
              />
              <path
                d="M3 39C14 34 21 44 32 39C43 34 51 44 61 38"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="animate-river-flow-reverse"
              />

              {/* Wetland reeds */}
              <path
                d="M12 27V9M12 16L7 12M12 20L17 15M49 27V7M49 15L44 11M49 19L54 13"
                stroke="#a16207"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M12 10C8 7 7 5 8 3C12 4 14 6 12 10ZM49 8C46 5 46 3 48 2C51 4 52 6 49 8Z"
                fill="#d97706"
              />
            </svg>

            <div className="min-w-0">
              <h2 className="break-words text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Haor Activities
              </h2>
            </div>
          </div>
          {/* 
          <Link
            href="/activities"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800 shadow-sm shadow-amber-100/70 transition-all duration-200 hover:border-amber-200 hover:bg-amber-50 hover:text-amber-900"
          >
            Explore All
            <ArrowUpRight
              size={14}
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link> */}
        </div>

        {/* ACTIVITY CARDS */}
        {activities.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {activities.map((item) => (
              <article
                key={item.id}
                className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-slate-100 bg-white shadow-md shadow-amber-100/70 transition-all duration-300 hover:-translate-y-1 hover:border-amber-100 hover:shadow-xl hover:shadow-amber-100"
              >
                {/* IMAGE / VIDEO */}
                <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-slate-100">
                  {item.image && item.mediaType === "VIDEO" ? (
                    <video
                      className="h-full w-full bg-black object-cover"
                      src={item.image}
                      controls
                      playsInline
                      preload="metadata"
                      aria-label={item.title}
                    >
                      Your browser does not support video playback.
                    </video>
                  ) : item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : fallbackImage ? (
                    <img
                      src={fallbackImage}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-50 via-white to-slate-100">
                      <Leaf
                        size={40}
                        strokeWidth={1.3}
                        className="text-amber-700"
                      />
                    </div>
                  )}

                  {/* IMAGE OVERLAY */}
                  {!(item.mediaType === "VIDEO" && item.image) && (
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent" />
                  )}

                  {/* VIDEO LABEL */}
                  {item.mediaType === "VIDEO" && item.image && (
                    <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-md bg-black/75 px-2.5 py-1.5 text-[10px] font-bold tracking-wider text-white">
                      <Play size={11} fill="currentColor" />
                      VIDEO
                    </span>
                  )}
                </div>

                {/* CONTENT */}
                <div className="flex min-w-0 flex-1 flex-col p-4">
                  {/* CATEGORY AND DATE */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium text-slate-500">
                    <span className="font-bold uppercase tracking-wide text-amber-800">
                      {item.category}
                    </span>

                    <span className="inline-flex items-center gap-1">
                      <CalendarDays size={12} className="text-amber-700" />
                      {formatActivityDate(item.date)}
                    </span>
                  </div>

                  {/* TITLE */}
                  <h3 className="mt-2 break-words text-base font-bold leading-6 text-slate-900 transition-colors group-hover:text-amber-900">
                    {item.title}
                  </h3>

                  {/* DESCRIPTION */}
                  <p className="mt-2 min-w-0 flex-1 whitespace-pre-line break-words text-sm leading-6 text-slate-600 line-clamp-2">
                    {item.description}
                  </p>

                  {/* READ MORE */}
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                    <Link
                      href={item.href || "/activities"}
                      aria-label={`Read more about ${item.title}`}
                      className="group/link inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800 transition-colors hover:text-amber-900"
                    >
                      Read More
                      <ChevronRight
                        size={14}
                        className="text-amber-700 transition-transform duration-200 group-hover/link:translate-x-0.5"
                      />
                    </Link>

                    <Leaf
                      size={15}
                      strokeWidth={1.6}
                      className="text-amber-600/70"
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="rounded-xl border border-dashed border-slate-200 bg-white px-5 py-12 text-center shadow-sm shadow-amber-100/50">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50">
              <Leaf size={25} className="text-amber-800" strokeWidth={1.4} />
            </div>

            <h3 className="mt-4 break-words text-base font-bold text-slate-900">
              Haor Activities Coming Soon
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Published conservation activities, community programmes and
              awareness initiatives will appear here automatically.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
