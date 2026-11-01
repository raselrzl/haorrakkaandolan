"use client";

import { useEffect, useState } from "react";
import { Languages, ChevronDown } from "lucide-react";

export type Language = "en" | "bn";

export const LANGUAGE_EVENT = "haor-language-change";

export function getSavedLanguage(): Language {
  if (typeof window === "undefined") return "en";

  return localStorage.getItem("haor-language") === "bn" ? "bn" : "en";
}

export function useWebsiteLanguage() {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const updateLanguage = (event?: Event) => {
      const selected =
        event instanceof CustomEvent
          ? (event.detail as Language)
          : getSavedLanguage();

      setLanguage(selected === "bn" ? "bn" : "en");
    };

    updateLanguage();
    window.addEventListener(LANGUAGE_EVENT, updateLanguage);

    return () => {
      window.removeEventListener(LANGUAGE_EVENT, updateLanguage);
    };
  }, []);

  return language;
}

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            includedLanguages: string;
            autoDisplay: boolean;
          },
          elementId: string,
        ) => unknown;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

export default function LanguageSwitcher() {
  const language = useWebsiteLanguage();
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let observer: MutationObserver | undefined;

    const hideGoogleBanner = () => {
      document
        .querySelectorAll(
          "iframe.goog-te-banner-frame, .goog-te-banner-frame, body > .skiptranslate",
        )
        .forEach((element) => {
          const item = element as HTMLElement;
          item.style.setProperty("display", "none", "important");
          item.style.setProperty("visibility", "hidden", "important");
          item.style.setProperty("height", "0", "important");
        });

      document.documentElement.style.setProperty("top", "0px", "important");
      document.body.style.setProperty("top", "0px", "important");
      document.body.style.setProperty("margin-top", "0px", "important");
    };

    const applyGoogleLanguage = (next: Language) => {
      const select =
        document.querySelector<HTMLSelectElement>(".goog-te-combo");

      if (select && select.value !== next) {
        select.value = next;
        select.dispatchEvent(new Event("change"));
      }
    };

    const initialize = () => {
      const TranslateElement = window.google?.translate?.TranslateElement;
      const container = document.getElementById("google_translate_element");

      if (!TranslateElement || !container) return;

      if (container.dataset.initialized !== "true") {
        new TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,bn",
            autoDisplay: false,
          },
          "google_translate_element",
        );

        container.dataset.initialized = "true";
      }

      setReady(true);
      hideGoogleBanner();

      window.setTimeout(() => {
        applyGoogleLanguage(getSavedLanguage());
        hideGoogleBanner();
      }, 500);
    };

    const onContentUpdated = () => {
      window.setTimeout(() => {
        applyGoogleLanguage(getSavedLanguage());
        hideGoogleBanner();
      }, 300);
    };

    hideGoogleBanner();

    observer = new MutationObserver(hideGoogleBanner);
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });

    window.googleTranslateElementInit = initialize;
    window.addEventListener("haor-content-updated", onContentUpdated);

    if (window.google?.translate?.TranslateElement) {
      initialize();
    } else if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      script.onload = initialize;
      script.onerror = () => setReady(false);
      document.body.appendChild(script);
    } else {
      const script = document.getElementById(
        "google-translate-script",
      ) as HTMLScriptElement;

      script.addEventListener("load", initialize);
    }

    return () => {
      observer?.disconnect();
      window.removeEventListener("haor-content-updated", onContentUpdated);
      delete window.googleTranslateElementInit;
    };
  }, []);

  const changeLanguage = (next: Language) => {
    setOpen(false);

    localStorage.setItem("haor-language", next);
    window.dispatchEvent(new CustomEvent(LANGUAGE_EVENT, { detail: next }));

    const value = `/en/${next}`;

    document.cookie = `googtrans=${value};path=/;max-age=31536000;SameSite=Lax`;

    const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");

    if (select && select.value !== next) {
      select.value = next;
      select.dispatchEvent(new Event("change"));
    }
  };

  return (
    <>
      <div
        id="google_translate_element"
        className="hidden"
        aria-hidden="true"
      />

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((previous) => !previous)}
          aria-label="Change website language"
          aria-expanded={open}
          className="group inline-flex items-center gap-2 rounded-full border border-amber-600/30 bg-white px-3 py-2 text-xs font-semibold text-slate-800 shadow-sm transition-all duration-200 hover:border-amber-600 hover:bg-amber-50 hover:shadow-md sm:px-4 sm:py-2.5 sm:text-sm"
        >
          <Languages
            size={15}
            className="text-amber-700 transition-transform duration-300 group-hover:rotate-12 sm:h-4 sm:w-4"
          />

          <span>{language === "bn" ? "Bengali" : "English"}</span>

          <ChevronDown
            size={13}
            className={`text-amber-700 transition-transform duration-200 sm:h-3.5 sm:w-3.5 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {open && (
          <div className="absolute right-0 top-full z-[10000] mt-2 min-w-36 overflow-hidden rounded-xl border border-amber-200/80 bg-white p-1.5 shadow-xl shadow-slate-900/10">
            {(["en", "bn"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => changeLanguage(item)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors duration-150 ${
                  language === item
                    ? "bg-amber-50 font-semibold text-amber-800"
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                }`}
              >
                <span>{item === "en" ? "English" : "Bengali"}</span>

                {language === item && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-600 text-xs font-bold text-white">
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
