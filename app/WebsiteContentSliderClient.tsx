"use client";

import { CalendarDays } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type WebsiteContentItem = {
  id: string;
  imageUrl: string | null;
  heading: string;
  text: string;
  createdAt: string;
};

export default function WebsiteContentSliderClient({
  contents,
}: {
  contents: WebsiteContentItem[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateCurrent = () => {
      const cards = container.querySelectorAll<HTMLElement>(
        "[data-content-card]",
      );

      if (!cards.length) return;

      const containerLeft = container.getBoundingClientRect().left;

      let closestIndex = 0;
      let closestDistance = Infinity;

      cards.forEach((card, index) => {
        const distance = Math.abs(
          card.getBoundingClientRect().left - containerLeft,
        );

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setCurrent(closestIndex + 1);
    };

    container.addEventListener("scroll", updateCurrent, {
      passive: true,
    });

    return () => {
      container.removeEventListener("scroll", updateCurrent);
    };
  }, []);

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));

  return (
    <section className="w-full max-w-7xl mx-auto bg-white px-3 py-8 sm:px-5 lg:px-8">
      <div className="mb-5 flex items-center justify-between">
        <div>
     {/*      <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
            Important Information
          </span>

          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Website Updates
          </h2> */}
        </div>

        <span className="text-sm font-semibold tabular-nums text-slate-500">
          {current} / {contents.length}
        </span>
      </div>

      <div
        ref={containerRef}
        className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3"
      >
        {contents.map((item) => (
          <article
            key={item.id}
            data-content-card
            className="group relative h-[360px] min-w-[260px] max-w-[260px] snap-start overflow-hidden rounded-sm bg-slate-800 shadow-lg sm:min-w-[280px] sm:max-w-[280px]"
          >
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.heading}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      {/*       <div className="absolute left-3 top-3 rounded-full bg-amber-600 px-3 py-1 text-xs font-semibold text-white">
              Important Update
            </div> */}

            <div className="absolute inset-x-0 bottom-0 p-4 text-white">
           {/*    <h3 className="mb-2 line-clamp-3 text-base font-bold leading-snug">
                {item.heading}
              </h3> */}
{/* 
              <p className="mb-3 line-clamp-3 text-sm leading-relaxed text-white/85">
                {item.text}
              </p> */}

              <div className="flex items-center gap-1.5 text-xs text-white/75">
                <CalendarDays size={13} />
                {formatDate(item.createdAt)}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
