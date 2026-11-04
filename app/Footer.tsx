import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  ExternalLink,
  House,
  Info,
  Activity,
  BookOpen,
  Megaphone,
  ScrollText,
  HeartHandshake,
  Mail,
  ShieldCheck,
  Cookie,
  Landmark,
  Droplets,
  Building2,
  Fish,
  Globe2,
} from "lucide-react";

const footerLinks = [
  { label: "Home", href: "/", icon: House },
  { label: "About Us", href: "/about-us", icon: Info },
  { label: "Activities", href: "/activities", icon: Activity },
  {
    label: "Research & Publications",
    href: "/publications",
    icon: BookOpen,
  },
  { label: "Demands", href: "/demands", icon: Megaphone },
  { label: "Constitution", href: "/constitution", icon: ScrollText },
  { label: "Donations", href: "/donations", icon: HeartHandshake },
  { label: "Contact Us", href: "/contact", icon: Mail },
  { label: "Privacy Policy", href: "/privacy-policy", icon: ShieldCheck },
  { label: "Cookie Policy", href: "/cookie-policy", icon: Cookie },
];

const officialLinks = [
  {
    label: "Haor and Wetland Development Directorate",
    labelBn: "হাওর ও জলাভূমি উন্নয়ন অধিদপ্তর",
    href: "https://dbhwd.gov.bd/",
    icon: Droplets,
  },
  {
    label: "Ministry of Water Resources",
    labelBn: "পানি সম্পদ মন্ত্রণালয়",
    href: "https://mowr.gov.bd/",
    icon: Landmark,
  },
  {
    label: "Ministry of Public Administration",
    labelBn: "জনপ্রশাসন মন্ত্রণালয়",
    href: "https://mopa.gov.bd/",
    icon: Building2,
  },
  {
    label: "Ministry of Fisheries and Livestock",
    labelBn: "মৎস্য ও প্রাণিসম্পদ মন্ত্রণালয়",
    href: "https://mofl.gov.bd/",
    icon: Fish,
  },
  {
    label: "Department of Fisheries",
    labelBn: "মৎস্য অধিদপ্তর",
    href: "https://fisheries.gov.bd/",
    icon: Fish,
  },
  {
    label: "Bangladesh Fisheries Development Corporation",
    labelBn: "বাংলাদেশ মৎস্য উন্নয়ন কর্পোরেশন (BFDC)",
    href: "https://bfdc.gov.bd/",
    icon: Building2,
  },
  {
    label: "The Commonwealth",
    labelBn: "আন্তর্জাতিক সহযোগিতা ও টেকসই উন্নয়ন",
    href: "https://thecommonwealth.org/",
    icon: Globe2,
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-amber-100 bg-linear-to-t from-rose-50 via-slate-50 to-white">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        {/* LOGO, IDENTITY AND NAVIGATION */}
        <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Logo and title */}
          <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:gap-3 sm:text-left">
            <Link
              href="/"
              aria-label="Haor Rokkha Andolan home"
              className="shrink-0"
            >
              <Image
                src="/wri.png"
                alt="হাওর রক্ষা আন্দোলন logo"
                width={48}
                height={48}
                className="h-12 w-12 rounded-sm object-cover"
              />
            </Link>

            <div>
              <Link
                href="/"
                translate="no"
                className="notranslate text-sm font-bold text-[#123b2b] transition-colors hover:text-amber-700"
              >
                হাওর রক্ষা আন্দোলন
              </Link>

              <p
                translate="no"
                className="notranslate mt-1 text-xs italic text-slate-500"
              >
                Protecting Wetlands, Preserving Life.
              </p>
            </div>
          </div>

          {/* INTERNAL FOOTER NAVIGATION */}
          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap justify-center gap-x-4 gap-y-3 lg:max-w-3xl lg:justify-end"
          >
            {footerLinks.map((link) => {
              const Icon = link.icon;
              const isDonation = link.href === "/donations";

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group inline-flex items-center gap-1.5 text-xs transition-colors duration-200 ${
                    isDonation
                      ? "font-semibold text-red-600 hover:text-red-800"
                      : "text-slate-500 hover:text-amber-700"
                  }`}
                >
                  <Icon
                    size={13}
                    strokeWidth={1.8}
                    className={`shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 ${
                      isDonation ? "text-red-500" : "text-amber-700"
                    }`}
                  />

                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* OFFICIAL ORGANISATIONS AND EXTERNAL LINKS */}
        <section className="mt-5 border-amber-100 pt-4">
          <div className="grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-2 lg:grid-cols-4">
            {officialLinks.map((item) => {
              const Icon = item.icon;

              return (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${item.label} — opens in a new tab`}
                  className="group flex min-w-0 items-center gap-2 rounded px-1 py-1 text-xs text-slate-600 transition-all duration-200 hover:bg-amber-50 hover:text-amber-800"
                >
                  <Icon
                    size={14}
                    strokeWidth={1.7}
                    className="shrink-0 text-amber-700 transition-transform duration-200 group-hover:scale-110"
                  />

                  <span className="min-w-0 flex-1 leading-5">{item.label}</span>

                  <ExternalLink
                    size={12}
                    className="shrink-0 text-slate-400 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-amber-700"
                  />
                </a>
              );
            })}
          </div>
        </section>

        {/* COPYRIGHT */}
        <div className="mt-4 flex flex-col items-center gap-2 border-t border-amber-100 pt-3 text-center text-[11px] text-slate-400 sm:flex-row sm:justify-between sm:text-left">
          <p>© 2026 Haor Rokkha Andolan. All rights reserved.</p>

          <p className="flex items-center gap-1">
            Working together to protect our haors and wetlands.
            <ArrowUpRight size={12} className="text-amber-700" />
          </p>
          <a
            href="https://www.souveral.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Website developed by Souveral — opens in a new tab"
            className="group inline-flex items-center transition-opacity duration-200 hover:opacity-75"
          >
            <Image
              src="/sov.png"
              alt="Developed by Souveral"
              width={85}
              height={24}
              className="h-10 w-auto object-contain"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
