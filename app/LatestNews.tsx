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

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Dhaka",
    });

  const NewsMedia = ({
    item,
    featured = false,
  }: {
    item: (typeof news)[number];
    featured?: boolean;
  }) => (
    <div
      className={`relative overflow-hidden bg-slate-900 ${
        featured ? "h-full min-h-[320px]" : "h-full w-36 shrink-0 sm:w-40"
      }`}
    >
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
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
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
          className="flex h-full w-full items-center justify-center bg-linear-to-br from-slate-900 to-slate-700"
        >
          <Waves
            size={featured ? 52 : 36}
            strokeWidth={1.2}
            className="text-white/80"
          />
        </Link>
      )}

      {item.mediaType === "VIDEO" && item.mediaUrl && (
        <span className="pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-md bg-black/70 px-2 py-1 text-[10px] font-semibold text-white">
          <Play size={12} fill="currentColor" />
          VIDEO
        </span>
      )}
    </div>
  );

  const NewsDate = ({ date }: { date: Date }) => (
    <div className="flex items-center gap-1.5 text-xs text-slate-400">
      <CalendarDays size={13} />
      <time dateTime={date.toISOString()}>{formatDate(date)}</time>
    </div>
  );

  const NewsLink = ({ id }: { id: string }) => (
    <Link
      href={`/news/${id}`}
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 transition-colors hover:text-amber-800"
    >
      Details
      <ArrowUpRight
        size={14}
        className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </Link>
  );

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-amber-700">
                <svg
                  viewBox="0 0 48 48"
                  fill="none"
                  className="h-9 w-9"
                  aria-hidden="true"
                >
                  <path
                    d="M23 13C18 9 11 9 6 11V33C12 31 18 32 23 36V13Z"
                    fill="#fbbf24"
                    fillOpacity="0.25"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M25 13C30 9 37 9 42 11V33C36 31 30 32 25 36V13Z"
                    fill="#fbbf24"
                    fillOpacity="0.25"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                    className="origin-[25px_24px] animate-[book-open_2s_ease-in-out_infinite]"
                  />
                  <path
                    d="M24 12V37"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M10 17C14 16 18 17 21 19M10 22C14 21 18 22 21 24M27 19C31 17 35 16 38 17M27 24C31 22 35 21 38 22"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    opacity="0.65"
                  />
                </svg>
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Latest News
              </h2>
            </div>

            <svg
              viewBox="0 0 420 40"
              fill="none"
              className="ml-1 mt-2 h-7 w-52 sm:w-64"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M2 27C75 2 145 5 210 17C285 31 350 10 418 15C350 17 290 39 210 25C130 11 70 13 2 31Z"
                fill="#d97706"
              />
            </svg>
          </div>
        </div>

        {/* Featured news + three equal-height news cards */}
        {news.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* LEFT: Large featured news */}
            {news[0] && (
              <article className="group flex min-w-0 flex-col overflow-hidden rounded-md border border-slate-100 bg-white shadow-md shadow-amber-100/70 transition-all duration-300 hover:border-amber-100 hover:shadow-xl hover:shadow-amber-100 lg:h-[570px]">
                <div className="relative min-h-0 flex-1 overflow-hidden bg-slate-900">
                  <NewsMedia item={news[0]} featured />
                </div>

                <div className="flex flex-col p-5">
                  <div className="mb-3">
                    <NewsDate date={news[0].createdAt} />
                  </div>

                  <Link href={`/news/${news[0].id}`}>
                    <h3 className="line-clamp-2 text-xl font-bold leading-7 text-slate-900 transition-colors group-hover:text-amber-900 sm:text-2xl">
                      {news[0].heading}
                    </h3>
                  </Link>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                    {news[0].details}
                  </p>

                  <div className="mt-4 flex justify-end">
                    <NewsLink id={news[0].id} />
                  </div>
                </div>
              </article>
            )}

            {/* RIGHT: Three equal-height news cards */}
            <div className="grid min-w-0 grid-rows-3 gap-5 lg:h-[570px]">
              {news.slice(1, 4).map((item) => (
                <article
                  key={item.id}
                  className="group flex min-h-0 min-w-0 overflow-hidden rounded-md border border-slate-100 bg-white shadow-md shadow-amber-100/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-100 hover:shadow-xl hover:shadow-amber-100"
                >
                  <NewsMedia item={item} />

                  <div className="flex min-w-0 flex-1 flex-col justify-center p-3 sm:p-4">
                    <div className="mb-2">
                      <NewsDate date={item.createdAt} />
                    </div>

                    <Link href={`/news/${item.id}`}>
                      <h3 className="line-clamp-2 text-sm font-bold leading-5 text-slate-900 transition-colors group-hover:text-amber-900 sm:text-base sm:leading-6">
                        {item.heading}
                      </h3>
                    </Link>

                    <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-slate-600 sm:text-sm">
                      {item.details}
                    </p>

                    <div className="mt-2 flex justify-end">
                      <NewsLink id={item.id} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white px-5 py-12 text-center">
            <Newspaper size={30} className="mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">
              No news available yet
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Please check back for future updates.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
