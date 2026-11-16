import { features } from "@/content/site";
import { smooth } from "./geometry";

/**
 * One timeline for the whole page: scroll progress p (0 = top, 1 = bottom) → what the single
 * 3D device does. Pure: the same p and section ranges always give the same state, so the 3D view
 * and the text that reads the same ranges can never disagree.
 *
 * Sections register their real scroll ranges (measured from the DOM, recomputed on resize).
 * Sections that are not registered (the light ones) hide the device.
 */

export type StageSectionId =
  | "hero"
  | "problem"
  | "how-it-works"
  | "features"
  | "design"
  | "inside"
  | "demo"
  | "roadmap"
  | "waitlist";

export interface SectionRange {
  id: StageSectionId;
  /** Page progress where the section's 3D story starts and ends. */
  start: number;
  end: number;
}

/** Groups of parts that a section can bring forward (others dim to ~35%). */
export type FocusGroup = "sensors" | "motors" | "power" | "frame" | "leftArm" | "rightArm";

export const FOCUS_PARTS: Record<FocusGroup, string[]> = {
  sensors: ["sensorL", "sensorFront", "sensorR"],
  motors: ["motorL", "motorR", "earCapL", "earCapR"],
  power: ["battery", "charger", "powerSwitch"],
  frame: ["frame", "lensL", "lensR", "nosePad", "templeShellL", "templeShellR", "templeCoverL", "templeCoverR"],
  leftArm: ["controller", "driverA", "driverB", "motorL", "sensorFront", "sensorL"],
  rightArm: ["battery", "charger", "powerSwitch", "motorR"],
};

export interface DeviceState {
  /** Which slot (DOM box) the device sits in, travelling from a to b. */
  slot: { a: StageSectionId; b: StageSectionId; t: number };
  opacity: number;
  /** Camera around the device: azimuth (0 = front, +90° = wearer's left side) and elevation, radians. */
  azimuth: number;
  elevation: number;
  /** World size (device units) that should fill the slot. */
  size: number;
  target: [number, number, number];
  /** Motion amounts the stage integrates over time (float, pointer tilt, slow turntable). */
  float: number;
  tilt: number;
  spin: number;
  glow: number;
  rings: number;
  explode: number;
  labels: number;
  focus: { group: FocusGroup; amount: number }[];
  /** X-ray of the left and right temple shells. */
  xray: [number, number];
  cones: number;
  hits: [number, number, number];
  motors: [number, number];
  pulseRate: number;
  /** Obstacles left, ahead, right (visibility) and their distance from the sensors. */
  obstacles: [number, number, number];
  obstacleDistance: number;
  problem: number;
  signals: number;
}

const DEG = Math.PI / 180;

const BASE: Omit<DeviceState, "slot"> = {
  opacity: 1,
  azimuth: -38 * DEG,
  elevation: 16 * DEG,
  size: 1.9,
  target: [0, -0.03, -0.1],
  float: 0,
  tilt: 0,
  spin: 0,
  glow: 0,
  rings: 0,
  explode: 0,
  labels: 0,
  focus: [],
  xray: [0, 0],
  cones: 0,
  hits: [0, 0, 0],
  motors: [0, 0],
  pulseRate: 1.4,
  obstacles: [0, 0, 0],
  obstacleDistance: 1.8,
  problem: 0,
  signals: 0,
};

const state = (id: StageSectionId, s: Partial<DeviceState>): DeviceState => ({
  ...BASE,
  ...s,
  slot: { a: id, b: id, t: 0 },
});

/** How it works: sense → decide → feel; left, ahead and right obstacles each get a turn. */
export const HOW_STEPS = 3;
export const howStep = (local: number) => Math.min(HOW_STEPS - 1, Math.max(0, Math.floor(local * HOW_STEPS)));
/** A representative moment for the reduced-motion still: feel step, obstacle ahead, both motors. */
export const HOW_STILL_LOCAL = (2 + 0.5) / HOW_STEPS;

function howItWorks(local: number): DeviceState {
  const s = Math.min(HOW_STEPS - 1e-4, Math.max(0, local * HOW_STEPS));
  const step = Math.floor(s);
  const k = s - step;
  const turn = Math.min(2, Math.floor(k * 3)); // 0 left · 1 ahead · 2 right
  const inTurn = k * 3 - turn;
  const show = step === 0 ? 0 : smooth(inTurn / 0.2) * smooth((1 - inTurn) / 0.15);
  const obstacles: [number, number, number] = [0, 0, 0];
  const hits: [number, number, number] = [0, 0, 0];
  const motors: [number, number] = [0, 0];
  if (step > 0) {
    obstacles[turn] = show;
    hits[turn] = show;
  }
  if (step === 2) {
    if (turn !== 2) motors[0] = show;
    if (turn !== 0) motors[1] = show;
  }
  return state("how-it-works", {
    azimuth: Math.PI,
    elevation: 54 * DEG,
    size: 3.9,
    target: [0, -0.3, 0.95],
    cones: smooth(s / 0.5),
    hits,
    motors,
    obstacles,
    obstacleDistance: step === 2 ? 1.9 - 0.8 * smooth(inTurn) : 1.8,
    pulseRate: step === 2 ? 1.4 + 2.4 * smooth(inTurn) : 1.4,
  });
}

/** Features: as each card becomes active, turn to the part that delivers it. */
type FeatureIcon = (typeof features.items)[number]["icon"];
const FEATURE_VIEW: Record<
  FeatureIcon,
  { group: FocusGroup | null; azimuth: number; elevation: number; xray?: [number, number] }
> = {
  directions: { group: "sensors", azimuth: -12 * DEG, elevation: 8 * DEG },
  haptic: { group: "motors", azimuth: 145 * DEG, elevation: 18 * DEG },
  handsFree: { group: null, azimuth: -38 * DEG, elevation: 14 * DEG },
  cane: { group: null, azimuth: 35 * DEG, elevation: 12 * DEG },
  charge: { group: "power", azimuth: -96 * DEG, elevation: 14 * DEG, xray: [0, 1] },
  parts: { group: null, azimuth: -30 * DEG, elevation: 26 * DEG },
  glasses: { group: "frame", azimuth: 0, elevation: 4 * DEG },
};
export const featureIndex = (local: number) =>
  Math.min(features.items.length - 1, Math.max(0, Math.floor(local * features.items.length)));

function featureState(i: number): DeviceState {
  const icon = features.items[i].icon;
  const v = FEATURE_VIEW[icon];
  return state("features", {
    azimuth: v.azimuth,
    elevation: v.elevation,
    size: 1.85,
    target: [0, -0.02, -0.08],
    focus: v.group ? [{ group: v.group, amount: 1 }] : [],
    xray: v.xray ?? [0, 0],
    explode: icon === "parts" ? 0.42 : 0,
    motors: icon === "haptic" ? [1, 1] : [0, 0],
    cones: icon === "directions" ? 0.45 : 0,
  });
}

function featuresSection(local: number): DeviceState {
  const n = features.items.length;
  const s = Math.min(n - 1e-4, Math.max(0, local * n));
  const i = Math.floor(s);
  // ease into the next card's view during the last quarter of each card
  const t = i < n - 1 ? smooth((s - i - 0.75) / 0.25) : 0;
  return t > 0 ? mix(featureState(i), featureState(i + 1), t) : featureState(i);
}

/** Design: hold assembled briefly, then 0 → 0.5 (covers off) → 1 (fully exploded). */
export const designExplode = (local: number) => Math.min(1, Math.max(0, (local - 0.06) / 0.8));

function design(local: number): DeviceState {
  const e = designExplode(local);
  return state("design", {
    azimuth: 8 * DEG,
    elevation: 36 * DEG,
    size: 2.2 + 0.85 * smooth(e / 0.6),
    target: [0, -0.1, 0.24],
    explode: e,
    labels: smooth((e - 0.55) / 0.3),
  });
}

/** Inside the arms: X-ray the left arm (controller + drivers), then the right (battery + charger). */
export const insideSide = (local: number): "left" | "right" => (local < 0.5 ? "left" : "right");

function inside(local: number): DeviceState {
  const toRight = smooth((local - 0.42) / 0.16);
  const on = smooth(local / 0.1);
  return state("inside", {
    azimuth: (90 - 180 * toRight) * DEG,
    elevation: 10 * DEG,
    size: 1.8,
    target: [0, 0.04, -0.2],
    xray: [lerp(1, 0.3, toRight), lerp(0.3, 1, toRight)],
    focus: [
      { group: "leftArm", amount: 1 - toRight },
      { group: "rightArm", amount: toRight },
    ],
    signals: on * (1 - toRight),
    motors: [on * (1 - toRight), 0],
    pulseRate: 2,
  });
}

const SECTIONS: Record<StageSectionId, (local: number) => DeviceState> = {
  hero: () => state("hero", { float: 1, tilt: 1, glow: 1, rings: 1 }),
  problem: (l) =>
    state("problem", {
      azimuth: 90 * DEG,
      elevation: 17 * DEG,
      size: 4.2,
      target: [0, -0.75, 1.15],
      problem: smooth((l - 0.05) / 0.3),
      cones: smooth((l - 0.25) / 0.3) * 0.8,
      hits: [0, smooth((l - 0.35) / 0.25), 0],
    }),
  "how-it-works": howItWorks,
  features: featuresSection,
  design,
  inside,
  demo: () => state("demo", { spin: 1, size: 2.1, elevation: 12 * DEG }),
  roadmap: () => state("roadmap", { spin: 1, size: 2.1, elevation: 12 * DEG }),
  waitlist: () => state("waitlist", { azimuth: 0, elevation: 6 * DEG, size: 1.85, float: 0.6, glow: 0.6 }),
};

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerp3 = <T extends number[]>(a: T, b: T, t: number) => a.map((v, i) => lerp(v, b[i], t)) as T;

type NumKey = {
  [K in keyof DeviceState]: DeviceState[K] extends number ? K : never;
}[keyof DeviceState];
const NUM_KEYS: NumKey[] = [
  "opacity", "elevation", "size", "float", "tilt", "spin", "glow", "rings", "explode", "labels",
  "cones", "pulseRate", "obstacleDistance", "problem", "signals",
];

/** Blend two states. Numbers interpolate, focus lists cross-fade, the slot travels from a to b. */
export function mix(a: DeviceState, b: DeviceState, t: number): DeviceState {
  if (t <= 0) return a;
  if (t >= 1) return b;
  let d = b.azimuth - a.azimuth; // turn the short way round
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  const out = {
    ...a,
    slot: { a: a.slot.a, b: b.slot.b, t },
    azimuth: a.azimuth + d * t,
    target: lerp3(a.target, b.target, t),
    focus: [
      ...a.focus.map((f) => ({ ...f, amount: f.amount * (1 - t) })),
      ...b.focus.map((f) => ({ ...f, amount: f.amount * t })),
    ],
    xray: lerp3(a.xray, b.xray, t),
    hits: lerp3(a.hits, b.hits, t),
    motors: lerp3(a.motors, b.motors, t),
    obstacles: lerp3(a.obstacles, b.obstacles, t),
  };
  for (const k of NUM_KEYS) out[k] = lerp(a[k], b[k], t);
  return out;
}

const hidden = (s: DeviceState): DeviceState => ({ ...s, opacity: 0 });
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

export function sectionState(r: SectionRange, p: number): DeviceState {
  return SECTIONS[r.id](clamp01((p - r.start) / Math.max(1e-6, r.end - r.start)));
}

/**
 * The page timeline. `ranges` must be sorted by start. `blend` is how much page progress a
 * hand-over between two sections takes. Longer gaps (light sections in between) fade the
 * device out and back in instead of gliding across them.
 */
export function pageTimeline(p: number, ranges: SectionRange[], blend: number): DeviceState {
  if (!ranges.length) return hidden(state("hero", {}));
  if (p <= ranges[0].start) return sectionState(ranges[0], p);
  for (let i = 0; i < ranges.length; i++) {
    const r = ranges[i];
    const next = ranges[i + 1];
    if (!next) return sectionState(r, p);
    if (next.start - r.end > 2 * blend) {
      const out = r.end - blend / 2;
      const back = next.start - blend / 2;
      if (p < out) return sectionState(r, p);
      if (p < out + blend) return mix(sectionState(r, p), hidden(sectionState(r, p)), smooth((p - out) / blend));
      if (p < back) return hidden(sectionState(next, p));
      if (p < back + blend) return mix(hidden(sectionState(next, p)), sectionState(next, p), smooth((p - back) / blend));
      continue;
    }
    const a = Math.min(r.end, next.start) - blend / 2;
    const b = Math.max(r.end, next.start) + blend / 2;
    if (p < a) return sectionState(r, p);
    if (p < b) return mix(sectionState(r, p), sectionState(next, p), smooth((p - a) / (b - a)));
  }
  return sectionState(ranges[ranges.length - 1], p);
}
