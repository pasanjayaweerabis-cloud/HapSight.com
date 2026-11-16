"use client";

import { useReducedMotion } from "@/lib/a11yPrefs";
import { useWebGLSupport } from "@/lib/webgl";
import { useIsCompact, useMediaQuery } from "@/lib/useMediaQuery";
import { LazyStage } from "./LazyStage";

const loadStage = () => import("@/three/PersistentStage");

/**
 * The one WebGL canvas for the whole page: fixed behind the text, click-through, decorative.
 * Not mounted at all for reduced motion or without WebGL: the sections then show stills and
 * describe every step in text.
 */
export function StageHost() {
  const reduced = useReducedMotion();
  const webgl = useWebGLSupport();
  const compact = useIsCompact();
  const touch = useMediaQuery("(pointer: coarse)");
  if (reduced || !webgl) return null;
  return (
    <div aria-hidden="true" data-stage-host className="pointer-events-none fixed inset-0 z-[1]">
      <LazyStage
        load={loadStage}
        deferUntilIdle
        deferUntilInteraction={compact || touch}
        sceneProps={{ compact }}
        fallback={null}
      />
    </div>
  );
}
