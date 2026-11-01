"use client";

import Navbar from "../Navbar";
import FloatingContact from "../FloatingContact";
import Footer from "../Footer";
import AboutHero from "./AboutHero";

export default function AboutPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#f7f9f6]">
      <AboutHero />

      <Navbar />

      <div className="mx-auto w-full max-w-7xl space-y-7 px-4 py-7 sm:space-y-9 sm:px-6 sm:py-10 lg:px-8">
         {children}
      </div>

      <FloatingContact />
      <Footer />
    </main>
  );
}