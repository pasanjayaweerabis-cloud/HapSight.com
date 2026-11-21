"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { brand, nav } from "@/content/site";
import { LogoMark } from "./Logo";
import { A11yPanel } from "./A11yPanel";
import { ThemeToggle } from "./ThemeToggle";
import { Icon } from "@/components/ui/Icon";
import { buttonClass } from "@/components/ui/Button";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeHref, setActiveHref] = useState<string | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const onHome = pathname === "/";
  // On the legal pages, in-page anchors must point back to the home page.
  const href = (h: string) => (onHome ? h : `/${h}`);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Highlight the nav link for the section currently in view. Home page only.
  // IntersectionObserver callbacks only report entries whose state changed, so a running map
  // (not just the latest callback's entries) is what tells us when nothing is in view any more.
  useEffect(() => {
    if (!onHome) return;
    const elements = nav.links
      .map((l) => document.getElementById(l.href.slice(1)))
      .filter((el): el is HTMLElement => !!el);
    if (!elements.length) return;
    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.boundingClientRect.top);
          else visible.delete(entry.target.id);
        }
        if (visible.size === 0) {
          setActiveHref(null);
          return;
        }
        const [topId] = [...visible.entries()].reduce((a, b) => (a[1] < b[1] ? a : b));
        setActiveHref(`#${topId}`);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [onHome]);

  return (
    <header className="stage sticky top-0 z-(--z-nav) border-b border-stage-line !bg-stage">
      <div className="mx-auto flex h-18 max-w-[max(72.5rem,88vw)] items-center gap-4 px-5 sm:px-8">
        <a href={onHome ? "#top" : "/"} className="flex min-h-12 items-center gap-3 rounded-xl font-semibold tracking-tight">
          <LogoMark />
          <span className="text-xl">{brand.name}</span>
          <span className="sr-only">, home</span>
        </a>

        <nav aria-label={nav.label} className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.links.map((l) => (
              <li key={l.href}>
                <a
                  href={href(l.href)}
                  aria-current={onHome && activeHref === l.href ? "true" : undefined}
                  className={`relative inline-flex min-h-12 items-center rounded-full px-4 text-base transition-colors hover:text-stage-text after:absolute after:inset-x-4 after:bottom-2 after:h-0.5 after:rounded-full after:bg-stage-accent after:transition-opacity ${
                    onHome && activeHref === l.href
                      ? "font-semibold text-stage-text after:opacity-100"
                      : "font-medium text-stage-muted after:opacity-0"
                  }`}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-2">
          <ThemeToggle />
          <A11yPanel />
          <span className="hidden sm:block">
            <a href={href(nav.cta.href)} className={buttonClass("stagePrimary", "!shadow-none")}>
              {nav.cta.label}
            </a>
          </span>
          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-12 items-center justify-center rounded-full border border-stage-line text-stage-text transition-colors hover:border-stage-line-strong hover:bg-stage-surface-2 lg:hidden"
          >
            <Icon name={open ? "close" : "menu"} />
            <span className="sr-only">{open ? nav.closeMenu : nav.openMenu}</span>
          </button>
        </div>
      </div>

      <div id="mobile-menu" hidden={!open} className="border-t border-stage-line bg-stage lg:hidden">
        <nav aria-label={nav.menuTitle} className="mx-auto max-w-[max(72.5rem,88vw)] px-5 py-4 sm:px-8">
          <ul className="grid gap-1">
            {nav.links.map((l) => (
              <li key={l.href}>
                <a
                  href={href(l.href)}
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center rounded-xl px-3 text-lg font-medium hover:bg-stage-surface-2"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="mt-2 sm:hidden">
              <a href={href(nav.cta.href)} onClick={() => setOpen(false)} className={buttonClass("stagePrimary", "w-full !shadow-none")}>
                {nav.cta.label}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
