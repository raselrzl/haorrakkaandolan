"use client";

import { useActionState, useEffect, useState } from "react";
import {
  CheckCircle2,
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
    "w-full rounded-sm border border-amber-200 bg-white px-2.5 py-2 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/10";

  const labelClass = "mb-1 block text-[11px] font-semibold text-slate-700";

  return (
    <section
      aria-labelledby="floating-contact-title"
      aria-live="polite"
      className="animate-contact-in w-[calc(100vw-2rem)] overflow-hidden rounded-md border border-amber-200 bg-white shadow-xl shadow-amber-950/10 sm:w-80"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-amber-100 bg-white px-3 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm border border-amber-200 bg-amber-50 text-amber-800">
            <MessageCircle className="h-4 w-4" />
          </div>

          <div>
            <h2
              id="floating-contact-title"
              className="text-xs font-bold text-slate-900"
            >
              হাওর রক্ষা আন্দোলন
            </h2>
            <p className="text-[10px] text-slate-500">
              Haor Rokkha Andolan
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close contact form"
          className="rounded-sm p-1.5 text-slate-500 transition hover:bg-amber-50 hover:text-amber-900"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* SUCCESS STATE */}
      {state.success ? (
        <div className="px-4 py-6 text-center">
          <CheckCircle2 className="mx-auto h-9 w-9 text-amber-700" />

          <h3 className="mt-2 text-sm font-bold text-slate-900">
            Message received
          </h3>

          <p className="mt-1.5 text-xs leading-5 text-slate-600">
            {state.message}
          </p>

          <div className="mt-4 flex justify-center gap-2">
            <button
              type="button"
              onClick={onSendAnother}
              className="rounded-sm border border-amber-200 px-3 py-2 text-[11px] font-semibold text-slate-700 transition hover:bg-amber-50"
            >
              Send another
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-sm bg-amber-800 px-4 py-2 text-[11px] font-semibold text-white transition hover:bg-amber-900"
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <form action={formAction} className="space-y-2.5 p-3">
          {/* Honeypot for basic spam protection */}
          <div
            aria-hidden="true"
            className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden"
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
              <Mail className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-amber-700" />
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                maxLength={254}
                autoComplete="email"
                placeholder="you@example.com"
                className={`${inputClass} pl-8`}
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
              className="border border-red-200 bg-red-50 px-2.5 py-2 text-[11px] text-red-700"
            >
              {state.message}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="flex w-full items-center justify-center gap-2 rounded-sm bg-amber-800 px-3 py-2 text-xs font-semibold text-white transition hover:bg-amber-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? (
              <>
                <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-3.5 w-3.5" />
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
            transform: translateY(-2px);
          }
        }

        @keyframes contact-appear {
          from {
            opacity: 0;
            transform: translateY(7px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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

      {/* FLOATING CONTACT BUTTON */}
      <div className="fixed bottom-4 right-4 z-100 sm:bottom-5 sm:right-5">
        {open && (
          <div className="absolute bottom-14 right-0">
            <ContactForm
              key={formVersion}
              onClose={() => setOpen(false)}
              onSendAnother={() =>
                setFormVersion((version) => version + 1)
              }
            />
          </div>
        )}

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Close contact form" : "Open contact form"}
          aria-expanded={open}
          title={open ? "Close contact form" : "Contact us"}
          className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-amber-600 bg-amber-800 text-white shadow-lg shadow-amber-900/20 transition duration-200 hover:scale-105 hover:bg-amber-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-500/25 active:scale-95"
        >
          {!open && (
            <span className="contact-ripple pointer-events-none absolute inset-0 rounded-full border border-amber-500" />
          )}

          <span className={!open ? "contact-float relative" : "relative"}>
            {open ? (
              <X className="h-4 w-4" />
            ) : (
              <MessageCircle className="h-5 w-5 fill-white/20 stroke-[2.2]" />
            )}
          </span>
        </button>
      </div>
    </>
  );
}