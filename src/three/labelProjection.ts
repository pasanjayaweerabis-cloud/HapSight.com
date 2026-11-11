import * as THREE from "three";
import type { LabelId } from "@/content/site";

/** DOM nodes the 3D scene writes label positions into (no React re-render per frame). */
export interface LabelOverlayHandles {
  container: HTMLDivElement | null;
  items: Map<LabelId, { label: HTMLElement; line: SVGPolylineElement; dot: HTMLElement }>;
  /** Called every frame with label opacity 0..1. */
  setOpacity: (o: number) => void;
}

export interface ScreenAnchor {
  id: LabelId;
  x: number;
  y: number;
  visible: boolean;
}

const tmp = new THREE.Vector3();

export function projectToScreen(world: THREE.Vector3, camera: THREE.Camera, w: number, h: number) {
  tmp.copy(world).project(camera);
  return { x: (tmp.x * 0.5 + 0.5) * w, y: (-tmp.y * 0.5 + 0.5) * h, visible: tmp.z < 1 };
}

/**
 * Callout layout: labels sit in two columns at the sides, sorted by height and spaced so they
 * never overlap; a leader line runs from each label to its part.
 */
export function layoutCallouts(
  anchors: ScreenAnchor[],
  w: number,
  h: number,
  centerX: number,
  opts: { gap: number; margin: number; top: number; bottom: number },
) {
  const left = anchors.filter((a) => a.x < centerX).sort((a, b) => a.y - b.y);
  const right = anchors.filter((a) => a.x >= centerX).sort((a, b) => a.y - b.y);
  const place = (list: ScreenAnchor[]) => {
    const ys = list.map((a) => Math.min(h - opts.bottom, Math.max(opts.top, a.y)));
    for (let i = 1; i < ys.length; i++) ys[i] = Math.max(ys[i], ys[i - 1] + opts.gap);
    const overflow = ys.length ? ys[ys.length - 1] - (h - opts.bottom) : 0;
    if (overflow > 0) for (let i = 0; i < ys.length; i++) ys[i] -= overflow;
    for (let i = ys.length - 2; i >= 0; i--) ys[i] = Math.min(ys[i], ys[i + 1] - opts.gap);
    return ys;
  };
  const out = new Map<LabelId, { lx: number; ly: number; side: "left" | "right" }>();
  place(left).forEach((y, i) => out.set(left[i].id, { lx: opts.margin, ly: y, side: "left" }));
  place(right).forEach((y, i) => out.set(right[i].id, { lx: w - opts.margin, ly: y, side: "right" }));
  return out;
}
