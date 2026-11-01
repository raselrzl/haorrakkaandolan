import type { Metadata } from "next";
import Image from "next/image";
import { Waves } from "lucide-react";
import LawPageContent from "./LawPageContent";
import Navbar from "../Navbar";
import Footer from "../Footer";

export const metadata: Metadata = {
  title: "Haor, River & Wetland Protection Laws | Haor Rokkha Andolan",
  description:
    "Explore Bangladesh's haor, wetland, river, water, wildlife and environmental protection laws in English and Bangla.",
};

export default function LawsPage() {
  return (
    <>
      {/* HERO — SAME SIZE AS OTHER PUBLIC PAGES */}
      <section className="relative isolate h-[260px] w-full overflow-hidden bg-emerald-950 sm:h-[310px] lg:h-[350px]">
        <Image
          src="/hm3.jpg"
          alt="Wetland landscape in Bangladesh"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        <div className="absolute inset-0 bg-emerald-950/65" />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/75 via-emerald-950/25 to-emerald-950/35" />

        {/* Yellow top accent */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[10px] bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300"
          aria-hidden="true"
        />

        <div className="relative z-10 flex h-full items-center justify-center px-4 pt-2 text-center">
          <div className="mx-auto max-w-3xl">

            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Haor, River & Wetland Protection Laws
            </h1>

            <div className="mx-auto mt-5 h-1 w-14 bg-gradient-to-r from-yellow-300 to-amber-400" />
          </div>
        </div>
      </section>

      {/* NAVIGATION — AFTER HERO */}
      <Navbar />

      {/* LAW CONTENT */}
      <LawPageContent />

      {/* SHARED SITE FOOTER */}
      <Footer />
    </>
  );
}