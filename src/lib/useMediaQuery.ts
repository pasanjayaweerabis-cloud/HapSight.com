"use client";

import { useCallback, useSyncExternalStore } from "react";

export function useMediaQuery(query: string, serverValue = false): boolean {
  const subscribe = useCallback(
    (cb: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

/** Narrow screens and coarse pointers get the lighter 3D and shorter scroll sections. */
export function useIsCompact(): boolean {
  return useMediaQuery("(max-width: 767px)");
}
