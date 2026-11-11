"use client";

import { useRef } from "react";
import type { LabelOverlayHandles } from "@/three/labelProjection";
import { LazyStage } from "./LazyStage";
import { ExplodeOverlay } from "./ExplodeOverlay";
import { STILLS, Still } from "./Still";

const loadScene = () => import("@/three/scenes/DesignScene");

export function DesignVisual({
  getExplode,
  animate,
  compact,
  labels = true,
  labelMode,
  still = "assembled",
}: {
  getExplode: () => number;
  animate: boolean;
  compact: boolean;
  labels?: boolean;
  labelMode?: "callouts" | "dots";
  still?: "assembled" | "exploded";
}) {
  const overlay = useRef<LabelOverlayHandles>(null);
  const mode = labelMode ?? (compact ? "dots" : "callouts");
  return (
    <div className="relative size-full">
      <LazyStage
        load={loadScene}
        sceneProps={{ getExplode, overlay: labels ? overlay : undefined, labelMode: mode, animate, compact }}
        fallback={<Still src={STILLS[still]} sizes="(min-width: 1024px) 80vw, 100vw" />}
      />
      {labels ? <ExplodeOverlay ref={overlay} mode={mode} /> : null}
    </div>
  );
}
