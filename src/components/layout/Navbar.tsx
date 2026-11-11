"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { brand, nav } from "@/content/site";
import { LogoMark } from "./Logo";
import { A11yPanel } from "./A11yPanel";
import { Icon } from "@/components/ui/Icon";
import { buttonClass } from "@/components/ui/Button";

export function Navbar() {
  const [open, setOpen] = useState(false);
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

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-bg/85 backdrop-blur-xl supports-[backdrop-filter]:bg-bg/75">
      <div className="mx-auto flex h-18 max-w-7xl items-center gap-4 px-5 sm:px-8">
        <a href={onHome ? "#top" : "/"} className="flex min-h-12 items-center gap-3 rounded-lg font-semibold tracking-tight">
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
                  className="inline-flex min-h-12 items-center rounded-full px-4 text-base font-medium text-muted transition-colors hover:text-text"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-2">
          <A11yPanel />
          <span className="hidden sm:block">
            <a href={href(nav.cta.href)} className={buttonClass("primary")}>
              {nav.cta.label}
            </a>
          </span>
          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-12 items-center justify-center rounded-full border border-line lg:hidden"
          >
            <Icon name={open ? "close" : "menu"} />
            <span className="sr-only">{open ? nav.closeMenu : nav.openMenu}</span>
          </button>
        </div>
      </div>

      <div id="mobile-menu" hidden={!open} className="border-t border-line bg-bg lg:hidden">
        <nav aria-label={nav.menuTitle} className="mx-auto max-w-7xl px-5 py-4 sm:px-8">
          <ul className="grid gap-1">
            {nav.links.map((l) => (
              <li key={l.href}>
                <a
                  href={href(l.href)}
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center rounded-xl px-3 text-lg font-medium hover:bg-bg-soft"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="mt-2 sm:hidden">
              <a href={href(nav.cta.href)} onClick={() => setOpen(false)} className={buttonClass("primary", "w-full")}>
                {nav.cta.label}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
