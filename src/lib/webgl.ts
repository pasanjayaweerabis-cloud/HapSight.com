"use client";

import { useSyncExternalStore } from "react";

let cached: boolean | null = null;

/** True if the browser can create a WebGL context. Cached after the first check. */
export function hasWebGL(): boolean {
  if (cached !== null) return cached;
  try {
    const c = document.createElement("canvas");
    cached = !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    cached = false;
  }
  return cached;
}

const noop = () => () => {};

/** React hook: false only when the browser definitely has no WebGL. Server render assumes it does. */
export function useWebGLSupport(): boolean {
  return useSyncExternalStore(noop, hasWebGL, () => true);
}
