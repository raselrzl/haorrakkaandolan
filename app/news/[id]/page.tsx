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

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white text-slate-900">
        {/* White page header */}
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
            {/* Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              className="mb-7 flex flex-wrap items-center gap-2 text-xs text-slate-500 sm:text-sm"
            >
              <Link
                href="/"
                className="transition-colors hover:text-emerald-800"
              >
                Home
              </Link>

              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />

              <Link
                href="/activities"
                className="transition-colors hover:text-emerald-800"
              >
                Activities
              </Link>

              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />

              <span className="font-medium text-slate-800">Details</span>
            </nav>

            <div className="max-w-4xl">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
                  <Newspaper className="h-3.5 w-3.5" />
                  {newsType}
                </span>

                <span className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">
                  {coverage}
                </span>
              </div>

              <h1 className="break-words text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-2xl">
                {title}
              </h1>

              <div className=" flex items-center gap-2 text-sm text-slate-500">
                <CalendarDays className="h-4 w-4 shrink-0 text-emerald-700" />

                <time dateTime={news.createdAt.toISOString()}>
                  {formatDate(news.createdAt)}
                </time>
              </div>
            </div>
          </div>
        </section>

        {/* Activity content */}
        <section className="mx-auto max-w-7xl bg-white px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-12">
            <article className="min-w-0">
              {/* Full-width image or video */}
              {mediaUrl && (
                <div className="mb-8 overflow-hidden rounded-xl border border-slate-200 bg-black">
                  <div className="relative aspect-video w-full">
                    {video ? (
                      <>
                        <video
                          src={mediaUrl}
                          controls
                          playsInline
                          preload="metadata"
                          aria-label={title}
                          className="absolute inset-0 h-full w-full object-cover"
                        >
                          Your browser does not support video playback.
                        </video>

                        <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2 rounded-md bg-black/60 px-3 py-1.5 text-xs font-medium text-white">
                          <Play className="h-3.5 w-3.5" />
                          Video
                        </div>
                      </>
                    ) : (
                      <Image
                        src={mediaUrl}
                        alt={title}
                        fill
                        unoptimized
                        priority
                        sizes="(max-width: 1024px) 100vw, 900px"
                        className="object-cover"
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Activity details heading */}
              <div className="mb-6 flex items-center gap-3 border-b border-slate-200 pb-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800">
                  <FileText className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-base font-bold text-slate-950">
                    Activity details
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Published by Haor Rokkha Andolan
                  </p>
                </div>
              </div>

              {/* Activity description */}
              <div className="whitespace-pre-wrap break-words text-[15px] leading-8 text-slate-700 sm:text-base sm:leading-9">
                {details || "No activity details are available."}
              </div>

              {/* Back to activities */}
              <div className="mt-10 border-t border-slate-200 pt-6">
                <Link
                  href="/activities"
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-800 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to activities
                </Link>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="space-y-5">
              <section className="rounded-xl border border-slate-200 bg-white p-5">
                <h2 className="text-base font-bold text-slate-950">
                  About this activity
                </h2>

                <div className="mt-4 flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800">
                    <Droplets className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">
                      Haor Rokkha Andolan
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Activities and updates supporting the protection of haors,
                      rivers, wetlands and biodiversity.
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-4 border-t border-slate-100 pt-4">
                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      Activity type
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {newsType}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      Coverage
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {coverage}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      Publication date
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {formatDate(news.createdAt)}
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-xl border border-emerald-100 bg-white p-5">
                <h2 className="text-base font-bold text-slate-950">
                  Protect our wetlands
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Follow our activities and initiatives to conserve haors,
                  rivers and biodiversity.
                </p>

                <Link
                  href="/activities"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 transition-colors hover:text-emerald-950"
                >
                  Explore activities
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </section>
            </aside>
          </div>
        </section>
      </main>
    </>
  );
}
