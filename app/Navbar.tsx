
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ArrowUpRight,
  LogIn,
  ClipboardList,
  Heart,
  ChevronDown,
} from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Mission & Vision", href: "/mission-and-vision" },
  { label: "News & Activities", href: "/activities" },
  { label: "Research & Publications", href: "/publications" },
  { label: "Legal Documents", href: "/documents" },
  { label: "Demands", href: "/demands" },
  { label: "Law & Enforcement", href: "/law" },
  { label: "Constitution", href: "/constitution" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const linkClass = (href: string) =>
    `whitespace-nowrap rounded-md px-2 py-2 text-[12px] font-semibold transition-colors duration-200 lg:px-2.5 lg:text-[13px] ${
      isActive(href)
        ? "bg-emerald-50 text-emerald-800"
        : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
    }`;

  const moreLinks = navLinks.slice(5);
  const isMoreActive = moreLinks.some((link) => isActive(link.href));

  return (
    <>
      {/* HEADER */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-emerald-900/10 bg-white/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between gap-2 px-3 sm:gap-3 sm:px-5 lg:px-6">

          {/* LOGO */}
          <Link
            href="/"
            className="group flex min-w-0 shrink-0 items-center gap-2 sm:gap-2.5"
            aria-label="Haor Rokkha Andolan Home"
          >
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-emerald-100 bg-emerald-50 shadow-sm sm:h-11 sm:w-11">
              <Image
                src="/ha2.png"
                alt="Haor Rokkha Andolan Logo"
                fill
                priority
                sizes="44px"
                className="object-contain p-0.5"
              />
            </div>

            <div className="min-w-0 leading-tight">
              <p className="truncate text-[11px] font-extrabold tracking-tight text-emerald-950 sm:text-sm">
                Wetlands Resilience Initiatives
              </p>
              <p className="mt-0.5 truncate text-[10px] font-semibold text-emerald-700 sm:text-xs">
                হাওর রক্ষা আন্দোলন
              </p>
            </div>
          </Link>

          {/* TABLET / DESKTOP NAVIGATION */}
          <nav
            aria-label="Main navigation"
            className="hidden min-w-0 w-full max-w-3xl flex-1 items-center justify-center md:flex"
          >
            <div className="flex w-full min-w-0 items-center justify-center gap-0.5">

              {/* VISIBLE LINKS */}
              {navLinks.slice(0, 5).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={linkClass(link.href)}
                >
                  {link.label}
                </Link>
              ))}

              {/* MORE DROPDOWN */}
              <div className="group relative shrink-0">
                <button
                  type="button"
                  aria-haspopup="true"
                  className={`flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-2 text-[12px] font-semibold transition-colors duration-200 lg:px-2.5 lg:text-[13px] ${
                    isMoreActive
                      ? "bg-emerald-50 text-emerald-800"
                      : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
                  }`}
                >
                  More
                  <ChevronDown
                    size={14}
                    className="transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180"
                  />
                </button>

                <div className="invisible absolute right-0 top-full z-50 mt-1 w-56 translate-y-1 rounded-lg border border-slate-200 bg-white p-2 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 lg:w-60">
                  {moreLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`block rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive(link.href)
                          ? "bg-emerald-50 text-emerald-800"
                          : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          {/* TABLET / DESKTOP ACTIONS */}
          <div className="hidden shrink-0 items-center gap-1.5 md:flex lg:gap-2">
            <Link
              href="/donations"
              className="inline-flex items-center gap-1 rounded-md border border-emerald-700/20 px-2 py-2 text-[11px] font-semibold text-emerald-800 transition-colors hover:border-emerald-700 hover:bg-emerald-50 lg:gap-1.5 lg:px-3 lg:text-[13px]"
            >
              <Heart size={15} />
              Donations
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center gap-1 rounded-md bg-emerald-800 px-2.5 py-2 text-[11px] font-semibold text-white shadow-sm transition-colors hover:bg-emerald-900 lg:gap-1.5 lg:px-3.5 lg:text-[13px]"
            >
              <LogIn size={15} />
              Login
            </Link>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-emerald-800/15 bg-emerald-50 text-emerald-900 transition-colors hover:bg-emerald-100 md:hidden"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>

      {/* MOBILE BACKDROP */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-[2px] md:hidden"
        />
      )}

      {/* MOBILE MENU */}
      <div
        className={`fixed inset-x-0 top-16 z-50 overflow-y-auto border-t border-emerald-900/10 bg-white shadow-xl transition-all duration-300 md:hidden ${
          isOpen
            ? "visible max-h-[calc(100dvh-4rem)] translate-y-0 opacity-100"
            : "invisible max-h-0 -translate-y-2 opacity-0"
        }`}
      >
        <nav
          aria-label="Mobile navigation"
          className="mx-auto flex w-full max-w-[700px] flex-col gap-1 p-3 sm:p-4"
        >
          {/* MOBILE LINKS */}
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center justify-between rounded-md px-4 py-3 text-sm font-semibold transition-colors ${
                isActive(link.href)
                  ? "bg-emerald-50 text-emerald-800"
                  : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
              }`}
            >
              {link.label}

              {isActive(link.href) && (
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              )}
            </Link>
          ))}

          {/* MOBILE ACTIONS */}
          <div className="mt-2 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
            <Link
              href="/donations"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 rounded-md border border-emerald-700/20 px-3 py-3 text-sm font-semibold text-emerald-800 transition-colors hover:bg-emerald-50"
            >
              <Heart size={16} />
              Donations
            </Link>

            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 rounded-md bg-emerald-800 px-3 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-900"
            >
              <LogIn size={16} />
              Login
            </Link>

            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="col-span-2 flex items-center justify-center gap-2 rounded-md bg-emerald-50 px-3 py-3 text-sm font-semibold text-emerald-900 transition-colors hover:bg-emerald-100"
            >
              <ClipboardList size={16} />
              Get Involved
              <ArrowUpRight size={15} />
            </Link>
          </div>

          {/* LEGAL LINKS */}
          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-slate-100 pt-3 pb-2 text-xs font-medium text-slate-500">
            <Link
              href="/privacy-policy"
              onClick={() => setIsOpen(false)}
              className="transition-colors hover:text-emerald-800"
            >
              Privacy Policy
            </Link>

            <Link
              href="/cookie-policy"
              onClick={() => setIsOpen(false)}
              className="transition-colors hover:text-emerald-800"
            >
              Cookie Policy
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
