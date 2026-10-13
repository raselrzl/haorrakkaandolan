"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Play,
  ShieldCheck,
  Waves,
} from "lucide-react";

export type RiverActivityItem = {
  id: string;
  title: string;
  description: string;
  image?: string | null;
  mediaType?: "IMAGE" | "VIDEO" | null;
  date: string | Date;
  category: string;
  href?: string | null;
};

type RiverSectionProps = {
  activities: RiverActivityItem[];
  fallbackImage?: string;
};

const riverSlides = [
  {
    name: "Surma River",
    image: "/monu1.jpg",
    alt: "Surma River",
  },
  {
    name: "Kushiyara River",
    image: "/monu2.jpg",
    alt: "Kushiyara River",
  },
  {
    name: "Meghna River",
    image: "/monu3.jpg",
    alt: "Meghna River",
  },
  {
    name: "Rivers of Bangladesh",
    image: "/monu4.jpg",
    alt: "Bangladesh river",
  },
  {
    name: "Protect Our Waterways",
    image: "/monu5.jpg",
    alt: "Natural waterways",
  },
];

function formatActivityDate(date: string | Date) {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

export default function RiverSection({
  activities,
  fallbackImage = "/monu1.jpg",
}: RiverSectionProps) {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % riverSlides.length);
    }, 4000);

    return () => window.clearInterval(interval);
  }, []);

  const slide = riverSlides[activeSlide];

  return (
    <section
      id="river"
      className="scroll-mt-20 border-y border-slate-200 bg-white py-8 sm:py-10"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
          {/* River image carousel */}
          <div className="relative min-h-87.5 overflow-hidden rounded-xl bg-emerald-950 sm:min-h-97.5 lg:min-h-107.5">
            {riverSlides.map((item, index) => (
              <div
                key={item.image}
                role="img"
                aria-label={item.alt}
                aria-hidden={activeSlide !== index}
                className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${
                  activeSlide === index ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  backgroundImage: `url("${item.image}")`,
                }}
              />
            ))}

            <div className="absolute inset-0 bg-linear-to-t from-emerald-950/95 via-emerald-950/25 to-black/10" />

            {/* Carousel indicators */}
            <div className="absolute left-4 top-4 z-10 flex gap-1.5">
              {riverSlides.map((item, index) => (
                <button
                  key={item.image}
                  type="button"
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Show ${item.name}`}
                  aria-pressed={activeSlide === index}
                  className={`h-1.5 rounded-full transition-all ${
                    activeSlide === index
                      ? "w-6 bg-emerald-400"
                      : "w-1.5 bg-white/80 hover:bg-white"
                  }`}
                />
              ))}
            </div>

            {/* Carousel content */}
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300">
                Rivers of Bangladesh
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {slide.name}
              </h2>

              <p className="mt-2 max-w-md text-sm leading-5 text-white/80">
                Protecting rivers, biodiversity, and the communities that depend
                on them.
              </p>

              <Link
                href="/river"
                className="mt-4 inline-flex items-center gap-2 rounded-md bg-emerald-400 px-4 py-2.5 text-xs font-bold text-emerald-950 transition hover:bg-emerald-300"
              >
                Explore Rivers
                <ArrowRight size={14} />
              </Link>

              <div className="mt-4 flex items-center gap-2.5 border-t border-white/20 pt-3">
                <ShieldCheck size={19} className="text-emerald-300" />

                <p className="text-xs font-medium text-white">
                  Protect Our Rivers
                  <span className="ml-2 font-normal text-white/60">
                    Water · Wildlife · Communities
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* River activity list */}
          <div className="flex min-w-0 flex-col">
            <div className="mb-2 flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-800">
                  News & Updates
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  River Activities
                  <span className="ml-2 text-sm font-medium text-slate-500">
                    নদী কার্যক্রম
                  </span>
                </h2>
              </div>

              <Waves size={22} className="shrink-0 text-emerald-800" />
            </div>

            {activities.length > 0 ? (
              <>
                <div className="divide-y divide-slate-100">
                  {activities.slice(0, 3).map((item) => {
                    const href = item.href || "/activities";

                    return (
                      <article key={item.id} className="group flex gap-3 py-3">
                        {/* Image or video thumbnail */}
                        <Link
                          href={href}
                          aria-label={`Read ${item.title}`}
                          className="relative h-21.5 w-25 shrink-0 overflow-hidden rounded-lg bg-slate-100 sm:h-23.5 sm:w-29"
                        >
                          {item.image && item.mediaType === "VIDEO" ? (
                            <span className="relative block h-full w-full">
                              <video
                                src={item.image}
                                preload="metadata"
                                muted
                                playsInline
                                className="h-full w-full object-cover"
                              />

                              <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-emerald-900">
                                  <Play size={14} fill="currentColor" />
                                </span>
                              </span>
                            </span>
                          ) : item.image ? (
                            <img
                              src={item.image}
                              alt={item.title}
                              loading="lazy"
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : fallbackImage ? (
                            <img
                              src={fallbackImage}
                              alt=""
                              loading="lazy"
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center bg-emerald-50">
                              <Waves size={26} className="text-emerald-800" />
                            </span>
                          )}
                        </Link>

                        {/* Activity details */}
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-slate-500">
                            <span className="font-semibold text-emerald-800">
                              {item.category}
                            </span>

                            {item.mediaType === "VIDEO" && item.image && (
                              <span className="inline-flex items-center gap-1 text-emerald-700">
                                <Play size={10} />
                                Video
                              </span>
                            )}

                            <span className="flex items-center gap-1">
                              <CalendarDays size={11} />
                              {formatActivityDate(item.date)}
                            </span>
                          </div>

                          <h3 className="mt-1 text-sm font-bold leading-5 text-slate-900 transition-colors group-hover:text-emerald-800">
                            <Link href={href}>{item.title}</Link>
                          </h3>

                          <p className="mt-1 line-clamp-2 text-xs leading-[1.15rem] text-slate-600">
                            {item.description}
                          </p>

                          <Link
                            href="/activities"
                            className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 transition hover:text-emerald-950"
                          >
                            Read more
                            <ChevronRight size={13} />
                          </Link>
                        </div>
                      </article>
                    );
                  })}
                </div>

                <Link
                  href="/activities"
                  className="mt-auto flex items-center justify-between border-t border-slate-200 pt-3 text-xs font-bold text-emerald-800 transition hover:text-emerald-950"
                >
                  All River Activities
                  <ArrowRight size={15} />
                </Link>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
                <Waves size={28} className="text-emerald-800" />

                <h3 className="mt-3 text-sm font-bold text-slate-900">
                  River Activities Coming Soon
                </h3>

                <p className="mt-1 text-xs text-slate-600">
                  নদী সংরক্ষণ কার্যক্রম শিগগিরই প্রকাশিত হবে।
                </p>

                <Link
                  href="/activities"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 transition hover:text-emerald-950"
                >
                  View All Activities
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
