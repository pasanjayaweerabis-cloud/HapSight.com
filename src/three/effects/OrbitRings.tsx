"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { COLORS } from "../deviceConfig";

/** Thin teal rings behind the device in the hero, like the design file. Decorative. */
export function OrbitRings({ getAmount, animate }: { getAmount: () => number; animate: boolean }) {
  const group = useRef<THREE.Group>(null);
  const rings = useMemo(
    () =>
      [0.88, 1.12].map(
        (r) =>
          [
            new THREE.TorusGeometry(r, 0.0035, 6, 160),
            new THREE.MeshBasicMaterial({ color: COLORS.teal, transparent: true, opacity: 0, depthWrite: false, toneMapped: false }),
          ] as const,
      ),
    [],
  );
  useFrame((_, dt) => {
    const k = getAmount();
    const g = group.current;
    if (!g) return;
    g.visible = k > 0.01;
    rings.forEach(([, m], i) => (m.opacity = k * (i === 0 ? 0.32 : 0.18)));
    if (animate) g.rotation.z += Math.min(dt, 0.05) * 0.05;
  });
  return (
    <group ref={group} rotation={[Math.PI / 2.4, 0, 0]} position={[0, -0.05, -0.15]} visible={false}>
      {rings.map(([geo, mat], i) => (
        <mesh key={i} geometry={geo} material={mat} renderOrder={1} />
      ))}
    </group>
  );
}
