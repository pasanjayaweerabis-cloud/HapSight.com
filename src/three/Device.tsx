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
  quality?: "high" | "low";
  /** Receives the part groups by id, e.g. to project label anchors to the screen. */
  onParts?: (parts: Map<string, THREE.Object3D>) => void;
}

/** Assembled orientation of each part, created once so re-renders never reset a turned part. */
const BASE_QUATS = new Map(
  PARTS.map((p) => [p.id, p.quaternion ? new THREE.Quaternion(...p.quaternion) : new THREE.Quaternion()]),
);

/** The whole pair of glasses, built from deviceConfig. */
export function Device({ getExplode, quality = "high", onParts }: DeviceProps) {
  const mats = useMemo(() => createMaterials(), []);
  const refs = useRef(new Map<string, THREE.Group>());
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const last = useRef(-1);

  useLayoutEffect(() => {
    onParts?.(refs.current as Map<string, THREE.Object3D>);
  }, [onParts]);

  useLayoutEffect(
    () => () => {
      Object.values(mats).forEach((m) => m.dispose());
    },
    [mats],
  );

  useFrame(() => {
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
