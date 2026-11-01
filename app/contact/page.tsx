"use client";

import { useActionState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Leaf,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Waves,
} from "lucide-react";

import Navbar from "../Navbar";
import { submitContactMessage, type ContactFormState } from "./actions";
import Footer from "../Footer";
import LanguageSwitcher from "../LanguageSwitcher";

const initialState: ContactFormState = {
  success: false,
  message: "",
};

const reasons = [
  "Haor Protection",
  "River and Wetland Conservation",
  "Environmental Concern",
  "Volunteer",
  "Partnership",
  "Media and Press",
  "General Inquiry",
  "Other",
];

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/15";

const labelClass =
  "mb-1.5 block text-xs font-semibold text-slate-700 sm:text-sm";

export default function ContactPage() {
  const [state, formAction, pending] = useActionState(
    submitContactMessage,
    initialState,
  );

  return (
    <main className="min-h-screen bg-[#faf9f6] text-slate-800">
      {/* HERO */}
      <section className="relative isolate h-[260px] w-full overflow-hidden bg-[#29251f] text-white sm:h-[310px] lg:h-[350px]">
        {/* Background decoration */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 85% 20%, #b77928 0, transparent 35%), radial-gradient(circle at 10% 100%, #80603b 0, transparent 40%)",
          }}
        />

        {/* Hero content */}
        <div className="mx-auto flex h-full max-w-7xl items-center px-5 py-6 sm:px-8 lg:px-12">
          <div className="max-w-2xl">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-400/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-amber-200 sm:mb-3 sm:text-xs">
              <Leaf size={13} />
              Contact our organization
            </div>

            <h1 className="font-[var(--font-playfair)] text-2xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Let&apos;s protect{" "}
              <span className="text-amber-400">our haors together.</span>
            </h1>

            <p className="mt-2 max-w-xl text-xs leading-5 text-white/75 sm:mt-3 sm:text-sm sm:leading-6">
              Share a concern, ask a question, or join our efforts to protect
              the rivers, wetlands, and communities of Bangladesh.
            </p>
          </div>
        </div>

        {/* Amber accent */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[5px] bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300"
          aria-hidden="true"
        />
      </section>

      {/* NAVIGATION */}
      <Navbar />

      {/* CONTACT FORM AND INFORMATION */}
      <section className="mx-auto max-w-7xl px-4 py-7 sm:px-8 sm:py-9 lg:px-12">
        <div className="max-w-xl mx-auto">
          {/* CONTACT FORM */}
          <div
            id="contact-form"
            className="min-w-0 border rounded-2xl border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:p-7"
          >
            <div className="mb-5 border-b border-slate-100 pb-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-amber-700 sm:text-xs">
                Contact form
              </p>

              <h2 className="mt-1.5 font-[var(--font-playfair)] text-2xl font-semibold text-slate-900 sm:text-3xl">
                How can we help?
              </h2>

              <p className="mt-1.5 text-xs leading-5 text-slate-500 sm:text-sm">
                Fill in the details below to contact our team.
              </p>
            </div>

            {/* FORM RESPONSE */}
            {state.message && (
              <div
                role={state.success ? "status" : "alert"}
                className={`mb-4 flex items-start gap-2.5 border p-3 text-xs leading-5 sm:text-sm ${
                  state.success
                    ? "border-amber-200 bg-amber-50 text-amber-950"
                    : "border-red-200 bg-red-50 text-red-800"
                }`}
              >
                {state.success ? (
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-amber-700"
                  />
                ) : (
                  <MessageCircle size={18} className="mt-0.5 shrink-0" />
                )}

                <div>
                  <p className="font-semibold">
                    {state.success ? "Message received" : "Please check"}
                  </p>

                  <p>{state.message}</p>
                </div>
              </div>
            )}

            {/* SUCCESS STATE */}
            {state.success ? (
              <div className="border border-amber-200 bg-[#faf9f6] px-4 py-7 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-amber-100 text-amber-800">
                  <CheckCircle2 size={25} />
                </div>

                <h3 className="mt-3 text-base font-semibold text-slate-900">
                  Thank you for reaching out!
                </h3>

                <p className="mx-auto mt-1.5 max-w-sm text-xs leading-5 text-slate-600 sm:text-sm">
                  Your inquiry has been recorded. Thank you for supporting our
                  haors and environment.
                </p>

                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-amber-600 sm:text-sm"
                >
                  Send another message
                  <ArrowRight size={14} />
                </button>
              </div>
            ) : (
              /* CONTACT FORM */
              <form action={formAction} className="space-y-3.5 sm:space-y-4">
                {/* Reason */}
                <div>
                  <label htmlFor="reason" className={labelClass}>
                    Reason for contact <span className="text-red-600">*</span>
                  </label>

                  <div className="relative">
                    <select
                      id="reason"
                      name="reason"
                      required
                      defaultValue=""
                      aria-invalid={Boolean(state.errors?.reason)}
                      className={`${inputClass} appearance-none pr-10`}
                    >
                      <option value="" disabled>
                        Select a reason
                      </option>

                      {reasons.map((reason) => (
                        <option key={reason} value={reason}>
                          {reason}
                        </option>
                      ))}
                    </select>

                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>

                  {state.errors?.reason && (
                    <p className="mt-1 text-xs text-red-600">
                      {state.errors.reason}
                    </p>
                  )}
                </div>

                {/* Name */}
                <div>
                  <label htmlFor="name" className={labelClass}>
                    Full name <span className="text-red-600">*</span>
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your full name"
                    required
                    minLength={2}
                    maxLength={100}
                    aria-invalid={Boolean(state.errors?.name)}
                    className={inputClass}
                  />

                  {state.errors?.name && (
                    <p className="mt-1 text-xs text-red-600">
                      {state.errors.name}
                    </p>
                  )}
                </div>

                {/* Phone and email */}
                <div className="grid gap-3.5 sm:grid-cols-2 sm:gap-4">
                  <div className="min-w-0">
                    <label htmlFor="phone" className={labelClass}>
                      Phone number <span className="text-red-600">*</span>
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+880 1XXXXXXXXX"
                      required
                      minLength={7}
                      maxLength={25}
                      aria-invalid={Boolean(state.errors?.phone)}
                      className={inputClass}
                    />

                    {state.errors?.phone && (
                      <p className="mt-1 text-xs text-red-600">
                        {state.errors.phone}
                      </p>
                    )}
                  </div>

                  <div className="min-w-0">
                    <label htmlFor="email" className={labelClass}>
                      Email address <span className="text-red-600">*</span>
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      required
                      maxLength={254}
                      aria-invalid={Boolean(state.errors?.email)}
                      className={inputClass}
                    />

                    {state.errors?.email && (
                      <p className="mt-1 text-xs text-red-600">
                        {state.errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <div className="mb-1.5 flex flex-wrap items-center justify-between gap-1.5">
                    <label htmlFor="message" className={labelClass + " mb-0"}>
                      Your message <span className="text-red-600">*</span>
                    </label>

                    <span className="text-[10px] text-slate-400 sm:text-xs">
                      10–5,000 characters
                    </span>
                  </div>

                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    minLength={10}
                    maxLength={5000}
                    required
                    placeholder="Tell us about your concern, idea, or inquiry..."
                    aria-invalid={Boolean(state.errors?.message)}
                    className={`${inputClass} min-h-24 resize-y leading-5`}
                  />

                  {state.errors?.message && (
                    <p className="mt-1 text-xs text-red-600">
                      {state.errors.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[10px] leading-4 text-slate-500 sm:max-w-56 sm:text-xs">
                    <span className="text-red-600">*</span> Required fields.
                    Please provide accurate information.
                  </p>

                  <button
                    type="submit"
                    disabled={pending}
                    className="group inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    {pending ? (
                      <>
                        <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send message
                        <Send
                          size={15}
                          className="transition-transform group-hover:translate-x-0.5"
                        />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
      <div className="fixed right-4 top-1/2 z-9999 -translate-y-1/2">
        <LanguageSwitcher />
      </div>
      {/* FOOTER */}
      <Footer />
    </main>
  );
}
