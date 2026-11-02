import Link from "next/link";
import { prisma } from "@/app/utils/db";
import { ArrowUpRight, Play, Video } from "lucide-react";

export default async function LatestVideos() {
  const videos = await prisma.news.findMany({
    where: {
      mediaType: "VIDEO",
      mediaUrl: {
        not: null,
      },
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: 4,
    select: {
      id: true,
      heading: true,
      mediaUrl: true,
      createdAt: true,
    },
  });

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-0.5">
                <span className="text-amber-500">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-7 w-7 -rotate-45"
                    aria-hidden="true"
                  >
                    <path d="M20.8 3.2C11.2 3.5 5.4 6.3 3.3 11.1c-1.4 3.2.2 6.9 3.6 7.9 4.1 1.3 8.1-1.7 10.4-6.1 1.5-2.9 2.5-6.2 3.5-9.7ZM5.4 17.8c2.7-3.5 6.3-6.5 10.8-9.1-3.8 3-6.9 6.2-9.2 9.7-.6 0-1.1-.2-1.6-.6Z" />
                  </svg>
                </span>
                <span className="text-emerald-800">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-8 w-8 -ml-2 rotate-12"
                    aria-hidden="true"
                  >
                    <path d="M20.8 3.2C11.2 3.5 5.4 6.3 3.3 11.1c-1.4 3.2.2 6.9 3.6 7.9 4.1 1.3 8.1-1.7 10.4-6.1 1.5-2.9 2.5-6.2 3.5-9.7ZM5.4 17.8c2.7-3.5 6.3-6.5 10.8-9.1-3.8 3-6.9 6.2-9.2 9.7-.6 0-1.1-.2-1.6-.6Z" />
                  </svg>
                </span>
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Our Activities & Initiatives
              </h2>
            </div>

            <svg
              viewBox="0 0 420 40"
              fill="none"
              className="mt-2 h-8 w-[75%] sm:h-10"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="
      M2 27
      C75 2 145 5 210 17
      C285 31 350 10 418 15
      C350 17 290 39 210 25
      C130 11 70 13 2 31
      Z
    "
                fill="#d97706"
              />
            </svg>
          </div>
        </div>

        {/* Latest four videos */}
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {videos.map((item) => (
              <article
                key={item.id}
                className="group flex min-w-0 flex-col overflow-hidden rounded-md border border-slate-100 bg-white shadow-md shadow-amber-100/70 transition-all duration-300 hover:-translate-y-1 hover:border-amber-100 hover:shadow-xl hover:shadow-amber-100"
              >
                {/* Video player */}
                <div className="relative aspect-video overflow-hidden bg-slate-950">
                  {item.mediaUrl && (
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
                  )}
                </div>

                {/* Video details */}
                <div className="flex flex-1 items-start justify-between gap-3 p-4">
                  <Link href={`/news/${item.id}`} className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold leading-6 text-slate-900 transition-colors duration-200 group-hover:text-amber-900 sm:text-base">
                      {item.heading}
                    </h3>
                  </Link>

                  <Link
                    href={`/news/${item.id}`}
                    aria-label={`View ${item.heading}`}
                    className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-all duration-200 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-900"
                  >
                    <ArrowUpRight size={15} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-slate-200 bg-white px-5 py-12 text-center shadow-sm shadow-amber-100/50">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50">
              <Video size={25} className="text-amber-800" />
            </div>

            <p className="mt-4 text-sm font-bold text-slate-800">
              Our Stories Are Coming Soon
            </p>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
              Stay connected with Haor Rokkha Andolan for upcoming videos
              highlighting our environmental activities, community initiatives,
              and efforts to protect our rivers and wetlands.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
