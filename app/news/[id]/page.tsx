
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "../../Navbar";
import {
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  Droplets,
  FileText,
  Newspaper,
  Play,
} from "lucide-react";
import { prisma } from "@/app/utils/db";
import Footer from "@/app/Footer";

export const instant = false;

type PageProps = {
  params: Promise<{ id: string }>;
};

async function getNews(id: string) {
  if (!id) return null;

  try {
    return await prisma.news.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error("Unable to fetch public activity:", error);
    return null;
  }
}

async function getRelatedNews(
  currentId: string,
  riverOrHaor: string,
  type: string,
) {
  try {
    const related = await prisma.news.findMany({
      where: {
        id: { not: currentId },
        OR: [{ riverOrHaor: riverOrHaor as never }, { type: type as never }],
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 4,
      select: {
        id: true,
        heading: true,
        details: true,
        mediaUrl: true,
        mediaType: true,
        riverOrHaor: true,
        type: true,
        createdAt: true,
      },
    });

    if (related.length < 4) {
      const existingIds = [currentId, ...related.map((item) => item.id)];

      const additional = await prisma.news.findMany({
        where: {
          id: { notIn: existingIds },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 4 - related.length,
        select: {
          id: true,
          heading: true,
          details: true,
          mediaUrl: true,
          mediaType: true,
          riverOrHaor: true,
          type: true,
          createdAt: true,
        },
      });

      return [...related, ...additional];
    }

    return related;
  } catch (error) {
    console.error("Unable to fetch related news:", error);
    return [];
  }
}

function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function formatLabel(value: unknown, fallback = "General") {
  if (typeof value !== "string" || !value.trim()) {
    return fallback;
  }

  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function isVideo(url: string, mediaType: unknown) {
  const type = String(mediaType ?? "").toLowerCase();

  if (type.includes("video")) return true;
  if (type.includes("image")) return false;

  return /\.(mp4|webm|ogg|mov|m4v|avi|m3u8)(?:[?#].*)?$/i.test(url);
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const news = await getNews(id);

  if (!news) {
    return {
      title: "Activities | Haor Rokkha Andolan",
      description: "Activities and updates from Haor Rokkha Andolan.",
    };
  }

  const title = String(news.heading || "Activity update");
  const description = String(news.details ?? "")
    .replace(/\s+/g, " ")
    .slice(0, 160);

  const mediaUrl =
    typeof news.mediaUrl === "string" ? news.mediaUrl.trim() : "";

  const video = mediaUrl ? isVideo(mediaUrl, news.mediaType) : false;

  return {
    title: `${title} | Haor Rokkha Andolan`,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      ...(!video && mediaUrl ? { images: [mediaUrl] } : {}),
      publishedTime: news.createdAt.toISOString(),
    },
  };
}

export default async function NewsDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const news = await getNews(id);

  if (!news) {
    notFound();
  }

  const title = String(news.heading || "Activity update");
  const details = String(news.details ?? "");

  const mediaUrl =
    typeof news.mediaUrl === "string" ? news.mediaUrl.trim() : "";

  const newsType = formatLabel(news.type, "Activity");
  const coverage = formatLabel(news.riverOrHaor, "Wetlands");

  const video = mediaUrl ? isVideo(mediaUrl, news.mediaType) : false;

  const relatedNews = await getRelatedNews(
    news.id,
    String(news.riverOrHaor),
    String(news.type),
  );

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#faf9f6] text-slate-900">
        {/* Page header */}
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
            <nav
              aria-label="Breadcrumb"
              className="mb-5 flex flex-wrap items-center gap-2 text-xs text-slate-500 sm:text-sm"
            >
              <Link
                href="/"
                className="transition-colors hover:text-amber-700"
              >
                Home
              </Link>

              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />

              <Link
                href="/activities"
                className="transition-colors hover:text-amber-700"
              >
                Activities
              </Link>

              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />

              <span className="font-medium text-slate-800">Details</span>
            </nav>

            <div className="max-w-4xl">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-800 ring-1 ring-inset ring-amber-200">
                  <Newspaper className="h-3.5 w-3.5" />
                  {newsType}
                </span>

                <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                  {coverage}
                </span>
              </div>

              <h1 className="wrap-break-words text-2xl font-bold leading-tight tracking-tight text-slate-950 sm:text-3xl">
                {title}
              </h1>

              <div className="mt-2 flex items-center gap-2 text-xs text-slate-500 sm:text-sm">
                <CalendarDays className="h-4 w-4 shrink-0 text-amber-700" />
                <time dateTime={news.createdAt.toISOString()}>
                  {formatDate(news.createdAt)}
                </time>
              </div>
            </div>
          </div>
        </section>

        {/* Activity content */}
        <section className="mx-auto max-w-7xl bg-transparent px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_270px] lg:gap-8">
            <article className="min-w-0">
              {/* Main image or video */}
              {mediaUrl && (
                <div className="mb-6">
                  {video ? (
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
                      <video
                        className="absolute inset-0 h-full w-full bg-black object-contain"
                        controls
                        preload="metadata"
                        playsInline
                        aria-label={title}
                      >
                        <source src={mediaUrl} />
                        Your browser does not support this video.
                      </video>
                    </div>
                  ) : (
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-slate-100">
                      <Image
                        src={mediaUrl}
                        alt={title}
                        fill
                        unoptimized
                        priority
                        sizes="(max-width: 1024px) 100vw, 900px"
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Activity details heading */}
              <div className="mb-5 flex items-center gap-3 border-b border-slate-200 pb-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-800">
                  <FileText className="h-4 w-4" />
                </div>

                <div>
                  <h2 className="text-sm font-bold text-slate-950">
                    Activity details
                  </h2>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    Published by Haor Rokkha Andolan
                  </p>
                </div>
              </div>

              {/* Activity description */}
              <div className="whitespace-pre-wrap wrap-break-words text-justify text-sm leading-7 text-slate-700 sm:text-[15px] sm:leading-8">
                {details || "No activity details are available."}
              </div>

              {/* Back to activities */}
              <div className="mt-8 border-t border-slate-200 pt-5">
                <Link
                  href="/activities"
                  className="inline-flex items-center gap-2 rounded-lg bg-amber-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to activities
                </Link>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="space-y-4">
              <section className="rounded-lg border border-slate-200 bg-white p-4">
                <h2 className="text-sm font-bold text-slate-950">
                  About this activity
                </h2>

                <div className="mt-3 flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-800">
                    <Droplets className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">
                      Haor Rokkha Andolan
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Activities and updates supporting the protection of
                      haors, rivers, wetlands and biodiversity.
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-3 border-t border-slate-100 pt-3">
                  <div>
                    <p className="text-[11px] font-medium text-slate-500">
                      Activity type
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-slate-800">
                      {newsType}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-medium text-slate-500">
                      Coverage
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-slate-800">
                      {coverage}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-medium text-slate-500">
                      Publication date
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-slate-800">
                      {formatDate(news.createdAt)}
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-lg border border-amber-200 bg-amber-50/50 p-4">
                <h2 className="text-sm font-bold text-slate-950">
                  Protect our wetlands
                </h2>

                <p className="mt-1.5 text-xs leading-5 text-slate-600">
                  Follow our activities and initiatives to conserve haors,
                  rivers and biodiversity.
                </p>

                <Link
                  href="/activities"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 transition-colors hover:text-amber-950"
                >
                  Explore activities
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </section>
            </aside>
          </div>

          {/* Related news and activities */}
          {relatedNews.length > 0 && (
            <section className="mt-9 border-t border-slate-200 pt-7 sm:mt-12 sm:pt-8">
              <div className="mb-5 flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <div className="mb-1.5 flex items-center gap-2">
                    <span className="h-4 w-1 rounded-full bg-amber-600" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-amber-800">
                      Discover more
                    </p>
                  </div>

                  <h2 className="text-lg font-bold tracking-tight text-slate-950 sm:text-xl">
                    Related News & Activities
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Updates from our rivers, haors and wetlands.
                  </p>
                </div>

                <Link
                  href="/activities"
                  className="inline-flex shrink-0 items-center gap-1 rounded-md border border-amber-200 px-2.5 py-1.5 text-[11px] font-bold text-amber-800 transition-colors hover:border-amber-700 hover:bg-amber-700 hover:text-white sm:px-3 sm:text-xs"
                >
                  View all
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                {relatedNews.map((item) => {
                  const itemMediaUrl =
                    typeof item.mediaUrl === "string"
                      ? item.mediaUrl.trim()
                      : "";

                  const itemIsVideo = itemMediaUrl
                    ? isVideo(itemMediaUrl, item.mediaType)
                    : false;

                  return (
                    <Link
                      key={item.id}
                      href={`/news/${item.id}`}
                      className="group flex min-w-0 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md"
                    >
                      {/* Actual image or video preview */}
                      <div className="relative aspect-4/3 overflow-hidden bg-black">
                        {itemMediaUrl && itemIsVideo ? (
                          <>
                            <video
                              className="absolute inset-0 h-full w-full object-cover"
                              src={itemMediaUrl}
                              muted
                              playsInline
                              preload="metadata"
                              aria-label={item.heading}
                            />

                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/65 text-white shadow-md transition-transform duration-300 group-hover:scale-110 sm:h-12 sm:w-12">
                                <Play className="h-5 w-5 fill-current" />
                              </div>
                            </div>
                          </>
                        ) : itemMediaUrl ? (
                          <Image
                            src={itemMediaUrl}
                            alt={item.heading}
                            fill
                            unoptimized
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-amber-50 text-amber-700">
                            <Droplets className="h-8 w-8 opacity-60 sm:h-10 sm:w-10" />
                          </div>
                        )}

                        <span className="absolute left-2 top-2 max-w-[calc(100%-1rem)] truncate rounded bg-white/95 px-2 py-1 text-[9px] font-bold text-amber-900 shadow-sm sm:text-[10px]">
                          {formatLabel(item.type, "Activity")}
                        </span>

                        {itemIsVideo && itemMediaUrl && (
                          <span className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/65 text-white">
                            <Play className="h-3.5 w-3.5 fill-current" />
                          </span>
                        )}
                      </div>

                      {/* Card content */}
                      <div className="flex flex-1 flex-col p-2.5 sm:p-3">
                        <div className="mb-2 flex min-w-0 items-center gap-1.5 text-[9px] text-slate-500 sm:text-[11px]">
                          <CalendarDays className="h-3 w-3 shrink-0 text-amber-700" />
                          <time
                            dateTime={item.createdAt.toISOString()}
                            className="truncate"
                          >
                            {formatDate(item.createdAt)}
                          </time>
                        </div>

                        <h3 className="line-clamp-2 min-h-9 wrap-break-words text-xs font-bold leading-[1.15rem] text-slate-900 transition-colors group-hover:text-amber-800 sm:min-h-11 sm:text-sm sm:leading-5">
                          {item.heading}
                        </h3>

                        <p className="mt-1.5 line-clamp-2 wrap-break-words text-[10px] leading-4 text-slate-500 sm:mt-2 sm:text-xs sm:leading-5">
                          {item.details}
                        </p>

                        <div className="mt-3 flex items-center justify-between gap-1 border-t border-slate-100 pt-2.5 sm:pt-3">
                          <span className="text-[10px] font-bold text-amber-800 sm:text-xs">
                            Read more
                          </span>
                          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-amber-700 transition-transform duration-200 group-hover:translate-x-1" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
