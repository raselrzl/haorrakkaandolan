"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { HomepageNewsItem } from "./newsActions";

type HeroSectionProps = {
  updates?: HomepageNewsItem[];
  news?: HomepageNewsItem[];
};

function AnimatedChevron() {
  return (
    <span className="relative flex items-center" aria-hidden="true">
      <ChevronRight className="-mr-2 h-4 w-4 animate-chevron-one" />
      <ChevronRight className="h-4 w-4 animate-chevron-two" />
    </span>
  );
}

function formatDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function UpdateList({ items }: { items: HomepageNewsItem[] }) {
  if (items.length === 0) {
    return (
      <p className="py-2 text-sm text-slate-500">No items available yet.</p>
    );
  }

  return (
    <div className="mt-3 divide-y divide-slate-100">
      {items.map((item) => (
        <Link
          key={item.id}
          href={`/news/${item.id}`}
          className="group flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0"
        >
          <span className="min-w-0">
            <span className="block text-sm font-semibold leading-6 text-slate-800 transition-colors group-hover:text-green-800">
              {item.heading}
            </span>

            <span className="mt-1 block text-xs text-slate-500">
              {formatDate(item.createdAt)}
            </span>
          </span>

          <span className="mt-1 shrink-0 text-green-800 transition-transform duration-300 group-hover:translate-x-1">
            <AnimatedChevron />
          </span>
        </Link>
      ))}
    </div>
  );
}

export default function HeroSection({
  updates = [],
  news = [],
}: HeroSectionProps) {
  // Limit the panel to two records per category.
  const latestUpdates = updates.slice(0, 2);
  const latestNews = news.slice(0, 2); 

  return (
    <section className="relative isolate mt-16 w-full overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 h-130 w-full bg-cover bg-center sm:h-140 lg:h-[55vh] lg:min-h-120 lg:max-h-162.5"
        style={{ backgroundImage: "url('/hm1.jpg')" }}
        aria-hidden="true"
      />

      {/* Readability overlay */}
      <div
        className="absolute inset-0 h-full bg-linear-to-b from-black/80 via-black/50 to-black/0"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-130 max-w-7xl flex-col px-5 pb-8 pt-16 sm:min-h-140 sm:px-8 sm:pt-20 lg:min-h-[55vh] lg:max-h-162.5 lg:justify-center lg:px-10 lg:pb-20 lg:pt-12">
       {/* Main hero content */}
<div className="max-w-2xl text-white">
  <h1 className="mt-6 animate-[fadeInUp_0.8s_ease-out_both] text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
    Protect our haors.
    <span className="mt-1 block animate-[fadeInUp_0.8s_ease-out_0.25s_both] text-green-300">
      Protect our future.
    </span>
  </h1>

  <p className="mt-5 max-w-xl animate-[fadeInUp_0.8s_ease-out_0.4s_both] text-sm leading-7 text-white/90 sm:text-base sm:leading-8">
    Standing together to protect haors, rivers, wetlands, fisheries,
    agriculture and the natural heritage of Bangladesh.
  </p>

  <div className="mt-7 flex flex-wrap gap-3 animate-[fadeInUp_0.8s_ease-out_0.6s_both]">
    <Link
      href="/contact"
      className="group inline-flex items-center justify-center gap-3 rounded-full bg-green-700 px-6 py-2 text-sm font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-green-800"
    >
      Get Involved
      <AnimatedChevron />
    </Link>
  </div>
</div>

        {/* Updates panel: four items maximum */}
        <div className="mt-10 w-full self-end lg:absolute lg:-bottom-4 lg:-right-12 lg:mt-0 lg:w-110">
          <div className="rounded-xl border border-green-200/90 bg-white p-5 shadow shadow-green-100 sm:border-0 sm:p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1">
              {/* Latest Updates: two items maximum */}
              <div id="updates">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-green-800">
                    Latest Updates
                  </h2>

                  <span className="text-xs font-medium text-slate-400">
                    {latestUpdates.length} items
                  </span>
                </div>

                <UpdateList items={latestUpdates} />
              </div>

              {/* Latest News: two items maximum */}
              <div id="news">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-green-800">
                    Latest News
                  </h2>

                  <span className="text-xs font-medium text-slate-400">
                    {latestNews.length} items
                  </span>
                </div>

                <UpdateList items={latestNews} />
              </div>
            </div>

            {/* View all links */}
            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
              <Link
                href="/activities"
                className="text-xs font-semibold text-green-800 transition-colors hover:text-green-950"
              >
                All Activities
              </Link>

              <Link
                href="/activities"
                className="text-xs font-semibold text-green-800 transition-colors hover:text-green-950"
              >
                All News →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Chevron animations */}
      <style jsx>{`
        @keyframes chevron-one {
          0%,
          100% {
            opacity: 0.45;
            transform: translateX(-2px);
          }

          50% {
            opacity: 1;
            transform: translateX(2px);
          }
        }

        @keyframes chevron-two {
          0%,
          100% {
            opacity: 1;
            transform: translateX(0);
          }

          50% {
            opacity: 0.5;
            transform: translateX(3px);
          }
        }

        :global(.animate-chevron-one) {
          animation: chevron-one 1.1s ease-in-out infinite;
        }

        :global(.animate-chevron-two) {
          animation: chevron-two 1.1s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          :global(.animate-chevron-one),
          :global(.animate-chevron-two) {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
