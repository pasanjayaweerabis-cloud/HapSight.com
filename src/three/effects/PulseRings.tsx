"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Billboard } from "@react-three/drei";
import { COLORS, PARTS } from "../deviceConfig";
import { v3 } from "../geometry";

const RINGS = 3;

/**
 * Glowing ripple rings that pulse out from one temple pad while it vibrates.
 * `getStrength` 0..1, `getRate` pulses per second. Rings always face the camera.
 */
export function PulseRings({
  side,
  getStrength,
  getRate,
  animate,
}: {
  side: "left" | "right";
  getStrength: () => number;
  getRate: () => number;
  animate: boolean;
}) {
  const part = PARTS.find((p) => p.id === (side === "left" ? "templePadL" : "templePadR"))!;
  const position = useMemo(() => {
    const q = new THREE.Quaternion(...part.quaternion!);
    return v3(part.position).add(new THREE.Vector3(0, 0, 0.03).applyQuaternion(q));
  }, [part]);

  const ringGeo = useMemo(() => new THREE.RingGeometry(0.085, 0.1, 64), []);
  const glowGeo = useMemo(() => new THREE.CircleGeometry(0.09, 48), []);
  const makeMat = (color: string) =>
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    });
  const mats = useMemo(() => Array.from({ length: RINGS }, () => makeMat(COLORS.ripple)), []);
  const glowMat = useMemo(() => makeMat(COLORS.warm), []);
  const rings = useRef<(THREE.Mesh | null)[]>([]);
  const glow = useRef<THREE.Mesh>(null);
  const phase = useRef(0.35);

  useFrame((_, dt) => {
    const strength = getStrength();
    if (animate) phase.current += Math.min(dt, 0.05) * getRate();
    for (let i = 0; i < RINGS; i++) {
      const m = rings.current[i];
      if (!m) continue;
      const t = (phase.current + i / RINGS) % 1;
      m.scale.setScalar(0.6 + t * 2.4);
      (m.material as THREE.MeshBasicMaterial).opacity = strength * (1 - t) * 0.9;
    }
    const beat = animate ? 0.55 + 0.45 * Math.sin(phase.current * Math.PI * 2) : 1;
    if (glow.current) (glow.current.material as THREE.MeshBasicMaterial).opacity = strength * 0.55 * beat;
  });

  return (
    <Billboard position={position}>
      <mesh ref={glow} geometry={glowGeo} material={glowMat} renderOrder={5} />
      {mats.map((m, i) => (
        <mesh
          key={i}
          ref={(r) => {
            rings.current[i] = r;
          }}
          geometry={ringGeo}
          material={m}
          renderOrder={6}
        />
      ))}
    </Billboard>
  );
}
