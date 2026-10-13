import type { Metadata } from "next";
import Image from "next/image";
import { Target, Eye, ArrowDown } from "lucide-react";
import Navbar from "../Navbar";

export const metadata: Metadata = {
  title: "Mission & Vision | Haor Rokkha Andolan",
  description:
    "The mission and vision of Haor Rokkha Andolan for protecting Bangladesh's haors, rivers, wetlands, and biodiversity.",
};

export default function MissionVisionPage() {
  return (
    <main className="min-h-screen bg-white font-sans text-slate-800 antialiased">
      <Navbar />

      {/* Hero */}
      <section className="relative flex min-h-[360px] items-center justify-center overflow-hidden bg-emerald-950 sm:min-h-[420px] lg:min-h-[460px] mt-16">
        <Image
          src="/monu5.jpg"
          alt="The haor wetlands of Bangladesh"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Image overlay */}
        <div className="absolute inset-0 bg-emerald-950/65" />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/35 via-emerald-950/40 to-emerald-950/75" />

        {/* Centered heading */}
        <div className="relative z-10 mx-auto max-w-4xl px-5 py-24 text-center sm:px-8">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-emerald-300 sm:text-sm">
            Haor Rokkha Andolan
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Mission <span className="text-emerald-300">&amp;</span> Vision
          </h1>

          <div className="mx-auto mt-6 h-1 w-16 bg-emerald-400" />

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/90 sm:text-base sm:leading-8">
            Our commitment to protecting Bangladesh&apos;s haors, rivers,
            wetlands, and biodiversity for generations to come.
          </p>

          <a
            href="#mission-vision"
            aria-label="Explore our mission and vision"
            className="mx-auto mt-7 inline-flex h-10 w-10 items-center justify-center border border-white/50 text-white transition hover:border-emerald-400 hover:bg-emerald-400 hover:text-emerald-950"
          >
            <ArrowDown size={18} />
          </a>
        </div>

        {/* Bottom accent */}
        <div className="absolute bottom-0 left-0 h-1 w-full bg-emerald-400" />
      </section>

      {/* Mission and Vision */}
      <section
        id="mission-vision"
        className="scroll-mt-20 bg-slate-50 py-12 sm:py-16 lg:py-20"
      >
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <div className="grid items-stretch gap-5 md:grid-cols-2 md:gap-7">
            {/* Mission */}
            <article className="border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:border-emerald-700/50 hover:shadow-md sm:p-8 lg:p-9">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800">
                <Target size={25} strokeWidth={1.8} />
              </div>

              <h2 className="mt-5 text-2xl font-bold tracking-tight text-emerald-950 sm:text-3xl">
                Our Mission
              </h2>

              <div className="mt-3 h-1 w-12 bg-emerald-700" />

              <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base">
                To protect and conserve Bangladesh&apos;s haors, rivers,
                wetlands, and natural ecosystems through environmental
                awareness, community participation, advocacy, and responsible
                action.
              </p>

              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                We strive to preserve biodiversity, address environmental
                degradation, and encourage collective responsibility for our
                natural resources.
              </p>
            </article>

            {/* Vision */}
            <article className="border border-emerald-950 bg-emerald-950 p-6 text-white shadow-sm transition duration-300 hover:shadow-md sm:p-8 lg:p-9">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 text-emerald-300">
                <Eye size={25} strokeWidth={1.8} />
              </div>

              <h2 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">
                Our Vision
              </h2>

              <div className="mt-3 h-1 w-12 bg-emerald-400" />

              <p className="mt-5 text-sm leading-7 text-emerald-50/90 sm:text-base">
                A Bangladesh where rivers flow freely, haors and wetlands
                thrive, biodiversity is protected, and natural resources are
                valued and managed sustainably.
              </p>

              <p className="mt-4 text-sm leading-7 text-emerald-50/90 sm:text-base">
                We envision environmentally conscious communities working
                together to preserve our natural heritage for future
                generations.
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}