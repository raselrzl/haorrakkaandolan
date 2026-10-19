
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
import DonateNow from "./DonateNow";

type DonationAccount = {
  id: string;
  accountName: string;
  providerName: string;
  accountNumber: string;
  bankAddress: string | null;
};

type DonationsContentProps = {
  accounts: DonationAccount[];
};

export default function DonationsContent({
  accounts,
}: DonationsContentProps) {
  const [language, setLanguage] = useState<"en" | "bn">("en");
  const bn = language === "bn";

  const t = {
    donate: bn ? "এখনই অনুদান দিন" : "Donate Now",
    accounts: bn ? "অনুদানের অ্যাকাউন্ট" : "Donation Accounts",
    accountIntro: bn
      ? "নিচের অ্যাকাউন্টগুলোর মাধ্যমে সরাসরি অনুদান দিতে পারেন।"
      : "You can support our work directly through the accounts below.",
    accountName: bn ? "অ্যাকাউন্টের নাম" : "Account Name",
    provider: bn ? "ব্যাংক / সেবা প্রদানকারী" : "Bank / Provider",
    number: bn ? "অ্যাকাউন্ট নম্বর" : "Account Number",
    address: bn ? "শাখা / ঠিকানা" : "Branch / Address",
    noAccounts: bn
      ? "বর্তমানে কোনো অনুদান অ্যাকাউন্ট প্রকাশিত নেই।"
      : "No donation accounts are currently published.",
    copy: bn ? "নম্বর কপি করুন" : "Copy Account Number",
    copied: bn ? "কপি হয়েছে" : "Copied",
    missionTitle: bn
      ? "হাওর রক্ষায় আপনার অবদান"
      : "Your Contribution Protects Our Haors",
    missionText: bn
      ? "আপনার অনুদান হাওর, জীববৈচিত্র্য, পরিবেশ এবং হাওরনির্ভর জনগোষ্ঠীর সুরক্ষায় আমাদের উদ্যোগকে এগিয়ে নিতে সহায়তা করে।"
      : "Your contribution helps support initiatives focused on protecting haors, biodiversity, the environment, and communities that depend on these wetlands.",
    howTitle: bn ? "কীভাবে অনুদান দেবেন" : "How to Donate",
    stepOne: bn
      ? "অনলাইনে অনুদানের জন্য Donate Now নির্বাচন করুন।"
      : "Select Donate Now to start an online donation.",
    stepTwo: bn
      ? "পরিমাণ ও যোগাযোগের তথ্য পূরণ করুন।"
      : "Enter your donation amount and contact details.",
    stepThree: bn
      ? "SSLCommerz পেমেন্ট পেজে গিয়ে পেমেন্ট সম্পন্ন করুন।"
      : "Continue to SSLCommerz and complete your payment.",
    manualNote: bn
      ? "ব্যাংক বা অন্যান্য অ্যাকাউন্টে সরাসরি পাঠালে সঠিক অ্যাকাউন্টের তথ্য যাচাই করে নিন।"
      : "For direct transfers, please verify the account details before sending money.",
    contactTitle: bn
      ? "অনুদান সম্পর্কে সহায়তা প্রয়োজন?"
      : "Need Help With Your Donation?",
    contactText: bn
      ? "অনুদান সংক্রান্ত তথ্য বা সহায়তার জন্য আমাদের সঙ্গে যোগাযোগ করুন।"
      : "Contact us if you need assistance or have questions about making a donation.",
    footer: bn
      ? "হাওর, প্রকৃতি ও মানুষের কল্যাণে আপনার সহযোগিতার জন্য ধন্যবাদ।"
      : "Thank you for supporting our work for haors, nature, and local communities.",
  };

  async function copyAccountNumber(accountNumber: string) {
    try {
      await navigator.clipboard.writeText(accountNumber);
      window.alert(t.copied);
    } catch {
      window.alert(
        bn
          ? "কপি করা যায়নি। অনুগ্রহ করে নম্বরটি হাতে কপি করুন।"
          : "Could not copy. Please copy the account number manually.",
      );
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 mt-16">
      <Navbar />

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-emerald-950">
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{ backgroundImage: "url('/monu1.jpg')" }}
        />
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-emerald-950/95 via-emerald-950/80 to-emerald-950/55" />

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white">
              <Heart size={14} />
              {bn ? "হাওর রক্ষা আন্দোলন" : "Haor Rokkha Andolan"}
            </span>

            <div
              className="inline-flex items-center rounded-lg border border-white/30 bg-black/20 p-1"
              aria-label="Choose language"
            >
              <button
                type="button"
                onClick={() => setLanguage("en")}
                aria-pressed={!bn}
                className={`rounded-md px-3 py-1.5 text-xs font-bold transition ${
                  !bn
                    ? "bg-white text-emerald-950"
                    : "text-white hover:bg-white/10"
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage("bn")}
                aria-pressed={bn}
                className={`rounded-md px-3 py-1.5 text-xs font-bold transition ${
                  bn
                    ? "bg-white text-emerald-950"
                    : "text-white hover:bg-white/10"
                }`}
              >
                বাংলা
              </button>
            </div>
          </div>

          <div className="mt-9 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-200">
              {bn ? "আপনার সহযোগিতা গুরুত্বপূর্ণ" : "Your Support Matters"}
            </p>

            <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              {bn
                ? "হাওর রক্ষায় আপনার সহযোগিতা দিন"
                : "Support the Protection of Our Haors"}
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-emerald-50 sm:text-base">
              {t.missionText}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
            {/*   <DonateNow language={language} /> */}

              <a
                href="#donation-accounts"
                className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                {bn ? "অনুদানের অ্যাকাউন্ট দেখুন" : "View Donation Accounts"}
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
          <div className="rounded-xl border border-emerald-900/10 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800">
                <Heart size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {t.missionTitle}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {t.missionText}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-900/10 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-800">
                <Wallet size={20} />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                {t.howTitle}
              </h2>
            </div>

            <ol className="mt-4 space-y-3 text-sm leading-5 text-slate-600">
              {[t.stepOne, t.stepTwo, t.stepThree].map((step, index) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-900">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Donation Accounts */}
      <section
        id="donation-accounts"
        className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-10 sm:px-6 lg:px-8"
      >
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-800">
              {bn ? "সরাসরি অনুদান" : "Direct Contributions"}
            </p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">
              {t.accounts}
            </h2>
            <p className="mt-2 text-sm text-slate-600">{t.accountIntro}</p>
          </div>

          <span className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600">
            <Building2 size={15} />
            {accounts.length} {bn ? "টি অ্যাকাউন্ট" : "accounts"}
          </span>
        </div>

        {accounts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
            <Wallet className="mx-auto text-slate-400" size={30} />
            <p className="mt-3 text-sm text-slate-600">{t.noAccounts}</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {accounts.map((account) => (
              <article
                key={account.id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-emerald-800/40 hover:shadow-md"
              >
                <div className="flex items-center gap-3 border-b border-slate-100 bg-emerald-950 px-4 py-4 text-white">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <Building2 size={20} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-bold">
                      {account.accountName}
                    </h3>
                    <p className="mt-0.5 truncate text-xs text-emerald-100">
                      {account.providerName}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 p-4">
                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      {t.number}
                    </p>
                    <div className="mt-1 flex items-center justify-between gap-3">
                      <p className="break-all font-mono text-sm font-bold text-slate-900">
                        {account.accountNumber}
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          void copyAccountNumber(account.accountNumber)
                        }
                        className="shrink-0 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-emerald-900 transition hover:border-emerald-800 hover:bg-emerald-50"
                      >
                        {t.copy}
                      </button>
                    </div>
                  </div>

                  {account.bankAddress && (
                    <div className="flex items-start gap-2 border-t border-slate-100 pt-3">
                      <MapPin
                        size={16}
                        className="mt-0.5 shrink-0 text-emerald-800"
                      />
                      <div>
                        <p className="text-xs font-medium text-slate-500">
                          {t.address}
                        </p>
                        <p className="mt-1 text-sm leading-5 text-slate-700">
                          {account.bankAddress}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900">
          {t.manualNote}
        </p>
      </section>

      {/* Support */}
      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-900">
              <MessageCircle size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {t.contactTitle}
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
                {t.contactText}
              </p>
            </div>
          </div>

          <a
            href="/contact"
            className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800"
          >
            {bn ? "যোগাযোগ করুন" : "Contact Us"}
            <ArrowRight size={16} />
          </a>
        </div>

        <p className="mt-6 text-center text-xs leading-5 text-slate-500">
          {t.footer}
        </p>
      </section>
    </main>
  );
}
