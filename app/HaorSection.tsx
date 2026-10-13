"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

const haorSlides = [
  {
    name: "Hakaluki Haor",
    image: "/hm1.jpg",
    alt: "Hakaluki Haor wetland landscape in Bangladesh",
  },
  {
    name: "Kawadighi Haor",
    image: "/hm1.jpg",
    alt: "Kawadighi Haor wetland landscape in Bangladesh",
  },
  {
    name: "Hail Haor",
    image: "/hm3.jpg",
    alt: "Hail Haor wetland landscape in Bangladesh",
  },
];

export default function HaorSection() {
  const [activeSlide, setActiveSlide] = useState(0);

  // Automatically change the image every 2 seconds.
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((current) => (current + 1) % haorSlides.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const slide = haorSlides[activeSlide];

  return (
    <section id="haor" className="scroll-mt-24 py-16 sm:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
        {/* LEFT CONTENT */}
        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-emerald-600 uppercase">
            Protect Our Natural Heritage
          </p>

          <h2 className="mt-3 max-w-xl text-3xl leading-tight font-bold tracking-tight text-emerald-950 sm:text-4xl lg:text-[2.6rem]">
            Protecting the Haors of Bangladesh
          </h2>

          <p className="mt-6 text-base leading-7 text-slate-600">
            Our haors, rivers, canals, and wetlands are vital to
            Bangladesh&apos;s environment. They sustain fish, migratory birds,
            aquatic biodiversity, and the natural water systems on which local
            communities depend.
          </p>

          <p className="mt-4 text-base leading-7 text-slate-600">
            Haor Rokkha Andolan works to raise awareness and encourage the
            protection of wetlands, wildlife, natural habitats, and the
            livelihoods of communities connected to these precious ecosystems.
          </p>

          <Link
            href="/haor"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-emerald-400 px-6 py-2 text-sm font-semibold text-emerald-50 shadow-lg shadow-emerald-700/10 transition hover:bg-emerald-300"
          >
            More
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* RIGHT IMAGE CAROUSEL */}
        <div className="relative mx-2 mb-5">
          <div className="absolute -top-4 -left-4 h-24 w-24 rounded-tl-3xl border-t-[5px] border-l-[5px] border-emerald-500/80" />

          <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-br-3xl border-r-[5px] border-b-[5px] border-emerald-500/40" />

          <div
            className="relative h-72 overflow-hidden rounded-2xl bg-emerald-950 bg-cover bg-center shadow-2xl shadow-emerald-900/10 transition-[background-image] duration-500 sm:h-80 lg:h-95"
            style={{ backgroundImage: `url("${slide.image}")` }}
            role="img"
            aria-label={slide.alt}
          >
            <div className="absolute inset-0 bg-linear-to-t from-emerald-950/85 via-emerald-950/10 to-transparent" />

            {/* IMAGE TITLE */}
            <div className="absolute right-5 bottom-7 left-5 sm:right-7 sm:bottom-9 sm:left-7">
              <p className="text-xs font-bold tracking-[0.2em] text-emerald-300 uppercase">
                Bangladesh Wetlands
              </p>

              <h3 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {slide.name}
              </h3>
            </div>

            {/* THREE DOTS — MANUAL SWITCHING */}
            <div
              className="absolute top-5 left-1/2 flex -translate-x-1/2 items-center gap-2.5"
              aria-label="Choose a haor image"
            >
              {haorSlides.map((item, index) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Show ${item.name}`}
                  aria-pressed={activeSlide === index}
                  className={`h-2.5 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
                    activeSlide === index
                      ? "w-7 bg-emerald-400"
                      : "w-2.5 bg-white/80 hover:bg-white"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* BOTTOM INFORMATION BADGE */}
          <div className="absolute -right-1 -bottom-5 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white p-4 shadow-xl sm:right-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
              <ShieldCheck size={26} />
            </div>

            <div>
              <p className="text-sm font-bold text-emerald-950">
                Protect Our Haors
              </p>
              <p className="text-xs text-slate-500">
                Wetlands · Wildlife · Communities
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
