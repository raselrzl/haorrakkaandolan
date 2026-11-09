import Link from "next/link";
import { prisma } from "@/app/utils/db";
import { ArrowUpRight, CalendarDays, Video, Clapperboard } from "lucide-react";

export default async function LatestVideos() {
  const videos = await prisma.news.findMany({
    where: {
      mediaType: "VIDEO",
      mediaUrl: {
        not: null,
      },
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: 5,
    select: {
      id: true,
      heading: true,
      mediaUrl: true,
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

  const VideoCard = ({
    item,
    number,
  }: {
    item: (typeof videos)[number];
    number: number;
  }) => (
    <article className="group flex min-h-0 min-w-0 overflow-hidden rounded-lg border border-amber-200/10 bg-linear-to-br from-slate-800 via-slate-900 to-amber-950/80 shadow-lg shadow-amber-950/20 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-400/40 hover:shadow-xl hover:shadow-amber-700/20">
      <div className="relative w-[38%] shrink-0 overflow-hidden bg-black sm:w-[42%]">
        <video
          key={item.mediaUrl}
          src={item.mediaUrl!}
          controls
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
          aria-label={item.heading}
        />
        {/* 
        <span className="pointer-events-none absolute left-2 top-2 rounded border border-amber-400/20 bg-slate-950/85 px-2 py-1 text-[9px] font-bold text-amber-400 shadow-md shadow-amber-950/30">
          0{number}
        </span> */}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center p-3 sm:p-4">
        <div className="mb-2 flex items-center gap-1.5 text-[10px] text-slate-400 sm:text-xs">
          <CalendarDays size={12} className="shrink-0 text-amber-400" />
          {formatDate(item.createdAt)}
        </div>

        <Link href={`/news/${item.id}`}>
          <h3 className="line-clamp-3 text-xs font-bold leading-5 text-white transition-colors group-hover:text-amber-300 sm:text-sm sm:leading-6">
            {item.heading}
          </h3>
        </Link>

        <div className="mt-3">
          <Link
            href={`/news/${item.id}`}
            className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-400 transition-colors hover:text-amber-200 sm:text-xs"
          >
            Details
            <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>
    </article>
  );

  return (
    <section className="relative isolate overflow-hidden bg-linear-to-br from-slate-950 via-slate-900 to-amber-950 py-14 sm:py-20">
      {/* Gradient background decoration */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-amber-500/10 blur-[120px]" />

      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-orange-600/10 blur-[120px]" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-700/10 blur-[130px]" />

      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/20" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-9">
          <div className="mb-3 flex items-center gap-2 text-amber-400">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-400/30 bg-linear-to-br from-amber-400/20 to-orange-600/10 shadow-md shadow-amber-900/20">
              <Clapperboard size={17} />
            </span>

            <span className="text-[11px] font-bold uppercase tracking-[0.25em]">
              Watch & Discover
            </span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            Our Activities <span className="text-amber-400">&</span> Initiatives
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
            Watch our environmental activities, community initiatives, and
            ongoing efforts to protect Bangladesh&apos;s rivers and wetlands.
          </p>

          {/* Gradient underline */}
          <div className="mt-5 h-1 w-28 rounded-full bg-linear-to-r from-amber-400 via-orange-500 to-transparent shadow-md shadow-amber-500/30" />
        </div>

        {/* Five video layout */}
        {videos.length > 0 ? (
          <>
            {/* Desktop: 2 left + 1 center + 2 right */}
            <div className="hidden grid-cols-[1fr_1.45fr_1fr] gap-4 lg:grid">
              {/* Left: Two videos */}
              <div className="grid h-[470px] min-w-0 grid-rows-2 gap-4">
                {videos[0] && <VideoCard item={videos[0]} number={1} />}

                {videos[1] && <VideoCard item={videos[1]} number={2} />}
              </div>

              {/* Center: Featured video */}
              {videos[2] && (
                <article className="group flex min-h-0 min-w-0 flex-col overflow-hidden rounded-lg border border-amber-400/30 bg-linear-to-br from-slate-800 via-slate-900 to-amber-950 shadow-xl shadow-amber-950/40 transition-all duration-300 hover:border-amber-400/60 hover:shadow-2xl hover:shadow-amber-700/20">
                  <div className="relative min-h-0 flex-1 overflow-hidden bg-black">
                    <video
                      key={videos[2].mediaUrl}
                      src={videos[2].mediaUrl!}
                      controls
                      playsInline
                      preload="metadata"
                      className="h-full w-full object-contain"
                      aria-label={videos[2].heading}
                    />
                    {/* 
                    <span className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-md border border-amber-400/30 bg-slate-950/85 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-amber-300 shadow-lg shadow-amber-950/30 backdrop-blur-md">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400" />
                      Featured Video
                    </span> */}
                  </div>

                  <div className="shrink-0 bg-linear-to-r from-slate-900 via-slate-900 to-amber-950/70 p-5">
                    <div className="mb-3 flex items-center gap-2 text-xs text-slate-400">
                      <CalendarDays size={13} className="text-amber-400" />
                      {formatDate(videos[2].createdAt)}
                    </div>

                    <Link href={`/news/${videos[2].id}`}>
                      <h3 className="line-clamp-2 text-lg font-bold leading-7 text-white transition-colors group-hover:text-amber-300 xl:text-xl">
                        {videos[2].heading}
                      </h3>
                    </Link>

                    <div className="mt-4 flex justify-between border-t border-amber-400/15 pt-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-amber-200/50">
                        Featured Initiative
                      </span>

                      <Link
                        href={`/news/${videos[2].id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 transition-colors hover:text-amber-200"
                      >
                        Explore Story
                        <ArrowUpRight size={15} />
                      </Link>
                    </div>
                  </div>
                </article>
              )}

              {/* Right: Two videos */}
              <div className="grid h-[470px] min-w-0 grid-rows-2 gap-4">
                {videos[3] && <VideoCard item={videos[3]} number={4} />}

                {videos[4] && <VideoCard item={videos[4]} number={5} />}
              </div>
            </div>

            {/* Mobile and tablet */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
              {videos.map((item, index) => (
                <article
                  key={item.id}
                  className={`group overflow-hidden rounded-lg border border-amber-200/10 bg-linear-to-br from-slate-800 via-slate-900 to-amber-950/80 shadow-lg shadow-amber-950/20 transition-all duration-300 hover:border-amber-400/40 hover:shadow-xl hover:shadow-amber-700/20 ${
                    index === 2 ? "sm:col-span-2" : ""
                  }`}
                >
                  <div className="relative aspect-video bg-black">
                    <video
                      key={item.mediaUrl}
                      src={item.mediaUrl!}
                      controls
                      playsInline
                      preload="metadata"
                      className="h-full w-full object-contain"
                      aria-label={item.heading}
                    />

                    {index === 2 && (
                      <span className="pointer-events-none absolute left-3 top-3 rounded-md border border-amber-400/30 bg-slate-950/85 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-300 shadow-md shadow-amber-950/30">
                        Featured Video
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="mb-2 flex items-center gap-1.5 text-xs text-slate-400">
                      <CalendarDays size={12} className="text-amber-400" />
                      {formatDate(item.createdAt)}
                    </div>

                    <Link href={`/news/${item.id}`}>
                      <h3 className="line-clamp-2 text-sm font-bold leading-6 text-white transition-colors group-hover:text-amber-300 sm:text-base">
                        {item.heading}
                      </h3>
                    </Link>

                    <Link
                      href={`/news/${item.id}`}
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 transition-colors hover:text-amber-200"
                    >
                      Explore Story
                      <ArrowUpRight size={14} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-lg border border-amber-200/15 bg-linear-to-br from-slate-800 via-slate-900 to-amber-950/70 px-5 py-16 text-center shadow-xl shadow-amber-950/20">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-amber-400/25 bg-linear-to-br from-amber-400/20 to-orange-600/10 shadow-lg shadow-amber-900/20">
              <Video size={26} className="text-amber-400" />
            </div>

            <h3 className="mt-5 text-base font-bold text-white">
              Our Stories Are Coming Soon
            </h3>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-300">
              Stay connected with Wetlands Resilience Initiatives for upcoming
              videos highlighting our environmental activities, community
              initiatives, and efforts to protect our rivers and wetlands.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
