"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Navbar from "../Navbar";
import {
  CalendarDays,
  ArrowUpRight,
  Play,
  Newspaper,
  Waves,
  X,
  MapPin,
} from "lucide-react";
import { getPublicNewsAction } from "../newsActions";

type NewsItem = Awaited<ReturnType<typeof getPublicNewsAction>>[number];
type FilterType = "ALL" | "NEWS" | "ACTIVITY" | "RIVER" | "HAOR";

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function isVideo(item: NewsItem) {
  if (item.mediaType === "VIDEO") return true;

  const url = item.mediaUrl?.toLowerCase() ?? "";

  return (
    /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/.test(url) ||
    /youtube\.com|youtu\.be|vimeo\.com/.test(url)
  );
}

function getVideoEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      return `https://www.youtube-nocookie.com/embed/${parsed.pathname.slice(1)}`;
    }

    if (parsed.hostname.includes("youtube.com")) {
      const videoId = parsed.searchParams.get("v");

      if (videoId) {
        return `https://www.youtube-nocookie.com/embed/${videoId}`;
      }

      if (parsed.pathname.startsWith("/embed/")) {
        return url;
      }
    }

    if (parsed.hostname.includes("vimeo.com")) {
      const videoId = parsed.pathname.split("/").filter(Boolean).pop();

      if (videoId && /^\d+$/.test(videoId)) {
        return `https://player.vimeo.com/video/${videoId}`;
      }
    }
  } catch {
    return url;
  }

  return url;
}

function MediaPreview({ item }: { item: NewsItem }) {
  const url = item.mediaUrl;

  if (!url) {
    return (
      <div className="flex h-full min-h-40 items-center justify-center bg-emerald-950 text-emerald-300">
        <Waves size={40} strokeWidth={1.4} />
      </div>
    );
  }

  if (isVideo(item)) {
    const isEmbedded = /youtube\.com|youtu\.be|vimeo\.com/i.test(url);

    if (isEmbedded) {
      return (
        <iframe
          src={getVideoEmbedUrl(url)}
          title={item.heading}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      );
    }

    return (
      <video
        className="absolute inset-0 h-full w-full bg-black object-contain"
        controls
        preload="metadata"
        playsInline
        aria-label={item.heading}
      >
        <source src={url} />
        Your browser does not support this video.
      </video>
    );
  }

  return (
    <Image
      src={url}
      alt={item.heading}
      fill
      sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 25vw"
      className="object-cover transition-transform duration-500 group-hover:scale-105"
    />
  );
}

export default function ActivitiesPage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [filter, setFilter] = useState<FilterType>("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedItem, setSelectedItem] = useState<NewsItem | null>(null);

  useEffect(() => {
    let active = true;

    async function loadNews() {
      try {
        setLoading(true);
        setError("");

        const result = await getPublicNewsAction();

        if (active) {
          setItems(result);
        }
      } catch (err) {
        console.error("Failed to load news and activities:", err);

        if (active) {
          setError(
            "News and activities could not be loaded. Please try again later.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadNews();

    return () => {
      active = false;
    };
  }, []);

  // Close the details popup with Escape and prevent background scrolling.
  useEffect(() => {
    if (!selectedItem) return;

    const previousOverflow = document.body.style.overflow;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedItem(null);
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedItem]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesSearch =
        !query ||
        item.heading.toLowerCase().includes(query) ||
        item.details.toLowerCase().includes(query);

      const matchesFilter =
        filter === "ALL" ||
        (filter === "NEWS" && item.type === "NEWS") ||
        (filter === "ACTIVITY" && item.type === "ACTIVITY") ||
        (filter === "RIVER" && item.riverOrHaor === "RIVER") ||
        (filter === "HAOR" && item.riverOrHaor === "HAOR");

      return matchesSearch && matchesFilter;
    });
  }, [items, filter, search]);

  const filters: { label: string; value: FilterType }[] = [
    { label: "All", value: "ALL" },
    { label: "News", value: "NEWS" },
    { label: "Activities", value: "ACTIVITY" },
    { label: "Rivers", value: "RIVER" },
    { label: "Haors", value: "HAOR" },
  ];

  return (
    <main className="min-h-screen bg-[#f7f9f6]">
      <Navbar />

      {/* Hero */}
      <section className="relative isolate flex min-h-57.5 items-center justify-center overflow-hidden bg-emerald-950 sm:min-h-70">
        <Image
          src="/img/monu1.jpg"
          alt="Haor landscape"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-linear-to-r from-emerald-950/95 via-emerald-950/80 to-emerald-950/60" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-300 sm:text-xs">
            Haor Rokkha Andolan · Moulvibazar
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            News &amp; Activities
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-emerald-50/85 sm:text-base">
            News, campaigns, and activities to protect our rivers, haors, and
            natural environment.
          </p>

          <div className="mx-auto mt-5 h-1 w-14 rounded-full bg-emerald-400" />
        </div>
      </section>

      {/* News and activities */}
      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-5 flex flex-col gap-3 border-b border-emerald-900/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700">
              Updates &amp; Stories
            </p>

            <h2 className="text-xl font-bold tracking-tight text-emerald-950 sm:text-2xl">
              Latest News &amp; Activities
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Reports and media published by Haor Rokkha Andolan.
            </p>
          </div>

          <span className="text-xs font-semibold text-slate-500">
            {loading ? "Loading..." : `${filteredItems.length} stories`}
          </span>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search news and activities..."
            aria-label="Search news and activities"
            className="w-full rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10 sm:max-w-sm"
          />
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
          {filters.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFilter(option.value)}
              className={`shrink-0 rounded-md px-4 py-2 text-xs font-semibold transition ${
                filter === option.value
                  ? "bg-emerald-900 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-emerald-700 hover:text-emerald-800"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-lg border border-slate-200 bg-white"
              >
                <div className="aspect-4/3 bg-slate-200" />
                <div className="space-y-3 p-3 sm:p-4">
                  <div className="h-3 w-20 rounded bg-slate-200" />
                  <div className="h-4 w-full rounded bg-slate-200" />
                  <div className="h-4 w-2/3 rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Cards */}
        {!loading && !error && filteredItems.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
            {filteredItems.map((item) => {
              const video = isVideo(item);

              return (
                <article
                  key={item.id}
                  className="group overflow-hidden rounded-lg border border-slate-200/80 bg-white transition duration-300 hover:-translate-y-1 hover:border-emerald-700/30 hover:shadow-lg hover:shadow-emerald-950/5"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-slate-950">
                    <MediaPreview item={item} />

                    <div className="pointer-events-none absolute left-2 top-2 z-10 flex items-center gap-1.5 rounded-sm bg-emerald-950/90 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-white sm:text-[10px]">
                      {item.type === "ACTIVITY" ? (
                        <Waves size={12} />
                      ) : (
                        <Newspaper size={12} />
                      )}
                      {item.type === "ACTIVITY" ? "Activity" : "News"}
                    </div>

                    {video && (
                      <div className="pointer-events-none absolute bottom-2 right-2 z-10 flex items-center gap-1 rounded-sm bg-black/75 px-2 py-1 text-[10px] font-semibold text-white">
                        <Play size={11} fill="currentColor" />
                        Video
                      </div>
                    )}
                  </div>

                  <div className="p-3 sm:p-4">
                    <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-semibold text-emerald-800 sm:text-xs">
                      <span>
                        {item.riverOrHaor === "HAOR" ? "Haor" : "River"}
                      </span>

                      <span className="text-slate-300">•</span>

                      <span className="inline-flex items-center gap-1 text-slate-500">
                        <CalendarDays size={11} />
                        {formatDate(item.createdAt)}
                      </span>
                    </div>

                    <h3 className="line-clamp-2 text-sm font-bold leading-snug text-slate-900 transition-colors group-hover:text-emerald-800 sm:text-base">
                      {item.heading}
                    </h3>

                    <p className="mt-2 line-clamp-3 whitespace-pre-line text-xs leading-5 text-slate-600 sm:text-sm">
                      {item.details}
                    </p>

                    <button
                      type="button"
                      onClick={() => setSelectedItem(item)}
                      className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-emerald-800 transition hover:text-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                    >
                      Read full story <ArrowUpRight size={14} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredItems.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
            <Newspaper
              size={32}
              className="mx-auto mb-3 text-emerald-800"
              strokeWidth={1.5}
            />

            <h3 className="text-base font-bold text-slate-800">
              No news or activities found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try another filter or search term.
            </p>

            <button
              type="button"
              onClick={() => {
                setFilter("ALL");
                setSearch("");
              }}
              className="mt-4 rounded-md bg-emerald-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-800"
            >
              Show all stories
            </button>
          </div>
        )}
      </section>

      {/* Full story popup */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center overflow-y-auto bg-emerald-950/80 p-3 backdrop-blur-sm sm:p-6"
          onClick={() => setSelectedItem(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="story-dialog-title"
            className="relative my-auto flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-white/20 bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Popup header */}
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-emerald-950 px-4 py-3 text-white sm:px-5">
              <div className="flex min-w-0 items-center gap-2">
                {selectedItem.type === "ACTIVITY" ? (
                  <Waves size={18} className="shrink-0 text-emerald-300" />
                ) : (
                  <Newspaper size={18} className="shrink-0 text-emerald-300" />
                )}

                <span className="truncate text-xs font-bold uppercase tracking-[0.15em] text-emerald-100">
                  {selectedItem.type === "ACTIVITY"
                    ? "Activity Details"
                    : "News Details"}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                aria-label="Close story details"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable popup content */}
            <div className="min-h-0 overflow-y-auto">
              {/* Full-size media */}
              <div className="relative aspect-video w-full overflow-hidden bg-black">
                <MediaPreview item={selectedItem} />

                {!selectedItem.mediaUrl && (
                  <div className="pointer-events-none absolute bottom-3 left-3 rounded-sm bg-black/50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                    Haor Rokkha Andolan
                  </div>
                )}
              </div>

              <div className="p-4 sm:p-6">
                {/* Category and date */}
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-sm bg-emerald-900 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                    {selectedItem.type === "ACTIVITY" ? (
                      <Waves size={12} />
                    ) : (
                      <Newspaper size={12} />
                    )}
                    {selectedItem.type === "ACTIVITY" ? "Activity" : "News"}
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-sm bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-900">
                    <MapPin size={12} />
                    {selectedItem.riverOrHaor === "HAOR" ? "Haor" : "River"}
                  </span>

                  {isVideo(selectedItem) && (
                    <span className="inline-flex items-center gap-1.5 rounded-sm bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-700">
                      <Play size={11} />
                      Video
                    </span>
                  )}

                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                    <CalendarDays size={14} />
                    {formatDate(selectedItem.createdAt)}
                  </span>
                </div>

                {/* Full heading */}
                <h2
                  id="story-dialog-title"
                  className="text-xl font-bold leading-snug tracking-tight text-emerald-950 sm:text-2xl md:text-3xl"
                >
                  {selectedItem.heading}
                </h2>

                <div className="my-4 h-1 w-12 rounded-full bg-emerald-600" />

                {/* Full details */}
                <div className="whitespace-pre-wrap wrap-break-words text-sm leading-7 text-slate-700 sm:text-base sm:leading-8">
                  {selectedItem.details}
                </div>

                <div className="mt-6 border-t border-slate-200 pt-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-800">
                    Haor Rokkha Andolan · Moulvibazar
                  </p>
                </div>
              </div>
            </div>

            {/* Popup footer */}
            <div className="flex shrink-0 justify-end border-t border-slate-200 bg-slate-50 px-4 py-3 sm:px-6">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="rounded-md bg-emerald-900 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
              >
                Close
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
