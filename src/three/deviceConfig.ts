import * as THREE from "three";
import type { LabelId } from "@/content/site";
import { frameQuaternion, mirrorCorners, mirrorX, rectCorners, v3, type Corner, type V3 } from "./geometry";

/**
 * THE single source of truth for the 3D glasses.
 *
 * Coordinates (units ≈ decimetres): the wearer faces +Z (front = where the sensors look),
 * wearer's LEFT = +X, up = +Y. The front frame sits at z ≈ 0.6 and the temples run back to
 * z ≈ −0.9, so the origin is roughly the middle of the head.
 *
 * Every part is a separately named object with:
 *  - `position` / `quaternion`: where it sits when assembled
 *  - `explode`: one or more moves. Each move belongs to a stage:
 *      "half" runs while explode progress goes 0 → 0.5 (covers, lenses, nose pad and ear caps come off),
 *      "full" runs while it goes 0.5 → 1 (sensors, boards, battery and motors come out).
 *  - `turn` (optional): during its stage the part also turns so its face points along `faceTo`,
 *    so boards that stand upright inside a temple lie face-up when they are pulled out.
 *  - `label`: one of the 12 labels in site.ts (only on parts that get a label)
 *
 * LEFT and RIGHT symmetric parts are generated from mirrored inputs, never with a negative
 * scale. The two temples are NOT mirror copies inside: the left temple holds the controller and
 * the two motor drivers, the right temple holds the battery, the charger and the power switch.
 */

export const COLORS = {
  frame: "#2C2E33",
  frameInside: "#24262b",
  rubber: "#18191c",
  teal: "#FF6A1A", // brand orange (name kept): sensor glow, beams, arrows
  teal2: "#FFB27A",
  /** Only for vibration: motors, pulses, haptic ripples. */
  haptic: "#FFCB8A",
  lens: "#a9d6ff",
  /** Gunmetal lens rims. */
  rim: "#6b7280",
  pcbBlack: "#15161a",
  pcbGreen: "#1d7a3e",
  pcbBlue: "#1f4fae",
  chip: "#0f1013",
  gold: "#d2a54a",
  silver: "#c9ced4",
  pouch: "#b9bfc5",
  kapton: "#e1a515",
  wireRed: "#c62a2a",
  wireBlack: "#141414",
  connector: "#ece9e1",
  sensorLens: "#5c2a0d",
  port: "#08090b",
  screw: "#3b3e45",
  smd: "#cfc6b4",
} as const;

/* ---------- Front frame ---------- */

export const FRAME = {
  /** World z of the back of the front plate. */
  z: 0.62,
  halfWidth: 0.705,
  top: 0.225,
  /** Bottom of the thick top bar (= top of the lenses). */
  barBottom: 0.07,
  barCenterY: 0.1475,
  plateDepth: 0.03,
  bevel: 0.008,
  /** The top bar is deeper than the rims: a body behind the plate holds the sensors and wiring. */
  browDepth: 0.085,
} as const;

/** Lens opening on the wearer's LEFT (+x), counter-clockwise. The right one is mirrored. */
export const LENS_LEFT: Corner[] = [
  [0.16, -0.245, 0.09],
  [0.6, -0.245, 0.09],
  [0.625, 0.07, 0.03],
  [0.08, 0.07, 0.03],
];
export const LENS_CENTER: readonly [number, number] = [0.352, -0.0875];

/** Front frame outline for x ≥ 0, counter-clockwise from the bottom of the bridge to the top centre. */
const FRAME_HALF: Corner[] = [
  [0, -0.04, 0],
  [0.055, -0.04, 0.04],
  [0.115, -0.29, 0.12],
  [0.645, -0.29, 0.12],
  [0.705, 0.0, 0.06],
  [0.705, 0.225, 0.045],
  [0, 0.225, 0],
];
/** Whole outline, built from the left half and its mirror image. */
export const FRAME_OUTLINE: Corner[] = [...FRAME_HALF, ...mirrorCorners(FRAME_HALF.slice(1, -1))];

/** The three open sensor windows in the top bar: wearer's left corner, centre, right corner. */
export const SENSOR_WINDOW = { x: 0.53, w: 0.14, h: 0.085, r: 0.02 } as const;
export const sensorWindows = (): Corner[][] =>
  [SENSOR_WINDOW.x, 0, -SENSOR_WINDOW.x].map((x) =>
    rectCorners(x, FRAME.barCenterY, SENSOR_WINDOW.w, SENSOR_WINDOW.h, SENSOR_WINDOW.r),
  );
/** The corner sensors turn outward by this much; the centre one looks straight ahead. */
export const SENSOR_OUTWARD_DEG = 27;

/* ---------- Temples ---------- */

export const TEMPLE = {
  /** World z where the temples start (back of the top bar). */
  hingeZ: 0.535,
  /** Side profile of the electronics bay: u = distance back from the hinge, v = height. */
  bay: { length: 0.62, top: 0.222, bottomFront: 0.03, bottomRear: 0.04 },
  /** x of the head-side face of the shell. */
  innerX: 0.645,
  /** Thickness of the shell's inner wall and rim. */
  wall: 0.012,
  rimDepth: 0.046,
  cover: { depth: 0.014, bevel: 0.005 },
  arm: { thickness: 0.062, height: 0.072, radius: 0.022 },
} as const;

/** Bay side profile in (u, v), counter-clockwise. */
export const BAY_PROFILE: Corner[] = [
  [0, TEMPLE.bay.bottomFront, 0.03],
  [TEMPLE.bay.length, TEMPLE.bay.bottomRear, 0.06],
  [TEMPLE.bay.length, TEMPLE.bay.top, 0.03],
  [0, TEMPLE.bay.top, 0.025],
];

/** Centre line of the LEFT arm, from inside the bay back to where the ear tip starts. */
export const ARM_LEFT: V3[] = [
  [0.69, 0.186, 0.035],
  [0.69, 0.186, -0.25],
  [0.69, 0.181, -0.48],
  [0.69, 0.16, -0.61],
  [0.69, 0.115, -0.71],
  [0.69, 0.075, -0.775],
];

/** Where the ear tip starts and the direction it points (straight on along the arm). */
export function earTip(s: Side) {
  const pts = s === "left" ? ARM_LEFT : ARM_LEFT.map(mirrorX);
  const end = v3(pts[pts.length - 1]);
  const dir = end.clone().sub(v3(pts[pts.length - 2])).normalize();
  return { end, dir };
}

/** USB-C opening in the back wall of the right temple's bay. */
export const USB_PORT = { u: TEMPLE.bay.length, v: 0.128, x: -0.686, width: 0.046, height: 0.022 } as const;

export type Stage = "half" | "full";
export interface ExplodeMove {
  stage: Stage;
  direction: V3; // normalised at runtime
  distance: number;
  /** Optional slice of the stage (0..1) this move uses, so parts come out one group at a time. */
  window?: [number, number];
}

export type PartKind =
  | "frame"
  | "lens"
  | "nosePad"
  | "sensor"
  | "templeShell"
  | "templeCover"
  | "earCap"
  | "motor"
  | "controller"
  | "driver"
  | "battery"
  | "charger"
  | "powerSwitch";

export type Side = "left" | "right";

export interface PartConfig {
  id: string;
  kind: PartKind;
  side?: Side;
  position: V3;
  quaternion?: readonly [number, number, number, number];
  explode: ExplodeMove[];
  /** Optional turn during a stage: the part's local +z ends up pointing along `faceTo`. */
  turn?: { stage: Stage; faceTo: V3 };
  label?: LabelId;
  /** Where the label's leader line touches the part, in the part's local space. */
  anchor?: V3;
  /** False: no dashed leader line from where the part sits to where it moves. */
  leader?: boolean;
}

/* ---------- helpers used to compute assembled placements ---------- */

const q = (quat: THREE.Quaternion) => [quat.x, quat.y, quat.z, quat.w] as const;
const p = (v: THREE.Vector3): V3 => [v.x, v.y, v.z];
export const sideSign = (s: Side) => (s === "left" ? 1 : -1);
const facing = (dir: V3) => q(frameQuaternion(v3(dir)));

/** A point inside a temple bay: u back from the hinge, v up, `lift` out from the inner wall. */
const inBay = (s: Side, u: number, v: number, lift: number): V3 => [
  sideSign(s) * (TEMPLE.innerX + TEMPLE.wall + lift),
  v,
  TEMPLE.hingeZ - u,
];

/** Pulled-out boards lie face up, tilted a little towards the front. */
const FACE_UP: V3 = [0, 1, 0.45];
const BOARD_V = 0.126;

function sensorPart(id: string, x: number, yawDeg: number, label: LabelId, side?: Side): PartConfig {
  const yaw = (yawDeg * Math.PI) / 180;
  const look: V3 = [Math.sin(yaw), 0, Math.cos(yaw)];
  return {
    id,
    kind: "sensor",
    side,
    position: [x, FRAME.barCenterY, FRAME.z + 0.012],
    quaternion: facing(look),
    // first out in the full stage: straight forward, a little down, into the space the lenses left
    explode: [{ stage: "full", direction: [look[0], -0.22, look[2]], distance: 0.55, window: [0, 0.5] }],
    label,
    anchor: [0, 0, 0.018],
  };
}

function sideParts(s: Side): PartConfig[] {
  const sg = sideSign(s);
  const L = s === "left" ? "L" : "R";
  const tip = earTip(s);
  const tipDir = p(tip.dir);
  const inward: V3 = [-sg, 0, 0];

  return [
    {
      id: `lens${L}`,
      kind: "lens",
      side: s,
      position: [sg * LENS_CENTER[0], LENS_CENTER[1], FRAME.z + FRAME.plateDepth / 2],
      explode: [{ stage: "half", direction: [sg * 0.12, -0.95, 1], distance: 0.85, window: [0.15, 1] }],
      label: s === "left" ? "lenses" : undefined,
      anchor: [sg * 0.1, -0.09, 0.006],
    },
    sensorPart(
      `sensor${L}`,
      sg * SENSOR_WINDOW.x,
      sg * SENSOR_OUTWARD_DEG,
      s === "left" ? "tofLeft" : "tofRight",
      s,
    ),
    {
      id: `templeShell${L}`,
      kind: "templeShell",
      side: s,
      position: [sg * 0.68, BOARD_V, TEMPLE.hingeZ - 0.31],
      explode: [],
    },
    {
      id: `templeCover${L}`,
      kind: "templeCover",
      side: s,
      position: [sg * (TEMPLE.innerX + TEMPLE.wall + TEMPLE.rimDepth + 0.007), BOARD_V, TEMPLE.hingeZ - 0.31],
      // covers lift up and out, above the boards, so they stay clear of the label columns
      explode: [{ stage: "half", direction: [sg * 0.8, 1.2, 0], distance: 0.85, window: [0, 0.75] }],
    },
    {
      id: `earCap${L}`,
      kind: "earCap",
      side: s,
      position: p(tip.end.clone().addScaledVector(tip.dir, 0.05)),
      quaternion: facing(tipDir),
      explode: [{ stage: "half", direction: tipDir, distance: 0.7, window: [0.25, 1] }],
    },
    {
      id: `motor${L}`,
      kind: "motor",
      side: s,
      position: p(tip.end.clone().addScaledVector(tip.dir, 0.065)),
      // the flat face of the coin motor presses towards the head, behind the ear
      quaternion: facing(inward),
      explode: [{ stage: "full", direction: tipDir, distance: 0.42, window: [0.5, 1] }],
      turn: { stage: "full", faceTo: FACE_UP },
      label: s === "left" ? "motorLeft" : "motorRight",
      anchor: [0, 0, 0.013],
    },
  ];
}

/** Boards come out sideways and up, between the temple and its lifted cover. */
const OUT_UP = (s: Side): V3 => [sideSign(s), 0.7, 0];

/** Left temple: controller next to the hinge, then the two motor driver boards. */
const leftTemple: PartConfig[] = [
  {
    id: "controller",
    kind: "controller",
    side: "left",
    position: inBay("left", 0.145, BOARD_V, 0.004 + 0.006),
    quaternion: facing([1, 0, 0]),
    explode: [{ stage: "full", direction: OUT_UP("left"), distance: 0.5, window: [0.2, 0.7] }],
    turn: { stage: "full", faceTo: FACE_UP },
    label: "controller",
    // front half of the board (local −x points forward on the left side)
    anchor: [-0.05, 0, 0.022],
  },
  {
    id: "driverA",
    kind: "driver",
    side: "left",
    position: inBay("left", 0.33, BOARD_V, 0.004 + 0.005),
    quaternion: facing([1, 0, 0]),
    explode: [{ stage: "full", direction: OUT_UP("left"), distance: 0.5, window: [0.3, 0.8] }],
    turn: { stage: "full", faceTo: FACE_UP },
  },
  {
    id: "driverB",
    kind: "driver",
    side: "left",
    position: inBay("left", 0.455, BOARD_V, 0.004 + 0.005),
    quaternion: facing([1, 0, 0]),
    explode: [{ stage: "full", direction: OUT_UP("left"), distance: 0.5, window: [0.35, 0.85] }],
    turn: { stage: "full", faceTo: FACE_UP },
    // the label sits on the rear board so its marker stays clear of the controller's
    label: "drivers",
    anchor: [0, 0, 0.012],
  },
];

/** Right temple: battery, USB-C charger (port out through the back wall) and the slide switch on top. */
const rightTemple: PartConfig[] = [
  {
    id: "battery",
    kind: "battery",
    side: "right",
    position: inBay("right", 0.17, BOARD_V, 0.002 + 0.0175),
    quaternion: facing([-1, 0, 0]),
    explode: [{ stage: "full", direction: OUT_UP("right"), distance: 0.5, window: [0.2, 0.7] }],
    turn: { stage: "full", faceTo: FACE_UP },
    label: "battery",
    // front half of the pouch (local +x points forward on the right side)
    anchor: [0.07, 0, 0.018],
  },
  {
    id: "charger",
    kind: "charger",
    side: "right",
    position: inBay("right", 0.45, BOARD_V, 0.004 + 0.005),
    quaternion: facing([-1, 0, 0]),
    explode: [{ stage: "full", direction: OUT_UP("right"), distance: 0.5, window: [0.3, 0.8] }],
    turn: { stage: "full", faceTo: FACE_UP },
    label: "charger",
    anchor: [-0.02, 0, 0.012],
  },
  {
    id: "powerSwitch",
    kind: "powerSwitch",
    side: "right",
    // on top of the right arm, just behind the bay
    position: [-0.69, TEMPLE.bay.top + 0.001, TEMPLE.hingeZ - 0.76],
    quaternion: q(frameQuaternion(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1))),
    explode: [],
    label: "wiring",
    anchor: [0, 0, 0.008],
  },
];

export const PARTS: PartConfig[] = [
  {
    id: "frame",
    kind: "frame",
    position: [0, 0, FRAME.z],
    explode: [],
    label: "frame",
    anchor: [-0.3, FRAME.top, -0.02],
  },
  {
    id: "nosePad",
    kind: "nosePad",
    position: [0, -0.055, FRAME.z - 0.03],
    explode: [{ stage: "half", direction: [0, -1, 0.55], distance: 0.8, window: [0.2, 1] }],
  },
  sensorPart("sensorFront", 0, 0, "tofFront"),
  ...sideParts("left"),
  ...sideParts("right"),
  ...leftTemple,
  ...rightTemple,
];

export const STAGE_WINDOWS: Record<Stage, [number, number]> = { half: [0, 0.5], full: [0.5, 1] };

/* ---------- Scene settings (cameras live in pageTimeline.ts) ---------- */

export const SCENES = {
  /** VL53L1X field of view (about 27° wide) used for the translucent detection cones. */
  sensing: { length: 2.3, halfAngleDeg: 13.5 },
} as const;
