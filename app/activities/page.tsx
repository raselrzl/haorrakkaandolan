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
  Leaf,
} from "lucide-react";
import { getPublicNewsPageAction, type PublicNewsFilter } from "../newsActions";
import Footer from "../Footer";
import LanguageSwitcher from "../LanguageSwitcher";

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
      <div className="flex h-full min-h-40 items-center justify-center bg-gradient-to-br from-amber-50 via-white to-slate-100">
        <Waves size={40} strokeWidth={1.3} className="text-amber-700" />
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
      {/* NEWS & ACTIVITIES HERO — ORIGINAL DESIGN UNCHANGED */}
      <section className="relative isolate h-[260px] w-full overflow-hidden bg-emerald-950 sm:h-[310px] lg:h-[350px]">
        <Image
          src="/monu.jpg"
          alt="Rivers and wetlands of Moulvibazar"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Dark overlays */}
        <div className="absolute inset-0 bg-emerald-950/65" />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/75 via-emerald-950/25 to-emerald-950/35" />

        {/* Top yellow accent */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[10px] bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300"
          aria-hidden="true"
        />

        {/* Hero content */}
        <div className="relative z-10 flex h-full items-center justify-center px-4 pt-2 text-center">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              News & Activities
            </h1>

            <div className="mx-auto mt-5 h-1 w-14 bg-gradient-to-r from-yellow-300 to-amber-400" />
          </div>
        </div>
      </section>

      {/* NAVIGATION */}
      <Navbar />

      {/* NEWS AND ACTIVITIES */}
      <section className="mx-auto w-full max-w-7xl px-3 py-8 sm:px-6 sm:py-10">
        {/* News Header, Search & Filters */}
        <div className="mb-5 border-b border-amber-200 pb-4">
          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            {/* FILTERS */}
            <div className="grid min-w-0 grid-cols-5 gap-1 sm:order-1 sm:flex sm:flex-1 sm:flex-wrap sm:gap-2">
              {filters.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => changeFilter(option.value)}
                  aria-pressed={filter === option.value}
                  className={`inline-flex h-9 w-full min-w-0 items-center justify-center whitespace-nowrap rounded-full border px-1.5 text-[10px] font-semibold transition sm:h-10 sm:w-auto sm:px-4 sm:text-xs ${
                    filter === option.value
                      ? "border-amber-500 bg-gradient-to-b from-amber-200 to-amber-400 text-amber-950 shadow-sm shadow-amber-900/10"
                      : "border-slate-200 bg-white text-slate-700 hover:border-amber-500 hover:text-amber-900"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* SEARCH */}
            <div className="w-full shrink-0 sm:order-2 sm:w-52 lg:w-64">
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search news and activities..."
                aria-label="Search news and activities"
                className="h-9 w-full rounded-full border border-slate-200 bg-white px-4 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 sm:h-10 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div
            aria-label="Loading news and activities"
            className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4"
          >
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse flex min-w-0 flex-col overflow-hidden rounded-xl border border-slate-100 bg-white shadow-md shadow-amber-100/70"
              >
                <div className="aspect-video bg-slate-200" />
                <div className="space-y-3 p-3 sm:p-4">
                  <div className="h-3 w-20 bg-slate-200" />
                  <div className="h-4 w-full bg-slate-200" />
                  <div className="h-4 w-2/3 bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div
            role="alert"
            className="border border-red-200 bg-red-50 p-5 text-sm text-red-700 shadow-sm shadow-red-900/5"
          >
            <p>{error}</p>

            <button
              type="button"
              onClick={() => goToPage(page)}
              className="mt-3 bg-amber-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-amber-800"
            >
              Try again
            </button>
          </div>
        )}

        {/* Cards */}
        {!loading && !error && items.length > 0 && (
          <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
            {items.map((item) => {
              const video = isVideo(item);

              return (
                <article
                  key={item.id}
                  className="group flex min-w-0 flex-col overflow-hidden rounded-md border border-slate-100 bg-white shadow-md shadow-amber-100/70 transition-all duration-300 hover:-translate-y-1 hover:border-amber-100 hover:shadow-xl hover:shadow-amber-100"
                >
                  {/* IMAGE / VIDEO */}
                  <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-slate-100">
                    <MediaPreview item={item} />

                    {/* IMAGE OVERLAY */}
                    {!video && (
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent" />
                    )}

                    {/* NEWS / ACTIVITY LABEL */}
                    {/*      <span className="pointer-events-none absolute left-2 top-2 inline-flex items-center gap-1.5 rounded-md bg-amber-950/85 px-2 py-1.5 text-[9px] font-bold uppercase tracking-wide text-amber-50 shadow-sm sm:left-3 sm:top-3 sm:px-2.5 sm:text-[10px]">
                      {item.type === "ACTIVITY" ? (
                        <Waves size={11} />
                      ) : (
                        <Newspaper size={11} />
                      )}
                      {item.type === "ACTIVITY" ? "Activity" : "News"}
                    </span> */}

                    {/* VIDEO LABEL */}
                    {video && (
                      <span className="pointer-events-none absolute bottom-2 right-2 inline-flex items-center gap-1.5 rounded-md bg-black/75 px-2 py-1.5 text-[9px] font-bold tracking-wider text-white sm:text-[10px]">
                        <Play size={11} fill="currentColor" />
                        VIDEO
                      </span>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="flex min-w-0 flex-1 flex-col p-3">
                    {/* CATEGORY AND DATE */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-medium text-slate-500 sm:gap-x-3 sm:text-[11px]">
                      {/*          <span className="font-bold uppercase tracking-wide text-amber-800">
                        {item.riverOrHaor === "HAOR" ? "Haor" : "River"}
                      </span> */}

                      <span className="inline-flex items-center gap-1">
                        <CalendarDays
                          size={11}
                          className="shrink-0 text-amber-700"
                        />
                        {formatDate(item.createdAt)}
                      </span>
                    </div>

                    {/* TITLE */}
                    <h3 className="mt-2 line-clamp-2 break-words text-sm font-bold leading-5 text-slate-900 transition-colors group-hover:text-amber-900 sm:text-base sm:leading-6">
                      {item.heading}
                    </h3>

                    {/* DESCRIPTION */}
                    <p className="mt-2 min-w-0 flex-1 whitespace-pre-line break-words text-xs leading-5 text-slate-600 line-clamp-2 sm:text-sm sm:leading-6">
                      {item.details}
                    </p>

                    {/* READ MORE */}
                    <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 sm:mt-4">
                      <button
                        type="button"
                        onClick={() => setSelectedItem(item)}
                        className="group/link inline-flex items-center gap-1 text-[11px] font-semibold text-slate-800 transition-colors hover:text-amber-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 sm:gap-1.5 sm:text-xs"
                      >
                        Read More
                        <ArrowUpRight
                          size={13}
                          className="text-amber-700 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                        />
                      </button>

                      <Leaf
                        size={14}
                        strokeWidth={1.6}
                        className="text-amber-600/70"
                      />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && items.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white px-5 py-12 text-center shadow-sm shadow-amber-100/50">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50">
              <Newspaper
                size={25}
                className="text-amber-800"
                strokeWidth={1.4}
              />
            </div>

            <h3 className="mt-4 text-base font-bold text-slate-900">
              No news or activities found
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Try another filter or search term.
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="mt-4 rounded-full bg-amber-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-amber-800"
            >
              Show all stories
            </button>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && (items.length > 0 || page > 1) && (
          <nav
            aria-label="News pagination"
            className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-amber-200 pt-5 sm:flex-row"
          >
            <p className="text-xs text-slate-500">
              Showing{" "}
              <span className="font-semibold text-amber-950">
                {items.length}
              </span>{" "}
              {items.length === 1 ? "story" : "stories"}
              <span className="mx-1.5 text-slate-300">·</span>
              Page <span className="font-bold text-amber-950">{page}</span>
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page === 1 || loading}
                onClick={() => goToPage(page - 1)}
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-amber-500 hover:text-amber-900 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={14} />
                Previous
              </button>

              <span
                aria-current="page"
                className="flex h-9 min-w-9 items-center justify-center rounded-full border border-amber-500 bg-gradient-to-b from-amber-200 to-amber-400 px-3 text-xs font-bold text-amber-950 shadow-sm shadow-amber-900/10"
              >
                {page}
              </span>

              <button
                type="button"
                disabled={!hasMore || loading}
                onClick={() => goToPage(page + 1)}
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-amber-500 hover:text-amber-900 disabled:cursor-not-allowed disabled:opacity-40"
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
          className="fixed inset-0 z-100 flex items-center justify-center overflow-y-auto bg-amber-950/80 p-3 backdrop-blur-sm sm:p-6"
          onClick={() => setSelectedItem(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="story-dialog-title"
            className="relative my-auto flex max-h-[80dvh] w-full rounded-lg max-w-xl flex-col overflow-hidden border border-amber-200/40 bg-white shadow-2xl shadow-amber-950/20"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-amber-200 bg-amber-50 px-4 py-1 sm:px-5">
              <div className="flex min-w-0 items-center gap-2">
                {selectedItem.type === "ACTIVITY" ? (
                  <Waves size={14} className="shrink-0 text-amber-700" />
                ) : (
                  <Newspaper size={14} className="shrink-0 text-amber-700" />
                )}

                <span className="truncate text-xs font-bold uppercase tracking-[0.15em] text-amber-950">
                  Details
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                aria-label="Close story details"
                className="flex h-9 w-9 shrink-0 items-center justify-center text-red-700 transition hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                <X size={16} />
              </button>
            </div>

            <div className="min-h-0 overflow-y-auto">
              <div className="relative aspect-video w-full overflow-hidden bg-black">
                <MediaPreview item={selectedItem} />

                {!selectedItem.mediaUrl && (
                  <div className="pointer-events-none absolute bottom-3 left-3 bg-black/50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                    Haor Rokkha Andolan
                  </div>
                )}
              </div>

              <div className="p-4 sm:p-6">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 border border-amber-500 bg-gradient-to-b from-amber-200 to-amber-400 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-950">
                    {selectedItem.type === "ACTIVITY" ? (
                      <Waves size={12} />
                    ) : (
                      <Newspaper size={12} />
                    )}
                    {selectedItem.type === "ACTIVITY" ? "Activity" : "News"}
                  </span>

                  <span className="inline-flex items-center gap-1.5 border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-900">
                    <MapPin size={12} />
                    {selectedItem.riverOrHaor === "HAOR" ? "Haor" : "River"}
                  </span>

                  {isVideo(selectedItem) && (
                    <span className="inline-flex items-center gap-1.5 border border-slate-200 bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-700">
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
                  className="text-lg font-bold leading-snug tracking-tight text-amber-950 sm:text-2xl"
                >
                  {selectedItem.heading}
                </h2>

                <div className="my-4 h-1 w-12 bg-gradient-to-r from-amber-400 to-yellow-500" />

                <div className="whitespace-pre-wrap wrap-break-words text-justify text-sm leading-7 text-slate-700 sm:text-base sm:leading-8">
                  {selectedItem.details}
                </div>

                <div className="mt-6 flex justify-center border-slate-200 pt-4 text-center">
                  <p className="text-center text-[8px] font-bold uppercase tracking-[0.18em] text-amber-800">
                    হাওর রক্ষা আন্দোলন · Moulvibazar
                  </p>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 justify-end border-t border-amber-200 bg-amber-50 px-4 py-1">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="bg-amber-900 px-3 py-1.5 rounded-2xl text-xs font-bold text-white transition hover:bg-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2"
              >
                Close
              </button>
            </div>
          </section>
        </div>
      )}

      <Footer />

      {/* Language Switcher */}
      <div className="fixed right-4 top-1/2 z-[9999] -translate-y-1/2">
        <LanguageSwitcher />
      </div>
    </main>
  );
}
