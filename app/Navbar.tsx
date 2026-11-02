"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  FileText,
  Megaphone,
  Scale,
  BookOpen,
  HeartHandshake,
  Users,
  LogIn,
  ChevronsRight,
} from "lucide-react";

const firstRow = [
  { label: "Home", mobileLabel: "Home", href: "/" },
  { label: "About Us", mobileLabel: "About", href: "/about-us" },
  {
    label: "Mission & Vision",
    mobileLabel: "Mission",
    href: "/mission-and-vision",
  },
  { label: "Activities", mobileLabel: "News", href: "/activities" },
  {
    label: "Publications",
    mobileLabel: "Research",
    href: "/publications",
  },
];

const secondRow = [
  { label: "Legal Documents", href: "/documents", icon: FileText },
  { label: "Demands", href: "/demands", icon: Megaphone },
  { label: "Law & Enforcement", href: "/law", icon: Scale },
  { label: "Constitution", href: "/constitution", icon: BookOpen },
  { label: "Donations", href: "/donations", icon: HeartHandshake },
  { label: "Get Involved", href: "/contact", icon: Users },
  { label: "Login", href: "/login", icon: LogIn },
];

export default function Navbar() {
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;

    if (!header) return;

    const handleScroll = () => {
      setIsSticky(header.getBoundingClientRect().top <= 0);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const renderPrimaryTab = (
    link: (typeof firstRow)[number],
    mobile = false,
  ) => {
    const active = isActive(link.href);

    return (
      <Link
        key={link.href}
        href={link.href}
        aria-current={active ? "page" : undefined}
        title={mobile ? link.label : undefined}
        onClick={() => setMobileMenuOpen(false)}
        className={`relative isolate flex min-w-0 flex-1 items-center justify-center text-center leading-tight transition-colors ${
          mobile
            ? "h-8 text-[10px] font-bold sm:text-[11px]"
            : "-ml-2 h-8 text-[11px] lg:text-xs"
        } ${active ? "z-20" : "z-10"}`}
      >
        <span
          aria-hidden="true"
          className={`absolute inset-0 -z-10 border border-b-0 ${
            mobile ? "" : "rounded-t-md"
          } ${
            active
              ? "border-amber-400 bg-amber-300"
              : "border-amber-300 bg-gradient-to-b from-white to-slate-200"
          }`}
          style={{
            transform: mobile
              ? "none"
              : "perspective(30px) rotateX(2deg) skewX(30deg)",
            transformOrigin: "bottom",
          }}
        />

        <span
          className={`relative z-10 line-clamp-2 ${
            active
              ? "font-extrabold text-[#17150f]"
              : mobile
                ? "font-bold text-black"
                : "font-medium text-black"
          }`}
        >
          {mobile ? link.mobileLabel : link.label}
        </span>
      </Link>
    );
  };

  const renderSecondaryTab = (link: (typeof secondRow)[number]) => {
    const active = isActive(link.href);

    return (
      <Link
        key={link.href}
        href={link.href}
        aria-current={active ? "page" : undefined}
        onClick={() => setMobileMenuOpen(false)}
        className={`relative flex min-h-8 min-w-0 items-center justify-center border-r border-b border-white/80 px-2 text-center text-[11px] leading-tight transition-colors duration-200 ${
          active
            ? "z-10 bg-amber-200 font-extrabold text-[#17150f]"
            : "font-semibold text-[#382b13] hover:bg-yellow-200/60 hover:text-black"
        }`}
      >
        <span>{link.label}</span>
      </Link>
    );
  };

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-[60] w-full bg-white shadow-md"
    >
      {/* MOBILE — ORGANIZATION NAME AND BIRD-WING UNDERLINE (ONLY WHEN STICKY) */}
      <div
        className={`grid overflow-hidden transition-all duration-300 ease-in-out sm:hidden ${
          isSticky
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] border-b-0 opacity-0"
        }`}
        aria-hidden={!isSticky}
      >
        <div className="min-h-0">
          <div className="bg-gradient-to-t from-white via-gray-50 to-red-50 px-3 py-2">
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center justify-center gap-2">
                <span
                  lang="bn"
                  translate="no"
                  className="notranslate text-[17px] font-extrabold tracking-wide text-amber-900 drop-shadow-sm"
                >
                  হাওর রক্ষা আন্দোলন
                </span>
              </div>

              {/* GOLDEN BIRD-WING UNDERLINE */}
              <svg
                className="mt-0.5 h-4 w-36"
                viewBox="0 0 220 28"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient
                    id="goldBirdWing"
                    x1="0"
                    y1="0"
                    x2="220"
                    y2="0"
                  >
                    <stop offset="0%" stopColor="#fde047" />
                    <stop offset="45%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#fef3c7" />
                  </linearGradient>
                </defs>

                <path
                  d="M2 18 C28 2 48 1 76 9 C112 19 151 19 218 3 C177 25 117 28 72 18 C42 11 22 12 2 18Z"
                  fill="url(#goldBirdWing)"
                />

                <path
                  d="M8 20 C45 12 68 17 100 22 C139 27 179 17 213 5"
                  stroke="#fde68a"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  opacity=".8"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP — COMPACT ORGANIZATION NAME AND BIRD-WING UNDERLINE */}
      <div
        className={`hidden overflow-hidden transition-all duration-300 ease-in-out sm:grid ${
          isSticky
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] border-b-0 opacity-0"
        }`}
        aria-hidden={!isSticky}
      >
        <div className="min-h-0">
          <div className="bg-gradient-to-t from-white via-gray-50 to-red-50 px-2 py-1">
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center justify-center gap-3">
                <span
                  lang="bn"
                  translate="no"
                  className="notranslate text-lg font-extrabold tracking-wide text-amber-900 drop-shadow-sm"
                >
                  হাওর রক্ষা আন্দোলন
                </span>
              </div>

              {/* GOLDEN BIRD-WING UNDERLINE */}
              <svg
                className="mt-0 h-3 w-40"
                viewBox="0 0 220 28"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient
                    id="goldBirdWingDesktop"
                    x1="0"
                    y1="0"
                    x2="220"
                    y2="0"
                  >
                    <stop offset="0%" stopColor="#fde047" />
                    <stop offset="45%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#fef3c7" />
                  </linearGradient>
                </defs>

                <path
                  d="M2 18 C28 2 48 1 76 9 C112 19 151 19 218 3 C177 25 117 28 72 18 C42 11 22 12 2 18Z"
                  fill="url(#goldBirdWingDesktop)"
                />

                <path
                  d="M8 20 C45 12 68 17 100 22 C139 27 179 17 213 5"
                  stroke="#fde68a"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  opacity=".8"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP — COMPACT CONNECTED PRIMARY TABS */}
      <div className="mx-auto hidden max-w-4xl px-1 sm:block sm:px-2">
        <nav
          aria-label="Primary navigation"
          className="flex h-9 items-end overflow-visible pl-2 pt-0.5"
        >
          {firstRow.map((link) => renderPrimaryTab(link))}
        </nav>
      </div>

      {/* MOBILE — PRIMARY NAVIGATION WITH MENU BUTTON */}
      <div className="overflow-visible bg-white sm:hidden">
        <nav
          aria-label="Mobile primary navigation"
          className="grid grid-cols-[repeat(5,minmax(0,1fr))_auto] items-end gap-0 pt-0"
        >
          {firstRow.map((link) => renderPrimaryTab(link, true))}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((previous) => !previous)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-secondary-navigation"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className={`relative z-30 flex h-8 min-w-[43px] items-center justify-center gap-0.5 border border-b-0 px-1 text-[10px] font-bold transition-colors ${
              mobileMenuOpen
                ? "border-amber-500 bg-amber-300 text-[#17150f]"
                : "border-amber-300 bg-gradient-to-b from-white to-slate-200 text-slate-800"
            }`}
          >
            {mobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
            <span>Menu</span>
          </button>
        </nav>

        {/* MOBILE — COMPACT DROPDOWN MENU */}
        <div
          id="mobile-secondary-navigation"
          aria-label="Additional navigation"
          aria-hidden={!mobileMenuOpen}
          className={`absolute inset-x-0 top-full z-[70] overflow-hidden border-t border-amber-500/50 bg-white shadow-lg transition-all duration-200 ease-in-out ${
            mobileMenuOpen
              ? "visible translate-y-0 opacity-100"
              : "invisible pointer-events-none -translate-y-2 opacity-0"
          }`}
        >
          <div className="border-b border-amber-200 bg-gradient-to-r from-yellow-300 to-amber-400 px-3 py-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#382b13]">
                Wetlands Resilience Initiatives
              </span>
              <ChevronDown className="h-4 w-4 text-[#382b13]" />
            </div>
          </div>

          <nav
            aria-label="Additional mobile navigation"
            className="grid grid-cols-1 gap-px bg-slate-200 p-px"
          >
            {secondRow.map((link) => {
              const active = isActive(link.href);
              const Icon = link.icon;
              const isLogin = link.href === "/login";

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex min-h-11 items-center justify-between gap-3 px-3 py-2 text-xs transition-colors ${
                    isLogin
                      ? "bg-gradient-to-r from-yellow-300 to-amber-400 font-extrabold text-[#382b13] hover:from-yellow-400 hover:to-amber-500"
                      : active
                        ? "bg-amber-100 font-extrabold text-[#17150f]"
                        : "bg-white font-bold text-slate-700 hover:bg-amber-50"
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <Icon
                      className={`h-[17px] w-[17px] shrink-0 ${
                        isLogin
                          ? "text-[#704900]"
                          : active
                            ? "text-amber-700"
                            : "text-slate-500"
                      }`}
                      strokeWidth={2.2}
                      aria-hidden="true"
                    />
                    <span>{link.label}</span>
                  </span>

                  <ChevronsRight
                    className={`h-4 w-4 shrink-0 ${
                      isLogin
                        ? "text-[#704900]"
                        : active
                          ? "text-amber-700"
                          : "text-slate-400"
                    }`}
                    strokeWidth={2.4}
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* DESKTOP — COMPACT FULL-WIDTH YELLOW SECONDARY BAR */}
      <nav
        aria-label="Secondary navigation"
        className="relative z-30 hidden w-full bg-gradient-to-b from-yellow-300 to-amber-400 sm:block"
      >
        <div className="mx-auto grid min-h-9 max-w-6xl grid-cols-7 px-1 sm:px-3 lg:px-5">
          {secondRow.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-9 min-w-0 items-center justify-center border-l border-white px-1.5 text-center text-[11px] leading-tight transition-colors duration-200 lg:text-xs ${
                  active
                    ? "bg-amber-200 font-bold text-[#17150f]"
                    : "font-semibold text-[#382b13] hover:text-black"
                }`}
              >
                <span className="line-clamp-2">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
