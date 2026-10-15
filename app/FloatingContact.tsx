"use client";

import { useActionState, useEffect, useState } from "react";
import {
  CheckCircle2,
  Droplet,
  LoaderCircle,
  Mail,
  MessageCircle,
  Send,
  X,
} from "lucide-react";

import { contactMessageAction } from "./newsActions";
import { initialContactFormState } from "./contactTypes";

function ContactForm({
  onClose,
  onSendAnother,
}: {
  onClose: () => void;
  onSendAnother: () => void;
}) {
  const [state, formAction, pending] = useActionState(
    contactMessageAction,
    initialContactFormState,
  );

  const inputClass =
    "w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10";

  const labelClass = "mb-1 block text-xs font-semibold text-slate-700";

  return (
    <section
      aria-labelledby="floating-contact-title"
      aria-live="polite"
      className="w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 sm:w-[330px] animate-contact-in"
    >
      <div className="flex items-center justify-between border-b border-slate-100 bg-white px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800">
            <MessageCircle className="h-5 w-5 fill-emerald-700/15" />
          </div>

          <div>
            <h2
              id="floating-contact-title"
              className="text-sm font-bold text-slate-900"
            >
              হাওর রক্ষা আন্দোলন
            </h2>
            <p className="text-[11px] text-slate-500">Haor Rokkha Andolan</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close contact form"
          className="rounded-md p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {state.success ? (
        <div className="px-5 py-7 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-700" />

          <h3 className="mt-3 text-base font-bold text-slate-900">
            Message received
          </h3>

          <p className="mt-2 text-xs leading-5 text-slate-600">
            {state.message}
          </p>

          <div className="mt-5 flex justify-center gap-2">
            <button
              type="button"
              onClick={onSendAnother}
              className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Send another
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-emerald-800 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-900"
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <form action={formAction} className="space-y-3 p-4">
          {/* Honeypot for basic spam protection */}
          <div
            aria-hidden="true"
            className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"
          >
            <label htmlFor="contact-website">Website</label>
            <input
              id="contact-website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div>
            <label htmlFor="contact-reason" className={labelClass}>
              Reason for contacting *
            </label>
            <select
              id="contact-reason"
              name="reason"
              required
              defaultValue=""
              className={inputClass}
            >
              <option value="" disabled>
                Select a reason
              </option>
              <option value="General inquiry">General inquiry</option>
              <option value="Haor conservation">Haor conservation</option>
              <option value="Report an environmental issue">
                Report an environmental issue
              </option>
              <option value="Volunteer or membership">
                Volunteer or membership
              </option>
              <option value="Partnership or support">
                Partnership or support
              </option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="contact-name" className={labelClass}>
              Full name *
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              maxLength={100}
              autoComplete="name"
              placeholder="Your name"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="contact-email" className={labelClass}>
              Email address *
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                maxLength={254}
                autoComplete="email"
                placeholder="you@example.com"
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>

          <div>
            <label htmlFor="contact-phone" className={labelClass}>
              Phone number *
            </label>
            <input
              id="contact-phone"
              name="phone"
              type="tel"
              required
              maxLength={30}
              autoComplete="tel"
              placeholder="Your phone number"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="contact-message" className={labelClass}>
              Message *
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              minLength={5}
              maxLength={10000}
              rows={3}
              placeholder="How can we help?"
              className={`${inputClass} resize-y`}
            />
          </div>

          {state.message && (
            <p
              role="alert"
              className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
            >
              {state.message}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-emerald-800 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send message
              </>
            )}
          </button>
        </form>
      )}
    </section>
  );
}

export default function FloatingContact() {
  const [open, setOpen] = useState(false);
  const [formVersion, setFormVersion] = useState(0);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <>
      <style jsx global>{`
        @keyframes contact-ripple {
          0% {
            transform: scale(0.85);
            opacity: 0.45;
          }
          100% {
            transform: scale(1.65);
            opacity: 0;
          }
        }

        @keyframes contact-float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        @keyframes contact-appear {
          from {
            opacity: 0;
            transform: translateY(8px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .contact-ripple {
          animation: contact-ripple 2.2s ease-out infinite;
        }

        .contact-float {
          animation: contact-float 3s ease-in-out infinite;
        }

        .animate-contact-in {
          animation: contact-appear 180ms ease-out;
        }

        @media (prefers-reduced-motion: reduce) {
          .contact-ripple,
          .contact-float,
          .animate-contact-in {
            animation: none !important;
          }
        }
      `}</style>

      <div className="fixed bottom-4 right-4 z-[100] sm:bottom-5 sm:right-5">
        {open && (
          <div className="absolute bottom-[58px] right-0">
            <ContactForm
              key={formVersion}
              onClose={() => setOpen(false)}
              onSendAnother={() => setFormVersion((version) => version + 1)}
            />
          </div>
        )}

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Close contact form" : "Open contact form"}
          aria-expanded={open}
          title={open ? "Close contact form" : "Contact us"}
          className="group relative flex h-11 w-11 items-center justify-center rounded-full bg-emerald-800 text-white shadow-lg shadow-emerald-950/20 transition duration-200 hover:scale-105 hover:bg-emerald-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-700/25 active:scale-95"
        >
          {!open && (
            <span className="contact-ripple pointer-events-none absolute inset-0 rounded-full border border-emerald-600" />
          )}

          <span className={!open ? "contact-float relative" : "relative"}>
            {open ? (
              <X className="h-[18px] w-[18px]" />
            ) : (
              <MessageCircle className="h-[21px] w-[21px] fill-white/20 stroke-[2.2]" />
            )}
          </span>
        </button>
      </div>
    </>
  );
}
