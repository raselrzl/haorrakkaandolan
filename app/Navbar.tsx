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
} from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Mission & Vision", href: "/mission-and-vision" },
  { label: "Activities", href: "/activities" },
  { label: "Demands", href: "/demands" },
  { label: "Law & Enforcement", href: "/law" },
  { label: "Constitution", href: "/constitution" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

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
    <header className="fixed inset-x-0 top-0 z-9999 w-full border-b border-slate-200 bg-white text-slate-800 shadow-sm">
      {/* Main navigation */}
      <div className="mx-auto flex h-16 max-w-full items-center justify-between gap-3 px-4 sm:px-6">
        {/* Logo and identity */}
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="group flex min-w-0 shrink items-center gap-2.5 sm:gap-3"
        >
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-white sm:h-11 sm:w-11">
            <Image
              src="/ha2.png"
              alt="Haor Rokkha Andolan"
              fill
              sizes="44px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority
            />
          </div>

          <div className="min-w-0">
            <p className="truncate text-[18px] font-extrabold tracking-tight text-[#123b2b] sm:text-sm">
              হাওর রক্ষা আন্দোলন
            </p>
            <p className="mt-0.5 hidden text-[10px] tracking-wide text-slate-500 sm:block sm:text-[11px]">
              Protecting Wetlands, Preserving Life.
            </p>
          </div>
        </Link>

        {/* Desktop navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-0.5 lg:flex"
        >
          {navLinks.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`relative whitespace-nowrap px-2.5 py-3 text-[12px] font-medium transition-colors xl:px-3 xl:text-[13px] ${
                  active
                    ? "text-[#176b45]"
                    : "text-slate-600 hover:text-[#176b45]"
                }`}
              >
                {link.label}

                <span
                  className={`absolute inset-x-2 bottom-1 h-0.5 rounded-full bg-[#176b45] transition-transform duration-200 xl:inset-x-3 ${
                    active ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Desktop actions */}
        <div className="hidden shrink-0 items-center gap-2 xl:gap-3 lg:flex">
          {/* Donations */}
          <Link
            href="/donations"
            aria-current={isActive("/donations") ? "page" : undefined}
            className={`inline-flex h-10 items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-3 text-[12px] font-semibold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 xl:px-4 xl:text-[13px] ${
              isActive("/donations")
                ? "bg-red-800"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            <Heart size={15} />
            Donations
          </Link>

          {/* Login */}
          <Link
            href="/login"
            aria-current={isActive("/login") ? "page" : undefined}
            className={`inline-flex h-10 items-center justify-center rounded-md px-4 text-[12px] font-semibold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2 xl:px-5 xl:text-[13px] ${
              isActive("/login")
                ? "bg-green-800"
                : "bg-green-600 hover:bg-green-800"
            }`}
          >
            Login
          </Link>

          {/* Get involved */}
          <Link
            href="/contact"
            aria-current={isActive("/contact") ? "page" : undefined}
            className={`group inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-full border px-3 text-[12px] font-semibold transition-colors xl:px-4 xl:text-[13px] ${
              isActive("/contact")
                ? "border-[#123b2b] bg-[#123b2b] text-white"
                : "border-slate-200 text-[#123b2b] hover:border-emerald-200 hover:bg-emerald-50"
            }`}
          >
            Get Involved
            <ArrowUpRight
              size={15}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-10 w-10 shrink-0 items-center justify-center border border-slate-200 text-[#123b2b] transition-colors hover:bg-slate-50 lg:hidden"
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {/* Mobile backdrop */}
      {menuOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-x-0 bottom-0 top-16 z-[-1] bg-slate-900/30 lg:hidden"
        />
      )}

      {/* Mobile navigation */}
      <div
        id="mobile-navigation"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
        className={`fixed inset-x-0 bottom-0 top-16 z-10000 overflow-y-auto border-t border-slate-100 bg-white transition-[opacity,visibility,transform] duration-200 lg:hidden ${
          menuOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0"
        }`}
      >
        <nav
          aria-label="Mobile navigation"
          className="mx-auto flex min-h-full max-w-xl flex-col px-4 pb-6 pt-3 sm:px-6"
        >
          <div className="mb-2 border-b border-slate-100 pb-3">
            <p className="text-xs font-semibold text-[#176b45]">
              Haor Rokkha Andolan
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              Protecting Wetlands, Preserving Life.
            </p>
          </div>

          <div className="flex-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                  className={`flex min-h-12 items-center justify-between border-b border-slate-100 px-2 text-sm transition-colors ${
                    active
                      ? "font-semibold text-[#176b45]"
                      : "font-medium text-slate-600 hover:text-[#176b45]"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    {link.href === "/demands" && (
                      <ClipboardList size={17} />
                    )}
                    {link.label}
                  </span>

                  {active && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#176b45]" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile actions */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Link
              href="/donations"
              aria-current={isActive("/donations") ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
              className={`col-span-2 flex min-h-11 items-center justify-center gap-2 rounded-full px-3 py-3 text-sm font-semibold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 ${
                isActive("/donations")
                  ? "bg-red-800"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              <Heart size={17} />
              Donations
            </Link>

            <Link
              href="/login"
              aria-current={isActive("/login") ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
              className={`flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-200 px-3 py-3 text-sm font-semibold transition-colors ${
                isActive("/login")
                  ? "bg-slate-100 text-[#176b45]"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <LogIn size={16} />
              Login
            </Link>

            <Link
              href="/contact"
              aria-current={isActive("/contact") ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
              className="flex min-h-11 items-center justify-center gap-1.5 rounded-full bg-[#176b45] px-3 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#123b2b]"
            >
              Get Involved
              <ArrowUpRight size={15} />
            </Link>
          </div>

          {/* Legal links */}
          <div className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
            <Link
              href="/privacy-policy"
              onClick={() => setMenuOpen(false)}
              className="transition-colors hover:text-[#176b45]"
            >
              Privacy Policy
            </Link>
            <Link
              href="/cookie-policy"
              onClick={() => setMenuOpen(false)}
              className="transition-colors hover:text-[#176b45]"
            >
              Cookie Policy
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
