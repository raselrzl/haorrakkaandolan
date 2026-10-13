"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

const updates = [
  {
    category: "LATEST UPDATE",
    title: "An Appeal to Protect Our Haors",
    date: "July 2026",
    href: "#updates",
  },
  {
    category: "LATEST UPDATE",
    title: "Twelve Demands for Haor Protection",
    date: "July 2026",
    href: "#updates",
  },
];

const news = [
  {
    category: "LATEST NEWS",
    title: "Protect Kawadighi and Hail Haor",
    date: "July 2026",
    href: "#news",
  },
  {
    category: "LATEST NEWS",
    title: "Sustainable Development for Haor Areas",
    date: "July 2026",
    href: "#news",
  },
];

function AnimatedChevron() {
  return (
    <span className="relative flex items-center" aria-hidden="true">
      <ChevronRight className="-mr-2 h-4 w-4 animate-chevron-one" />
      <ChevronRight className="h-4 w-4 animate-chevron-two" />
    </span>
  );
}

export default function HeroSection() {
  return (
    <section className="relative isolate mt-16 w-full overflow-hidden bg-white">
      {/* Full-width background image */}
      <div
        className="absolute inset-0 h-130 w-full bg-cover bg-center sm:h-140 lg:h-[55vh] lg:min-h-120 lg:max-h-162.5"
        style={{ backgroundImage: "url('/hm1.jpg')" }}
        aria-hidden="true"
      />

      {/* Readability overlay */}
      <div
        className="absolute inset-0 h-130 bg-linear-to-t from-black/80 via-black/50 to-black/0 "
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-130 max-w-7xl flex-col px-5 pb-8 pt-16 sm:min-h-140 sm:px-8 sm:pt-20 lg:min-h-[55vh] lg:max-h-162.5 lg:justify-center lg:px-10 lg:pb-20 lg:pt-12">
        {/* Main hero content */}
        <div className="max-w-2xl text-white">
          {/*         <span className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-semibold uppercase backdrop-blur-sm">
            হাওর রক্ষা আন্দোলন · মৌলভীবাজার
          </span> */}

          <h1 className="mt-6 font-heading text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Protect Our Haors.
            <span className="mt-1 block text-green-300">
              Protect Our Future.
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-white/90 sm:text-base sm:leading-8">
            Standing together to protect haors, rivers, wetlands, fisheries,
            agriculture and the natural heritage of Bangladesh.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="#updates"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-green-700 px-6 py-2 text-sm font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-green-800"
            >
              Latest Updates
              <AnimatedChevron />
            </Link>

            <Link
              href="/contact"
              className="group inline-flex items-center justify-center gap-3 rounded-full border border-white/70 bg-white/10 px-6 py-2 text-sm font-semibold text-white backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-green-900"
            >
              Get Involved
              <AnimatedChevron />
            </Link>
          </div>
        </div>

        {/* Updates panel: shifted farther right on desktop */}
        <div className="mt-10 w-full self-end lg:absolute lg:-bottom-4 lg:-right-12 lg:mt-0 lg:w-110">
          <div className="rounded-xl border border-green-200/90 sm:border-0 shadow shadow-green-100 bg-white p-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1">
              {/* Latest Updates */}
              <div id="updates">
                <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-green-800">
                  Latest Updates
                </h2>

                <div className="mt-3 divide-y divide-slate-100">
                  {updates.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="group flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0"
                    >
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold leading-6 text-slate-800 transition-colors group-hover:text-green-800">
                          {item.title}
                        </span>
                        <span className="mt-1 block text-xs text-slate-500">
                          {item.date}
                        </span>
                      </span>

                      <span className="mt-1 shrink-0 text-green-800 transition-transform duration-300 group-hover:translate-x-1">
                        <AnimatedChevron />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Latest News */}
              <div id="news">
                <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-green-800">
                  Latest News
                </h2>

                <div className="mt-3 divide-y divide-slate-100">
                  {news.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="group flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0"
                    >
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold leading-6 text-slate-800 transition-colors group-hover:text-green-800">
                          {item.title}
                        </span>
                        <span className="mt-1 block text-xs text-slate-500">
                          {item.date}
                        </span>
                      </span>

                      <span className="mt-1 shrink-0 text-green-800 transition-transform duration-300 group-hover:translate-x-1">
                        <AnimatedChevron />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
