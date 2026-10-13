"use client";

import { useActionState } from "react";
import Link from "next/link";
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
  "w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10";

const labelClass =
  "mb-1.5 block text-xs font-semibold text-slate-700 sm:text-sm";

export default function ContactPage() {
  const [state, formAction, pending] = useActionState(
    submitContactMessage,
    initialState,
  );

  return (
    <main className="min-h-screen bg-[#f7f9f5] text-[#173b2b]">
      <Navbar />

      {/* Compact hero */}
      <section className="relative isolate overflow-hidden bg-[#102e20] pt-24 text-white sm:pt-28">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(circle at 85% 20%, #5b9a67 0, transparent 35%), radial-gradient(circle at 10% 100%, #38704c 0, transparent 40%)",
          }}
        />

        <div className="absolute -right-16 top-6 -z-10 h-52 w-52 rounded-full border border-white/10 sm:right-10 sm:h-72 sm:w-72" />
        <div className="absolute -right-8 top-14 -z-10 h-36 w-36 rounded-full border border-white/10 sm:right-20 sm:h-52 sm:w-52" />

        <div className="mx-auto max-w-7xl px-5 pb-9 pt-5 sm:px-8 sm:pb-12 lg:px-12">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200/20 bg-white/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-200 sm:text-xs">
              <Leaf size={13} />
              Contact our organization
            </div>

            <h1 className="font-[var(--font-playfair)] text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Let&apos;s protect{" "}
              <span className="text-emerald-300">our haors together.</span>
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-emerald-50/75">
              Share a concern, ask a question, or join our efforts to protect
              the rivers, wetlands, and communities of Bangladesh.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-emerald-100/80 sm:text-sm">
              <span className="inline-flex items-center gap-1.5">
                <Waves size={15} className="text-emerald-300" />
                Protect our wetlands
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Leaf size={15} className="text-emerald-300" />
                Preserve our future
              </span>
            </div>
          </div>
        </div>

        <div className="h-1 w-full bg-linear-to-r from-emerald-800 via-emerald-400 to-lime-300" />
      </section>

      {/* Contact form and information */}
      <section className="mx-auto max-w-7xl px-4 py-7 sm:px-8 sm:py-9 lg:px-12">
        <div className="grid items-start gap-5 lg:grid-cols-[0.78fr_1.22fr] lg:gap-6">
          {/* Organization information */}
          <aside className="overflow-hidden rounded-xl bg-[#173d2a] text-white shadow-md shadow-emerald-950/10">
            <div className="p-5 sm:p-6">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-400/15 text-emerald-300">
                <MessageCircle size={19} />
              </div>

              <h2 className="font-[var(--font-playfair)] text-2xl font-semibold sm:text-3xl">
                Get in touch
              </h2>

              <p className="mt-2 text-xs leading-5 text-emerald-50/75 sm:text-sm sm:leading-6">
                Your voice matters. Share your concerns, ideas, or interest in
                working together for healthier haors and rivers.
              </p>

              <div className="my-5 h-px bg-white/10" />

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-emerald-300">
                    <MapPin size={16} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold">Our organization</h3>
                    <p className="mt-1 text-xs leading-5 text-emerald-50/70">
                      Haor Rokkha Andolan
                      <br />
                      Moulvibazar, Bangladesh
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-emerald-300">
                    <Mail size={16} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold">Email inquiries</h3>
                    <p className="mt-1 text-xs leading-5 text-emerald-50/70">
                      Send your inquiry through the contact form.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-emerald-300">
                    <Phone size={16} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold">Phone inquiries</h3>
                    <p className="mt-1 text-xs leading-5 text-emerald-50/70">
                      Provide your phone number so our team can reach you.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 bg-black/10 px-5 py-3.5 sm:px-6">
              <div className="flex items-start gap-2.5">
                <ShieldCheck
                  size={16}
                  className="mt-0.5 shrink-0 text-emerald-300"
                />
                <p className="text-[11px] leading-5 text-emerald-50/70">
                  Your contact details help us respond to your inquiry.
                </p>
              </div>
            </div>
          </aside>

          {/* Contact form */}
          <div
            id="contact-form"
            className="min-w-0 rounded-xl border border-[#e2e9df] bg-white p-4 shadow-sm sm:p-6 lg:p-7"
          >
            <div className="mb-5 border-b border-slate-100 pb-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700 sm:text-xs">
                Contact form
              </p>
              <h2 className="mt-1.5 font-[var(--font-playfair)] text-2xl font-semibold text-[#173b2b] sm:text-3xl">
                How can we help?
              </h2>
              <p className="mt-1.5 text-xs leading-5 text-slate-500 sm:text-sm">
                Fill in the details below to contact our team.
              </p>
            </div>

            {state.message && (
              <div
                role={state.success ? "status" : "alert"}
                className={`mb-4 flex items-start gap-2.5 rounded-lg border p-3 text-xs leading-5 sm:text-sm ${
                  state.success
                    ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                    : "border-red-200 bg-red-50 text-red-800"
                }`}
              >
                {state.success ? (
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-emerald-700"
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

            {state.success ? (
              <div className="rounded-lg border border-emerald-100 bg-[#f6faf4] px-4 py-6 text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                  <CheckCircle2 size={24} />
                </div>

                <h3 className="mt-3 text-base font-semibold text-[#173b2b]">
                  Thank you for reaching out!
                </h3>

                <p className="mx-auto mt-1.5 max-w-sm text-xs leading-5 text-slate-600 sm:text-sm">
                  Your inquiry has been recorded. Thank you for supporting our
                  haors and environment.
                </p>

                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#173d2a] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#24583a] sm:text-sm"
                >
                  Send another message
                  <ArrowRight size={14} />
                </button>
              </div>
            ) : (
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
                      className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
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

                <div className="flex flex-col gap-3 border-t border-slate-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[10px] leading-4 text-slate-500 sm:max-w-56 sm:text-xs">
                    <span className="text-red-600">*</span> Required fields.
                    Please provide accurate information.
                  </p>

                  <button
                    type="submit"
                    disabled={pending}
                    className="group inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-[#173d2a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#24583a] focus:outline-none focus:ring-2 focus:ring-emerald-700/30 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    {pending ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
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
    </main>
  );
}
