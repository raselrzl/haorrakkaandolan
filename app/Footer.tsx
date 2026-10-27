import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ExternalLink } from "lucide-react";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Activities", href: "/activities" },
  { label: "Research & Publications", href: "/publications" },
  { label: "Demands", href: "/demands" },
  { label: "Constitution", href: "/constitution" },
  { label: "Donations", href: "/donations" },
  { label: "Contact Us", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Cookie Policy", href: "/cookie-policy" },
];

const officialLinks = [
  {
    label: "Haor and Wetland Development Directorate",
    labelBn: "হাওর ও জলাভূমি উন্নয়ন অধিদপ্তর",
    href: "https://dbhwd.gov.bd/",
  },
  {
    label: "Ministry of Water Resources",
    labelBn: "পানি সম্পদ মন্ত্রণালয়",
    href: "https://mowr.gov.bd/",
  },
  {
    label: "Ministry of Public Administration",
    labelBn: "জনপ্রশাসন মন্ত্রণালয়",
    href: "https://mopa.gov.bd/",
  },
  {
    label: "Ministry of Fisheries and Livestock",
    labelBn: "মৎস্য ও প্রাণিসম্পদ মন্ত্রণালয়",
    href: "https://mofl.gov.bd/",
  },
  {
    label: "Department of Fisheries",
    labelBn: "মৎস্য অধিদপ্তর",
    href: "https://fisheries.gov.bd/",
  },
  {
    label: "Bangladesh Fisheries Development Corporation",
    labelBn: "বাংলাদেশ মৎস্য উন্নয়ন কর্পোরেশন (BFDC)",
    href: "https://bfdc.gov.bd/",
  },
  {
    label: "The Commonwealth",
    labelBn: "আন্তর্জাতিক সহযোগিতা ও টেকসই উন্নয়ন",
    href: "https://thecommonwealth.org/",
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-emerald-200 bg-linear-to-t from-emerald-50 via-slate-50 to-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Logo, identity and navigation */}
        <div className="flex flex-col items-center gap-5 lg:flex-row lg:items-center lg:justify-between">
          {/* Logo and title */}
          <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:gap-3 sm:text-left">
            <Link
              href="/"
              aria-label="Haor Rokkha Andolan home"
              className="shrink-0"
            >
              <Image
                src="/ha2.png"
                alt="হাওর রক্ষা আন্দোলন logo"
                width={48}
                height={48}
                className="h-12 w-12 rounded-full border border-emerald-100 object-cover"
              />
            </Link>

            <div>
              <Link
                href="/"
                translate="no"
                className="notranslate text-sm font-bold text-[#123b2b] transition-colors hover:text-emerald-700"
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

          {/* Internal footer navigation */}
          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap justify-center gap-x-4 gap-y-3 lg:max-w-3xl lg:justify-end"
          >
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs transition-colors ${
                  link.href === "/donations"
                    ? "font-semibold text-red-600 hover:text-red-800"
                    : "text-slate-500 hover:text-[#176b45]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Relevant organisations and official links */}
        <section className="mt-6 border-t border-emerald-100 pt-5">
          <div className="mb-4 text-center">
            <h2 className="text-sm font-bold text-[#123b2b]">
              Relevant Organisations & Official Links
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {officialLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${item.label} — opens in a new tab`}
                className="group flex min-w-0 items-start justify-between gap-3 rounded-lg border border-emerald-100 bg-white px-3 py-3 transition-colors hover:border-emerald-300 hover:bg-emerald-50/70"
              >
                <span className="min-w-0">
                  <span className="block text-xs font-semibold leading-5 text-slate-700 transition-colors group-hover:text-[#176b45]">
                    {item.label}
                  </span>

                  <span className="mt-0.5 block text-[11px] leading-5 text-slate-500">
                    {item.labelBn}
                  </span>
                </span>

                <ExternalLink
                  size={14}
                  className="mt-0.5 shrink-0 text-emerald-700 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            ))}
          </div>
        </section>

        {/* Copyright */}
        <div className="mt-5 flex flex-col items-center gap-2 border-t border-emerald-100 pt-4 text-center text-[11px] text-slate-400 sm:flex-row sm:justify-between sm:text-left">
          <p>
            © {new Date().getFullYear()} Haor Rokkha Andolan. All rights
            reserved.
          </p>

          <p className="flex items-center gap-1">
            Working together to protect our haors and wetlands.
            <ArrowUpRight size={12} className="text-emerald-700" />
          </p>
        </div>
      </div>
    </footer>
  );
}
