"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../Navbar";
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";

const categories = ["All", "Environment", "Events", "Community", "Updates"];

const news = [
  {
    id: 1,
    title: "An Appeal to Protect Our Haors",
    date: "July 10, 2026",
    category: "Environment",
    image: "/img/monu1.jpg",
    href: "#",
  },
  {
    id: 2,
    title: "River Cleanup and Environmental Protection",
    date: "June 18, 2026",
    category: "Community",
    image: "/img/monu2.jpg",
    href: "#",
  },
  {
    id: 3,
    title: "Protecting Our Natural Wetlands",
    date: "May 25, 2026",
    category: "Environment",
    image: "/img/monu3.jpg",
    href: "#",
  },
  {
    id: 4,
    title: "Community Awareness for Haor Conservation",
    date: "April 22, 2026",
    category: "Events",
    image: "/img/monu2.jpg",
    href: "#",
  },
  {
    id: 5,
    title: "Working Together for a Greener Region",
    date: "March 15, 2026",
    category: "Community",
    image: "/img/monu1.jpg",
    href: "#",
  },
  {
    id: 6,
    title: "Our Commitment to a Sustainable Future",
    date: "February 28, 2026",
    category: "Updates",
    image: "/img/monu3.jpg",
    href: "#",
  },
  {
    id: 7,
    title: "The Beauty of Our Haors",
    date: "January 20, 2026",
    category: "Environment",
    image: "/img/monu1.jpg",
    href: "#",
  },
  {
    id: 8,
    title: "Haor Rokkha Andolan: Community Initiatives",
    date: "December 12, 2025",
    category: "Events",
    image: "/img/monu2.jpg",
    href: "#",
  },
  {
    id: 9,
    title: "Preserving Nature for Future Generations",
    date: "November 5, 2025",
    category: "Updates",
    image: "/img/monu3.jpg",
    href: "#",
  },
];

const PAGE_SIZE = 9;

export default function NewsPage() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [searchOpen, setSearchOpen] = useState(false);

  const filteredNews = useMemo(() => {
    const query = search.trim().toLowerCase();

    return news.filter((item) => {
      const matchesCategory = category === "All" || item.category === category;

      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  const totalPages = Math.max(1, Math.ceil(filteredNews.length / PAGE_SIZE));

  const visibleNews = filteredNews.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  function changeCategory(value: string) {
    setCategory(value);
    setPage(1);
  }

  function changeSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  return (
    <main className="min-h-screen bg-[#f5f8f4] text-slate-900">
      <Navbar />

      {/* Hero */}
      <section className="relative isolate flex min-h-[245px] mt-16 items-center overflow-hidden bg-emerald-950 sm:min-h-[290px]">
        <Image
          src="/img/monu1.jpg"
          alt="Haor landscape in Bangladesh"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#032f24]/95 via-[#063d2d]/80 to-[#063d2d]/25" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-300 sm:text-xs">
            Haor Rokkha Andolan · Moulvibazar
          </p>

          <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
            News &amp; Updates
          </h1>

          <p className="mt-4 max-w-lg text-sm leading-6 text-emerald-50/90 sm:text-base">
            Latest news, announcements, and activities from Haor Rokkha Andolan.
          </p>

          <div className="mt-5 h-1 w-12 rounded-full bg-emerald-400" />
        </div>
      </section>

      {/* News */}
      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700">
              Latest News
            </p>

            <h2 className="text-2xl font-bold tracking-tight text-emerald-950 sm:text-3xl">
              News &amp; Activities
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Follow our work to protect the haor region.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative w-full sm:w-56">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => changeSearch(event.target.value)}
                placeholder="Search news..."
                aria-label="Search news"
                className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-9 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => changeSearch("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-800"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Category filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => changeCategory(item)}
                  aria-pressed={category === item}
                  className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
                    category === item
                      ? "border-emerald-800 bg-emerald-800 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-emerald-700 hover:text-emerald-800"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4 flex items-center justify-between border-b border-emerald-900/10 pb-3">
          <p className="text-xs text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-800">
              {filteredNews.length}
            </span>{" "}
            {filteredNews.length === 1 ? "story" : "stories"}
          </p>

          <span className="text-xs font-medium text-emerald-800">
            Haor Rokkha Andolan
          </span>
        </div>

        {/* Cards */}
        {visibleNews.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {visibleNews.map((item) => (
              <article
                key={item.id}
                className="group min-w-0 overflow-hidden rounded-xl border border-emerald-950/10 bg-white transition duration-200 hover:-translate-y-0.5 hover:border-emerald-800/30 hover:shadow-lg hover:shadow-emerald-950/5"
              >
                <Link
                  href={item.href}
                  aria-label={`Read ${item.title}`}
                  className="block"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-emerald-50">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.04]"
                    />

                    <span className="absolute bottom-3 left-3 rounded-full bg-emerald-800 px-3 py-1 text-[10px] font-semibold text-white shadow-sm">
                      {item.category}
                    </span>
                  </div>

                  <div className="p-4 sm:p-5">
                    <p className="flex items-center gap-2 text-xs text-slate-500">
                      <CalendarDays
                        size={14}
                        className="shrink-0 text-emerald-700"
                      />
                      {item.date}
                    </p>

                    <h3 className="mt-3 line-clamp-2 min-h-[3rem] text-base font-bold leading-6 text-emerald-950 transition group-hover:text-emerald-700 sm:text-lg">
                      {item.title}
                    </h3>

                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                      <span className="text-xs font-semibold text-emerald-800">
                        Read News
                      </span>

                      <ArrowRight
                        size={16}
                        className="text-emerald-800 transition-transform group-hover:translate-x-1"
                      />
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">
            <Search size={28} className="mx-auto mb-3 text-slate-300" />

            <h3 className="font-semibold text-slate-800">No news found</h3>

            <p className="mt-1 text-sm text-slate-500">
              Try another search term or category.
            </p>

            <button
              type="button"
              onClick={() => {
                changeSearch("");
                changeCategory("All");
              }}
              className="mt-4 rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-900"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {filteredNews.length > PAGE_SIZE && (
          <nav
            aria-label="News pagination"
            className="mt-8 flex items-center justify-center gap-2"
          >
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((current) => current - 1)}
              aria-label="Previous page"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-emerald-700 hover:text-emerald-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={17} />
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (number) => (
                <button
                  key={number}
                  type="button"
                  onClick={() => setPage(number)}
                  aria-current={page === number ? "page" : undefined}
                  className={`h-9 min-w-9 rounded-lg px-3 text-sm font-semibold transition ${
                    page === number
                      ? "bg-emerald-800 text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-emerald-700 hover:text-emerald-800"
                  }`}
                >
                  {number}
                </button>
              ),
            )}

            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => setPage((current) => current + 1)}
              aria-label="Next page"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-emerald-700 hover:text-emerald-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={17} />
            </button>
          </nav>
        )}
      </section>

      {/* Footer strip */}
      <footer className="border-t border-emerald-900/10 bg-[#eaf2e9]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
          <p className="text-sm font-bold text-emerald-950">
            Haor Rokkha Andolan
          </p>

          <p className="text-xs font-medium tracking-wide text-emerald-800">
            Healthy Haors · Green Future
          </p>
        </div>
      </footer>
    </main>
  );
}
