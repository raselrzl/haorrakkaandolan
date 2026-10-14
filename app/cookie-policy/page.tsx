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
      <main className="min-h-screen bg-slate-50 px-4 pb-10 pt-24 sm:px-6">
        <article className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-5 sm:p-8">
          <p className="text-xs font-bold tracking-widest text-emerald-800">
            WEBSITE POLICIES
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Cookie Policy
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            This page explains what cookies are and how they may be used when
            you visit the Haor Rokkha Andolan website.
          </p>

          <div className="mt-7 space-y-6 text-sm leading-7 text-slate-700">
            <section>
              <h2 className="font-bold text-slate-900">1. What Are Cookies?</h2>
              <p>
                Cookies are small text files stored by your browser. Similar
                technologies may store preferences, support sessions, or help
                websites understand how their pages are used.
              </p>
            </section>

            <section>
              <h2 className="font-bold text-slate-900">2. Essential Cookies</h2>
              <p>
                Some cookies or similar storage may be necessary for core
                website features, security, authentication, or remembering
                preferences. Blocking these technologies may affect some
                functionality.
              </p>
            </section>

            <section>
              <h2 className="font-bold text-slate-900">3. Analytics and Performance</h2>
              <p>
                If analytics or performance tools are enabled, they may use
                cookies or similar technologies to measure visits and understand
                how people use the website. The specific tools and data collected
                depend on the services configured for this site.
              </p>
            </section>

            <section>
              <h2 className="font-bold text-slate-900">4. Managing Cookies</h2>
              <p>
                You can review your browser settings to view, block, or delete
                cookies. Some website features may not work as intended if
                essential cookies are blocked. If the website introduces
                non-essential cookies requiring consent, the relevant consent
                options should be provided before those cookies are set where
                required by applicable law.
              </p>
            </section>

            <section>
              <h2 className="font-bold text-slate-900">5. Third-Party Services</h2>
              <p>
                Hosting, embedded content, security, or other third-party
                services may use their own technologies when enabled. Refer to
                the relevant provider policies for details.
              </p>
            </section>

            <section>
              <h2 className="font-bold text-slate-900">6. Policy Updates</h2>
              <p>
                We may update this policy when website technologies or
                requirements change. The current version will be published here.
              </p>
            </section>

            <section>
              <h2 className="font-bold text-slate-900">Contact</h2>
              <p>
                If you have questions about cookies, visit our{" "}
                <a
                  href="/contact"
                  className="font-semibold text-emerald-800 underline underline-offset-4"
                >
                  Contact Us
                </a>{" "}
                page.
              </p>
            </section>
          </div>

          <p className="mt-7 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-400">
            This page describes possible cookie uses. Confirm the actual
            cookies and third-party services configured on your website before
            publishing.
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}