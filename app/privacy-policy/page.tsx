import type { Metadata } from "next";
import Navbar from "../Navbar";
import Footer from "../Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | Haor Rokkha Andolan",
  description:
    "Learn how Haor Rokkha Andolan handles personal information on its website.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 px-4 pb-10 pt-24 sm:px-6">
        <article className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-5 sm:p-8">
          <p className="text-xs font-bold tracking-widest text-emerald-800">
            WEBSITE POLICIES
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            This policy explains how Haor Rokkha Andolan may collect and use
            information when you visit our website or contact our organisation.
          </p>

          <div className="mt-7 space-y-6 text-sm leading-7 text-slate-700">
            <section>
              <h2 className="font-bold text-slate-900">
                1. Information You Provide
              </h2>
              <p>
                If you contact us, submit a form, or communicate with our
                organisation, we may receive information such as your name,
                email address, phone number, and the contents of your message.
                Please do not submit sensitive personal information unless it is
                necessary for your request.
              </p>
            </section>

            <section>
              <h2 className="font-bold text-slate-900">
                2. How We Use Information
              </h2>
              <p>
                We may use submitted information to respond to enquiries,
                communicate about our activities, provide requested services,
                maintain website security, and improve our website.
              </p>
            </section>

            <section>
              <h2 className="font-bold text-slate-900">
                3. Organizational Independence and Non-Affiliation
              </h2>
              <p>
                Haor Rokkha Andolan is an independent civic and environmental
                initiative committed to wetland conservation, environmental
                protection, and the public interest. Unless expressly stated
                otherwise, the organisation is not affiliated with, operated by,
                or officially endorsed by any political party or government
                ministry, department, agency, or institution. Our activities,
                publications, campaigns, and public communications reflect our
                own objectives and positions. References to government bodies,
                public officials, political organisations, or other institutions
                do not imply endorsement or formal affiliation.
              </p>
            </section>

            <section>
              <h2 className="font-bold text-slate-900">4. Donations</h2>
              <p>
                Our donations page may display account details for making
                contributions. Verify the recipient and account details before
                transferring funds. Do not send payment credentials, PINs, or
                passwords to us. Any personal information you voluntarily share
                about a donation will be handled for the relevant communication
                or administrative purpose.
              </p>
            </section>

            <section>
              <h2 className="font-bold text-slate-900">
                5. Cookies and Technical Data
              </h2>
              <p>
                The website or its hosting and security services may use cookies
                or similar technologies for essential functionality, security,
                preferences, or performance. See our Cookie Policy for further
                information.
              </p>
            </section>

            <section>
              <h2 className="font-bold text-slate-900">
                6. Sharing and Security
              </h2>
              <p>
                We do not intend to sell your personal information. Information
                may be processed by service providers supporting website
                hosting, communications, or security, or disclosed where
                required by law. We take reasonable steps to protect
                information, but no internet transmission or storage system can
                be guaranteed completely secure.
              </p>
            </section>

            <section>
              <h2 className="font-bold text-slate-900">
                7. Data Retention and Your Choices
              </h2>
              <p>
                We retain information for as long as reasonably necessary for
                its purpose or applicable legal obligations. You may contact us
                to ask about personal information you have submitted or request
                a correction or deletion where appropriate and legally
                permissible.
              </p>
            </section>

            <section>
              <h2 className="font-bold text-slate-900">
                8. Third-Party Websites
              </h2>
              <p>
                Our website may link to external websites. Their privacy
                practices are governed by their own policies, which we encourage
                you to review.
              </p>
            </section>

            <section>
              <h2 className="font-bold text-slate-900">9. Policy Updates</h2>
              <p>
                We may update this policy as our website or practices change.
                The updated version will be published on this page.
              </p>
            </section>

            <section>
              <h2 className="font-bold text-slate-900">Contact</h2>
              <p>
                For privacy-related questions, please use our{" "}
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
            Please review this policy against the website's actual data
            collection, hosting, and applicable legal requirements before
            publication.
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
