"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Droplets,
  Fish,
  HeartHandshake,
  MapPin,
  Trees,
  Waves,
} from "lucide-react";
import Navbar from "../Navbar";

type Language = "en" | "bn";

const content = {
  en: {
    eyebrow: "HAOR ROKKHA ANDOLAN · MOULVIBAZAR",
    heroTitle: "Protect the Monu River",
    heroBangla: "মনু নদী রক্ষা করি",
    heroDescription:
      "Protect our rivers, preserve nature and safeguard local livelihoods.",
    explore: "Explore Our Mission",
    missionLabel: "OUR MISSION",
    introTitle: "Our River, Our Responsibility",
    intro:
      "The Monu River is an important part of life and nature in Moulvibazar. Protecting its water, natural flow and riverbanks is a shared responsibility.",
    quote: "Healthy rivers mean a healthier future.",
    whyLabel: "WHY RIVERS MATTER",
    whyTitle: "Rivers Sustain Our Lives",
    benefits: [
      {
        title: "Water and Agriculture",
        description:
          "Rivers support agriculture, water availability and everyday life.",
      },
      {
        title: "Fish and Wildlife",
        description:
          "Clean waterways help protect aquatic life and natural habitats.",
      },
      {
        title: "Nature and Communities",
        description:
          "Healthy rivers sustain local ecosystems and communities.",
      },
    ],
    riversLabel: "OUR LOCAL WATERWAYS",
    riversTitle: "Rivers of Moulvibazar",
    riversDescription:
      "Every river matters. Learn about the waterways we must protect.",
    prioritiesLabel: "OUR COMMITMENT",
    prioritiesTitle: "How We Can Protect Rivers",
    priorities: [
      {
        title: "Prevent Water Pollution",
        description:
          "Keep plastic, household waste and harmful pollutants out of rivers.",
      },
      {
        title: "Protect Natural River Flow",
        description:
          "Protect river channels, banks and natural water movement.",
      },
      {
        title: "Conserve Aquatic Life",
        description:
          "Support sustainable fishing and protect aquatic habitats.",
      },
      {
        title: "Protect Riverbanks",
        description:
          "Encourage responsible land use and preserve riverside vegetation.",
      },
      {
        title: "Community Participation",
        description:
          "Bring residents, students and local organisations together.",
      },
    ],
    actionLabel: "TAKE ACTION",
    actionTitle: "Protect Our Rivers, Protect Our Future",
    actionDescription:
      "Keep waterways clean, prevent pollution and encourage others to care for nature.",
    actionList: [
      "Keep rivers clean",
      "Prevent pollution",
      "Protect riverbanks",
      "Raise awareness",
    ],
    join: "Get Involved",
    back: "Back to Home",
    footer: "Protecting our rivers and natural heritage.",
    locations: {
      monu: "Kulaura, Rajnagar and Moulvibazar Sadar",
      dholai: "Kamalganj and Moulvibazar Sadar",
      juri: "Juri and Barlekha",
      fanai: "Kulaura and Juri",
      kushiyara: "Rajnagar and the wider Sylhet region",
      laghata: "Kamalganj and Rajnagar",
    },
    riverDescriptions: {
      monu: "An important river connected to local life, agriculture and the wider Kushiyara river system.",
      dholai: "Protecting its natural flow and water quality is important for local communities.",
      juri: "Its river environment deserves care, awareness and responsible management.",
      fanai: "Local waterways are valuable parts of the wider natural landscape.",
      kushiyara: "A major river in the Sylhet region connected to the wider local river network.",
      laghata: "Protecting its flow, banks and surrounding environment matters.",
    },
  },
  bn: {
    eyebrow: "হাওর রক্ষা আন্দোলন · মৌলভীবাজার",
    heroTitle: "মনু নদী রক্ষা করি",
    heroBangla: "নদী বাঁচাই, প্রকৃতি বাঁচাই",
    heroDescription:
      "নদী রক্ষা করি, প্রকৃতি সংরক্ষণ করি, মানুষের জীবিকা সুরক্ষিত রাখি।",
    explore: "আমাদের উদ্যোগ দেখুন",
    missionLabel: "আমাদের লক্ষ্য",
    introTitle: "নদী আমাদের, দায়িত্বও আমাদের",
    intro:
      "মনু নদী মৌলভীবাজারের মানুষের জীবন ও প্রকৃতির একটি গুরুত্বপূর্ণ অংশ। নদীর পানি, স্বাভাবিক প্রবাহ ও তীর রক্ষা করা আমাদের সম্মিলিত দায়িত্ব।",
    quote: "নদী বাঁচলে প্রকৃতি বাঁচবে, বাঁচবে ভবিষ্যৎ।",
    whyLabel: "নদী কেন গুরুত্বপূর্ণ",
    whyTitle: "নদী আমাদের জীবনধারা",
    benefits: [
      {
        title: "পানি ও কৃষি",
        description:
          "নদী কৃষি, পানির প্রাপ্যতা ও মানুষের দৈনন্দিন জীবনের সঙ্গে জড়িত।",
      },
      {
        title: "মাছ ও জীববৈচিত্র্য",
        description:
          "পরিচ্ছন্ন নদী জলজ প্রাণী ও প্রাকৃতিক আবাসস্থল রক্ষা করে।",
      },
      {
        title: "প্রকৃতি ও জনজীবন",
        description:
          "সুস্থ নদী স্থানীয় পরিবেশ ও মানুষের জীবনধারাকে সহায়তা করে।",
      },
    ],
    riversLabel: "আমাদের নদ-নদী",
    riversTitle: "মৌলভীবাজারের নদ-নদী",
    riversDescription:
      "প্রতিটি নদী গুরুত্বপূর্ণ। আসুন, আমাদের নদ-নদী রক্ষা করি।",
    prioritiesLabel: "আমাদের অঙ্গীকার",
    prioritiesTitle: "যেভাবে নদী রক্ষা করতে পারি",
    priorities: [
      {
        title: "নদীদূষণ প্রতিরোধ",
        description:
          "নদীতে প্লাস্টিক, গৃহস্থালি বর্জ্য ও ক্ষতিকর পদার্থ ফেলা বন্ধ করি।",
      },
      {
        title: "স্বাভাবিক প্রবাহ রক্ষা",
        description:
          "নদীর গতিপথ, তীর ও স্বাভাবিক পানিপ্রবাহ রক্ষা করি।",
      },
      {
        title: "জলজ প্রাণী সংরক্ষণ",
        description:
          "টেকসই মাছ ধরা ও জলজ প্রাণীর আবাসস্থল সংরক্ষণে সচেতন হই।",
      },
      {
        title: "নদীর তীর সংরক্ষণ",
        description:
          "দায়িত্বশীল ভূমি ব্যবহার ও নদীতীরের গাছপালা রক্ষা করি।",
      },
      {
        title: "জনসাধারণের অংশগ্রহণ",
        description:
          "নদী রক্ষায় স্থানীয় মানুষ, শিক্ষার্থী ও সংগঠনকে একসঙ্গে যুক্ত করি।",
      },
    ],
    actionLabel: "এগিয়ে আসুন",
    actionTitle: "নদী রক্ষা করি, ভবিষ্যৎ রক্ষা করি",
    actionDescription:
      "নদী পরিচ্ছন্ন রাখুন, দূষণ প্রতিরোধ করুন এবং অন্যদেরও প্রকৃতি রক্ষায় উৎসাহিত করুন।",
    actionList: [
      "নদী পরিচ্ছন্ন রাখুন",
      "দূষণ প্রতিরোধ করুন",
      "নদীর তীর রক্ষা করুন",
      "জনসচেতনতা বাড়ান",
    ],
    join: "যুক্ত হোন",
    back: "হোমে ফিরুন",
    footer: "নদী ও প্রাকৃতিক ঐতিহ্য সংরক্ষণে আমাদের অঙ্গীকার।",
    locations: {
      monu: "কুলাউড়া, রাজনগর ও মৌলভীবাজার সদর",
      dholai: "কমলগঞ্জ ও মৌলভীবাজার সদর",
      juri: "জুড়ী ও বড়লেখা",
      fanai: "কুলাউড়া ও জুড়ী",
      kushiyara: "রাজনগর ও বৃহত্তর সিলেট অঞ্চল",
      laghata: "কমলগঞ্জ ও রাজনগর",
    },
    riverDescriptions: {
      monu: "স্থানীয় জনজীবন, কৃষি ও কুশিয়ারা নদীব্যবস্থার সঙ্গে যুক্ত একটি গুরুত্বপূর্ণ নদী।",
      dholai: "স্থানীয় মানুষের জন্য নদীর স্বাভাবিক প্রবাহ ও পানির মান রক্ষা গুরুত্বপূর্ণ।",
      juri: "জুড়ী নদীর প্রাকৃতিক পরিবেশ রক্ষায় সচেতনতা ও দায়িত্বশীল ব্যবস্থাপনা প্রয়োজন।",
      fanai: "স্থানীয় জলপ্রবাহ আমাদের প্রাকৃতিক পরিবেশের মূল্যবান অংশ।",
      kushiyara: "সিলেট অঞ্চলের একটি গুরুত্বপূর্ণ নদী, যা বৃহত্তর নদীব্যবস্থার সঙ্গে যুক্ত।",
      laghata: "নদীর প্রবাহ, তীর ও আশপাশের পরিবেশ রক্ষা করা প্রয়োজন।",
    },
  },
} as const;

const rivers = [
  { key: "monu", en: "Monu River", bn: "মনু নদী" },
  { key: "dholai", en: "Dholai River", bn: "ধলাই নদী" },
  { key: "juri", en: "Juri River", bn: "জুড়ী নদী" },
  { key: "fanai", en: "Fanai River", bn: "ফানাই নদী" },
  { key: "kushiyara", en: "Kushiyara River", bn: "কুশিয়ারা নদী" },
  { key: "laghata", en: "Laghata River", bn: "লাঘাটা নদী" },
] as const;

const benefitIcons = [Droplets, Fish, Trees];
const priorityIcons = [Droplets, Waves, Fish, Trees, HeartHandshake];

export default function RiverContent() {
  const [language, setLanguage] = useState<Language>("en");
  const t = content[language];

  return (
    <main
      lang={language}
      className="min-h-screen bg-white text-slate-800 mt-16"
    >
      <Navbar />

      {/* HERO */}
      <section className="relative isolate flex min-h-[390px] items-center justify-center overflow-hidden bg-white">
        <Image
          src="/monu1.jpg"
          alt={
            language === "bn"
              ? "মৌলভীবাজারের মনু নদী"
              : "The Monu River in Moulvibazar"
          }
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 mx-auto w-full max-w-4xl px-5 py-12 text-center">
          <p className="text-xs font-semibold tracking-[0.18em] text-white/90 sm:text-sm">
            {t.eyebrow}
          </p>

          <h1 className="mt-4 text-3xl leading-tight font-bold text-white sm:text-4xl md:text-5xl">
            {t.heroTitle}
          </h1>

          <p className="mt-3 text-xl font-semibold text-white sm:text-2xl">
            {t.heroBangla}
          </p>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/90 sm:text-base">
            {t.heroDescription}
          </p>

          {/* LANGUAGE SWITCH */}
          <div
            className="mx-auto mt-6 inline-flex items-center rounded-md border border-white/40 bg-black/25 p-1"
            aria-label="Choose language"
          >
            <button
              type="button"
              onClick={() => setLanguage("bn")}
              aria-pressed={language === "bn"}
              className={`min-w-20 rounded px-4 py-2 text-sm font-semibold transition ${
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
              className={`min-w-20 rounded px-4 py-2 text-sm font-semibold transition ${
                language === "en"
                  ? "bg-white text-emerald-900"
                  : "text-white hover:bg-white/15"
              }`}
            >
              English
            </button>
          </div>

          <div>
            <a
              href="#monu-river"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-emerald-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900"
            >
              {t.explore}
              <ArrowRight size={17} />
            </a>
          </div>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section
        id="monu-river"
        className="scroll-mt-24 px-4 py-10 sm:px-6 sm:py-14 lg:px-8"
      >
        <article className="mx-auto max-w-4xl">
          <p className="text-sm font-semibold text-emerald-800">
            {t.missionLabel}
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {t.introTitle}
          </h2>

          <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
            {t.intro}
          </p>

          <p className="mt-6 border-l-2 border-emerald-700 pl-4 text-base leading-7 font-semibold text-slate-900 sm:text-lg">
            {t.quote}
          </p>
        </article>
      </section>

      {/* WHY RIVERS MATTER */}
      <section className="px-4 py-9 sm:px-6 sm:py-11 lg:px-8">
        <div className="mx-auto max-w-4xl border-t border-slate-200 pt-8">
          <p className="text-sm font-semibold text-emerald-800">
            {t.whyLabel}
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            {t.whyTitle}
          </h2>

          <div className="mt-5 divide-y divide-slate-200">
            {t.benefits.map((item, index) => {
              const Icon = benefitIcons[index];

              return (
                <article key={item.title} className="flex gap-4 py-4">
                  <Icon
                    size={22}
                    className="mt-1 shrink-0 text-emerald-800"
                  />
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {item.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* RIVERS */}
      <section className="px-4 py-9 sm:px-6 sm:py-11 lg:px-8">
        <div className="mx-auto max-w-4xl border-t border-slate-200 pt-8">
          <p className="text-sm font-semibold text-emerald-800">
            {t.riversLabel}
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            {t.riversTitle}
          </h2>

          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
            {t.riversDescription}
          </p>

          <div className="mt-5 divide-y divide-slate-200 border-y border-slate-200">
            {rivers.map((river, index) => (
              <article key={river.key} className="flex gap-4 py-4">
                <span className="pt-1 text-sm font-semibold tabular-nums text-emerald-800">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-slate-900">
                    {language === "bn" ? river.bn : river.en}
                  </h3>

                  <p className="mt-2 flex items-start gap-2 text-xs leading-5 text-slate-500 sm:text-sm">
                    <MapPin size={15} className="mt-0.5 shrink-0" />
                    <span>{t.locations[river.key]}</span>
                  </p>

                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {t.riverDescriptions[river.key]}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PROTECTION PRIORITIES */}
      <section className="px-4 py-9 sm:px-6 sm:py-11 lg:px-8">
        <div className="mx-auto max-w-4xl border-t border-slate-200 pt-8">
          <p className="text-sm font-semibold text-emerald-800">
            {t.prioritiesLabel}
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            {t.prioritiesTitle}
          </h2>

          <div className="mt-5 divide-y divide-slate-200 border-y border-slate-200">
            {t.priorities.map((item, index) => {
              const Icon = priorityIcons[index];

              return (
                <article key={item.title} className="flex gap-4 py-4">
                  <Icon
                    size={21}
                    className="mt-1 shrink-0 text-emerald-800"
                  />
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {item.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* COMMUNITY ACTION */}
      <section className="px-4 py-9 sm:px-6 sm:py-11 lg:px-8">
        <article className="mx-auto max-w-4xl border-t border-slate-200 pt-8">
          <p className="text-sm font-semibold text-emerald-800">
            {t.actionLabel}
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            {t.actionTitle}
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
            {t.actionDescription}
          </p>

          <ul className="mt-5 space-y-3">
            {t.actionList.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-sm leading-6 text-slate-700"
              >
                <CheckCircle2
                  size={18}
                  className="mt-1 shrink-0 text-emerald-800"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/contact"
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-md bg-emerald-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900"
          >
            {t.join}
            <ArrowRight size={17} />
          </Link>
        </article>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-sm sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <p className="font-semibold text-slate-900">
              Haor Rokkha Andolan
            </p>
            <p className="mt-1 text-slate-500">{t.footer}</p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 font-medium text-emerald-800 transition hover:text-emerald-950"
          >
            <ArrowLeft size={16} />
            {t.back}
          </Link>
        </div>
      </footer>
    </main>
  );
}