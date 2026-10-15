import Link from "next/link";
import Image from "next/image";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Activities", href: "/activities" },
  { label: "Demands", href: "/demands" },
  { label: "Constitution", href: "/constitution" },
  { label: "Donations", href: "/donations" },
  { label: "Contact Us", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Cookie Policy", href: "/cookie-policy" },
];

export default function Footer() {
  return (
    <footer className="border-t border-green-200 bg-linear-to-t from-green-50 via-gray-50 to-white">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:justify-between">
          {/* Logo and Title */}
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
                className="h-12 w-12 rounded-full border border-slate-200 object-cover"
              />
            </Link>

            <div className="text-center sm:text-left">
              <Link
                href="/"
                className="text-sm font-bold text-[#123b2b] transition-colors hover:text-emerald-700"
              >
                হাওর রক্ষা আন্দোলন
              </Link>
              <p className="mt-1 text-xs text-slate-500 italic">
                Protecting Wetlands, Preserving Life.
              </p>
            </div>
          </div>

          {/* Footer Navigation */}
          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap justify-center gap-x-4 gap-y-3 sm:justify-end"
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

        {/* Copyright */}
        <div className="mt-4 flex flex-col items-center gap-1 border-t border-slate-100 pt-3 text-center text-[11px] text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p>© 2026 Haor Rokkha Andolan. All rights reserved.</p>
          <p>Working together to protect our haors and wetlands.</p>
        </div>
      </div>
    </footer>
  );
}