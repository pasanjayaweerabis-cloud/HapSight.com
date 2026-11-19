"use client";

import { useEffect, useRef, useState } from "react";
import { backToTop as t } from "@/content/site";
import { useReducedMotion } from "@/lib/a11yPrefs";

const R = 21;
const C = 2 * Math.PI * R;

/**
 * Floating "Back to top" button, bottom right. Appears after about one screen of scrolling; its
 * teal ring fills as you read down the page. Sends focus back to the start of the page too, so
 * keyboard and screen reader users land at the top with the view.
 */
export function BackToTop() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);
  const ring = useRef<SVGCircleElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      setShow(y > window.innerHeight * 0.9);
      const p = max > 0 ? Math.min(1, y / max) : 0;
      ring.current?.setAttribute("stroke-dashoffset", String(C * (1 - p)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const goTop = () => {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    document.getElementById("main")?.focus({ preventScroll: true });
  };

  return (
    <button
      type="button"
      onClick={goTop}
      aria-label={t.label}
      tabIndex={show ? 0 : -1}
      aria-hidden={!show}
      className={`stage group fixed bottom-5 right-5 z-(--z-sticky) flex h-12 items-center gap-2 rounded-full border border-stage-line pl-1 pr-4 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] transition-[opacity,transform,border-color] duration-300 hover:border-stage-accent print:hidden sm:bottom-6 sm:right-6 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <span className="relative grid size-10 place-items-center">
        <svg aria-hidden="true" viewBox="0 0 48 48" className="absolute inset-0 size-10 -rotate-90">
          <circle cx="24" cy="24" r={R} fill="none" stroke="var(--stage-border)" strokeWidth="2" />
          <circle
            ref={ring}
            cx="24"
            cy="24"
            r={R}
            fill="none"
            stroke="var(--stage-accent)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C}
          />
        </svg>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="size-4 text-stage-accent transition-transform duration-300 group-hover:-translate-y-0.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </span>
      <span className="text-sm font-semibold text-stage-text">{t.short}</span>
    </button>
  );
}
