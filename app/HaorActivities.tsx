import Link from "next/link";
import {
  ChevronRight,
  Leaf,
  Play,
  ArrowUpRight,
  Newspaper,
  Bird,
  Fish,
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

function ActivityMedia({
  item,
  fallbackImage,
  className = "",
}: {
  item: HaorActivityItem;
  fallbackImage?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative h-full w-full overflow-hidden rounded-md bg-slate-100 ${className}`}
    >
      {item.image && item.mediaType === "VIDEO" ? (
        <video
          className="h-full w-full rounded-md bg-black object-cover"
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
          className="h-full w-full rounded-md object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
      ) : fallbackImage ? (
        <img
          src={fallbackImage}
          alt=""
          loading="lazy"
          className="h-full w-full rounded-md object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-md bg-gradient-to-br from-amber-50 via-white to-slate-100">
          <Leaf size={42} strokeWidth={1.3} className="text-amber-700" />
        </div>
      )}

      {item.mediaType === "VIDEO" && item.image && (
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-sm bg-black/80 px-2.5 py-1.5 text-[10px] font-bold tracking-wider text-white">
          <Play size={11} fill="currentColor" />
          VIDEO
        </span>
      )}
    </div>
  );
}

export default function HaorActivities({
  activities,
  fallbackImage,
}: HaorActivitiesProps) {
  const [leadStory, ...otherStories] = activities;

  return (
    <section
      id="haor-activities"
      className="relative scroll-mt-20 overflow-hidden bg-white py-8 sm:py-10"
    >
      {/* EXISTING BACKGROUND */}
      <div className="pointer-events-none absolute -right-24 -top-20 h-64 w-64 rounded-full bg-amber-100/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-amber-50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {activities.length > 0 ? (
          <>
            {/* NEWSPAPER BODY */}
            <div className="grid grid-cols-1 gap-0 lg:grid-cols-12">
              {/* LEAD STORY */}
              <article className="group min-w-0 border-slate-200 py-6 lg:col-span-8 lg:pr-6">
                <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-bold uppercase tracking-wider">
                  <span className="rounded-sm bg-amber-700 px-2.5 py-1 text-white">
                    Lead Story
                  </span>

                  <span className="text-amber-800">{leadStory.category}</span>

                  <span className="text-slate-400">
                    / {formatActivityDate(leadStory.date)}
                  </span>
                </div>

                <Link href={leadStory.href || "/activities"} className="block">
                  <h3 className="max-w-3xl font-serif text-2xl font-bold leading-tight tracking-tight text-slate-950 transition-colors group-hover:text-amber-900 sm:text-3xl lg:text-4xl">
                    {leadStory.title}
                  </h3>
                </Link>
                {/* 
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                  {leadStory.description}
                </p> */}

                {/* LEAD IMAGE */}
                <Link
                  href={leadStory.href || "/activities"}
                  aria-label={`Read more about ${leadStory.title}`}
                  className="mt-5 block"
                >
                  <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-slate-100">
                    <ActivityMedia
                      item={leadStory}
                      fallbackImage={fallbackImage}
                    />
                  </div>
                </Link>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 pb-4">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400">
                    WRI / Environmental Field Report
                  </span>

                  <Link
                    href={leadStory.href || "/activities"}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 transition-colors hover:text-amber-800"
                  >
                    Details
                    <ChevronRight size={14} className="text-amber-700" />
                  </Link>
                </div>
              </article>

              {/* SECONDARY NEWS COLUMN */}
              <aside className="min-w-0 py-6 lg:col-span-4 lg:pl-6">
                <div className="mb-4 flex items-center justify-between border-b-2 border-slate-900 pb-2">
                  <h3 className="font-serif text-lg font-bold text-slate-950">
                    Latest Reports
                  </h3>

                  <Newspaper size={17} className="text-amber-700" />
                </div>

                <div className="divide-y divide-slate-200">
                  {otherStories.slice(0, 4).map((item) => (
                    <article key={item.id} className="group py-4 first:pt-0">
                      <div className="mb-2 flex flex-wrap items-center gap-2 text-[9px] font-bold uppercase tracking-wider">
                        <span className="text-amber-800">{item.category}</span>

                        <span className="text-slate-300">/</span>

                        <span className="font-medium text-slate-400">
                          {formatActivityDate(item.date)}
                        </span>
                      </div>

                      <div className="grid grid-cols-[1fr_105px] gap-3 sm:grid-cols-[1fr_115px]">
                        <div className="min-w-0">
                          <Link href={item.href || "/activities"}>
                            <h4 className="break-words font-serif text-base font-bold leading-5 text-slate-900 transition-colors group-hover:text-amber-800">
                              {item.title}
                            </h4>
                          </Link>

                          <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
                            {item.description}
                          </p>

                          <Link
                            href={item.href || "/activities"}
                            className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-slate-700 hover:text-amber-800"
                          >
                            Continue Reading
                            <ChevronRight
                              size={12}
                              className="text-amber-700"
                            />
                          </Link>
                        </div>

                        <Link
                          href={item.href || "/activities"}
                          aria-label={`Read more about ${item.title}`}
                          className="block"
                        >
                          <div className="aspect-[4/3] overflow-hidden rounded-md">
                            <ActivityMedia
                              item={item}
                              fallbackImage={fallbackImage}
                            />
                          </div>
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>

                {otherStories.length > 4 && (
                  <Link
                    href="/activities"
                    className="mt-3 flex items-center justify-between border-t border-slate-900 pt-3 text-xs font-bold text-slate-900 hover:text-amber-800"
                  >
                    Explore More Reports
                    <ArrowUpRight size={15} className="text-amber-700" />
                  </Link>
                )}

                {otherStories.length === 0 && (
                  <p className="py-8 text-center text-xs text-slate-400">
                    More reports will appear here soon.
                  </p>
                )}
              </aside>
            </div>

            {/* BOTTOM NEWSPAPER FOOTER */}
            {/*             <div className="flex flex-wrap items-center justify-between gap-2 border-y-2 border-slate-900 py-3">
              <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-700">
                <Leaf size={13} className="text-amber-700" />
                Protecting Wetlands, Preserving Life
              </span>

              <Link
                href="/activities"
                className="text-[10px] font-bold uppercase tracking-wider text-amber-800 hover:text-amber-950"
              >
                View All Activities →
              </Link>
            </div> */}
          </>
        ) : (
          /* EMPTY STATE */
          <div className="relative isolate overflow-hidden px-0 py-16 text-center">
            {/* EMPTY STATE */}
            <div className="w-full">
              <img
                src="/img.png"
                alt="Haor Activities"
                className="block h-auto w-full object-cover"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
