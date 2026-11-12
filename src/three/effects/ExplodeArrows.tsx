"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import type { Line2, LineSegments2 } from "three-stdlib";
import { COLORS, PARTS, type PartConfig } from "../deviceConfig";
import { pointAt, travel } from "../explode";

const UP = new THREE.Vector3(0, 1, 0);
const UNIT: [number, number, number][] = [
  [0, 0, 0],
  [0, 1, 0],
];
/** World length of one dash and one gap. */
const DASH = 0.026;

/**
 * Cyan dashed leader lines, as in the reference renders: each one runs from where a part sits
 * in the assembled glasses to where it is now, with a small dot at the empty slot.
 */
export function ExplodeArrows({ getExplode }: { getExplode: () => number }) {
  const parts = useMemo<PartConfig[]>(() => PARTS.filter((p) => p.leader !== false && travel(p) > 0.1), []);
  const lines = useRef<(THREE.Group | null)[]>([]);
  const dashes = useRef<(Line2 | LineSegments2 | null)[]>([]);
  const dots = useRef<(THREE.Mesh | null)[]>([]);
  const tmp = useMemo(() => ({ a: new THREE.Vector3(), b: new THREE.Vector3(), d: new THREE.Vector3() }), []);
  const dotGeo = useMemo(() => new THREE.SphereGeometry(0.011, 12, 8), []);

  useFrame(() => {
    const e = getExplode();
    parts.forEach((p, i) => {
      const g = lines.current[i];
      const line = dashes.current[i];
      const dot = dots.current[i];
      if (!g || !line || !dot) return;
      const anchor = p.anchor ?? [0, 0, 0];
      pointAt(p, anchor, 0, tmp.a);
      pointAt(p, anchor, e, tmp.b);
      const len = tmp.d.subVectors(tmp.b, tmp.a).length();
      const o = Math.min(1, Math.max(0, (len - 0.03) / 0.12)) * 0.9;
      g.visible = dot.visible = o > 0.01;
      if (!g.visible) return;
      g.position.copy(tmp.a);
      g.quaternion.setFromUnitVectors(UP, tmp.d.divideScalar(len));
      g.scale.set(1, len, 1);
      const m = line.material;
      m.dashScale = len;
      m.opacity = o;
      dot.position.copy(tmp.a);
      (dot.material as THREE.MeshBasicMaterial).opacity = o;
    });
  });

  return (
    <group>
      {parts.map((p, i) => (
        <group key={p.id}>
          <group
            ref={(g) => {
              lines.current[i] = g;
            }}
            visible={false}
          >
            <Line
              ref={(l) => {
                dashes.current[i] = l;
              }}
              points={UNIT}
              color={COLORS.cyan}
              lineWidth={1.4}
              dashed
              dashSize={DASH}
              gapSize={DASH * 0.7}
              transparent
              opacity={0}
              depthWrite={false}
              toneMapped={false}
              renderOrder={7}
            />
          </group>
          <mesh
            ref={(m) => {
              dots.current[i] = m;
            }}
            geometry={dotGeo}
            renderOrder={7}
            visible={false}
          >
            <meshBasicMaterial color={COLORS.cyan} transparent opacity={0} depthWrite={false} toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
