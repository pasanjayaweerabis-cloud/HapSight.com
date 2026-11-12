import * as THREE from "three";
import { PARTS, STAGE_WINDOWS, type PartConfig, type Stage } from "./deviceConfig";
import { smooth } from "./geometry";

/** 0..1 progress of a stage given the overall explode progress (0 assembled → 1 fully exploded). */
export function stageProgress(stage: Stage, explode: number): number {
  const [a, b] = STAGE_WINDOWS[stage];
  return smooth((explode - a) / (b - a));
}

const dir = new THREE.Vector3();
const face = new THREE.Vector3();
const target = new THREE.Vector3();
const full = new THREE.Quaternion();
const part = new THREE.Quaternion();
const IDENTITY = new THREE.Quaternion();

/** Device-space offset of a part at the given explode progress. */
export function explodeOffset(p: PartConfig, explode: number, out = new THREE.Vector3()): THREE.Vector3 {
  out.set(0, 0, 0);
  for (const m of p.explode) {
    const k = stageProgress(m.stage, explode);
    if (k <= 0) continue;
    dir.set(m.direction[0], m.direction[1], m.direction[2]).normalize();
    out.addScaledVector(dir, m.distance * k);
  }
  return out;
}

/** Orientation of a part at the given explode progress: its assembled rotation plus its optional turn. */
export function explodeQuaternion(p: PartConfig, explode: number, out = new THREE.Quaternion()): THREE.Quaternion {
  if (p.quaternion) out.set(p.quaternion[0], p.quaternion[1], p.quaternion[2], p.quaternion[3]);
  else out.identity();
  if (!p.turn) return out;
  const k = stageProgress(p.turn.stage, explode);
  if (k <= 0) return out;
  face.set(0, 0, 1).applyQuaternion(out);
  target.set(p.turn.faceTo[0], p.turn.faceTo[1], p.turn.faceTo[2]).normalize();
  full.setFromUnitVectors(face, target);
  part.copy(IDENTITY).slerp(full, k);
  return out.premultiply(part);
}

const offset = new THREE.Vector3();
const rot = new THREE.Quaternion();
const base = new THREE.Vector3();

/** Device-space position of a point given in the part's local space, at the given explode progress. */
export function pointAt(p: PartConfig, local: readonly [number, number, number], explode: number, out = new THREE.Vector3()) {
  explodeOffset(p, explode, offset);
  explodeQuaternion(p, explode, rot);
  return out
    .set(local[0], local[1], local[2])
    .applyQuaternion(rot)
    .add(offset)
    .add(base.set(p.position[0], p.position[1], p.position[2]));
}

/** Total distance a part travels when fully exploded. */
export function travel(p: PartConfig): number {
  return p.explode.reduce((sum, m) => sum + m.distance, 0);
}

export const LABELLED_PARTS = PARTS.filter((p) => p.label);
