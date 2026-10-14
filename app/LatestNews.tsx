import Link from "next/link";
import { prisma } from "@/app/utils/db";
import {
  ArrowUpRight,
  CalendarDays,
  Newspaper,
  Waves,
  Play,
} from "lucide-react";

export default async function LatestNews() {
  const news = await prisma.news.findMany({
    where: {
      type: "NEWS",
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: 4,
    select: {
      id: true,
      heading: true,
      details: true,
      mediaUrl: true,
      mediaType: true,
      riverOrHaor: true,
      createdAt: true,
    },
  });

  return (
    <section className="bg-white py-14 sm:py-18">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">
              <span className="h-px w-7 bg-emerald-700" />
              Haor Rokkha Andolan
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Latest News
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              The latest news and updates on our efforts to protect the haors,
              rivers, and natural environment.
            </p>
          </div>

          <Link
            href="/activities"
            className="group hidden shrink-0 items-center gap-2 text-sm font-semibold text-emerald-800 transition hover:text-emerald-950 sm:inline-flex"
          >
            View all
            <ArrowUpRight
              size={17}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        {/* Latest four news */}
        {news.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {news.map((item) => (
              <article
                key={item.id}
                className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-emerald-800/30 hover:shadow-lg hover:shadow-emerald-950/5"
              >
                {/* Media */}
                <div className="relative aspect-[16/10] overflow-hidden bg-emerald-950">
                  {item.mediaUrl && item.mediaType === "IMAGE" ? (
                    <Link
                      href={`/news/${item.id}`}
                      aria-label={`Read ${item.heading}`}
                      className="block h-full w-full"
                    >
                      <img
                        src={item.mediaUrl}
                        alt={item.heading}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </Link>
                  ) : item.mediaUrl && item.mediaType === "VIDEO" ? (
                    <video
                      key={item.mediaUrl}
                      src={item.mediaUrl}
                      controls
                      playsInline
                      preload="metadata"
                      className="h-full w-full object-cover"
                      aria-label={item.heading}
                    >
                      Your browser does not support video playback.
                    </video>
                  ) : (
                    <Link
                      href={`/news/${item.id}`}
                      aria-label={`Read ${item.heading}`}
                      className="flex h-full w-full items-center justify-center bg-linear-to-br from-emerald-950 to-green-800"
                    >
                      <Waves
                        size={42}
                        strokeWidth={1.2}
                        className="text-white/80"
                      />
                    </Link>
                  )}

                  {/* River / Haor label */}
                  <span className="pointer-events-none absolute left-3 top-3 rounded-md bg-emerald-950/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    {item.riverOrHaor === "HAOR" ? "Haor" : "River"}
                  </span>

                  {/* Video indicator */}
                  {item.mediaType === "VIDEO" && item.mediaUrl && (
                    <span className="pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-md bg-black/70 px-2 py-1 text-[10px] font-semibold text-white">
                      <Play size={12} fill="currentColor" />
                      VIDEO
                    </span>
                  )}
                </div>

                {/* News details */}
                <div className="flex flex-1 flex-col p-4">
                  <div className="mb-3 flex items-center gap-1.5 text-xs text-slate-400">
                    <CalendarDays size={13} />
                    <time dateTime={item.createdAt.toISOString()}>
                      {item.createdAt.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        timeZone: "Asia/Dhaka",
                      })}
                    </time>
                  </div>

                  <Link href={`/news/${item.id}`}>
                    <h3 className="line-clamp-2 text-base font-bold leading-6 text-slate-900 transition group-hover:text-emerald-800">
                      {item.heading}
                    </h3>
                  </Link>

                  {/*     <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-slate-500">
                    {item.details}
                  </p> */}

                  <Link
                    href={`/news/${item.id}`}
                    className="mt-4 inline-flex w-fit items-center gap-1.5 border-b border-emerald-800/30 pb-1 text-xs font-bold text-emerald-800 transition hover:border-emerald-800 hover:text-emerald-950"
                  >
                    Details
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 px-5 py-12 text-center">
            <Newspaper size={30} className="mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">
              No news available yet
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Please check back for future updates.
            </p>
          </div>
        )}

        <div className="mt-6 sm:hidden">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800"
          >
            View all news
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}
