"use client";

import { useReducedMotion } from "@/lib/a11yPrefs";
import { useIsCompact, useMediaQuery } from "@/lib/useMediaQuery";
import { LazyStage } from "./LazyStage";
import { STILLS, Still } from "./Still";

const loadHero = () => import("@/three/scenes/HeroScene");

export function HeroVisual() {
  const reducedMotion = useReducedMotion();
  const compact = useIsCompact();
  const touch = useMediaQuery("(pointer: coarse)");
  return (
    <LazyStage
      load={loadHero}
      deferUntilIdle
      deferUntilInteraction={compact || touch}
      sceneProps={{ reducedMotion, compact, touch }}
      fallback={<Still src={STILLS.hero} sizes="(min-width: 1024px) 55vw, 100vw" preload />}
    />
  );
}
