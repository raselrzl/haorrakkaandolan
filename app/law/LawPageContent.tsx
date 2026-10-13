"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Gavel,
  Leaf,
  Scale,
  ShieldCheck,
  Waves,
} from "lucide-react";
import Navbar from "../Navbar";

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

const primaryButton =
  "inline-flex items-center justify-center gap-1.5 rounded-full bg-emerald-700 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700";

const secondaryButton =
  "inline-flex items-center justify-center gap-1.5 rounded-full border border-white/40 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

export default function LawPageContent() {
  const [language, setLanguage] = useState<Language>("en");
  const bn = language === "bn";

  return (
    <main lang={language} className="min-h-screen bg-[#f5f8f5] text-slate-700">
      <Navbar />

      {/* HERO */}
      <section className="relative isolate mt-16 overflow-hidden bg-emerald-950">
        <div className="absolute inset-0">
          <Image
            src="/hm3.jpg"
            alt="Wetland landscape in Bangladesh"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-linear-to-r from-emerald-950/95 via-emerald-950/80 to-emerald-950/50" />
        </div>

        <div className="relative mx-auto flex min-h-72.5 max-w-7xl items-center px-5 py-10 sm:min-h-82.5">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-900/50 px-3 py-1.5 text-[10px] font-bold tracking-wider text-emerald-100 uppercase">
              <Scale size={14} />
              {bn ? "আইন ও পরিবেশ সুরক্ষা" : "Law & environmental protection"}
            </span>

            <h1 className="mt-4 max-w-3xl text-3xl leading-tight font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {bn
                ? "হাওর, নদী ও জলাভূমি রক্ষার আইন"
                : "Haor, River & Wetland Protection Laws"}
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-emerald-50/90 sm:text-base">
              {bn
                ? "বাংলাদেশের হাওর, নদী, জলাভূমি, পানি সম্পদ ও জীববৈচিত্র্য সংরক্ষণে প্রাসঙ্গিক আইন সম্পর্কে জানুন।"
                : "Explore the laws relevant to protecting Bangladesh's haors, rivers, wetlands, water resources and biodiversity."}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <a href="#laws" className={primaryButton}>
                <BookOpen size={14} />
                {bn ? "আইনসমূহ" : "Explore the laws"}
                <ArrowUpRight size={13} />
              </a>
              <a href="#responsibility" className={secondaryButton}>
                {bn ? "আমাদের দায়িত্ব" : "Our responsibility"}
              </a>
              <div className="flex w-fit items-center gap-1 rounded-full border border-slate-200 bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  aria-pressed={!bn}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                    !bn
                      ? "bg-emerald-700 text-white shadow-sm"
                      : "text-slate-600 hover:text-emerald-800"
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("bn")}
                  aria-pressed={bn}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                    bn
                      ? "bg-emerald-700 text-white shadow-sm"
                      : "text-slate-600 hover:text-emerald-800"
                  }`}
                >
                  বাংলা
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="px-4 py-7">
        <article className="mx-auto max-w-4xl rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800">
              <Scale size={19} />
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-[0.14em] text-emerald-700 uppercase">
                {bn ? "ভূমিকা" : "INTRODUCTION"}
              </p>
              <h2 className="mt-0.5 text-xl font-bold tracking-tight text-slate-900">
                {bn ? "আইন জানা কেন জরুরি?" : "Why do these laws matter?"}
              </h2>
            </div>
          </div>

          <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
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
        </article>
      </section>

      {/* LAW SUMMARIES */}
      <section id="laws" className="scroll-mt-20 px-4 sm:py-10">
        <div className="mx-auto max-w-4xl">
          <div className="mb-5">
            <p className="text-[10px] font-bold tracking-[0.14em] text-emerald-700 uppercase">
              {bn ? "প্রাসঙ্গিক আইনসমূহ" : "RELEVANT LEGISLATION"}
            </p>
            <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              {bn ? "আইন ও সংশ্লিষ্ট বিধান" : "Laws and relevant provisions"}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              {bn
                ? "প্রতিটি আইন ধারাবাহিকভাবে নম্বর দিয়ে উপস্থাপন করা হয়েছে। এখানে দেওয়া সারসংক্ষেপগুলো সরকারি আইনের পূর্ণ পাঠের বিকল্প নয়।"
                : "Each law is presented as a numbered section. These summaries do not replace the complete official legislation."}
            </p>
          </div>

          <div className="space-y-4">
            {laws.map((law) => {
              const Icon = law.icon;

              return (
                <article
                  key={law.number}
                  className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="p-4 sm:p-6">
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-xs font-bold text-white">
                        {law.number}
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <Icon size={14} className="text-emerald-700" />
                          <p className="text-[10px] font-bold tracking-[0.12em] text-emerald-700 uppercase">
                            {law.category}
                          </p>
                        </div>

                        <h3 className="mt-1.5 text-base leading-snug font-bold text-slate-900 sm:text-lg">
                          {law.title[language]}
                        </h3>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {law.reference[language]}
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-7 text-slate-600">
                      {law.description[language]}
                    </p>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {law.provisions.map((provision) => (
                        <section
                          key={provision.heading.en}
                          className="rounded-xl border border-slate-100 bg-slate-50/80 p-3.5"
                        >
                          <h4 className="text-sm leading-6 font-bold text-slate-800">
                            {provision.heading[language]}
                          </h4>
                          <p className="mt-1.5 text-sm leading-6 text-slate-600">
                            {provision.text[language]}
                          </p>
                        </section>
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
        className="scroll-mt-20 px-2 py-8 sm:py-10"
      >
        <div className="mx-auto max-w-4xl rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800">
              <ShieldCheck size={19} />
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-[0.14em] text-emerald-700 uppercase">
                {bn ? "জনসচেতনতা" : "PUBLIC AWARENESS"}
              </p>
              <h2 className="mt-0.5 text-xl font-bold text-slate-900 sm:text-2xl">
                {bn
                  ? "হাওর ও নদী রক্ষায় আমাদের দায়িত্ব"
                  : "Our responsibility to protect haors and rivers"}
              </h2>
            </div>
          </div>

          <p className="mt-3 text-sm leading-7 text-slate-600">
            {bn
              ? "নিচের বিষয়গুলো হাওর রক্ষা আন্দোলনের জনসচেতনতামূলক নীতি, আইনের সরাসরি উদ্ধৃতি নয়।"
              : "The following principles support Haor Rokkha Andolan's public-awareness work; they are not direct quotations from legislation."}
          </p>

          <ol className="mt-4 space-y-2">
            {principles.map((principle, index) => (
              <li
                key={index}
                className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-3.5 py-3"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-900">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="flex-1 pt-0.5 text-sm leading-6 font-medium text-slate-700">
                  {principle[language]}
                </p>
                <CheckCircle2
                  size={16}
                  className="mt-1 shrink-0 text-emerald-700"
                />
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* LEGAL NOTICE */}
      <section className="px-4 pb-7 ">
        <div className="mx-auto flex max-w-4xl items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 sm:px-5">
          <Gavel size={18} className="mt-0.5 shrink-0 text-amber-800" />
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              {bn ? "আইনি বিজ্ঞপ্তি" : "Legal notice"}
            </h2>
            <p className="mt-1.5 text-sm leading-6 text-slate-600">
              {bn
                ? "এই পৃষ্ঠাটি সাধারণ তথ্য ও জনসচেতনতার জন্য তৈরি। এটি আইনের পূর্ণ পাঠ বা আইনগত পরামর্শের বিকল্প নয়। আইন সংশোধিত হতে পারে। কোনো অভিযোগ, প্রকল্প, নিষেধাজ্ঞা বা দণ্ডের বিষয়ে সিদ্ধান্ত নেওয়ার আগে হালনাগাদ সরকারি আইন, প্রযোজ্য বিধিমালা ও সংশ্লিষ্ট কর্তৃপক্ষের নির্দেশনা যাচাই করুন।"
                : "This page is for general information and public awareness. It does not replace the full legislation or legal advice. Laws may be amended. Before acting on a complaint, project, restriction or penalty, verify the current official text, applicable rules and guidance from the relevant authority."}
            </p>
          </div>
        </div>
      </section>

      {/* COMPACT FOOTER */}
      <footer className="border-t border-emerald-900 bg-emerald-950 px-4 py-2 text-white sm:px-8">
        <div className="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-semibold text-emerald-50">
            <span className="font-normal text-emerald-100/70">
              {bn
                ? "হাওর ও প্রকৃতি রক্ষায় জনসচেতনতা"
                : "Environmental awareness"}
            </span>
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={mainActUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-700 px-3 py-1.5 text-[11px] font-medium text-emerald-50 transition hover:bg-emerald-900"
            >
              <BookOpen size={13} />
              {bn ? "সরকারি আইন" : "Official Act"}
              <ExternalLink size={11} />
            </a>

            <Link
              href="/"
              className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-100/80 transition hover:text-white"
            >
              <ArrowLeft size={12} />
              {bn ? "হোম" : "Home"}
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
