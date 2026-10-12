"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Menu,
  X,
  Leaf,
  Users,
  Sprout,
  Waves,
  Bird,
  HeartHandshake,
  Trees,
  ShieldCheck,
  MapPin,
  Mail,
  Phone,
  CalendarDays,
  ChevronRight,
  Globe,
} from "lucide-react";
import Navbar from "./Navbar";

const photos = {
  hero: "/h2.jpg",
  wetland:
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1100&q=85",
  forest:
    "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=85",
  river:
    "https://images.unsplash.com/photo-1437482078695-73f5ca6c96e2?auto=format&fit=crop&w=800&q=85",
  bird: "https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=800&q=85",
  planting:
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=85",
  water:
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=85",
  community:
    "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=85",
};

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
  { label: "Our Work", href: "#work" },
  { label: "News & Updates", href: "#news" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

const priorities = [
  {
    icon: Leaf,
    title: "Wetland Conservation",
    description:
      "Protecting haors, rivers, canals, and aquatic habitats for future generations.",
  },
  {
    icon: Users,
    title: "Community Awareness",
    description:
      "Encouraging communities to take collective action for a healthier environment.",
  },
  {
    icon: Sprout,
    title: "Biodiversity Protection",
    description:
      "Supporting the protection of native species and their natural habitats.",
  },
  {
    icon: Waves,
    title: "Sustainable Future",
    description:
      "Promoting responsible use of water, land, and natural resources.",
  },
];

const news = [
  {
    date: "Environmental Awareness",
    title: "Protecting Our Wetlands Starts With Us",
    description:
      "Raising awareness about the importance of haors, rivers, canals, and freshwater ecosystems.",
    image: photos.wetland,
  },
  {
    date: "Community Initiative",
    title: "Building a Greener Future Together",
    description:
      "Community participation can help create cleaner, healthier, and more sustainable surroundings.",
    image: photos.planting,
  },
  {
    date: "Nature & Wildlife",
    title: "Why Wetlands Matter for Biodiversity",
    description:
      "Wetlands provide essential habitats for birds, fish, plants, and many other living species.",
    image: photos.bird,
  },
];

const gallery = [
  { image: photos.wetland, label: "Wetland landscapes" },
  { image: photos.water, label: "Natural landscapes" },
  { image: photos.river, label: "Rivers and waterways" },
  { image: photos.bird, label: "Birdlife and biodiversity" },
  { image: photos.community, label: "Community participation" },
  { image: photos.forest, label: "Green environments" },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <main
      id="home"
      className="min-h-screen overflow-x-hidden bg-white font-sans text-slate-800 antialiased"
    >
      {/* HERO */}
              <Navbar />

      <section
        id="home"
        className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-emerald-950 pt-[72px]"
      >
        {/* Hero photograph */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url("${photos.hero}")` }}
        />

        {/* One continuous linear overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald-950/95 via-emerald-950/75 to-emerald-950/35"
        />

        <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 border border-white/20 bg-emerald-950/30 px-4 py-2 text-xs font-semibold tracking-wider text-emerald-50">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              ENVIRONMENTAL CONSERVATION IN BANGLADESH
            </div>

            <h1 className="text-4xl leading-[1.1] font-bold tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
              Protect Our Haors,
              <span className="mt-2 block bg-gradient-to-r from-emerald-200 via-lime-200 to-emerald-300 bg-clip-text text-transparent">
                Protect Our Future.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg sm:leading-8">
              Working to conserve Bangladesh&apos;s haors, rivers, canals,
              wetlands, and natural ecosystems for future generations.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="#about"
                className="group inline-flex min-h-[52px] items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:from-emerald-500 hover:via-emerald-400 hover:to-teal-400"
              >
                Discover Our Mission
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="#work"
                className="inline-flex min-h-[52px] items-center justify-center gap-2 border border-white/40 bg-emerald-950/30 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-900/70"
              >
                Explore Our Work
              </Link>
            </div>
          </div>
        </div>

        {/* Subtle bottom gradient, not a separate image */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-emerald-700 via-lime-400 to-teal-500"
        />
      </section>

      {/* ───────────────────────────────────────── About ───────────────────────────────────────── */}
      <section id="about" className="scroll-mt-24 py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-emerald-600 uppercase">
              Who We Are
            </p>

            <h2 className="mt-3 max-w-xl text-3xl leading-tight font-bold tracking-tight text-emerald-950 sm:text-4xl lg:text-[2.6rem]">
              A Voice for Nature and Wetland Communities
            </h2>

            <p className="mt-6 text-base leading-7 text-slate-600">
              Haor Rokkha Andolan is an environmental conservation initiative
              focused on protecting Bangladesh&apos;s haors, rivers, canals,
              wetlands, and biodiversity.
            </p>

            <p className="mt-4 text-base leading-7 text-slate-600">
              We believe that protecting nature requires awareness, responsible
              action, and cooperation between communities and people who care
              about the environment.
            </p>

            <Link
              href="#work"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-emerald-700 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-700/20 transition hover:bg-emerald-800"
            >
              Learn More <ArrowRight size={16} />
            </Link>
          </div>

          <div className="relative">
            <div className="absolute -top-4 -left-4 h-24 w-24 rounded-tl-3xl border-t-[5px] border-l-[5px] border-emerald-500/80" />
            <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-br-3xl border-r-[5px] border-b-[5px] border-emerald-500/40" />

            <div
              role="img"
              aria-label="A peaceful natural landscape representing wetland conservation"
              className="relative h-72 overflow-hidden rounded-2xl bg-cover bg-center shadow-2xl shadow-emerald-900/10 sm:h-80 lg:h-[380px]"
              style={{ backgroundImage: `url("${photos.water}")` }}
            />

            <div className="absolute -right-1 -bottom-5 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white p-4 shadow-xl sm:right-6 sm:-bottom-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                <ShieldCheck size={26} />
              </div>
              <div>
                <p className="text-sm font-bold text-emerald-950">
                  Nature First
                </p>
                <p className="text-xs text-slate-500">
                  Protecting our shared future
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────── Mission / Work ───────────────────────────────────────── */}
      <section
        id="work"
        className="scroll-mt-24 border-y border-emerald-100/80 bg-gradient-to-b from-emerald-50/80 to-white py-16 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-14">
            <p className="text-xs font-bold tracking-[0.2em] text-emerald-600 uppercase">
              Our Mission
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-emerald-950 sm:text-4xl">
              Working Together for a Greener Bangladesh
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              We aim to encourage environmental responsibility and support the
              conservation of natural resources through awareness and community
              participation.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {priorities.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="group relative overflow-hidden rounded-2xl border border-emerald-100/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-900/5"
                >
                  <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-700 group-hover:text-white">
                    <Icon size={24} strokeWidth={1.8} />
                  </div>

                  <h3 className="mt-5 text-base font-bold text-emerald-950">
                    {item.title}
                  </h3>

                  <p className="mt-2.5 text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>

                  <div className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-emerald-500 to-lime-400 transition-transform duration-300 group-hover:scale-x-100" />
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────── News ───────────────────────────────────────── */}
      <section id="news" className="scroll-mt-24 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-emerald-600 uppercase">
                Stay Informed
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-emerald-950 sm:text-4xl">
                News & Updates
              </h2>
            </div>

            <Link
              href="#contact"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 transition hover:text-emerald-900"
            >
              Get Updates <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {news.map((item) => (
              <article
                key={item.title}
                className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-900/5"
              >
                <div className="relative h-52 overflow-hidden bg-emerald-50 sm:h-56">
                  <div
                    role="img"
                    aria-label={item.title}
                    className="h-full w-full bg-cover bg-center transition duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url("${item.image}")` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition group-hover:opacity-100" />
                </div>

                <div className="p-6">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <CalendarDays size={13} />
                    {item.date}
                  </div>

                  <h3 className="mt-4 text-lg leading-snug font-bold text-emerald-950">
                    {item.title}
                  </h3>

                  <p className="mt-2.5 text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>

                  <Link
                    href="#contact"
                    aria-label={`Learn more about ${item.title}`}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 transition hover:text-emerald-900"
                  >
                    Learn More
                    <ChevronRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────── Gallery ───────────────────────────────────────── */}
      <section
        id="gallery"
        className="scroll-mt-24 border-t border-slate-100 bg-slate-50/80 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-emerald-600 uppercase">
                Nature in Focus
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-emerald-950 sm:text-4xl">
                Our Gallery
              </h2>
            </div>
            <span className="text-sm text-slate-500">
              Nature · People · Conservation
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
            {gallery.map((item) => (
              <a
                key={item.label}
                href={item.image}
                target="_blank"
                rel="noreferrer"
                aria-label={`View photo: ${item.label}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-emerald-100 sm:aspect-[4/3]"
              >
                <div
                  role="img"
                  aria-label={item.label}
                  className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url("${item.image}")` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-emerald-950/20 to-transparent opacity-70 transition group-hover:opacity-95" />
                <p className="absolute right-3 bottom-3 left-3 text-xs font-semibold text-white sm:text-sm">
                  {item.label}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────── CTA ───────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-emerald-950 py-16 sm:py-20">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-800/40 via-emerald-950 to-emerald-950" />
        <div className="pointer-events-none absolute -top-32 -right-20 h-80 w-80 rounded-full border border-white/5" />
        <div className="pointer-events-none absolute -bottom-40 -left-20 h-96 w-96 rounded-full border border-white/5" />

        <div className="mx-auto max-w-3xl px-5 text-center sm:px-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 text-emerald-200 backdrop-blur-sm">
            <HeartHandshake size={30} />
          </div>

          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Join Our Mission
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-emerald-100/90">
            Together, we can help protect our wetlands, support local
            communities, and build a greener, healthier Bangladesh.
          </p>

          <Link
            href="#contact"
            className="mt-8 inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-emerald-900 shadow-xl transition hover:bg-emerald-50"
          >
            Get Involved <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {/* ───────────────────────────────────────── Contact ───────────────────────────────────────── */}
      <section id="contact" className="scroll-mt-24 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-emerald-600 uppercase">
                Get in Touch
              </p>
              <h2 className="mt-2 text-3xl font-bold text-emerald-950 sm:text-4xl">
                Let&apos;s Protect Our Natural Heritage
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
                Interested in environmental conservation or community
                initiatives? Connect with Haor Rokkha Andolan to learn more
                about opportunities to get involved.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3.5 rounded-2xl border border-slate-200 p-5 transition hover:border-emerald-200 hover:bg-emerald-50/50">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-emerald-950">
                      Location
                    </p>
                    <p className="mt-1 text-sm text-slate-500">Bangladesh</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 rounded-2xl border border-slate-200 p-5 transition hover:border-emerald-200 hover:bg-emerald-50/50">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                    <Globe size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-emerald-950">
                      Our Mission
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Wetland & environmental protection
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Simple contact form */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 sm:p-8">
              <h3 className="text-lg font-bold text-emerald-950">
                Send us a message
              </h3>
              <form
                className="mt-5 space-y-4"
                onSubmit={(e) => e.preventDefault()}
              >
                <div>
                  <label htmlFor="name" className="sr-only">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Your email"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="sr-only">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="How would you like to get involved?"
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                  Send Message <ArrowRight size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────── Footer ───────────────────────────────────────── */}
      <footer className="bg-[#042A24] text-white">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr]">
            <div>
              <Link href="#home" className="inline-flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-800/60 text-emerald-100">
                  <Leaf size={22} />
                </div>
                <div>
                  <p className="text-sm font-bold tracking-wide">
                    HAOR ROKKHA ANDOLAN
                  </p>
                  <p className="mt-0.5 text-xs text-emerald-300/80">
                    Protecting Wetlands, Preserving Life.
                  </p>
                </div>
              </Link>

              <p className="mt-5 max-w-sm text-sm leading-6 text-emerald-100/70">
                Advocating for the conservation of Bangladesh&apos;s wetlands,
                waterways, biodiversity, and natural environment.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold tracking-wide">Quick Links</h3>
              <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-emerald-100/70 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold tracking-wide">Our Values</h3>
              <ul className="mt-5 space-y-3.5 text-sm text-emerald-100/70">
                <li className="flex items-center gap-2.5">
                  <Leaf size={15} className="text-emerald-400" /> Environmental
                  responsibility
                </li>
                <li className="flex items-center gap-2.5">
                  <Trees size={15} className="text-emerald-400" /> Nature
                  conservation
                </li>
                <li className="flex items-center gap-2.5">
                  <Users size={15} className="text-emerald-400" /> Community
                  participation
                </li>
                <li className="flex items-center gap-2.5">
                  <Bird size={15} className="text-emerald-400" /> Biodiversity
                  protection
                </li>
              </ul>
            </div>
          </div>
       </div>
      </footer>
    </main>
  );
}
