
import Link from "next/link";
import { prisma } from "@/app/utils/db";
import { Play, Video } from "lucide-react";

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
    <section className="bg-white py-14 sm:py-18">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">
            <span className="h-px w-7 bg-emerald-700" />
            Haor Rokkha Andolan · Visual Stories
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Our Activities & Initiatives
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Explore our latest videos documenting environmental awareness,
            community engagement, and initiatives to protect the haors,
            rivers, and natural ecosystems of Bangladesh. Together, we
            stand for sustainable development and the preservation of
            our wetlands for future generations.
          </p>
        </div>

        {/* Latest four videos */}
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {videos.map((item) => (
              <article
                key={item.id}
                className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-emerald-800/30 hover:shadow-lg hover:shadow-emerald-950/5"
              >
                {/* Video */}
                <div className="relative aspect-video overflow-hidden bg-emerald-950">
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

                  {/* Video indicator */}
                  <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-md bg-black/70 px-2 py-1 text-[10px] font-semibold text-white">
                    <Play size={12} fill="currentColor" />
                    VIDEO
                  </span>
                </div>

                {/* Video heading */}
                <div className="flex flex-1 flex-col p-4">
                  <Link href={`/news/${item.id}`}>
                    <h3 className="line-clamp-2 text-base font-bold leading-6 text-slate-900 transition group-hover:text-emerald-800">
                      {item.heading}
                    </h3>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 px-5 py-12 text-center">
            <Video
              size={30}
              className="mx-auto mb-3 text-slate-300"
            />

            <p className="text-sm font-semibold text-slate-700">
              Our Stories Are Coming Soon
            </p>

            <p className="mx-auto mt-1 max-w-lg text-sm leading-6 text-slate-500">
              Stay connected with Haor Rokkha Andolan for upcoming
              videos highlighting our environmental activities,
              community initiatives, and efforts to protect our
              rivers and wetlands.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
