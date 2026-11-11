import * as THREE from "three";
import { PARTS, STAGE_WINDOWS, type PartConfig } from "./deviceConfig";
import { smooth } from "./geometry";

/** 0..1 progress of a stage given the overall explode progress (0 assembled → 1 fully exploded). */
export function stageProgress(stage: "half" | "full", explode: number): number {
  const [a, b] = STAGE_WINDOWS[stage];
  return smooth((explode - a) / (b - a));
}

const dir = new THREE.Vector3();

/** Device-space offset of a part at the given explode progress. */
export function explodeOffset(part: PartConfig, explode: number, out = new THREE.Vector3()): THREE.Vector3 {
  out.set(0, 0, 0);
  for (const m of part.explode) {
    const k = stageProgress(m.stage, explode);
    if (k <= 0) continue;
    dir.set(m.direction[0], m.direction[1], m.direction[2]).normalize();
    out.addScaledVector(dir, m.distance * k);
  }
  return out;
}

/** Offset accumulated before a stage starts (used to draw each move's arrow from the right place). */
export function offsetBeforeStage(part: PartConfig, stage: "half" | "full", out = new THREE.Vector3()): THREE.Vector3 {
  out.set(0, 0, 0);
  if (stage === "half") return out;
  for (const m of part.explode) {
    if (m.stage !== "half") continue;
    dir.set(m.direction[0], m.direction[1], m.direction[2]).normalize();
    out.addScaledVector(dir, m.distance);
  }
  return out;
}

export const LABELLED_PARTS = PARTS.filter((p) => p.label);
