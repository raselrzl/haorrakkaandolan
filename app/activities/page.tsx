"use client";

import { useEffect, useState } from "react";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getPublicNewsPageAction, type PublicNewsFilter } from "../newsActions";

type NewsItem = Awaited<
  ReturnType<typeof getPublicNewsPageAction>
>["items"][number];

type FilterType = PublicNewsFilter;

const PAGE_SIZE = 20;

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
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedItem, setSelectedItem] = useState<NewsItem | null>(null);

  // Debounce search to avoid database requests on every keystroke.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [search]);

  // Load only the requested page from the database.
  useEffect(() => {
    let active = true;

    async function loadNews() {
      setLoading(true);
      setError("");

      try {
        const result = await getPublicNewsPageAction({
          page,
          filter,
          search: debouncedSearch,
        });

        if (!active) return;

        setItems(result.items);
        setHasMore(result.hasMore);
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
  }, [page, filter, debouncedSearch]);

  // Close the popup with Escape and prevent background scrolling.
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

  const filters: { label: string; value: FilterType }[] = [
    { label: "All", value: "ALL" },
    { label: "News", value: "NEWS" },
    { label: "Activities", value: "ACTIVITY" },
    { label: "Rivers", value: "RIVER" },
    { label: "Haors", value: "HAOR" },
  ];

  function changeFilter(value: FilterType) {
    setFilter(value);
    setPage(1);
  }

  function resetFilters() {
    setFilter("ALL");
    setSearch("");
    setDebouncedSearch("");
    setPage(1);
  }

  function goToPage(nextPage: number) {
    setPage(Math.max(1, nextPage));
    setSelectedItem(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="min-h-screen bg-[#f7f9f6]">
      <Navbar />

      {/* News and activities */}
      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 mt-16">
        {/* News Header, Search & Filters */}
        <div className="mb-5 border-b border-emerald-900/10 pb-4">
          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            {/* Horizontally Scrollable Filters — Left */}
            <div className="grid min-w-0 grid-cols-5 gap-1.5 sm:flex sm:flex-1 sm:order-1 sm:gap-1.5 sm:overflow-x-auto sm:pb-1">
              {filters.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => changeFilter(option.value)}
                  aria-pressed={filter === option.value}
                  className={`h-9 w-full min-w-0 whitespace-nowrap rounded-md px-1 text-[10px] font-semibold transition sm:h-10 sm:w-auto sm:shrink-0 sm:px-3 sm:text-xs ${
                    filter === option.value
                      ? "bg-emerald-900 text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-emerald-700 hover:text-emerald-800"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* Search — Right */}
            <div className="w-full shrink-0 sm:order-2 sm:w-52 lg:w-64">
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search news and activities..."
                aria-label="Search news and activities"
                className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10 sm:h-10 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div
            aria-label="Loading news and activities"
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4"
          >
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
          <div
            role="alert"
            className="rounded-md border border-red-200 bg-red-50 p-5 text-sm text-red-700"
          >
            <p>{error}</p>

            <button
              type="button"
              onClick={() => goToPage(page)}
              className="mt-3 rounded-md bg-emerald-900 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800"
            >
              Try again
            </button>
          </div>
        )}

        {/* Cards */}
        {!loading && !error && items.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
            {items.map((item) => {
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
        {!loading && !error && items.length === 0 && (
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
              onClick={resetFilters}
              className="mt-4 rounded-md bg-emerald-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-800"
            >
              Show all stories
            </button>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && (items.length > 0 || page > 1) && (
          <nav
            aria-label="News pagination"
            className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-emerald-900/10 pt-5 sm:flex-row"
          >
            <p className="text-xs text-slate-500">
              Showing{" "}
              <span className="font-semibold text-emerald-950">
                {items.length}
              </span>{" "}
              {items.length === 1 ? "story" : "stories"} on this page
              <span className="mx-1.5 text-slate-300">·</span>
              Page <span className="font-bold text-emerald-950">{page}</span>
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page === 1 || loading}
                onClick={() => goToPage(page - 1)}
                className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-emerald-700 hover:text-emerald-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={14} />
                Previous
              </button>

              <span
                aria-current="page"
                className="flex h-9 min-w-9 items-center justify-center rounded-md bg-emerald-900 px-3 text-xs font-bold text-white"
              >
                {page}
              </span>

              <button
                type="button"
                disabled={!hasMore || loading}
                onClick={() => goToPage(page + 1)}
                className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-emerald-700 hover:text-emerald-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={14} />
              </button>
            </div>
          </nav>
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
            className="relative my-auto flex max-h-[80dvh] w-full max-w-xl flex-col overflow-hidden rounded-lg border border-white/20 bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-1 text-green-900 sm:px-5">
              <div className="flex min-w-0 items-center gap-2">
                {selectedItem.type === "ACTIVITY" ? (
                  <Waves size={14} className="shrink-0 text-emerald-300" />
                ) : (
                  <Newspaper size={14} className="shrink-0 text-emerald-300" />
                )}

                <span className="truncate text-xs font-bold uppercase tracking-[0.15em] text-green-900">
                  {selectedItem.type === "ACTIVITY" ? "Details" : "Details"}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                aria-label="Close story details"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-red-700 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
              >
                <X size={16} />
              </button>
            </div>

            <div className="min-h-0 overflow-y-auto">
              <div className="relative aspect-video w-full overflow-hidden bg-black">
                <MediaPreview item={selectedItem} />

                {!selectedItem.mediaUrl && (
                  <div className="pointer-events-none absolute bottom-3 left-3 rounded-sm bg-black/50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                    Haor Rokkha Andolan
                  </div>
                )}
              </div>

              <div className="p-4 sm:p-6">
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

                <h2
                  id="story-dialog-title"
                  className="text-xl font-bold leading-snug tracking-tight text-emerald-950 sm:text-2xl md:text-3xl"
                >
                  {selectedItem.heading}
                </h2>

                <div className="my-4 h-1 w-12 rounded-full bg-emerald-600" />

                <div className="whitespace-pre-wrap wrap-break-words text-sm leading-7 text-slate-700 sm:text-base sm:leading-8 text-justify">
                  {selectedItem.details}
                </div>

                <div className="mt-6 border-slate-200 pt-4 flex justify-center text-center">
                  <p className="text-center text-[8px] font-bold uppercase tracking-[0.18em] text-emerald-800">
                    হাওর রক্ষা আন্দোলন · Moulvibazar
                  </p>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 justify-end border-t border-slate-200 bg-slate-50 px-4 py-2">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="rounded-md bg-emerald-900 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
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
