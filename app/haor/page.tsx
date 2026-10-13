import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Bird,
  Droplets,
  Fish,
  Leaf,
  MapPin,
  ShieldCheck,
  Waves,
} from "lucide-react";
import Navbar from "../Navbar";

export const metadata: Metadata = {
  title: "Haor Rokkha Andolan | Haors of Bangladesh",
  description:
    "Discover the haors of Bangladesh, their wetland ecosystems, biodiversity, local communities, and conservation.",
};

export default function HaorPage() {
  return (
    <main className="min-h-screen bg-white text-slate-800">
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-[400px] overflow-hidden bg-emerald-950">
        <Image
          src="/hm3.jpg"
          alt="Haor wetland landscape in Bangladesh"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        <div className="absolute inset-0 bg-emerald-950/45" />

        <div className="relative z-10 flex min-h-[400px] items-center justify-center px-4">
          <h1 className="text-center text-3xl font-bold tracking-wide text-white sm:text-4xl md:text-5xl">
            Haor Rokkha Andolan
          </h1>
        </div>
      </section>

      {/* DETAILS */}
      <section className="px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <article className="mx-auto max-w-5xl">
          {/* INTRODUCTION */}
          <section>
            <p className="text-xs font-bold tracking-[0.18em] text-emerald-700 uppercase">
              Our Natural Heritage
            </p>

            <h2 className="mt-3 flex items-center gap-3 text-2xl leading-tight font-bold tracking-tight text-emerald-950 sm:text-3xl">
              <Waves className="h-7 w-7 shrink-0 text-emerald-700" />
              Discover the Haors of Bangladesh
            </h2>

            <div className="mt-5 space-y-5 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
              <p>
                Haors are unique wetland ecosystems found mainly in northeastern
                Bangladesh. During the monsoon, large areas become vast expanses
                of water. In the dry season, parts of these wetlands emerge as
                fertile land used for agriculture. Rivers, canals, open water,
                and floodplains together create a distinctive natural
                environment.
              </p>

              <p>
                Haors are essential to the lives and livelihoods of local
                communities. They support fisheries, agricultural production,
                biodiversity, and families whose lives depend on seasonal
                changes in water and land.
              </p>

              <p>
                These wetlands provide habitats for fish, aquatic plants, and
                many species of resident and migratory birds. Protecting haors
                helps maintain ecological balance and preserves an important
                part of Bangladesh&apos;s natural heritage.
              </p>
            </div>
          </section>

          {/* IMPORTANCE */}
          <section className="mt-10">
            <h2 className="flex items-center gap-3 text-xl font-bold text-emerald-950 sm:text-2xl">
              <Droplets className="h-6 w-6 shrink-0 text-emerald-700" />
              Why Should We Protect Our Haors?
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
              <p>
                Wetland pollution, habitat destruction, unsustainable fishing,
                and disruption of natural water flows can threaten haor
                ecosystems. These problems affect wildlife as well as
                communities that rely on wetlands for food, income, and
                agriculture.
              </p>

              <p>
                Protecting haors requires public awareness, responsible use of
                natural resources, protection of habitats, and cooperation
                between local communities and environmental organisations.
              </p>

              <p>
                Haor Rokkha Andolan promotes wetland protection, environmental
                responsibility, and public awareness about preserving these
                valuable natural landscapes.
              </p>
            </div>
          </section>

          {/* CONSERVATION */}
          <section className="mt-10">
            <h2 className="flex items-center gap-3 text-xl font-bold text-emerald-950 sm:text-2xl">
              <ShieldCheck className="h-6 w-6 shrink-0 text-emerald-700" />
              Our Conservation Priorities
            </h2>

            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
              <li className="flex items-start gap-3">
                <Leaf className="mt-1 h-5 w-5 shrink-0 text-emerald-700" />
                Protect wetlands, rivers, canals, and natural habitats.
              </li>

              <li className="flex items-start gap-3">
                <Leaf className="mt-1 h-5 w-5 shrink-0 text-emerald-700" />
                Raise awareness about pollution and biodiversity loss.
              </li>

              <li className="flex items-start gap-3">
                <Fish className="mt-1 h-5 w-5 shrink-0 text-emerald-700" />
                Encourage sustainable fishing and responsible resource use.
              </li>

              <li className="flex items-start gap-3">
                <Bird className="mt-1 h-5 w-5 shrink-0 text-emerald-700" />
                Support community participation in wetland conservation.
              </li>
            </ul>
          </section>

          {/* HAOR DIRECTORY */}
          <section className="mt-10">
            <h2 className="flex items-center gap-3 text-xl font-bold text-emerald-950 sm:text-2xl">
              <MapPin className="h-6 w-6 shrink-0 text-emerald-700" />
              Explore the Haors
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
              <p>
                Bangladesh&apos;s haors differ in location, landscape,
                biodiversity, and importance to local communities. Learning
                about individual haors helps people understand their ecological
                value and the need for their protection.
              </p>

              <p>
                Explore our website for more information about wetland
                conservation and efforts to protect the natural heritage of the
                haor region.
              </p>
            </div>

            <Link
              href="/"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 transition hover:text-emerald-950"
            >
              <ArrowLeft size={16} />
              Return to Home
            </Link>
          </section>
        </article>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p className="font-semibold text-emerald-950">Haor Rokkha Andolan</p>

          <p className="text-slate-500">
            Protecting wetlands. Preserving our natural heritage.
          </p>

          <Link
            href="/"
            className="font-medium text-emerald-800 transition hover:text-emerald-950"
          >
            Back to Home
          </Link>
        </div>
      </footer>
    </main>
  );
}
