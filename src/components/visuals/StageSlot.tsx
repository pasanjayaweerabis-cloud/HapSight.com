"use client";

import { useEffect, useRef, useSyncExternalStore, type RefObject } from "react";
import { stageBus, type RangeMode } from "@/three/stageBus";
import type { StageSectionId } from "@/three/pageTimeline";
import { Still } from "./Still";
import { useReducedMotion } from "@/lib/a11yPrefs";
import { useWebGLSupport } from "@/lib/webgl";

/** True when the persistent 3D stage is used at all (not for reduced motion or without WebGL). */
export function useStageEnabled(): boolean {
  const reduced = useReducedMotion();
  const webgl = useWebGLSupport();
  return !reduced && webgl;
}

const subscribe = (cb: () => void) => stageBus.subscribe(cb);

/** True once the persistent 3D stage has drawn its first frame. */
export function useStageReady(): boolean {
  return useSyncExternalStore(subscribe, stageBus.isReady, () => false);
}

/** Registers the element whose scroll range drives this section's part of the 3D story. */
export function useStageSection(id: StageSectionId, ref: RefObject<HTMLElement | null>, mode: RangeMode = "center") {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return stageBus.registerSection({ id, el, mode });
  }, [id, ref, mode]);
}

/**
 * The box the one 3D device sits in for a section. Until the stage is ready (or when there is
 * no 3D at all: reduced motion, no WebGL) it shows a static still instead. Decorative.
 */
export function StageSlot({
  id,
  still,
  sizes = "(min-width: 1024px) 55vw, 100vw",
  preload = false,
  className = "",
  front = false,
  backdrop = front,
  label,
  children,
}: {
  /** Gives the slot a text alternative (role="img") instead of hiding it. Use once, for the hero. */
  label?: string;
  id: StageSectionId;
  /** Phones: draw the device above the page here; the slot gets a solid backdrop. */
  front?: boolean;
  /** Solid stage-coloured backdrop behind a front slot. Turn off when the parent already has one. */
  backdrop?: boolean;
  still?: string;
  sizes?: string;
  preload?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const ready = useStageReady();
  const enabled = useStageEnabled();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return stageBus.registerSlot(id, el, front);
  }, [id, enabled, front]);
  // without 3D, a slot with no still would only be empty space
  if (!enabled && !still) return null;
  return (
    <div
      ref={ref}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
      data-stage-slot={id} className={`relative ${backdrop ? "bg-stage" : ""} ${className}`}>
      {still ? (
        <div className={`absolute inset-0 transition-opacity duration-500 ${ready ? "opacity-0" : "opacity-100"}`}>
          <Still src={still} sizes={sizes} preload={preload} />
        </div>
      ) : null}
      {children}
    </div>
  );
}

/** Invisible box covering its (relative) parent; registers that area's scroll range. */
export function RangeMarker({ id, mode = "center" }: { id: StageSectionId; mode?: RangeMode }) {
  const ref = useRef<HTMLDivElement>(null);
  useStageSection(id, ref, mode);
  return <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0" />;
}
