"use client";

import { useState } from "react";
import {
  ArrowRight,
  Building2,
  CreditCard,
  Heart,
  MapPin,
  MessageCircle,
  Wallet,
} from "lucide-react";
import Navbar from "../Navbar";

type DonationAccount = {
  id: string;
  accountName: string;
  providerName: string;
  accountNumber: string;
  bankAddress: string | null;
};

type Props = {
  accounts: DonationAccount[];
};

export default function DonationsContent({ accounts }: Props) {
  const [language, setLanguage] = useState<"en" | "bn">("en");
  const bn = language === "bn";

  const t = {
    eyebrow: bn ? "অনুদান" : "DONATION",
    title: bn
      ? "হাওর রক্ষা আন্দোলনের পাশে থাকুন"
      : "Support Haor Rokkha Andolan",
    intro: bn
      ? "হাওর, নদী, জলাভূমি, জীববৈচিত্র্য ও স্থানীয় মানুষের জীবন-জীবিকা রক্ষায় আপনার সহযোগিতা গুরুত্বপূর্ণ।"
      : "Your contribution supports our efforts to protect haors, rivers, wetlands, biodiversity, and local communities.",
    donate: bn ? "অনুদান দিন" : "Donate Now",
    details: bn ? "অনুদানের তথ্য" : "DONATION DETAILS",
    accounts: bn ? "অনুদানের অ্যাকাউন্টসমূহ" : "Donation Accounts",
    accountIntro: bn
      ? "নিচের তথ্য ব্যবহার করে অনুদান পাঠান।"
      : "Use the account details below to send your contribution.",
    payment: bn ? "পেমেন্টের মাধ্যম" : "Payment Method",
    accountName: bn ? "অ্যাকাউন্টের নাম" : "Account Name",
    accountNumber: bn ? "অ্যাকাউন্ট নম্বর" : "Account Number",
    address: bn ? "শাখা / ঠিকানা" : "Branch / Address",
    verify: bn
      ? "অনুদান পাঠানোর আগে প্রাপকের তথ্য যাচাই করুন।"
      : "Please verify the recipient details before transferring.",
    emptyTitle: bn
      ? "অনুদানের অ্যাকাউন্টের তথ্য শিগগিরই প্রকাশ করা হবে।"
      : "Donation accounts will be available soon.",
    emptyText: bn
      ? "পরে আবার দেখুন অথবা সহায়তার জন্য যোগাযোগ করুন।"
      : "Please check back later or contact us for assistance.",
    thanks: bn ? "আপনার অনুদানের জন্য ধন্যবাদ" : "Thank You for Your Support",
    thanksText: bn
      ? "হাওর ও প্রকৃতি রক্ষায় আপনার সহযোগিতা আমাদের অনুপ্রেরণা।"
      : "Your support inspires our shared efforts to protect our haors and nature.",
    helpTitle: bn ? "সহায়তা প্রয়োজন?" : "Need Help?",
    helpText: bn
      ? "অনুদান সম্পর্কে জানতে বা সহায়তা পেতে আমাদের সঙ্গে যোগাযোগ করুন।"
      : "Contact us if you have questions or need help with your donation.",
    contact: bn ? "যোগাযোগ করুন" : "Contact Us",
    footer: bn
      ? "হাওর, নদী, জলাভূমি ও প্রকৃতি রক্ষায় আমরা একসঙ্গে।"
      : "Together for our haors, rivers, wetlands, and nature.",
    count: bn ? "টি অ্যাকাউন্ট" : "accounts",
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Navbar />

      {/* Compact hero */}
      <section
        className="relative isolate flex min-h-100 mt-16 items-center overflow-hidden bg-emerald-950 text-white sm:min-h-105"
        style={{
          backgroundImage: "url('/monu1.jpg')",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 -z-10 bg-emerald-950/75" />
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-emerald-950/95 via-emerald-950/75 to-emerald-950/35" />

        <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
          <div className="mb-8 flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-emerald-200">
              <Heart size={15} />
              {t.eyebrow}
            </span>

            {/* English / Bangla toggle */}
            <div
              className="inline-flex shrink-0 rounded-lg border border-white/25 bg-black/20 p-1 backdrop-blur-sm"
              aria-label="Choose page language"
            >
              <button
                type="button"
                onClick={() => setLanguage("en")}
                aria-pressed={!bn}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  !bn
                    ? "bg-white text-emerald-950"
                    : "text-white/85 hover:bg-white/10"
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage("bn")}
                aria-pressed={bn}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  bn
                    ? "bg-white text-emerald-950"
                    : "text-white/85 hover:bg-white/10"
                }`}
              >
                বাংলা
              </button>
            </div>
          </div>

          <h1 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {t.title}
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-6 text-white/90 sm:text-base sm:leading-7">
            {t.intro}
          </p>

          <a
            href="#donation-accounts"
            className="mt-6 inline-flex min-h-10 items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-emerald-950 transition hover:bg-emerald-50"
          >
            {t.donate}
            <ArrowRight size={16} />
          </a>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-linear-to-t from-emerald-950/40 to-transparent" />
      </section>

      {/* Donation accounts */}
      <section
        id="donation-accounts"
        className="scroll-mt-4 bg-slate-50 px-4 py-9 sm:px-6 sm:py-11"
      >
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-[11px] font-bold tracking-[0.15em] text-emerald-800">
                {t.details}
              </p>
              <h2 className="mt-1.5 text-2xl font-bold tracking-tight sm:text-3xl">
                {t.accounts}
              </h2>
              <p className="mt-1.5 text-sm text-slate-600">{t.accountIntro}</p>
            </div>

            <span className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600">
              <Wallet size={15} className="text-emerald-800" />
              {accounts.length} {t.count}
            </span>
          </div>

          {accounts.length === 0 ? (
            <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-9 text-center">
              <Building2 size={26} className="mx-auto text-emerald-800" />
              <h3 className="mt-3 text-sm font-bold text-slate-800">
                {t.emptyTitle}
              </h3>
              <p className="mt-1.5 text-sm text-slate-600">{t.emptyText}</p>
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
              {accounts.map((account) => (
                <article
                  key={account.id}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-emerald-200 hover:shadow-sm"
                >
                  <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800">
                      <CreditCard size={19} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] text-slate-500">{t.payment}</p>
                      <h3 className="wrap-break-words text-sm font-bold text-slate-900">
                        {account.providerName}
                      </h3>
                    </div>

                    <span className="rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-800">
                      DONATE
                    </span>
                  </div>

                  <div className="space-y-3 px-4 py-3.5">
                    <div>
                      <p className="text-[11px] font-medium text-slate-500">
                        {t.accountName}
                      </p>
                      <p className="mt-0.5 wrap-break-words text-sm font-semibold text-slate-800">
                        {account.accountName}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-medium text-slate-500">
                        {t.accountNumber}
                      </p>
                      <p className="mt-1 break-all rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 font-mono text-sm font-bold tracking-wide text-slate-900">
                        {account.accountNumber}
                      </p>
                    </div>

                    {account.bankAddress && (
                      <div className="flex items-start gap-2">
                        <MapPin
                          size={14}
                          className="mt-0.5 shrink-0 text-emerald-800"
                        />
                        <div className="min-w-0">
                          <p className="text-[11px] font-medium text-slate-500">
                            {t.address}
                          </p>
                          <p className="mt-0.5 whitespace-pre-line wrap-break-words text-sm leading-5 text-slate-700">
                            {account.bankAddress}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-100 bg-slate-50 px-4 py-2">
                    <p className="text-xs leading-5 text-slate-600">
                      {t.verify}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Compact thank-you section */}
      <section className="px-4 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto flex max-w-5xl items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/70 p-4 sm:p-5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
            <Heart size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-emerald-950">{t.thanks}</h2>
            <p className="mt-1 text-sm leading-6 text-slate-700">
              {t.thanksText}
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="border-t border-slate-200 bg-white px-4 py-7 sm:px-6">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-emerald-800">
              <MessageCircle size={19} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {t.helpTitle}
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-5 text-slate-600">
                {t.helpText}
              </p>
            </div>
          </div>

          <a
            href="/contact"
            className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            {t.contact}
            <ArrowRight size={15} />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 px-4 py-4 text-center">
        <p className="text-sm font-bold text-slate-800">Haor Rokkha Andolan</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">{t.footer}</p>
      </footer>
    </main>
  );
}
