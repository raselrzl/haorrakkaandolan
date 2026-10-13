"use client";

import { useEffect } from "react";

const BENGALI_REGEX = /[\u0980-\u09FF]/;

const EXCLUDED_TAGS = new Set([
  "SCRIPT",
  "STYLE",
  "TEXTAREA",
  "INPUT",
  "SELECT",
  "OPTION",
  "CODE",
  "PRE",
  "NOSCRIPT",
]);

export default function BengaliFont() {
  useEffect(() => {
    const processed = new WeakSet<Element>();

    const applyFont = (root: Node) => {
      const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_TEXT,
      );

      const parents = new Set<Element>();
      let current: Node | null;

      while ((current = walker.nextNode())) {
        const text = current.textContent ?? "";

        if (!BENGALI_REGEX.test(text)) continue;

        const parent = current.parentElement;

        if (!parent) continue;

        if (parent.closest("[contenteditable='true']")) continue;

        if (parent.closest("[data-no-bengali-font]")) continue;

        if (parent.closest("svg")) continue;

        if (EXCLUDED_TAGS.has(parent.tagName)) continue;

        parents.add(parent);
      }

      parents.forEach((element) => {
        if (processed.has(element)) return;

        processed.add(element);
        element.classList.add("tiro-bangla-auto");
      });
    };

    applyFont(document.body);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "characterData") {
          const parent = mutation.target.parentElement;

          if (parent) {
            applyFont(parent);
          }
        }

        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            applyFont(node);
          } else if (node.nodeType === Node.TEXT_NODE) {
            const parent = node.parentElement;

            if (
              parent &&
              BENGALI_REGEX.test(node.textContent ?? "")
            ) {
              applyFont(parent);
            }
          }
        });
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, []);

  return null;
}