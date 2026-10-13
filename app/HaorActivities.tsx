import Link from "next/link";
import { ArrowRight, CalendarDays, ChevronRight, Leaf } from "lucide-react";

export type HaorActivityItem = {
  id: string;
  title: string;
  description: string;
  image?: string | null;
  date: string | Date;
  category: string;
  href?: string | null;
};

type HaorActivitiesProps = {
  activities: HaorActivityItem[];
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

export default function HaorActivities({ activities }: HaorActivitiesProps) {
  return (
    <section id="activities" className="scroll-mt-24 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-emerald-600 uppercase">
              Protecting Our Wetlands
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-emerald-950 sm:text-4xl">
              Haor Activities
            </h2>
          </div>

          <Link
            href="/activities"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 transition hover:text-emerald-900"
          >
            All Activities
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Activity cards from the database */}
        {activities.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activities.map((item) => (
              <article
                key={item.id}
                className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-900/5"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden bg-emerald-50 sm:h-56">
                  {item.image ? (
                    <div
                      role="img"
                      aria-label={item.title}
                      className="h-full w-full bg-cover bg-center transition duration-700 group-hover:scale-110"
                      style={{
                        backgroundImage: `url("${item.image}")`,
                      }}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-linear-to-br from-emerald-50 via-emerald-100 to-teal-100">
                      <Leaf
                        size={48}
                        strokeWidth={1.2}
                        className="text-emerald-700/60"
                      />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 transition group-hover:opacity-100" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {item.category}
                    </span>

                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                      <CalendarDays size={13} />
                      {formatActivityDate(item.date)}
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg leading-snug font-bold text-emerald-950">
                    {item.title}
                  </h3>

                  <p className="mt-2.5 line-clamp-3 text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>

                  <Link
                    href={item.href || "/activities"}
                    aria-label={`Learn more about ${item.title}`}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 transition hover:text-emerald-900"
                  >
                    Learn More
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
          <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/50 px-6 py-12 text-center">
            <Leaf
              size={34}
              className="mx-auto text-emerald-700"
              strokeWidth={1.5}
            />

            <h3 className="mt-4 text-lg font-bold text-emerald-950">
              Activities Coming Soon
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
              Haor conservation activities and community initiatives will appear
              here when they are published.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
