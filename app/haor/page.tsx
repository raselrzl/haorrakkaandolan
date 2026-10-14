
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Bird,
  Droplets,
  Fish,
  Leaf,
  MapPin,
  ShieldCheck,
  Waves,
} from "lucide-react";
import Navbar from "../Navbar";

type Language = "en" | "bn";

const content = {
  en: {
    eyebrow: "HAOR ROKKHA ANDOLAN · MOULVIBAZAR",
    heroTitle: "Haor Rokkha Andolan",
    heroBangla: "হাওর রক্ষা আন্দোলন",
    heroDescription:
      "Protect our haors, preserve biodiversity and safeguard the lives and livelihoods of local communities.",
    explore: "Explore Our Mission",

    missionLabel: "OUR MISSION",
    introTitle: "Our Haors, Our Responsibility",
    intro:
      "Haors are an essential part of the natural environment and everyday life in northeastern Bangladesh. Their wetlands, rivers, canals and seasonal waters support biodiversity, agriculture, fisheries and local communities. Protecting these natural resources is our shared responsibility.",
    quote: "Protect our haors today, preserve our future tomorrow.",

    whyLabel: "WHY HAORS MATTER",
    whyTitle: "Haors Sustain Life and Nature",
    benefits: [
      {
        title: "Water and Agriculture",
        description:
          "Haors support agricultural production, seasonal water resources and the livelihoods of farming communities.",
      },
      {
        title: "Fish and Biodiversity",
        description:
          "Wetlands provide important habitats for fish, aquatic plants and diverse wildlife.",
      },
      {
        title: "Nature and Communities",
        description:
          "Healthy haors sustain local ecosystems, traditional livelihoods and the natural heritage of Bangladesh.",
      },
    ],

    haorsLabel: "OUR NATURAL HERITAGE",
    haorsTitle: "Discover the Haors of Bangladesh",
    haorsDescription:
      "Haors are valuable wetland landscapes with distinctive ecosystems and communities. Understanding their importance is the first step towards protecting them.",
    haors: [
      {
        title: "Tanguar Haor",
        description:
          "A renowned wetland in Sunamganj, known for its biodiversity, aquatic habitats and importance to local livelihoods.",
      },
      {
        title: "Hakaluki Haor",
        description:
          "An extensive wetland ecosystem in the Sylhet region that supports fisheries, agriculture and diverse wildlife.",
      },
      {
        title: "Hail Haor",
        description:
          "A significant wetland in Moulvibazar, important for aquatic life, waterbirds and surrounding communities.",
      },
      {
        title: "Dekhar Haor",
        description:
          "A wetland landscape in Sunamganj that supports local fishing communities and seasonal natural habitats.",
      },
    ],

    prioritiesLabel: "OUR COMMITMENT",
    prioritiesTitle: "How We Can Protect Our Haors",
    priorities: [
      {
        title: "Prevent Water Pollution",
        description:
          "Keep plastic, household waste and harmful pollutants out of wetlands, rivers and canals.",
      },
      {
        title: "Protect Natural Water Flow",
        description:
          "Preserve natural waterways and seasonal water movement essential to healthy wetland ecosystems.",
      },
      {
        title: "Conserve Fish and Wildlife",
        description:
          "Encourage sustainable fishing and protect the habitats of fish, birds and other wildlife.",
      },
      {
        title: "Preserve Wetland Habitats",
        description:
          "Protect wetland vegetation, natural habitats and the ecological balance of haor landscapes.",
      },
      {
        title: "Community Participation",
        description:
          "Bring local residents, students, fishers and organisations together to protect our wetlands.",
      },
    ],

    actionLabel: "TAKE ACTION",
    actionTitle: "Protect Our Haors, Protect Our Future",
    actionDescription:
      "Every individual and community has a role to play in protecting wetlands. Together, we can raise awareness, prevent pollution and preserve our natural heritage.",
    actionList: [
      "Keep wetlands and waterways clean",
      "Prevent pollution and irresponsible waste disposal",
      "Protect fish, birds and natural habitats",
      "Raise awareness in local communities",
    ],

    join: "Get Involved",
    back: "Back to Home",
    footer: "Protecting wetlands. Preserving our natural heritage.",
  },

  bn: {
    eyebrow: "হাওর রক্ষা আন্দোলন · মৌলভীবাজার",
    heroTitle: "হাওর রক্ষা আন্দোলন",
    heroBangla: "হাওর বাঁচাই, প্রকৃতি বাঁচাই",
    heroDescription:
      "হাওর রক্ষা করি, জীববৈচিত্র্য সংরক্ষণ করি, মানুষের জীবন ও জীবিকা সুরক্ষিত রাখি।",
    explore: "আমাদের লক্ষ্য দেখুন",

    missionLabel: "আমাদের লক্ষ্য",
    introTitle: "হাওর আমাদের, দায়িত্বও আমাদের",
    intro:
      "হাওর বাংলাদেশের উত্তর-পূর্বাঞ্চলের প্রাকৃতিক পরিবেশ ও জনজীবনের একটি গুরুত্বপূর্ণ অংশ। হাওরের জলাভূমি, নদী, খাল ও মৌসুমি জলরাশি জীববৈচিত্র্য, কৃষি, মৎস্যসম্পদ এবং স্থানীয় মানুষের জীবিকা রক্ষায় গুরুত্বপূর্ণ ভূমিকা রাখে। এসব প্রাকৃতিক সম্পদ সংরক্ষণ করা আমাদের সম্মিলিত দায়িত্ব।",
    quote: "আজ হাওর রক্ষা করি, আগামী দিনের ভবিষ্যৎ গড়ি।",

    whyLabel: "হাওর কেন গুরুত্বপূর্ণ",
    whyTitle: "হাওর বাঁচলে বাঁচবে প্রকৃতি ও জনজীবন",
    benefits: [
      {
        title: "পানি ও কৃষি",
        description:
          "হাওর কৃষি উৎপাদন, মৌসুমি পানিসম্পদ এবং কৃষিনির্ভর মানুষের জীবিকা রক্ষায় সহায়তা করে।",
      },
      {
        title: "মাছ ও জীববৈচিত্র্য",
        description:
          "হাওরের জলাভূমি মাছ, জলজ উদ্ভিদ ও বিভিন্ন বন্যপ্রাণীর গুরুত্বপূর্ণ আবাসস্থল।",
      },
      {
        title: "প্রকৃতি ও জনজীবন",
        description:
          "সুস্থ হাওর স্থানীয় প্রতিবেশ, মানুষের ঐতিহ্যবাহী জীবিকা এবং বাংলাদেশের প্রাকৃতিক ঐতিহ্য রক্ষা করে।",
      },
    ],

    haorsLabel: "আমাদের প্রাকৃতিক ঐতিহ্য",
    haorsTitle: "বাংলাদেশের হাওরাঞ্চল",
    haorsDescription:
      "হাওর অনন্য প্রাকৃতিক পরিবেশ ও জনপদসমৃদ্ধ মূল্যবান জলাভূমি। হাওরের গুরুত্ব জানা ও বোঝাই এগুলো রক্ষার প্রথম পদক্ষেপ।",
    haors: [
      {
        title: "টাঙ্গুয়ার হাওর",
        description:
          "সুনামগঞ্জের একটি পরিচিত জলাভূমি, যা জীববৈচিত্র্য, জলজ আবাসস্থল ও স্থানীয় মানুষের জীবিকার জন্য গুরুত্বপূর্ণ।",
      },
      {
        title: "হাকালুকি হাওর",
        description:
          "সিলেট অঞ্চলের বিস্তৃত জলাভূমি, যা মৎস্যসম্পদ, কৃষি ও বিভিন্ন বন্যপ্রাণীর আবাসস্থল হিসেবে গুরুত্বপূর্ণ।",
      },
      {
        title: "হাইল হাওর",
        description:
          "মৌলভীবাজারের একটি গুরুত্বপূর্ণ জলাভূমি, যা জলজ প্রাণী, জলচর পাখি ও আশপাশের জনপদের জন্য মূল্যবান।",
      },
      {
        title: "দেখার হাওর",
        description:
          "সুনামগঞ্জের একটি হাওরাঞ্চল, যা স্থানীয় মৎস্যজীবী সম্প্রদায় ও মৌসুমি প্রাকৃতিক আবাসস্থলকে সহায়তা করে।",
      },
    ],

    prioritiesLabel: "আমাদের অঙ্গীকার",
    prioritiesTitle: "যেভাবে হাওর রক্ষা করতে পারি",
    priorities: [
      {
        title: "পানিদূষণ প্রতিরোধ",
        description:
          "জলাভূমি, নদী ও খালে প্লাস্টিক, গৃহস্থালি বর্জ্য এবং ক্ষতিকর পদার্থ ফেলা বন্ধ করি।",
      },
      {
        title: "স্বাভাবিক পানিপ্রবাহ রক্ষা",
        description:
          "সুস্থ জলাভূমি ও প্রাকৃতিক পরিবেশের জন্য প্রয়োজনীয় নদী-খাল এবং মৌসুমি পানিপ্রবাহ সংরক্ষণ করি।",
      },
      {
        title: "মাছ ও বন্যপ্রাণী সংরক্ষণ",
        description:
          "টেকসই মাছ ধরা উৎসাহিত করি এবং মাছ, পাখি ও অন্যান্য বন্যপ্রাণীর আবাসস্থল রক্ষা করি।",
      },
      {
        title: "জলাভূমির আবাসস্থল সংরক্ষণ",
        description:
          "হাওরের উদ্ভিদ, প্রাকৃতিক আবাসস্থল ও পরিবেশগত ভারসাম্য রক্ষা করি।",
      },
      {
        title: "জনসাধারণের অংশগ্রহণ",
        description:
          "হাওর রক্ষায় স্থানীয় মানুষ, শিক্ষার্থী, মৎস্যজীবী ও বিভিন্ন সংগঠনকে একসঙ্গে যুক্ত করি।",
      },
    ],

    actionLabel: "এগিয়ে আসুন",
    actionTitle: "হাওর রক্ষা করি, ভবিষ্যৎ রক্ষা করি",
    actionDescription:
      "জলাভূমি রক্ষায় প্রত্যেক ব্যক্তি ও সম্প্রদায়ের ভূমিকা রয়েছে। আসুন, সবাই মিলে জনসচেতনতা বাড়াই, দূষণ প্রতিরোধ করি এবং আমাদের প্রাকৃতিক ঐতিহ্য সংরক্ষণ করি।",
    actionList: [
      "হাওর ও জলপথ পরিচ্ছন্ন রাখি",
      "দূষণ ও যত্রতত্র বর্জ্য ফেলা বন্ধ করি",
      "মাছ, পাখি ও প্রাকৃতিক আবাসস্থল রক্ষা করি",
      "স্থানীয় জনগণের মধ্যে সচেতনতা বাড়াই",
    ],

    join: "যুক্ত হোন",
    back: "হোমে ফিরুন",
    footer: "জলাভূমি রক্ষা করি, প্রাকৃতিক ঐতিহ্য সংরক্ষণ করি।",
  },
} as const;

const benefitIcons = [Droplets, Fish, Leaf];
const priorityIcons = [Droplets, Waves, Fish, Leaf, ShieldCheck];

export default function HaorPage() {
  const [language, setLanguage] = useState<Language>("en");
  const t = content[language];

  return (
    <main
      lang={language}
      className="mt-16 min-h-screen bg-white text-slate-800"
    >
      <Navbar />

      {/* HERO */}
      <section className="relative isolate flex min-h-[440px] items-center justify-center overflow-hidden bg-emerald-950 sm:min-h-[500px]">
        <Image
          src="/hm3.jpg"
          alt={
            language === "bn"
              ? "বাংলাদেশের হাওরাঞ্চলের প্রাকৃতিক দৃশ্য"
              : "Haor wetland landscape in Bangladesh"
          }
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 mx-auto w-full max-w-4xl px-5 py-14 text-center">
          <p className="text-xs font-semibold tracking-[0.15em] text-white/90 sm:text-sm">
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
              href="#haor-mission"
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
        id="haor-mission"
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

      {/* WHY HAORS MATTER */}
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

      {/* HAOR DIRECTORY */}
      <section className="px-4 py-9 sm:px-6 sm:py-11 lg:px-8">
        <div className="mx-auto max-w-4xl border-t border-slate-200 pt-8">
          <p className="text-sm font-semibold text-emerald-800">
            {t.haorsLabel}
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            {t.haorsTitle}
          </h2>

          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
            {t.haorsDescription}
          </p>

          <div className="mt-5 divide-y divide-slate-200 border-y border-slate-200">
            {t.haors.map((haor, index) => (
              <article key={haor.title} className="flex gap-4 py-4">
                <span className="pt-1 text-sm font-semibold tabular-nums text-emerald-800">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-slate-900">
                    {haor.title}
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {haor.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CONSERVATION PRIORITIES */}
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
                <ShieldCheck
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
