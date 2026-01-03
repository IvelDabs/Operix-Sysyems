"use client";
import { useEffect } from "react";

export default function SiteScripts() {
  useEffect(() => {
    // dynamic year
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // smooth scroll for internal links
    const anchors = Array.from(document.querySelectorAll('a[href^="#"]'));
    const onClick = (e) => {
      const target = e.currentTarget.getAttribute("href");
      if (target && target !== "#") {
        const el = document.querySelector(target);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };
    anchors.forEach((a) => a.addEventListener("click", onClick));

    // CTA analytics: track clicks on primary CTAs (keeps prior behavior)
    const ctas = Array.from(document.querySelectorAll(".primary-btn"));
    const onCta = (e) => {
      try {
        const label = (e.currentTarget.textContent || "").trim();
        // lightweight tracking placeholder (console). Replace with analytics call as needed.
        console.log("CTA clicked:", label);
      } catch (err) {
        /* ignore */
      }
    };
    ctas.forEach((b) => b.addEventListener("click", onCta));

    return () => {
      anchors.forEach((a) => a.removeEventListener("click", onClick));
      ctas.forEach((b) => b.removeEventListener("click", onCta));
    };
  }, []);

  return null;
}
