"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronRight } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Mission & Vision", href: "/mission-and-vision" },
  { label: "Activities", href: "/activities" },
  { label: "Latest News", href: "/latest-news" },
  { label: "Photo Gallery", href: "/photo-gallery" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-[9999] w-full border-b border-slate-200 bg-white text-slate-900 shadow-sm">
      {/* Compact white header */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="group flex min-w-0 items-center gap-2.5"
        >
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-white sm:h-10 sm:w-10">
            <Image
              src="/ha2.png"
              alt="Haor Rokkha Andolan"
              fill
              className="object-cover"
              sizes="40px"
              priority
            />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-extrabold tracking-tight text-emerald-950 sm:text-sm">
              HAOR ROKKHA ANDOLAN
            </p>
            <p className="mt-0.5 text-[10px] text-slate-500 sm:text-[11px]">
              Protecting Wetlands, Preserving Life.
            </p>
          </div>
        </Link>

        {/* Desktop navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-0.5 lg:flex"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap rounded-md px-2.5 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-emerald-50 hover:text-emerald-950 xl:px-3 xl:text-[13px]"
            >
              {link.label}
            </Link>
          ))}

          {/* Compact dark-green buttons without icons */}
          <div className="ml-2 flex shrink-0 items-center gap-2">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-md bg-emerald-950 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-900 xl:text-[13px]"
            >
              Login
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-green-950 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-900 xl:text-[13px]"
            >
              Get Involved
            </Link>
          </div>
        </nav>

        {/* Mobile menu toggle */}
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-emerald-950 text-white transition-colors hover:bg-emerald-900 lg:hidden"
        >
          {menuOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>

      {/* Mobile navigation */}
      <div
        id="mobile-navigation"
        aria-hidden={!menuOpen}
        className={`fixed inset-x-0 bottom-0 top-16 z-[10000] overflow-y-auto overscroll-contain bg-white transition-[opacity,visibility] duration-200 lg:hidden ${
          menuOpen
            ? "visible pointer-events-auto opacity-100"
            : "invisible pointer-events-none opacity-0"
        }`}
      >
        <nav
          aria-label="Mobile navigation"
          className="mx-auto flex min-h-full max-w-xl flex-col px-4 py-3 sm:px-6"
        >
          {/* Links without numbering */}
          <div className="flex-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                tabIndex={menuOpen ? 0 : -1}
                onClick={() => setMenuOpen(false)}
                className="group flex items-center justify-between border-b border-slate-100 px-3 py-3.5 text-sm font-medium text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-950"
              >
                <span>{link.label}</span>
                <ChevronRight
                  size={17}
                  className="text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-emerald-950"
                />
              </Link>
            ))}
          </div>

          {/* Compact mobile action buttons */}
          <div className="flex flex-col items-center gap-2.5 py-5">
            <Link
              href="/login"
              tabIndex={menuOpen ? 0 : -1}
              onClick={() => setMenuOpen(false)}
              className="flex min-h-11 w-full max-w-xs items-center justify-center rounded-md bg-emerald-950 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-900"
            >
              Login
            </Link>

            <Link
              href="/contact"
              tabIndex={menuOpen ? 0 : -1}
              onClick={() => setMenuOpen(false)}
              className="flex min-h-11 w-full max-w-xs items-center justify-center rounded-md bg-green-950 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-900"
            >
              Get Involved
            </Link>

            <p className="pt-1 text-center text-[11px] text-slate-500">
              Protecting Wetlands, Preserving Life.
            </p>
          </div>
        </nav>
      </div>
    </header>
  );
}