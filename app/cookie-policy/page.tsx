
import type { Metadata } from "next";
import Navbar from "../Navbar";
import Footer from "../Footer";

export const metadata: Metadata = {
  title: "Cookie Policy | Haor Rokkha Andolan",
  description:
    "Understand how cookies and similar technologies may be used on the Haor Rokkha Andolan website.",
};

export default function CookiePolicyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#faf9f6] px-4 pb-12 pt-24 sm:px-6">
        <article className="mx-auto max-w-3xl overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
          <div className="h-1.5 w-full bg-amber-500" />

          <div className="p-5 sm:p-8 md:p-10">
            <p className="text-xs font-bold tracking-[0.18em] text-amber-700">
              WEBSITE POLICIES
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Cookie Policy
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
              This page explains what cookies are and how they may be used when
              you visit the Haor Rokkha Andolan website.
            </p>

            <div className="mt-8 space-y-7 text-sm leading-7 text-slate-600">
              <section className="border-b border-slate-100 pb-6">
                <h2 className="font-bold text-slate-900">
                  1. What Are Cookies?
                </h2>
                <p className="mt-2">
                  Cookies are small text files stored by your browser. Similar
                  technologies may store preferences, support sessions, or help
                  websites understand how their pages are used.
                </p>
              </section>

              <section className="border-b border-slate-100 pb-6">
                <h2 className="font-bold text-slate-900">
                  2. Essential Cookies
                </h2>
                <p className="mt-2">
                  Some cookies or similar storage may be necessary for core
                  website features, security, authentication, or remembering
                  preferences. Blocking these technologies may affect some
                  functionality.
                </p>
              </section>

              <section className="border-b border-slate-100 pb-6">
                <h2 className="font-bold text-slate-900">
                  3. Analytics and Performance
                </h2>
                <p className="mt-2">
                  If analytics or performance tools are enabled, they may use
                  cookies or similar technologies to measure visits and understand
                  how people use the website. The specific tools and data collected
                  depend on the services configured for this site.
                </p>
              </section>

              <section className="border-b border-slate-100 pb-6">
                <h2 className="font-bold text-slate-900">
                  4. Managing Cookies
                </h2>
                <p className="mt-2">
                  You can review your browser settings to view, block, or delete
                  cookies. Some website features may not work as intended if
                  essential cookies are blocked. If the website introduces
                  non-essential cookies requiring consent, the relevant consent
                  options should be provided before those cookies are set where
                  required by applicable law.
                </p>
              </section>

              <section className="border-b border-slate-100 pb-6">
                <h2 className="font-bold text-slate-900">
                  5. Third-Party Services
                </h2>
                <p className="mt-2">
                  Hosting, embedded content, security, or other third-party
                  services may use their own technologies when enabled. Refer to
                  the relevant provider policies for details.
                </p>
              </section>

              <section className="border-b border-slate-100 pb-6">
                <h2 className="font-bold text-slate-900">
                  6. Policy Updates
                </h2>
                <p className="mt-2">
                  We may update this policy when website technologies or
                  requirements change. The current version will be published here.
                </p>
              </section>

              <section>
                <h2 className="font-bold text-slate-900">Contact</h2>
                <p className="mt-2">
                  If you have questions about cookies, visit our{" "}
                  <a
                    href="/contact"
                    className="font-semibold text-amber-700 underline decoration-amber-300 underline-offset-4 transition-colors hover:text-amber-900"
                  >
                    Contact Us
                  </a>{" "}
                  page.
                </p>
              </section>
            </div>

            <p className="mt-8 border-t border-slate-100 pt-5 text-xs leading-6 text-slate-400">
              This page describes possible cookie uses. Confirm the actual
              cookies and third-party services configured on your website before
              publishing.
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
