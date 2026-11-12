"use client";

import { useSyncExternalStore } from "react";

export type ThemePref = "system" | "light" | "dark";

export interface A11yPrefs {
  theme: ThemePref;
  highContrast: boolean;
  largeText: boolean;
  reduceMotion: boolean;
}

export const STORAGE_KEY = "hapsight-a11y";

export const DEFAULT_PREFS: A11yPrefs = {
  theme: "system",
  highContrast: false,
  largeText: false,
  reduceMotion: false,
};

/**
 * Runs inline in <head> before the first paint so there is no flash of the wrong theme.
 * Keep it dependency free and in sync with `applyPrefs` below.
 */
export const bootScript = `(function(){try{var p=JSON.parse(localStorage.getItem('${STORAGE_KEY}')||'{}');var d=document.documentElement;var t=p.theme||'system';var dark=t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);d.classList.toggle('dark',dark);d.classList.toggle('light',!dark);d.classList.toggle('hc',!!p.highContrast);d.classList.toggle('large-text',!!p.largeText);d.classList.toggle('reduce-motion',!!p.reduceMotion);}catch(e){}})();`;

let current: A11yPrefs = DEFAULT_PREFS;
let loaded = false;
const listeners = new Set<() => void>();

function load(): A11yPrefs {
  if (loaded || typeof window === "undefined") return current;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) current = { ...DEFAULT_PREFS, ...(JSON.parse(raw) as Partial<A11yPrefs>) };
  } catch {
    current = DEFAULT_PREFS;
  }
  return current;
}

function systemDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function applyPrefs(p: A11yPrefs): void {
  const d = document.documentElement;
  const dark = p.theme === "dark" || (p.theme === "system" && systemDark());
  d.classList.toggle("dark", dark);
  d.classList.toggle("light", !dark);
  d.classList.toggle("hc", p.highContrast);
  d.classList.toggle("large-text", p.largeText);
  d.classList.toggle("reduce-motion", p.reduceMotion);
}

export function setPrefs(patch: Partial<A11yPrefs>): void {
  current = { ...load(), ...patch };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch {
    /* storage may be blocked; settings still apply for this visit */
  }
  applyPrefs(current);
  listeners.forEach((l) => l());
}

export function resetPrefs(): void {
  setPrefs(DEFAULT_PREFS);
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const onScheme = () => {
    if (load().theme === "system") applyPrefs(current);
  };
  mq.addEventListener("change", onScheme);
  return () => {
    listeners.delete(cb);
    mq.removeEventListener("change", onScheme);
  };
}

export function useA11yPrefs(): A11yPrefs {
  return useSyncExternalStore(subscribe, load, () => DEFAULT_PREFS);
}

function subscribeMotion(cb: () => void): () => void {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  listeners.add(cb);
  return () => {
    mq.removeEventListener("change", cb);
    listeners.delete(cb);
  };
}

function getMotion(): boolean {
  return load().reduceMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** True when the visitor asked for less motion, in their OS or in our settings panel. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribeMotion, getMotion, () => false);
}
