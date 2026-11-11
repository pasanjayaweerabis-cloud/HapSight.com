"use client";

import { LazyStage } from "./LazyStage";
import { STILLS, Still } from "./Still";

const loadScene = () => import("@/three/scenes/HowItWorksScene");

export function HowItWorksVisual({
  getProgress,
  animate,
  compact,
}: {
  getProgress: () => number;
  animate: boolean;
  compact: boolean;
}) {
  return (
    <LazyStage
      load={loadScene}
      sceneProps={{ getProgress, animate, compact }}
      fallback={<Still src={STILLS.howItWorks} sizes="(min-width: 1024px) 55vw, 100vw" />}
    />
  );
}
