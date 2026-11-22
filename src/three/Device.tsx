"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { PARTS } from "./deviceConfig";
import { createMaterials } from "./materials";
import { PartsContext } from "./parts/context";
import { PartMesh } from "./parts";
import { explodeOffset, explodeQuaternion } from "./explode";

export interface DeviceProps {
  /** Returns explode progress 0..1. Read every frame, so it never causes React re-renders. */
  getExplode?: () => number;
  /** Optional per-part opacity 0..1 (highlight one part, dim or X-ray the rest). */
  getPartOpacity?: (id: string) => number;
  /** Optional 0..1 boost for the decorative orange strips. */
  getGlow?: () => number;
  quality?: "high" | "low";
  /** Receives the part groups by id, e.g. to project label anchors to the screen. */
  onParts?: (parts: Map<string, THREE.Object3D>) => void;
}

/** Assembled orientation of each part, created once so re-renders never reset a turned part. */
const BASE_QUATS = new Map(
  PARTS.map((p) => [p.id, p.quaternion ? new THREE.Quaternion(...p.quaternion) : new THREE.Quaternion()]),
);

interface OwnMaterial {
  mat: THREE.Material;
  opacity: number;
  transparent: boolean;
  depthWrite: boolean;
  glow: boolean;
}

/** Applies one part's opacity and the strip glow to its own materials (called every frame). */
function applyLook(list: OwnMaterial[], o: number, changed: boolean, glow: number) {
  for (const m of list) {
    if (m.glow) (m.mat as THREE.MeshStandardMaterial).emissiveIntensity = 1.6 + 1.2 * glow;
    if (!changed) continue;
    const transparent = m.transparent || o < 0.999;
    if (transparent !== m.mat.transparent) m.mat.needsUpdate = true;
    m.mat.transparent = transparent;
    m.mat.opacity = m.opacity * o;
    m.mat.depthWrite = m.depthWrite && o > 0.6;
  }
}

/** The whole pair of glasses, built from deviceConfig. */
export function Device({ getExplode, getPartOpacity, getGlow, quality = "high", onParts }: DeviceProps) {
  const mats = useMemo(() => createMaterials(), []);
  const refs = useRef(new Map<string, THREE.Group>());
  const own = useRef(new Map<string, OwnMaterial[]>());
  const lastOpacity = useRef(new Map<string, number>());
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const last = useRef(-1);
  const perPart = Boolean(getPartOpacity || getGlow);

  useLayoutEffect(() => {
    onParts?.(refs.current as Map<string, THREE.Object3D>);
  }, [onParts]);

  // Per-part dimming needs each part to own its materials (they are shared by default).
  useLayoutEffect(() => {
    if (!perPart) return;
    const owned = own.current;
    const seen = lastOpacity.current;
    for (const [id, g] of refs.current) {
      const list: OwnMaterial[] = [];
      g.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (!mesh.isMesh) return;
        const clone = (m: THREE.Material) => {
          const c = m.clone();
          list.push({ mat: c, opacity: m.opacity, transparent: m.transparent, depthWrite: m.depthWrite, glow: m === mats.accent });
          return c;
        };
        mesh.material = Array.isArray(mesh.material) ? mesh.material.map(clone) : clone(mesh.material);
      });
      owned.set(id, list);
    }
    return () => {
      owned.forEach((list) => list.forEach((m) => m.mat.dispose()));
      owned.clear();
      seen.clear();
    };
  }, [perPart, mats]);

  useLayoutEffect(
    () => () => {
      Object.values(mats).forEach((m) => m.dispose());
    },
    [mats],
  );

  useFrame(() => {
    if (perPart) {
      const glow = getGlow ? getGlow() : 0;
      for (const [id, list] of own.current) {
        const o = getPartOpacity ? getPartOpacity(id) : 1;
        const changed = Math.abs((lastOpacity.current.get(id) ?? -1) - o) > 0.004;
        if (changed) lastOpacity.current.set(id, o);
        applyLook(list, o, changed, glow);
      }
    }

    const e = getExplode ? getExplode() : 0;
    if (Math.abs(e - last.current) < 1e-4) return;
    last.current = e;
    for (const part of PARTS) {
      const g = refs.current.get(part.id);
      if (!g) continue;
      explodeOffset(part, e, tmp);
      g.position.set(part.position[0] + tmp.x, part.position[1] + tmp.y, part.position[2] + tmp.z);
      if (part.turn) explodeQuaternion(part, e, g.quaternion);
    }
  });

  return (
    <PartsContext.Provider value={{ mats, quality }}>
      <group name="hapsight-device">
        {PARTS.map((part) => (
          <group
            key={part.id}
            name={part.id}
            ref={(g) => {
              if (g) refs.current.set(part.id, g);
              else refs.current.delete(part.id);
            }}
            position={part.position as [number, number, number]}
            quaternion={BASE_QUATS.get(part.id)}
          >
            <PartMesh part={part} />
          </group>
        ))}
      </group>
    </PartsContext.Provider>
  );
}
