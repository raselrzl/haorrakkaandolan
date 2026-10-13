import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Leaf,
  Play,
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
      className="scroll-mt-24 bg-white py-14 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
              Protecting Our Wetlands
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-emerald-950 sm:text-4xl">
              Haor Activities
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
              Discover our latest haor conservation activities and community
              initiatives.
            </p>
          </div>

          <Link
            href="/activities"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-950"
          >
            All Activities
            <ArrowRight size={16} />
          </Link>
        </div>

        {activities.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {activities.map((item) => (
              <article
                key={item.id}
                className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition duration-300 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-950/5"
              >
                <div className="relative h-52 overflow-hidden bg-emerald-50 sm:h-56">
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
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : fallbackImage ? (
                    <img
                      src={fallbackImage}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-linear-to-br from-emerald-50 to-teal-100">
                      <Leaf
                        size={44}
                        strokeWidth={1.3}
                        className="text-emerald-700/60"
                      />
                    </div>
                  )}

                  {item.mediaType === "VIDEO" && item.image && (
                    <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-md bg-black/70 px-2.5 py-1.5 text-xs font-semibold text-white">
                      <Play size={12} fill="currentColor" />
                      Video
                    </span>
                  )}
                </div>

                <div className="p-5 sm:p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                      {item.category}
                    </span>

                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                      <CalendarDays size={13} />
                      {formatActivityDate(item.date)}
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-bold leading-snug text-emerald-950">
                    {item.title}
                  </h3>

                  <p className="mt-2.5 line-clamp-3 text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>

                  <Link
                    href="/activities"
                    aria-label={`Read more about ${item.title}`}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 transition hover:text-emerald-950"
                  >
                    Read More
                    <ChevronRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-emerald-200 bg-emerald-50/40 px-6 py-12 text-center">
            <Leaf
              size={34}
              className="mx-auto text-emerald-700"
              strokeWidth={1.5}
            />

            <h3 className="mt-4 text-lg font-bold text-emerald-950">
              Haor Activities Coming Soon
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
              Published haor activities will appear here automatically.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}