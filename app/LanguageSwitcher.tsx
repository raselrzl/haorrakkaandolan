"use client";

import { useEffect, useState } from "react";
import { Languages, ChevronDown } from "lucide-react";

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

type Language = "bn" | "en";

export default function LanguageSwitcher() {
  const [language, setLanguage] = useState<Language>("bn");
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let observer: MutationObserver | null = null;

    // Hide Google's injected translation banner and reset page offsets.
    const hideGoogleBanner = () => {
      document
        .querySelectorAll(
          "iframe.goog-te-banner-frame, .goog-te-banner-frame, body > .skiptranslate",
        )
        .forEach((element) => {
          (element as HTMLElement).style.setProperty(
            "display",
            "none",
            "important",
          );

          (element as HTMLElement).style.setProperty(
            "visibility",
            "hidden",
            "important",
          );

          (element as HTMLElement).style.setProperty(
            "height",
            "0",
            "important",
          );
        });

      document.documentElement.style.setProperty("top", "0px", "important");

      document.body.style.setProperty("top", "0px", "important");

      document.body.style.setProperty("margin-top", "0px", "important");
    };

    // Observe Google's dynamically injected elements.
    hideGoogleBanner();

    observer = new MutationObserver(() => {
      hideGoogleBanner();
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    // Read the currently selected language.
    const cookie = document.cookie
      .split("; ")
      .find((item) => item.startsWith("googtrans="));

    if (cookie) {
      const value = decodeURIComponent(cookie.split("=")[1]);

      setLanguage(value.endsWith("/en") ? "en" : "bn");
    }

    // Initialize Google Translate.
    const initializeGoogleTranslate = () => {
      if (!window.google?.translate?.TranslateElement) {
        return;
      }

      const element = document.getElementById("google_translate_element");

      if (!element) {
        return;
      }

      if (element.dataset.initialized !== "true") {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "bn",
            includedLanguages: "bn,en",
            autoDisplay: false,
          },
          "google_translate_element",
        );

        element.dataset.initialized = "true";
      }

      setReady(true);
      hideGoogleBanner();
    };

    window.googleTranslateElementInit = initializeGoogleTranslate;

    if (window.google?.translate?.TranslateElement) {
      initializeGoogleTranslate();
    } else {
      const existingScript = document.getElementById(
        "google-translate-script",
      ) as HTMLScriptElement | null;

      if (!existingScript) {
        const script = document.createElement("script");

        script.id = "google-translate-script";
        script.src =
          "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;

        script.onerror = () => {
          setReady(false);
        };

        document.body.appendChild(script);
      } else {
        existingScript.addEventListener("load", initializeGoogleTranslate);
      }
    }

    return () => {
      observer?.disconnect();
      delete window.googleTranslateElementInit;
    };
  }, []);

  const changeLanguage = (nextLanguage: Language) => {
    if (!ready) return;

    setOpen(false);

    const value = nextLanguage === "en" ? "/bn/en" : "/bn/bn";

    // Save the translation preference.
    document.cookie = `googtrans=${value};path=/;max-age=31536000;SameSite=Lax`;

    document.cookie = `googtrans=${value};path=/;domain=${window.location.hostname};max-age=31536000;SameSite=Lax`;

    setLanguage(nextLanguage);

    // Reload to apply the selected language.
    window.location.reload();
  };

  return (
    <>
      {/* Google Translate initialization */}
      <div
        id="google_translate_element"
        className="hidden"
        aria-hidden="true"
      />

      {/* Custom language selector */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((previous) => !previous)}
          disabled={!ready}
          aria-label="Change website language"
          aria-expanded={open}
          className="inline-flex items-center gap-2 rounded-lg border border-emerald-800/20 bg-white px-3 py-2 text-sm font-semibold text-emerald-900 shadow-sm transition hover:border-emerald-800/40 hover:bg-emerald-50 disabled:cursor-wait disabled:opacity-50"
        >
          <Languages size={16} />

          <span>{language === "bn" ? "English" : "বাংলা"}</span>

          <ChevronDown
            size={14}
            className={`transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <div className="absolute right-0 top-full z-[10000] mt-2 min-w-36 overflow-hidden rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
            <button
              type="button"
              onClick={() => changeLanguage("bn")}
              className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition hover:bg-emerald-50 ${
                language === "bn"
                  ? "font-semibold text-emerald-800"
                  : "text-slate-700"
              }`}
            >
              বাংলা
              {language === "bn" && <span className="text-emerald-700">✓</span>}
            </button>

            <button
              type="button"
              onClick={() => changeLanguage("en")}
              className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition hover:bg-emerald-50 ${
                language === "en"
                  ? "font-semibold text-emerald-800"
                  : "text-slate-700"
              }`}
            >
              English
              {language === "en" && <span className="text-emerald-700">✓</span>}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
