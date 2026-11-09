"use client";

import { useState } from "react";
import Image from "next/image";
import { Target, Eye } from "lucide-react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import LanguageSwitcher from "../LanguageSwitcher";

const content = {
  en: {
    eyebrow: "HAOR ROKKHA ANDOLAN · MOULVIBAZAR",
    title: "Mission & Vision",
    banglaTitle: "লক্ষ্য ও ভবিষ্যৎ পরিকল্পনা",
    description:
      "Our commitment to protecting Bangladesh's haors, rivers, wetlands and biodiversity for generations to come.",
    explore: "Explore Our Mission",

    missionLabel: "OUR MISSION",
    missionTitle: "Our Mission",
    missionParagraphs: [
      "To protect and conserve Bangladesh's haors, rivers, wetlands and natural ecosystems through environmental awareness, community participation, advocacy and responsible action.",
      "We strive to preserve biodiversity, address environmental degradation and encourage collective responsibility for our natural resources.",
    ],

    visionLabel: "OUR VISION",
    visionTitle: "Our Vision",
    visionParagraphs: [
      "A Bangladesh where rivers flow freely, haors and wetlands thrive, biodiversity is protected, and natural resources are valued and managed sustainably.",
      "We envision environmentally conscious communities working together to preserve our natural heritage for future generations.",
    ],

    footerTitle: "Protect Our Natural Heritage",
    footerDescription:
      "Working together for healthier rivers, thriving wetlands and a greener future.",
  },

  bn: {
    eyebrow: "হাওর রক্ষা আন্দোলন · মৌলভীবাজার",
    title: "লক্ষ্য ও ভবিষ্যৎ পরিকল্পনা",
    banglaTitle: "প্রকৃতি রক্ষায় আমাদের অঙ্গীকার",
    description:
      "আগামী প্রজন্মের জন্য বাংলাদেশের হাওর, নদ-নদী, জলাভূমি ও জীববৈচিত্র্য সংরক্ষণে আমাদের অঙ্গীকার।",
    explore: "আমাদের লক্ষ্য জানুন",

    missionLabel: "আমাদের লক্ষ্য",
    missionTitle: "আমাদের কর্মলক্ষ্য",
    missionParagraphs: [
      "পরিবেশবিষয়ক সচেতনতা বৃদ্ধি, জনসম্পৃক্ততা, জনস্বার্থে দাবি উত্থাপন এবং দায়িত্বশীল উদ্যোগের মাধ্যমে বাংলাদেশের হাওর, নদ-নদী, জলাভূমি ও প্রাকৃতিক প্রতিবেশ সংরক্ষণ করা।",
      "আমরা জীববৈচিত্র্য রক্ষা, পরিবেশের অবক্ষয় মোকাবিলা এবং প্রাকৃতিক সম্পদ সংরক্ষণে সবার সম্মিলিত দায়িত্ববোধ গড়ে তুলতে কাজ করি।",
    ],

    visionLabel: "আমাদের স্বপ্ন",
    visionTitle: "আমাদের ভবিষ্যৎ ভাবনা",
    visionParagraphs: [
      "আমরা এমন একটি বাংলাদেশ দেখতে চাই, যেখানে নদী তার স্বাভাবিক গতিতে প্রবাহিত হবে, হাওর ও জলাভূমি সমৃদ্ধ থাকবে, জীববৈচিত্র্য সুরক্ষিত হবে এবং প্রাকৃতিক সম্পদের টেকসই ব্যবহার নিশ্চিত হবে।",
      "আমাদের স্বপ্ন পরিবেশসচেতন জনগোষ্ঠী গড়ে তোলা, যারা ভবিষ্যৎ প্রজন্মের জন্য একসঙ্গে কাজ করে দেশের প্রাকৃতিক ঐতিহ্য সংরক্ষণ করবে।",
    ],

    footerTitle: "প্রাকৃতিক ঐতিহ্য রক্ষা করি",
    footerDescription:
      "সুস্থ নদ-নদী, সমৃদ্ধ জলাভূমি ও সবুজ ভবিষ্যতের জন্য একসঙ্গে কাজ করি।",
  },
} as const;

type Language = "en" | "bn";

export default function MissionVisionPage() {
  const [language, setLanguage] = useState<Language>("en");
  const t = content[language];

  return (
    <main
      lang={language}
      className="min-h-screen bg-white font-sans text-slate-800 antialiased"
    >
      {/* HERO — KEEPING ORIGINAL DESIGN */}
      <section className="relative isolate overflow-hidden bg-emerald-950">
        {/* Top gradient border — 10px */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[10px] bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300"
          aria-hidden="true"
        />

        <Image
          src="/fish.png"
          alt={
            language === "bn"
              ? "বাংলাদেশের হাওর ও জলাভূমির প্রাকৃতিক দৃশ্য"
              : "The haor wetlands of Bangladesh"
          }
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Image overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-emerald-950/30 via-emerald-950/50 to-emerald-950/30" />

        <div className="relative mx-auto flex h-[340px] max-w-7xl items-center justify-center px-5 py-10 text-center sm:h-[360px] sm:px-8 lg:h-[390px]">
          <div className="w-full max-w-4xl">
            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              {t.title}
            </h1>

            {/* LANGUAGE SWITCH */}
            {/*    <div
              className="mx-auto mt-5 inline-flex items-center rounded-md border border-white/40 bg-black/25 p-0.5"
              aria-label="Choose language"
            >
              <button
                type="button"
                onClick={() => setLanguage("bn")}
                aria-pressed={language === "bn"}
                className={`min-w-14 rounded px-2.5 py-1.5 text-xs font-semibold transition ${
                  language === "bn"
                    ? "bg-white text-emerald-900"
                    : "text-white hover:bg-white/15"
                }`}
              >
                বাংলা
              </button>

              <button
                type="button"
                onClick={() => setLanguage("en")}
                aria-pressed={language === "en"}
                className={`min-w-14 rounded px-2.5 py-1.5 text-xs font-semibold transition ${
                  language === "en"
                    ? "bg-white text-emerald-900"
                    : "text-white hover:bg-white/15"
                }`}
              >
                English
              </button>
            </div> */}
          </div>
        </div>
      </section>
      <div className="fixed right-4 top-1/2 z-9999 -translate-y-1/2">
        <LanguageSwitcher />
      </div>
      {/* NAVIGATION — AFTER HERO */}
      <Navbar />

      {/* MISSION & VISION */}
      <section
        id="mission-vision"
        className="scroll-mt-24 px-4 py-10 sm:px-6 sm:py-14 lg:px-8"
      >
        <div className="mx-auto max-w-4xl">
          <div className="grid items-stretch gap-0 md:grid-cols-2">
            {/* MISSION */}
            <article className="border-y border-amber-200 py-7 md:border-r md:border-b-0 md:pr-7 lg:py-9 lg:pr-9">
              <div className="flex h-11 w-11 items-center justify-center border border-amber-200 bg-amber-50 text-amber-800 shadow-sm shadow-amber-900/5">
                <Target size={23} strokeWidth={1.8} />
              </div>

              <p className="mt-5 text-xs font-bold tracking-[0.15em] text-amber-800">
                {t.missionLabel}
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-amber-950 sm:text-3xl">
                {t.missionTitle}
              </h2>

              <div className="mt-3 h-1 w-12 bg-gradient-to-r from-amber-400 to-yellow-500 shadow-sm shadow-amber-600/20" />

              {t.missionParagraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="mt-4 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8"
                >
                  {paragraph}
                </p>
              ))}
            </article>

            {/* VISION */}
            <article className="border-b border-amber-200 py-7 md:pl-7 lg:py-9 lg:pl-9">
              <div className="flex h-11 w-11 items-center justify-center border border-amber-200 bg-amber-50 text-amber-800 shadow-sm shadow-amber-900/5">
                <Eye size={23} strokeWidth={1.8} />
              </div>

              <p className="mt-5 text-xs font-bold tracking-[0.15em] text-amber-800">
                {t.visionLabel}
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-amber-950 sm:text-3xl">
                {t.visionTitle}
              </h2>

              <div className="mt-3 h-1 w-12 bg-gradient-to-r from-amber-400 to-yellow-500 shadow-sm shadow-amber-600/20" />

              {t.visionParagraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="mt-4 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8"
                >
                  {paragraph}
                </p>
              ))}
            </article>
          </div>
        </div>
      </section>

      {/* CLOSING */}
      <section className="border-t border-amber-200 bg-gradient-to-b from-amber-50/70 to-white px-4 py-9 sm:px-6 sm:py-11 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-xl font-bold text-amber-950 sm:text-2xl">
            {t.footerTitle}
          </h2>

          <div className="mt-3 h-1 w-12 bg-gradient-to-r from-amber-400 to-yellow-500" />

          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
            {t.footerDescription}
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
