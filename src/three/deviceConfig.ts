import * as THREE from "three";
import type { LabelId } from "@/content/site";
import { bandFrame, frameQuaternion, mirrorX, type BandShape, type V3 } from "./geometry";

/**
 * THE single source of truth for the 3D headband.
 *
 * Coordinates (units ≈ decimetres): the wearer faces +Z (front = where the sensors look),
 * wearer's LEFT = +X, up = +Y, origin ≈ centre of the head at band height.
 *
 * Every part is a separately named object with:
 *  - `position` / `quaternion`: where it sits when assembled
 *  - `explode`: one or more moves. Each move belongs to a stage:
 *      "half" runs while explode progress goes 0 → 0.5 (outer shells open),
 *      "full" runs while it goes 0.5 → 1 (internals come out).
 *    Moves add up, so a button can travel with its shell and then further on its own.
 *  - `label`: one of the 12 labels in site.ts (only on parts that get a label)
 *
 * LEFT and RIGHT symmetric parts are generated from mirrored inputs, never with a negative
 * scale. The two ear pods are NOT mirror copies: the right pod carries the SOS button and
 * speaker, the left pod carries the pause button and USB-C port (see `kind`).
 */

export const COLORS = {
  teal: "#0F6E56",
  tealDark: "#0b5843",
  tealLight: "#E1F5EE",
  charcoal: "#2C2C2A",
  silicone: "#141615",
  silver: "#c7ceca",
  sos: "#c2362a",
  pause: "#8c9390",
  warm: "#ffd9a6",
  pcb: "#1f6b3c",
  ribbon: "#b37a2e",
  arrow: "#5fd3ad",
  cone: "#3fbf98",
  ripple: "#9be8cf",
} as const;

export const BAND: BandShape = { a: 0.74, b: 0.9, zShift: 0.06, thetaMax: 1.28, y: 0 };

export const DIMS = {
  band: { thickness: 0.05, height: 0.19, radius: 0.02, taper: 0.42 },
  lining: { offset: -0.036, thickness: 0.022, height: 0.165, radius: 0.01, thetaMax: 1.22 },
  ribbon: { offset: -0.004, thickness: 0.004, height: 0.03, thetaMax: 1.24 },
  hook: { thickness: 0.042, width: 0.078 },
  sensorTheta: 0.3,
  /** 0 = sensors face along the band's normal, 1 = straight ahead. */
  sensorForwardBlend: 0.6,
  padTheta: 1.05,
  pod: { center: [0.79, -0.52, -0.22] as V3, half: 0.038, height: 0.26, depth: 0.15, radius: 0.018 },
  strap: { thickness: 0.012, width: 0.08 },
} as const;

/** Ear hook path for the LEFT side, from the band end over the ear to the top of the pod. */
export const HOOK_LEFT: V3[] = [
  [0.709, 0.0, 0.318],
  [0.745, -0.005, 0.17],
  [0.775, -0.04, 0.03],
  [0.79, -0.14, -0.1],
  [0.79, -0.28, -0.19],
  [0.787, -0.42, -0.22],
];

/** Back strap path, wearer's left pod → round the back of the head → right pod. */
export const STRAP: V3[] = [
  [0.79, -0.55, -0.3],
  [0.66, -0.56, -0.66],
  [0.36, -0.55, -0.93],
  [0, -0.54, -1.01],
  [-0.36, -0.55, -0.93],
  [-0.66, -0.56, -0.66],
  [-0.79, -0.55, -0.3],
];

export type Stage = "half" | "full";
export interface ExplodeMove {
  stage: Stage;
  direction: V3; // normalised at runtime
  distance: number;
  /** Set false when this move just follows a parent part (no extra arrow). */
  arrow?: boolean;
}

export type PartKind =
  | "bandShell"
  | "bandLining"
  | "earHook"
  | "sensorMount"
  | "sensorModule"
  | "templePad"
  | "vibrationMotor"
  | "hapticBoard"
  | "ribbonCable"
  | "podShellOuterLeft"
  | "podShellOuterRight"
  | "podShellInner"
  | "sosButton"
  | "speaker"
  | "controller"
  | "led"
  | "pauseButton"
  | "battery"
  | "chargingBoard"
  | "strap"
  | "ledStrip"
  | "buckle"
  | "lightSensor";

export type Side = "left" | "right";

export interface PartConfig {
  id: string;
  kind: PartKind;
  side?: Side;
  position: V3;
  quaternion?: readonly [number, number, number, number];
  explode: ExplodeMove[];
  label?: LabelId;
  /** Where the label's leader line touches the part, in the part's local space. */
  anchor?: V3;
}

/* ---------- helpers used to compute assembled placements ---------- */

const q = (quat: THREE.Quaternion) => [quat.x, quat.y, quat.z, quat.w] as const;
const p = (v: THREE.Vector3): V3 => [v.x, v.y, v.z];
const sideSign = (s: Side) => (s === "left" ? 1 : -1);

/** On the band, with the part's +z turned towards straight ahead (forward-facing sensors). */
function onBandFacingForward(theta: number, offset: number, blend: number) {
  const f = bandFrame(BAND, theta, offset);
  const n = new THREE.Vector3(0, 0, 1).applyQuaternion(f.quaternion);
  const facing = n.lerp(new THREE.Vector3(0, 0, 1), blend).normalize();
  return { position: p(f.position), quaternion: q(frameQuaternion(facing)), facing: p(facing) };
}
function inwardOnBand(theta: number, offset: number) {
  const f = bandFrame(BAND, theta, offset);
  const inward = new THREE.Vector3(f.position.x, 0, f.position.z - BAND.zShift).normalize().negate();
  return { position: p(f.position), quaternion: q(frameQuaternion(inward)), inward: p(inward) };
}
/** Pod placement: local +z faces OUT of the pod (away from the head) on both sides. */
const podQuat = (s: Side) => q(frameQuaternion(new THREE.Vector3(sideSign(s), 0, 0)));
const podPoint = (s: Side, outward: number, up: number, forward: number): V3 => {
  const c = DIMS.pod.center;
  return [sideSign(s) * (c[0] + outward), c[1] + up, c[2] + forward];
};

const OUT = (s: Side): V3 => [sideSign(s), 0, 0];
const SHELL_OPEN = 0.34;

function symmetricParts(s: Side): PartConfig[] {
  const sg = sideSign(s);
  const L = s === "left" ? "L" : "R";
  const sensorT = sg * DIMS.sensorTheta;
  const sensorMount = onBandFacingForward(sensorT, 0.03, DIMS.sensorForwardBlend);
  const sensorModule = onBandFacingForward(sensorT, 0.035, DIMS.sensorForwardBlend);
  const padT = sg * DIMS.padTheta;
  const pad = inwardOnBand(padT, DIMS.lining.offset - DIMS.lining.thickness / 2 - 0.007);
  const motor = inwardOnBand(padT, -0.006);
  const board = inwardOnBand(sg * 0.92, -0.006);

  return [
    { id: `earHook${L}`, kind: "earHook", side: s, position: [0, 0, 0], explode: [] },
    {
      id: `sensorMount${L}`,
      kind: "sensorMount",
      side: s,
      position: sensorMount.position,
      quaternion: sensorMount.quaternion,
      explode: [],
    },
    {
      id: `sensorModule${L}`,
      kind: "sensorModule",
      side: s,
      position: sensorModule.position,
      quaternion: sensorModule.quaternion,
      explode: [{ stage: "full", direction: sensorModule.facing, distance: 0.36 }],
      label: s === "left" ? "sensorLeft" : "sensorRight",
      anchor: [0, 0, 0.03],
    },
    {
      id: `templePad${L}`,
      kind: "templePad",
      side: s,
      position: pad.position,
      quaternion: pad.quaternion,
      explode: [
        { stage: "half", direction: [0, -1, 0], distance: 0.38, arrow: false },
        { stage: "full", direction: pad.inward, distance: 0.12 },
      ],
    },
    {
      id: `vibrationMotor${L}`,
      kind: "vibrationMotor",
      side: s,
      position: motor.position,
      quaternion: motor.quaternion,
      explode: [{ stage: "full", direction: motor.inward, distance: 0.24 }],
      label: s === "left" ? "motorLeft" : "motorRight",
    },
    {
      id: `hapticBoard${L}`,
      kind: "hapticBoard",
      side: s,
      position: board.position,
      quaternion: board.quaternion,
      explode: [{ stage: "full", direction: board.inward, distance: 0.24 }],
    },
    {
      id: `podShellInner${L}`,
      kind: "podShellInner",
      side: s,
      position: podPoint(s, -DIMS.pod.half / 2 - 0.001, 0, 0),
      quaternion: podQuat(s),
      explode: [],
    },
    {
      id: `podLed${L}`,
      kind: "led",
      side: s,
      position: podPoint(s, DIMS.pod.half + 0.001, 0.1, 0.05),
      quaternion: podQuat(s),
      explode: [
        { stage: "half", direction: OUT(s), distance: SHELL_OPEN, arrow: false },
        { stage: "full", direction: [0, 1, 0], distance: 0.14 },
      ],
    },
  ];
}

const leftPod: PartConfig[] = [
  {
    id: "podShellOuterL",
    kind: "podShellOuterLeft",
    side: "left",
    position: podPoint("left", DIMS.pod.half / 2 + 0.001, 0, 0),
    quaternion: podQuat("left"),
    explode: [{ stage: "half", direction: OUT("left"), distance: SHELL_OPEN }],
  },
  {
    id: "pauseButton",
    kind: "pauseButton",
    side: "left",
    position: podPoint("left", DIMS.pod.half + 0.004, 0.03, 0.005),
    quaternion: podQuat("left"),
    explode: [
      { stage: "half", direction: OUT("left"), distance: SHELL_OPEN, arrow: false },
      { stage: "full", direction: OUT("left"), distance: 0.16 },
    ],
    label: "pause",
  },
  {
    id: "battery",
    kind: "battery",
    side: "left",
    position: podPoint("left", -0.001, 0.02, 0),
    quaternion: podQuat("left"),
    explode: [{ stage: "full", direction: OUT("left"), distance: 0.2 }],
    label: "battery",
  },
  {
    id: "chargingBoard",
    kind: "chargingBoard",
    side: "left",
    position: podPoint("left", 0.02, -0.08, 0),
    quaternion: podQuat("left"),
    explode: [{ stage: "full", direction: [0.7, -0.7, 0], distance: 0.27 }],
    label: "usbc",
  },
];

const rightPod: PartConfig[] = [
  {
    id: "podShellOuterR",
    kind: "podShellOuterRight",
    side: "right",
    position: podPoint("right", DIMS.pod.half / 2 + 0.001, 0, 0),
    quaternion: podQuat("right"),
    explode: [{ stage: "half", direction: OUT("right"), distance: SHELL_OPEN }],
  },
  {
    id: "sosButton",
    kind: "sosButton",
    side: "right",
    position: podPoint("right", DIMS.pod.half + 0.006, 0.02, 0),
    quaternion: podQuat("right"),
    explode: [
      { stage: "half", direction: OUT("right"), distance: SHELL_OPEN, arrow: false },
      { stage: "full", direction: OUT("right"), distance: 0.16 },
    ],
    label: "sos",
  },
  {
    id: "controller",
    kind: "controller",
    side: "right",
    position: podPoint("right", 0, 0.01, 0),
    quaternion: podQuat("right"),
    explode: [{ stage: "full", direction: OUT("right"), distance: 0.2 }],
    label: "controller",
  },
  {
    id: "speaker",
    kind: "speaker",
    side: "right",
    position: podPoint("right", 0.02, -0.085, 0),
    quaternion: podQuat("right"),
    explode: [{ stage: "full", direction: [-0.7, -0.7, 0], distance: 0.27 }],
    label: "speaker",
  },
];

/** Strap placements. */
const strapOutward = (x: number, z: number) => new THREE.Vector3(x, 0, z + 0.05).normalize();
const buckleAt: V3 = [-0.37, -0.562, -0.935];
const buckleOut = strapOutward(buckleAt[0], buckleAt[2]);

const backParts: PartConfig[] = [
  {
    id: "strap",
    kind: "strap",
    position: [0, 0, 0],
    explode: [{ stage: "half", direction: [0, 0, -1], distance: 0.3 }],
  },
  {
    id: "ledStrip",
    kind: "ledStrip",
    position: [0, 0, 0],
    explode: [
      { stage: "half", direction: [0, 0, -1], distance: 0.3, arrow: false },
      { stage: "full", direction: [0, 0, -1], distance: 0.17 },
    ],
    label: "ledStrip",
    anchor: [0.36, -0.52, -0.95],
  },
  {
    id: "buckle",
    kind: "buckle",
    position: [buckleAt[0] + buckleOut.x * 0.014, buckleAt[1], buckleAt[2] + buckleOut.z * 0.014],
    quaternion: q(frameQuaternion(buckleOut)),
    explode: [
      { stage: "half", direction: [0, 0, -1], distance: 0.3, arrow: false },
      { stage: "full", direction: [0, -1, 0], distance: 0.14 },
    ],
  },
  {
    id: "lightSensor",
    kind: "lightSensor",
    position: [0, -0.552, -1.017],
    quaternion: q(frameQuaternion(new THREE.Vector3(0, 0, -1))),
    explode: [
      { stage: "half", direction: [0, 0, -1], distance: 0.3, arrow: false },
      { stage: "full", direction: [0, 1, 0], distance: 0.17 },
    ],
    label: "lightSensor",
  },
];

export const PARTS: PartConfig[] = [
  { id: "bandShell", kind: "bandShell", position: [0, 0, 0], explode: [] },
  {
    id: "bandLining",
    kind: "bandLining",
    position: [0, 0, 0],
    explode: [{ stage: "half", direction: [0, -1, 0], distance: 0.38 }],
  },
  {
    id: "ribbonCable",
    kind: "ribbonCable",
    position: [0, 0, 0],
    explode: [{ stage: "full", direction: [0, 1, 0], distance: 0.3 }],
  },
  ...symmetricParts("left"),
  ...symmetricParts("right"),
  ...leftPod,
  ...rightPod,
  ...backParts,
];

export const STAGE_WINDOWS: Record<Stage, [number, number]> = { half: [0, 0.5], full: [0.5, 1] };

/** Mirror helper re-exported for parts that build their own geometry. */
export { mirrorX };

/* ---------- Scene settings ---------- */

export const SCENES = {
  hero: { camera: [-2.6, 1.05, 3.3] as V3, target: [0, -0.22, 0] as V3, fov: 30 },
  /** Seen from behind and above the wearer, so the wearer's left is on the screen's left. */
  howItWorks: { camera: [0.0, 4.3, -4.3] as V3, target: [0, -0.25, 1.25] as V3, fov: 34 },
  design: { camera: [0.85, 2.1, 4.5] as V3, target: [0, -0.3, 0] as V3, fov: 29 },
  /** Sensor field of view used for the translucent cones in How it works. */
  sensing: { length: 2.3, radius: 0.7, outwardDeg: 7 },
} as const;
