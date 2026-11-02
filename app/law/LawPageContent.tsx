"use client";

import { useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Gavel,
  Leaf,
  ShieldCheck,
  Waves,
  ArrowUpRight,
} from "lucide-react";

type Language = "en" | "bn";

type BilingualText = {
  en: string;
  bn: string;
};

const laws: {
  number: string;
  category: string;
  title: BilingualText;
  reference: BilingualText;
  description: BilingualText;
  provisions: {
    heading: BilingualText;
    text: BilingualText;
  }[];
  icon: typeof Waves;
}[] = [
  {
    number: "01",
    category: "PRIMARY LAW",
    title: {
      en: "Bangladesh Haor and Wetland Conservation Act, 2026",
      bn: "বাংলাদেশ হাওর ও জলাভূমি সংরক্ষণ আইন, ২০২৬",
    },
    reference: {
      en: "Act No. 10 of 2026 · 10 April 2026",
      bn: "২০২৬ সনের ১০ নং আইন · ১০ এপ্রিল ২০২৬",
    },
    description: {
      en: "The principal legislation specifically addressing the protection, conservation and development of haors and wetlands in Bangladesh.",
      bn: "বাংলাদেশের হাওর ও জলাভূমির সুরক্ষা, সংরক্ষণ ও উন্নয়নের জন্য প্রণীত প্রধান বিশেষ আইন।",
    },
    provisions: [
      {
        heading: {
          en: "01.1 — Listing haors and wetlands",
          bn: "০১.১ — হাওর ও জলাভূমির তালিকা প্রণয়ন",
        },
        text: {
          en: "Section 8 addresses the preparation of a list of haors and wetlands, while Section 9 concerns the preparation of a master plan.",
          bn: "ধারা ৮-এ হাওর ও জলাভূমির তালিকা প্রণয়ন এবং ধারা ৯-এ মহাপরিকল্পনা প্রণয়নের বিষয় রয়েছে।",
        },
      },
      {
        heading: {
          en: "01.2 — Protection and reserved wetlands",
          bn: "০১.২ — সুরক্ষা ও সংরক্ষিত জলাভূমি",
        },
        text: {
          en: "Sections 11 and 12 address protection orders and the declaration of reserved haors and wetlands.",
          bn: "ধারা ১১-তে সুরক্ষা আদেশ জারি এবং ধারা ১২-তে সংরক্ষিত হাওর ও জলাভূমি ঘোষণার বিষয় রয়েছে।",
        },
      },
      {
        heading: {
          en: "01.3 — Prohibited activities",
          bn: "০১.৩ — নিষিদ্ধ কার্যক্রম",
        },
        text: {
          en: "Section 13 specifically addresses prohibited activities in haor and wetland areas.",
          bn: "ধারা ১৩-তে হাওর ও জলাভূমি এলাকায় কতিপয় কার্যক্রম নিষিদ্ধ করার বিধান রয়েছে।",
        },
      },
      {
        heading: {
          en: "01.4 — Development projects and ecosystem damage",
          bn: "০১.৪ — উন্নয়ন প্রকল্প ও প্রতিবেশ ব্যবস্থার ক্ষতি",
        },
        text: {
          en: "Sections 14 and 15 address departmental opinions on development projects and action against damage to haor and wetland ecosystems.",
          bn: "ধারা ১৪-তে উন্নয়ন প্রকল্পে অধিদপ্তরের মতামত এবং ধারা ১৫-তে হাওর ও জলাভূমির প্রতিবেশ ব্যবস্থার ক্ষতির বিরুদ্ধে ব্যবস্থা গ্রহণের বিষয় রয়েছে।",
        },
      },
      {
        heading: {
          en: "01.5 — Offences, penalties and enforcement",
          bn: "০১.৫ — অপরাধ, দণ্ড ও আইন প্রয়োগ",
        },
        text: {
          en: "Sections 19–23 cover investigation and trial, offences and penalties, related matters, and the application of the Mobile Court Act, 2009.",
          bn: "ধারা ১৯–২৩-এ তদন্ত ও বিচার, অপরাধ ও দণ্ড, সংশ্লিষ্ট বিষয় এবং মোবাইল কোর্ট আইন, ২০০৯-এর প্রয়োগ অন্তর্ভুক্ত রয়েছে।",
        },
      },
    ],
    icon: Waves,
  },
  {
    number: "02",
    category: "WATER RESOURCES",
    title: {
      en: "Bangladesh Water Act, 2013",
      bn: "বাংলাদেশ পানি আইন, ২০১৩",
    },
    reference: {
      en: "Act No. 14 of 2013",
      bn: "২০১৩ সনের ১৪ নং আইন",
    },
    description: {
      en: "Provides a legal framework for the integrated management, use, protection and conservation of water resources.",
      bn: "পানি সম্পদের সমন্বিত ব্যবস্থাপনা, ব্যবহার, সুরক্ষা ও সংরক্ষণের আইনি কাঠামো প্রদান করে।",
    },
    provisions: [
      {
        heading: {
          en: "02.1 — Water-resource management",
          bn: "০২.১ — পানি সম্পদের ব্যবস্থাপনা",
        },
        text: {
          en: "Relevant to the responsible management and use of water resources in rivers, wetlands and connected water systems.",
          bn: "নদী, জলাভূমি ও সংযুক্ত পানিব্যবস্থায় পানি সম্পদের দায়িত্বশীল ব্যবস্থাপনা ও ব্যবহারের সঙ্গে সম্পর্কিত।",
        },
      },
      {
        heading: {
          en: "02.2 — Sustainable water use",
          bn: "০২.২ — পানির টেকসই ব্যবহার",
        },
        text: {
          en: "Water-resource decisions should be considered within the applicable legal framework and the needs of connected ecosystems.",
          bn: "পানি সম্পদবিষয়ক সিদ্ধান্তে প্রযোজ্য আইনি কাঠামো এবং সংযুক্ত বাস্তুতন্ত্রের প্রয়োজন বিবেচনা করা জরুরি।",
        },
      },
    ],
    icon: Waves,
  },
  {
    number: "03",
    category: "ENVIRONMENTAL PROTECTION",
    title: {
      en: "Bangladesh Environment Conservation Act, 1995",
      bn: "বাংলাদেশ পরিবেশ সংরক্ষণ আইন, ১৯৯৫",
    },
    reference: {
      en: "Check the current consolidated text and amendments",
      bn: "হালনাগাদ সমন্বিত পাঠ ও সংশোধনী যাচাই করুন",
    },
    description: {
      en: "An important part of Bangladesh's environmental legal framework, relevant to environmental protection and pollution control.",
      bn: "বাংলাদেশের পরিবেশগত আইনি কাঠামোর একটি গুরুত্বপূর্ণ আইন, যা পরিবেশ সুরক্ষা ও দূষণ নিয়ন্ত্রণের সঙ্গে সম্পর্কিত।",
    },
    provisions: [
      {
        heading: {
          en: "03.1 — Environmental protection",
          bn: "০৩.১ — পরিবেশ সুরক্ষা",
        },
        text: {
          en: "Environmental decisions and activities should comply with applicable environmental legislation and rules.",
          bn: "পরিবেশবিষয়ক সিদ্ধান্ত ও কার্যক্রমে প্রযোজ্য পরিবেশ আইন ও বিধিমালা অনুসরণ করা উচিত।",
        },
      },
      {
        heading: {
          en: "03.2 — Pollution prevention",
          bn: "০৩.২ — দূষণ প্রতিরোধ",
        },
        text: {
          en: "Pollution affecting water, habitats and surrounding communities should be addressed through the applicable legal and regulatory framework.",
          bn: "পানি, আবাসস্থল ও স্থানীয় জনগোষ্ঠীকে প্রভাবিত করে এমন দূষণ প্রযোজ্য আইন ও বিধিমালার মাধ্যমে মোকাবিলা করা উচিত।",
        },
      },
    ],
    icon: Leaf,
  },
  {
    number: "04",
    category: "BIODIVERSITY",
    title: {
      en: "Bangladesh Biodiversity Act, 2017",
      bn: "বাংলাদেশ জীববৈচিত্র্য আইন, ২০১৭",
    },
    reference: {
      en: "Biodiversity conservation",
      bn: "জীববৈচিত্র্য সংরক্ষণ",
    },
    description: {
      en: "Relevant to the conservation of biological diversity and the protection and sustainable use of biological resources.",
      bn: "জীববৈচিত্র্য সংরক্ষণ এবং জৈবসম্পদের সুরক্ষা ও টেকসই ব্যবহারের সঙ্গে সম্পর্কিত।",
    },
    provisions: [
      {
        heading: {
          en: "04.1 — Ecosystems and species",
          bn: "০৪.১ — বাস্তুতন্ত্র ও প্রজাতি",
        },
        text: {
          en: "Wetlands support fish, birds, plants and other organisms whose habitats contribute to ecological balance.",
          bn: "জলাভূমি মাছ, পাখি, উদ্ভিদ ও অন্যান্য জীবের আবাসস্থল, যা পরিবেশগত ভারসাম্য রক্ষায় ভূমিকা রাখে।",
        },
      },
      {
        heading: {
          en: "04.2 — Responsible use of biological resources",
          bn: "০৪.২ — জৈবসম্পদের দায়িত্বশীল ব্যবহার",
        },
        text: {
          en: "Conservation efforts should consider biodiversity and the sustainable use of biological resources under applicable law.",
          bn: "সংরক্ষণ কার্যক্রমে প্রযোজ্য আইন অনুযায়ী জীববৈচিত্র্য ও জৈবসম্পদের টেকসই ব্যবহার বিবেচনা করা উচিত।",
        },
      },
    ],
    icon: Leaf,
  },
  {
    number: "05",
    category: "WILDLIFE CONSERVATION",
    title: {
      en: "Wildlife Conservation Legislation",
      bn: "বন্যপ্রাণী সংরক্ষণবিষয়ক আইন",
    },
    reference: {
      en: "Consult the current official legislation",
      bn: "বর্তমানে কার্যকর সরকারি আইন যাচাই করুন",
    },
    description: {
      en: "Wildlife legislation is relevant to the protection of wild animals, habitats and protected areas, including those associated with wetlands.",
      bn: "বন্যপ্রাণী, আবাসস্থল ও সংরক্ষিত এলাকা—বিশেষত জলাভূমিনির্ভর প্রজাতির সুরক্ষায় বন্যপ্রাণীবিষয়ক আইন প্রাসঙ্গিক।",
    },
    provisions: [
      {
        heading: {
          en: "05.1 — Wildlife and habitat protection",
          bn: "০৫.১ — বন্যপ্রাণী ও আবাসস্থল সুরক্ষা",
        },
        text: {
          en: "Protecting wildlife also requires safeguarding feeding, breeding and migration habitats.",
          bn: "বন্যপ্রাণী সংরক্ষণের জন্য তাদের খাদ্য সংগ্রহ, প্রজনন ও চলাচলের আবাসস্থল রক্ষা করাও জরুরি।",
        },
      },
      {
        heading: {
          en: "05.2 — Protected areas and restrictions",
          bn: "০৫.২ — সংরক্ষিত এলাকা ও বিধিনিষেধ",
        },
        text: {
          en: "Applicable restrictions depend on the current legislation, the designated area and the activity involved.",
          bn: "প্রযোজ্য বিধিনিষেধ নির্ভর করে কার্যকর আইন, ঘোষিত এলাকার ধরন এবং সংশ্লিষ্ট কার্যক্রমের ওপর।",
        },
      },
    ],
    icon: ShieldCheck,
  },
];

const principles: BilingualText[] = [
  {
    en: "Do not illegally fill, occupy or alter wetlands.",
    bn: "অবৈধভাবে জলাভূমি ভরাট, দখল বা পরিবর্তন করবেন না।",
  },
  {
    en: "Protect rivers, canals and natural water flows.",
    bn: "নদী, খাল ও প্রাকৃতিক পানিপ্রবাহ রক্ষা করুন।",
  },
  {
    en: "Prevent pollution and the destruction of aquatic habitats.",
    bn: "দূষণ ও জলজ প্রাণীর আবাসস্থল ধ্বংস প্রতিরোধ করুন।",
  },
  {
    en: "Protect fish, migratory birds and wetland biodiversity.",
    bn: "মাছ, অতিথি পাখি ও জলাভূমির জীববৈচিত্র্য রক্ষা করুন।",
  },
  {
    en: "Report suspected violations to the appropriate authority.",
    bn: "আইন লঙ্ঘনের আশঙ্কা থাকলে সংশ্লিষ্ট কর্তৃপক্ষকে জানান।",
  },
];

const mainActUrl = "https://bdlaws.minlaw.gov.bd/act-1639.html";

export default function LawPageContent() {
  const [language, setLanguage] = useState<Language>("en");
  const bn = language === "bn";

  return (
    <main lang={language} className="min-h-screen bg-[#faf9f6] text-slate-800">
      {/* INTRODUCTION */}
      <section className="px-4 pb-12 pt-8 sm:pb-16 sm:pt-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-8 border-b border-amber-200 pb-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-700">
                <span className="h-px w-8 bg-amber-500" />
                {bn ? "আইন ও পরিবেশ সুরক্ষা" : "LAW & ENVIRONMENTAL PROTECTION"}
              </div>

              <h1 className="text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                {bn
                  ? "হাওর ও জলাভূমি সুরক্ষায় আইন"
                  : "Laws that protect our wetlands"}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div
                className="flex w-fit items-center gap-1 rounded-full border border-amber-200 bg-white p-1"
                role="group"
                aria-label="Select language"
              >
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  aria-pressed={!bn}
                  className={`rounded-full px-5 py-2 text-xs font-bold transition-all duration-200 ${
                    !bn
                      ? "bg-amber-600 text-white shadow-sm"
                      : "bg-transparent text-slate-600 hover:bg-amber-50 hover:text-amber-700"
                  }`}
                >
                  English
                </button>

                <button
                  type="button"
                  onClick={() => setLanguage("bn")}
                  aria-pressed={bn}
                  className={`rounded-full px-5 py-2 text-xs font-bold transition-all duration-200 ${
                    bn
                      ? "bg-amber-600 text-white shadow-sm"
                      : "bg-transparent text-slate-600 hover:bg-amber-50 hover:text-amber-700"
                  }`}
                >
                  বাংলা
                </button>
              </div>

              <a
                href={mainActUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-amber-600 px-4 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-amber-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
              >
                <BookOpen size={15} />
                {bn ? "সরকারি আইন" : "Official Act"}
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>

          <div className="grid gap-8 pt-7 md:grid-cols-[1fr_2fr] md:gap-12">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-700">
                {bn ? "ভূমিকা" : "INTRODUCTION"}
              </p>

              <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900">
                {bn ? "আইন জানা কেন জরুরি?" : "Why these laws matter"}
              </h2>
            </div>

            <div className="space-y-3 text-sm leading-7 text-slate-600">
              <p>
                {bn
                  ? "হাওর, নদী ও জলাভূমি বাংলাদেশের পরিবেশ, কৃষি, মৎস্যসম্পদ, জীববৈচিত্র্য এবং মানুষের জীবন-জীবিকার গুরুত্বপূর্ণ অংশ। এসব প্রাকৃতিক সম্পদ রক্ষায় আইন জানা, পরিবেশগত দায়িত্ব পালন এবং প্রয়োজনে সংশ্লিষ্ট কর্তৃপক্ষের সহায়তা নেওয়া জরুরি।"
                  : "Haors, rivers and wetlands are essential to Bangladesh's environment, agriculture, fisheries, biodiversity and local livelihoods. Understanding relevant laws helps communities recognise their environmental responsibilities and identify the appropriate authorities when protection is needed."}
              </p>

              <p>
                {bn
                  ? "এই পৃষ্ঠায় প্রাসঙ্গিক আইনগুলোর পরিচিতি ও বিষয়ভিত্তিক সারসংক্ষেপ দেওয়া হয়েছে। সঠিক আইনি ভাষা, ধারা, ব্যতিক্রম ও প্রয়োগ জানতে সরকারি মূল আইন পড়ুন।"
                  : "This page introduces relevant legislation and summarises its subject matter. Consult the official legal text for exact wording, section numbers, exceptions and application."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LAW SUMMARIES */}
      <section id="laws" className="scroll-mt-20 px-4 pb-14 sm:pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4 border-b border-amber-200 pb-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-700">
                {bn ? "প্রাসঙ্গিক আইনসমূহ" : "LEGISLATIVE FRAMEWORK"}
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {bn ? "আইন ও সংশ্লিষ্ট বিধান" : "Laws and relevant provisions"}
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                {bn
                  ? "প্রতিটি আইন ধারাবাহিকভাবে নম্বর দিয়ে উপস্থাপন করা হয়েছে। এখানে দেওয়া সারসংক্ষেপগুলো সরকারি আইনের পূর্ণ পাঠের বিকল্প নয়।"
                  : "Explore the legislation and its relevant subject areas. These summaries do not replace the complete official legislation."}
              </p>
            </div>

            <span className="text-xs font-semibold tracking-wide text-slate-500">
              05 {bn ? "টি আইন" : "LEGISLATIVE ENTRIES"}
            </span>
          </div>

          <div>
            {laws.map((law) => {
              const Icon = law.icon;

              return (
                <article
                  key={law.number}
                  className="group grid gap-5 border-b border-amber-200 py-8 transition-colors first:pt-2 last:border-b-0 hover:border-amber-400 md:grid-cols-[100px_minmax(0,1fr)] md:gap-8 md:py-10"
                >
                  <div className="flex items-start justify-between md:block">
                    <span className="block text-4xl font-light leading-none tracking-tighter text-amber-600/65 transition-colors group-hover:text-amber-700 sm:text-5xl">
                      {law.number}
                    </span>

                    <Icon
                      size={23}
                      strokeWidth={1.5}
                      className="text-amber-700 transition-colors group-hover:text-amber-800 md:mt-5"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-700">
                        {law.category}
                      </span>

                      <span className="h-1 w-1 rounded-full bg-amber-500/70" />

                      <span className="text-xs text-slate-500">
                        {law.reference[language]}
                      </span>
                    </div>

                    <h3 className="mt-3 max-w-4xl text-xl font-bold leading-snug tracking-tight text-slate-900 transition-colors group-hover:text-amber-800 sm:text-2xl">
                      {law.title[language]}
                    </h3>

                    <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                      {law.description[language]}
                    </p>

                    <div className="mt-7 border-t border-amber-200">
                      {law.provisions.map((provision, index) => (
                        <div
                          key={provision.heading.en}
                          className="grid gap-2 border-b border-amber-100 py-4 last:border-b-0 sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.5fr)] sm:gap-8"
                        >
                          <h4 className="text-sm font-bold leading-6 text-slate-800">
                            <span className="mr-2 text-amber-700">
                              {String(index + 1).padStart(2, "0")}
                            </span>

                            {provision.heading[language].replace(
                              /^\d+\.\d+\s*—\s*/,
                              "",
                            )}
                          </h4>

                          <p className="text-sm leading-6 text-slate-600">
                            {provision.text[language]}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* CONSERVATION RESPONSIBILITY */}
      <section
        id="responsibility"
        className="relative isolate scroll-mt-20 overflow-hidden bg-gray-50 px-4 py-24 text-slate-900 sm:py-28"
      >
        {/* TOP ORGANIC WAVE EDGE */}
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-28 sm:h-36">
          <svg
            viewBox="0 0 1440 180"
            preserveAspectRatio="none"
            className="h-full w-full"
          >
            <path
              d="M0 0H1440V45C1250 105 1120 125 930 91C700 49 590 12 365 62C190 101 100 88 0 125V0Z"
              fill="#faf9f6"
            />
          </svg>
        </div>

        {/* BOTTOM ORGANIC WAVE EDGE */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-32 sm:h-40">
          <svg
            viewBox="0 0 1440 180"
            preserveAspectRatio="none"
            className="h-full w-full"
          >
            <path
              d="M0 75C190 5 340 12 540 67C760 128 900 145 1100 91C1240 54 1350 38 1440 65V180H0V75Z"
              fill="#faf9f6"
            />
          </svg>
        </div>

        {/* DECORATIVE LEAF */}
        <div className="pointer-events-none absolute -bottom-5 -left-5 -z-10 opacity-[0.17]">
          <svg
            viewBox="0 0 300 280"
            className="h-52 w-56 text-amber-600 sm:h-64 sm:w-64"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M10 270C75 205 100 125 120 15" strokeWidth="3" />
            <path
              d="M60 215C5 185 5 145 15 110C55 120 85 155 60 215Z"
              fill="currentColor"
              fillOpacity="0.45"
            />
            <path
              d="M85 165C35 130 45 85 70 55C105 85 115 125 85 165Z"
              fill="currentColor"
              fillOpacity="0.45"
            />
            <path
              d="M100 125C135 75 185 80 215 100C190 140 145 155 100 125Z"
              fill="currentColor"
              fillOpacity="0.45"
            />
            <path
              d="M65 220C120 170 180 165 255 190C205 245 125 255 65 220Z"
              fill="currentColor"
              fillOpacity="0.45"
            />
            <path d="M15 110L60 215M70 55L85 165M215 100L100 125M255 190L65 220" />
          </svg>
        </div>

        <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
          {/* LEFT CONTENT */}
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">
              <ShieldCheck size={23} strokeWidth={1.6} />
            </div>

            <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.22em] text-amber-700">
              {bn ? "জনসচেতনতা" : "PUBLIC AWARENESS"}
            </p>

            <h2 className="mt-3 max-w-lg text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">
              {bn
                ? "হাওর ও নদী রক্ষায় আমাদের দায়িত্ব"
                : "Our responsibility to protect haors and rivers"}
            </h2>

            <p className="mt-5 max-w-lg text-sm leading-7 text-slate-600">
              {bn
                ? "নিচের বিষয়গুলো হাওর রক্ষা আন্দোলনের জনসচেতনতামূলক নীতি, আইনের সরাসরি উদ্ধৃতি নয়।"
                : "The following principles support Haor Rokkha Andolan's public-awareness work; they are not direct quotations from legislation."}
            </p>
          </div>

          {/* RIGHT PRINCIPLES — NO STRAIGHT DIVIDERS */}
          <ol className="space-y-3">
            {principles.map((principle, index) => (
              <li
                key={index}
                className="group flex items-start gap-4 rounded-2xl px-3 py-4 transition-all duration-300 hover:bg-white hover:shadow-sm sm:gap-5 sm:px-5"
              >
                <span className="shrink-0 pt-0.5 text-xl font-bold tracking-wider text-amber-600 sm:text-2xl">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <p className="flex-1 text-sm leading-7 text-slate-700">
                  {principle[language]}
                </p>

                <CheckCircle2
                  size={20}
                  strokeWidth={1.8}
                  className="mt-1 shrink-0 text-amber-600 transition-transform duration-300 group-hover:scale-110"
                />
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* LEGAL NOTICE */}
      <section className="bg-[#faf9f6] px-4 py-9 sm:py-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 border-l-2 border-amber-500 bg-amber-50/70 px-5 py-5 sm:flex-row sm:items-start sm:gap-7 sm:px-7">
          <Gavel size={21} className="shrink-0 text-amber-700" />

          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-bold text-slate-900">
              {bn ? "আইনি বিজ্ঞপ্তি" : "Legal notice"}
            </h2>

            <p className="mt-2 text-sm leading-7 text-slate-600">
              {bn
                ? "এই পৃষ্ঠাটি সাধারণ তথ্য ও জনসচেতনতার জন্য তৈরি। এটি আইনের পূর্ণ পাঠ বা আইনগত পরামর্শের বিকল্প নয়। আইন সংশোধিত হতে পারে। কোনো অভিযোগ, প্রকল্প, নিষেধাজ্ঞা বা দণ্ডের বিষয়ে সিদ্ধান্ত নেওয়ার আগে হালনাগাদ সরকারি আইন, প্রযোজ্য বিধিমালা ও সংশ্লিষ্ট কর্তৃপক্ষের নির্দেশনা যাচাই করুন।"
                : "This page is for general information and public awareness. It does not replace the full legislation or legal advice. Laws may be amended. Before acting on a complaint, project, restriction or penalty, verify the current official text, applicable rules and guidance from the relevant authority."}
            </p>
          </div>

          <a
            href={mainActUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-2 text-xs font-bold text-amber-800 transition hover:text-amber-600"
          >
            <BookOpen size={14} />
            {bn ? "সরকারি আইন যাচাই করুন" : "Verify official Act"}
            <ExternalLink size={12} />
          </a>
        </div>
      </section>
    </main>
  );
}
