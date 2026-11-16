import type { LabelOverlayHandles } from "./labelProjection";
import type { StageSectionId } from "./pageTimeline";

/**
 * Tiny shared registry between the page (DOM) and the one persistent 3D stage:
 * - sections register the element whose scroll range drives their part of the story,
 * - slots register the box the device should sit in for that section,
 * - the Design section registers its label overlay,
 * - "ready" tells the stills in the slots to step aside once the first frame is drawn,
 * - the waitlist form fires a haptic pulse on success.
 * Plain module state (no React re-renders per frame).
 */

/** "center": progress runs while the element passes the middle of the screen.
 *  "pin": progress runs while a sticky track scrolls (top hits top → bottom hits bottom). */
export type RangeMode = "center" | "pin";

export interface StageSection {
  id: StageSectionId;
  el: HTMLElement;
  mode: RangeMode;
}

const sections = new Map<StageSectionId, StageSection>();
const slots = new Map<StageSectionId, HTMLElement>();
const front = new Set<StageSectionId>();
let overlay: { current: LabelOverlayHandles | null } | null = null;
let ready = false;
let version = 0;
const listeners = new Set<() => void>();
const pulseListeners = new Set<() => void>();

const notify = () => {
  version++;
  listeners.forEach((l) => l());
};

export const stageBus = {
  registerSection(s: StageSection) {
    sections.set(s.id, s);
    notify();
    return () => {
      if (sections.get(s.id)?.el === s.el) sections.delete(s.id);
      notify();
    };
  },
  /** `inFront`: the canvas draws above the page while the device is in this slot (sticky
   *  slots on phones, which have their own backdrop so cards can slide underneath). */
  registerSlot(id: StageSectionId, el: HTMLElement, inFront = false) {
    slots.set(id, el);
    if (inFront) front.add(id);
    else front.delete(id);
    notify();
    return () => {
      if (slots.get(id) === el) {
        slots.delete(id);
        front.delete(id);
      }
      notify();
    };
  },
  isFront: (id: StageSectionId) => front.has(id),
  setOverlay(o: { current: LabelOverlayHandles | null } | null) {
    overlay = o;
  },
  overlay: () => overlay?.current ?? null,
  sections: () => [...sections.values()],
  slot: (id: StageSectionId) => slots.get(id) ?? null,
  /** Bumps whenever sections or slots change, so the stage knows to re-measure. */
  version: () => version,
  setReady(v: boolean) {
    if (ready === v) return;
    ready = v;
    notify();
  },
  isReady: () => ready,
  subscribe(l: () => void) {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
  pulse() {
    pulseListeners.forEach((l) => l());
  },
  onPulse(l: () => void) {
    pulseListeners.add(l);
    return () => {
      pulseListeners.delete(l);
    };
  },
};
