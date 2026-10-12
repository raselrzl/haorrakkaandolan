"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Menu,
  X,
  Leaf,
  ChevronRight,
  LogIn,
} from "lucide-react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
  { label: "Our Work", href: "#work" },
  { label: "News & Updates", href: "#news" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  const lightHeader = scrolled || menuOpen;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[9999] isolate w-full transition-colors duration-300 ${
        lightHeader
          ? "border-b border-emerald-900/10 bg-gradient-to-r from-white via-emerald-50 to-white text-emerald-950 shadow-md"
          : "border-b border-white/10 bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white shadow-lg shadow-emerald-950/10"
      }`}
    >
      {/* Navbar content */}
      <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="#home"
          onClick={() => setMenuOpen(false)}
          className="group flex min-w-0 items-center gap-2.5 sm:gap-3"
        >
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-300 sm:h-12 sm:w-12 ${
              lightHeader
                ? "border-emerald-600 bg-emerald-100 text-emerald-800"
                : "border-white/40 bg-white/10 text-white"
            }`}
          >
            <Leaf size={24} strokeWidth={1.9} />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-extrabold tracking-tight sm:text-[15px]">
              HAOR ROKKHA ANDOLAN
            </p>

            <p
              className={`mt-0.5 text-[10px] sm:text-xs ${
                lightHeader ? "text-emerald-700" : "text-emerald-100"
              }`}
            >
              Protecting Wetlands, Preserving Life.
            </p>
          </div>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-1 lg:flex xl:gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap px-3 py-2 text-[13px] font-medium transition-colors xl:px-3.5 ${
                lightHeader
                  ? "text-slate-700 hover:text-emerald-700"
                  : "text-white/90 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Login */}
          <Link
            href="/login"
            className={`ml-2 inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors ${
              lightHeader
                ? "border-emerald-200 text-emerald-800 hover:bg-emerald-100"
                : "border-white/30 text-white hover:bg-white/10"
            }`}
          >
            <LogIn size={16} />
            Login
          </Link>

          {/* Get Involved */}
          <Link
            href="#contact"
            className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
              lightHeader
                ? "bg-emerald-700 text-white hover:bg-emerald-800"
                : "bg-white text-emerald-950 hover:bg-emerald-50"
            }`}
          >
            Get Involved
            <ArrowRight size={15} />
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors lg:hidden ${
            lightHeader
              ? "border-emerald-200 bg-white text-emerald-900 hover:bg-emerald-50"
              : "border-white/25 bg-white/10 text-white hover:bg-white/20"
          }`}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile navigation */}
      <div
        id="mobile-navigation"
        aria-hidden={!menuOpen}
        className={`fixed inset-x-0 bottom-0 top-[72px] z-[10000] overflow-y-auto overscroll-contain bg-gradient-to-b from-white via-white to-emerald-50 transition-[opacity,visibility] duration-200 lg:hidden ${
          menuOpen
            ? "visible pointer-events-auto opacity-100"
            : "invisible pointer-events-none opacity-0"
        }`}
      >
        <nav className="mx-auto flex min-h-full max-w-xl flex-col px-4 py-5 sm:px-6">
          <div className="flex flex-1 flex-col gap-1">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                tabIndex={menuOpen ? 0 : -1}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between border-b border-emerald-900/5 px-4 py-4 text-base font-medium text-slate-700 transition-colors hover:bg-emerald-100/70 hover:text-emerald-800"
              >
                <span className="flex items-center gap-3">
                  <span className="w-5 text-xs font-semibold text-emerald-600/60">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {link.label}
                </span>

                <ChevronRight
                  size={18}
                  className="text-emerald-700/50"
                />
              </Link>
            ))}
          </div>

          {/* Mobile action buttons */}
          <div className="space-y-3 pb-6 pt-6">
            <Link
              href="/login"
              tabIndex={menuOpen ? 0 : -1}
              onClick={() => setMenuOpen(false)}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-5 py-3.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
            >
              <LogIn size={17} />
              Login
            </Link>

            <Link
              href="#contact"
              tabIndex={menuOpen ? 0 : -1}
              onClick={() => setMenuOpen(false)}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/15 transition hover:from-emerald-900 hover:via-emerald-800 hover:to-teal-800"
            >
              Get Involved
              <ArrowRight size={17} />
            </Link>

            <p className="mt-4 text-center text-xs text-emerald-800/60">
              Protecting Wetlands, Preserving Life.
            </p>
          </div>
        </nav>
      </div>
    </header>
  );
}