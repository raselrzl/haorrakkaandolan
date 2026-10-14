import Link from "next/link";

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
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/"
              className="text-sm font-bold text-[#123b2b] hover:text-emerald-700"
            >
              হাওর রক্ষা আন্দোলন
            </Link>
            <p className="mt-1 text-xs text-slate-500">
              Protecting Wetlands, Preserving Life.
            </p>
          </div>

          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap gap-x-4 gap-y-2"
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

        <div className="mt-4 flex flex-col gap-1 border-t border-slate-100 pt-3 text-[11px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
           © 2026 Haor Rokkha Andolan. All rights reserved.
          </p>
          <p>Working together to protect our haors and wetlands.</p>
        </div>
      </div>
    </footer>
  );
}