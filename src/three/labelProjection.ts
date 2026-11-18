import * as THREE from "three";
import type { LabelId } from "@/content/site";

/** DOM nodes the 3D scene writes label positions into (no React re-render per frame). */
export interface LabelOverlayHandles {
  container: HTMLDivElement | null;
  items: Map<LabelId, { label: HTMLElement; line: SVGPathElement; dot: HTMLElement }>;
  /** "dots" = numbered dots only (narrow screens); "callouts" = side cards with leader lines. */
  mode: "callouts" | "dots";
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

export interface RingPlacement {
  /** card centre */
  cx: number;
  cy: number;
  /** smooth leader line (SVG path) from the card edge to the part */
  d: string;
}

const SAMPLES = 360;
let lastRing: { m: number; phase: number; slotOf: Map<LabelId, number> } | null = null;

/**
 * Ring layout: the cards sit on an ellipse around the device, using the whole stage instead of two
 * side columns. Slots are spaced by each card's footprint along the ring (a card at the top needs
 * its full width, one at the side only its height), so neighbours never overlap where there is
 * room. Parts are matched to slots in angular order around the device (keeping leader lines from
 * crossing), with a few spare slots so each card can sit near its part; the matching only changes
 * when a new one is clearly better, so cards don't hop.
 */
export function layoutRing(
  anchors: ScreenAnchor[],
  w: number,
  h: number,
  opts: { margin: number; top: number; bottom: number; gap: number },
  sizes: Map<LabelId, { w: number; h: number }>,
): Map<LabelId, RingPlacement> {
  const out = new Map<LabelId, RingPlacement>();
  const n = anchors.length;
  if (!n) return out;
  let cw = 0;
  let ch = 0;
  for (const a of anchors) {
    const z = sizes.get(a.id);
    cw = Math.max(cw, z?.w ?? 0);
    ch = Math.max(ch, z?.h ?? 0);
  }
  const ex = w / 2;
  const ey = (opts.top + h - opts.bottom) / 2;
  const rx = Math.max(10, w / 2 - cw / 2 - opts.margin);
  const ry = Math.max(10, (h - opts.top - opts.bottom) / 2 - ch / 2);

  // sample the ellipse; "weight" = arc length divided by the card footprint along the tangent
  const pts: { x: number; y: number }[] = [];
  const cum: number[] = [0];
  for (let k = 0; k <= SAMPLES; k++) {
    const t = (k / SAMPLES) * Math.PI * 2 - Math.PI / 2; // start at the top, go clockwise
    pts.push({ x: ex + rx * Math.cos(t), y: ey + ry * Math.sin(t) });
    if (k > 0) {
      const dx = pts[k].x - pts[k - 1].x;
      const dy = pts[k].y - pts[k - 1].y;
      const len = Math.hypot(dx, dy) || 1;
      const foot = (Math.abs(dx) / len) * cw + (Math.abs(dy) / len) * ch + opts.gap;
      cum.push(cum[k - 1] + len / foot);
    }
  }
  const total = cum[SAMPLES];
  const at = (u: number) => {
    const v = ((u % total) + total) % total;
    let lo = 0;
    let hi = SAMPLES;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (cum[mid] <= v) lo = mid;
      else hi = mid;
    }
    const f = (v - cum[lo]) / (cum[hi] - cum[lo] || 1);
    return { x: pts[lo].x + (pts[hi].x - pts[lo].x) * f, y: pts[lo].y + (pts[hi].y - pts[lo].y) * f };
  };

  // parts in clockwise order (from the top) around the ellipse centre
  const angle = (x: number, y: number) => {
    const t = Math.atan2((y - ey) / ry, (x - ex) / rx) + Math.PI / 2;
    return t < 0 ? t + Math.PI * 2 : t;
  };
  const order = [...anchors].sort((a, b) => angle(a.x, a.y) - angle(b.x, b.y));
  // a few spare slots (when the ring has room) let cards stay near their parts instead of being
  // spread evenly into empty parts of the ring
  const m = Math.max(n, Math.min(Math.floor(total), n + 5));
  const step = total / m;
  const PHASES = 16;
  const slotsFor = (p: number) => Array.from({ length: m }, (_, j) => at((p / PHASES) * step + j * step));
  // cost = how far (in angle around the centre) a card sits from its part's direction, so leader
  // lines run outwards like spokes and don't cross
  const partAngle = new Map(anchors.map((a) => [a.id, angle(a.x, a.y)]));
  const d2 = (s: { x: number; y: number }, a: ScreenAnchor) => {
    let d = Math.abs(angle(s.x, s.y) - partAngle.get(a.id)!);
    if (d > Math.PI) d = Math.PI * 2 - d;
    return d * d;
  };

  /** Best order-preserving assignment of the n parts to m slots (cyclic), by dynamic programming. */
  const assign = (slots: { x: number; y: number }[]) => {
    let bestC = Infinity;
    let bestMap: number[] = [];
    const dp = new Float64Array(n * m);
    const from = new Int16Array(n * m);
    for (let r = 0; r < m; r++) {
      const S = (j: number) => slots[(r + j) % m];
      for (let j = 0; j < m; j++) dp[j] = j <= m - n ? d2(S(j), order[0]) : Infinity;
      for (let i = 1; i < n; i++) {
        let runMin = Infinity;
        let runArg = -1;
        for (let j = 0; j < m; j++) {
          const prev = j - 1 >= 0 ? dp[(i - 1) * m + j - 1] : Infinity;
          if (prev < runMin) {
            runMin = prev;
            runArg = j - 1;
          }
          const ok = j >= i && j <= m - n + i;
          dp[i * m + j] = ok ? runMin + d2(S(j), order[i]) : Infinity;
          from[i * m + j] = runArg;
        }
      }
      let endJ = -1;
      let endC = Infinity;
      for (let j = 0; j < m; j++) if (dp[(n - 1) * m + j] < endC) [endC, endJ] = [dp[(n - 1) * m + j], j];
      if (endC < bestC) {
        bestC = endC;
        const map = new Array<number>(n);
        let j = endJ;
        for (let i = n - 1; i >= 0; i--) {
          map[i] = (r + j) % m;
          j = from[i * m + j];
        }
        bestMap = map;
      }
    }
    return { c: bestC, map: bestMap };
  };

  // keep the previous matching unless a new one is clearly better (no hopping between near-ties)
  let chosen: { phase: number; slotOf: Map<LabelId, number> } | null = null;
  if (lastRing && lastRing.m === m && order.every((a) => lastRing!.slotOf.has(a.id))) {
    const slots = slotsFor(lastRing.phase);
    const prevC = order.reduce((c, a) => c + d2(slots[lastRing!.slotOf.get(a.id)!], a), 0);
    let best = { c: Infinity, phase: 0, map: [] as number[] };
    for (let p = 0; p < PHASES; p++) {
      const r = assign(slotsFor(p));
      if (r.c < best.c) best = { c: r.c, phase: p, map: r.map };
    }
    chosen =
      best.c < prevC * 0.85
        ? { phase: best.phase, slotOf: new Map(order.map((a, i) => [a.id, best.map[i]])) }
        : { phase: lastRing.phase, slotOf: lastRing.slotOf };
  } else {
    let best = { c: Infinity, phase: 0, map: [] as number[] };
    for (let p = 0; p < PHASES; p++) {
      const r = assign(slotsFor(p));
      if (r.c < best.c) best = { c: r.c, phase: p, map: r.map };
    }
    chosen = { phase: best.phase, slotOf: new Map(order.map((a, i) => [a.id, best.map[i]])) };
  }
  lastRing = { m, ...chosen };
  const slots = slotsFor(chosen.phase);
  for (const a of order) {
    const s = slots[chosen.slotOf.get(a.id)!];
    const z = sizes.get(a.id) ?? { w: cw, h: ch };
    out.set(a.id, { cx: s.x, cy: s.y, d: leader(s.x, s.y, z.w, z.h, a.x, a.y) });
  }
  return out;
}

/** Smooth curve from the card's edge (the side facing the part) to the part. */
function leader(cx: number, cy: number, cw: number, ch: number, ax: number, ay: number) {
  const f = (v: number) => v.toFixed(1);
  const dx = ax - cx;
  const dy = ay - cy;
  // leave from the left/right edge unless the part is mostly straight above/below (cards are wide,
  // so a top/bottom exit with a sideways part would run back across neighbouring cards)
  const horizontal = Math.abs(dx) - cw * 0.35 >= Math.abs(dy) * 0.6;
  let x0: number;
  let y0: number;
  let nx = 0;
  let ny = 0;
  if (horizontal) {
    nx = Math.sign(dx) || 1;
    x0 = cx + (nx * cw) / 2;
    y0 = cy;
  } else {
    ny = Math.sign(dy) || 1;
    x0 = cx;
    y0 = cy + (ny * ch) / 2;
  }
  const len = Math.hypot(ax - x0, ay - y0);
  const k = Math.min(70, len * 0.35);
  // leave the card straight out of its edge, then ease along the direct line into the part
  const c1x = x0 + nx * k;
  const c1y = y0 + ny * k;
  const c2x = ax + (x0 - ax) * 0.3;
  const c2y = ay + (y0 - ay) * 0.3;
  return `M${f(x0)},${f(y0)} C${f(c1x)},${f(c1y)} ${f(c2x)},${f(c2y)} ${f(ax)},${f(ay)}`;
}
