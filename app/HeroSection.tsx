"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { HomepageNewsItem } from "./contactTypes";

type HeroSectionProps = {
  updates?: HomepageNewsItem[];
  news?: HomepageNewsItem[];
};

const backgroundImages = [
  "/h2.jpg",
  "/h11.jpg",
  "/hm2.jpg",
  "/hm1.jpg",
  "/hm3.jpg",
  "/monu.jpg",
];

const slogans = [
  {
    first: "“হাওর -নদী- পরিবেশ,",
    second: " রক্ষা করো বাংলাদেশ।”",
  },
  {
    first: "“Protect Bangladesh’s",
    second: " Haors, Rivers & Environment.”",
  },
];

export default function HeroSection(_props: HeroSectionProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [typedSlogan, setTypedSlogan] = useState("");
  const [activeSlogan, setActiveSlogan] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % backgroundImages.length);
    }, 6000);

    return () => window.clearInterval(interval);
  }, []);

  // BENGALI AND ENGLISH SLOGAN TYPEWRITER EFFECT
  useEffect(() => {
    const currentSlogan = slogans[activeSlogan];
    const fullSlogan = currentSlogan.first + currentSlogan.second;
    const characters = Array.from(fullSlogan);

    let currentIndex = 0;
    let timeout: ReturnType<typeof setTimeout>;

    const typeNextCharacter = () => {
      if (currentIndex < characters.length) {
        setTypedSlogan(characters.slice(0, currentIndex + 1).join(""));
        currentIndex++;

        timeout = setTimeout(typeNextCharacter, 110);
      } else {
        timeout = setTimeout(() => {
          setTypedSlogan("");
          setActiveSlogan((current) => (current + 1) % slogans.length);
        }, 3000);
      }
    };

    timeout = setTimeout(typeNextCharacter, 500);

    return () => clearTimeout(timeout);
  }, [activeSlogan]);

  const currentSlogan = slogans[activeSlogan];

  return (
    <section className="relative isolate h-[370px] w-full overflow-hidden border-t-8 border-amber-300 bg-slate-950 sm:h-[370px] lg:h-[390px]">
      {/* BACKGROUND IMAGE SLIDESHOW */}
      {backgroundImages.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[1500ms] ease-in-out ${
            activeImage === index ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url('${image}')` }}
          aria-hidden="true"
        />
      ))}

      {/* IMAGE OVERLAYS */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#031c2b]/90 via-[#062b38]/60 to-black/15"
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 bg-gradient-to-t from-[#031b25]/80 via-transparent to-black/15"
        aria-hidden="true"
      />

      {/* ENVIRONMENTAL SLOGAN — TOP RIGHT */}
      <div className="absolute right-4 top-5 z-20 max-w-[230px] text-right sm:right-8 sm:top-7 sm:max-w-sm lg:right-12 lg:top-8">
        <p
          lang={activeSlogan === 0 ? "bn" : "en"}
          translate="no"
          className="notranslate text-sm font-extrabold italic leading-relaxed text-white drop-shadow-[0_2px_5px_rgba(0,0,0,0.95)] sm:text-lg md:text-xl lg:text-2xl"
        >
          {typedSlogan.slice(0, currentSlogan.first.length)}

          {typedSlogan.length > currentSlogan.first.length && (
            <span className="block text-amber-300">
              {typedSlogan.slice(currentSlogan.first.length)}
            </span>
          )}

          {/* TYPEWRITER CURSOR */}
          <span
            className="ml-1 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-amber-300"
            aria-hidden="true"
          />
        </p>
      </div>

      {/* ORGANIZATION IDENTITY — BOTTOM LEFT */}
      <div className="absolute inset-x-0 bottom-[13%] z-10 mx-auto w-full max-w-7xl px-4 sm:bottom-[14%] sm:px-8 lg:px-10">
        <div className="flex max-w-5xl items-center gap-3 sm:gap-5 lg:gap-7">
          {/* ORGANIZATION LOGO */}
          <div className="relative h-[76px] w-[76px] shrink-0 -translate-y-3 sm:-translate-y-6 rounded-full border-[3px] border-amber-400 bg-white p-1 shadow-[0_8px_30px_rgba(0,0,0,0.5)] sm:h-[100px] sm:w-[100px] sm:border-4 lg:h-[122px] lg:w-[122px]">
            <div className="relative h-full w-full overflow-hidden rounded-full bg-white">
              <Image
                src="/ha2.png"
                alt="Haor Rokkha Andolan logo"
                fill
                priority
                sizes="(max-width: 640px) 76px, (max-width: 1024px) 100px, 122px"
                className="object-contain"
              />
            </div>
          </div>

          {/* ORGANIZATION TITLES */}
          <div className="min-w-0 flex-1">
            {/* ENGLISH TITLE */}
            <h1
              translate="no"
              className="notranslate font-serif text-[17px] font-black leading-tight tracking-[-0.03em] text-amber-300 drop-shadow-[0_3px_5px_rgba(0,0,0,0.8)] sm:text-2xl md:text-3xl lg:text-[39px]"
            >
              Wetlands Resilience Initiatives
            </h1>

            {/* DECORATIVE TITLE SEPARATOR */}
            <div className="my-2 flex items-center gap-2 sm:my-3">
              <span className="h-[3px] w-8 rounded-full bg-amber-400 sm:w-12" />
              <span className="h-1.5 w-1.5 rotate-45 bg-yellow-200" />
              <span className="h-px w-12 bg-gradient-to-r from-amber-300/80 to-transparent sm:w-20" />
            </div>

            {/* BANGLA TITLE */}
            <h2
              lang="bn"
              translate="no"
              className="notranslate text-[20px] font-extrabold leading-[1.5] tracking-normal text-white drop-shadow-[0_3px_6px_rgba(0,0,0,0.9)] sm:text-2xl md:text-3xl lg:text-[40px]"
            >
              হাওর রক্ষা আন্দোলন
            </h2>

            {/* GOLDEN BIRD-WING UNDERLINE */}
            <svg
              className="mt-2 h-5 w-36 sm:mt-3 sm:h-6 sm:w-52"
              viewBox="0 0 220 28"
              fill="none"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="goldBirdWing" x1="0" y1="0" x2="220" y2="0">
                  <stop offset="0%" stopColor="#fde047" />
                  <stop offset="45%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#fef3c7" />
                </linearGradient>
              </defs>

              {/* Main sweeping wing */}
              <path
                d="M2 18 C28 2 48 1 76 9 C112 19 151 19 218 3 C177 25 117 28 72 18 C42 11 22 12 2 18Z"
                fill="url(#goldBirdWing)"
              />

              {/* Fine feather detail */}
              <path
                d="M8 20 C45 12 68 17 100 22 C139 27 179 17 213 5"
                stroke="#fde68a"
                strokeWidth="1.2"
                strokeLinecap="round"
                opacity=".8"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
