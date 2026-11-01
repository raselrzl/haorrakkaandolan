"use client";

import { useEffect, useState } from "react";

const heroImages = [
  "/haor1.jpg",
  "/haor2.jpg",
  "/haor3.jpg",
  "/monu1.jpg",
  "/monu5.jpg",
];

export default function AboutHero() {
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % heroImages.length);
    }, 6000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="relative isolate h-[260px] w-full overflow-hidden bg-slate-950 sm:h-[310px] lg:h-[350px]">
      {/* Top gradient border — 10px */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-50 h-[10px] bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300"
        aria-hidden="true"
      />

      {/* Background image carousel */}
      {heroImages.map((image, index) => (
        <div
          key={image}
          aria-hidden="true"
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
            activeImage === index ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url("${image}")` }}
        />
      ))}

      {/* Image overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/55 to-slate-950/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-slate-950/10" />

      {/* Centered hero content */}
      <div className="relative mx-auto flex h-full w-full max-w-7xl items-center justify-center px-4 text-center sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
          About Us
        </h1>
      </div>
    </section>
  );
}
