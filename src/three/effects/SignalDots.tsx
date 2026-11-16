"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { COLORS, PARTS } from "../deviceConfig";
import { v3 } from "../geometry";

const at = (id: string) => v3(PARTS.find((p) => p.id === id)!.position);

/**
 * Signal dots for "Inside the arms": sensor → controller (ESP32-C3) → MOSFET driver → motor.
 * Teal while they carry data, orange (haptic) on the last leg into the motor.
 */
export function SignalDots({ getAmount, animate }: { getAmount: () => number; animate: boolean }) {
  const paths = useMemo(() => {
    const mk = (ids: string[]) => new THREE.CatmullRomCurve3(ids.map(at), false, "catmullrom", 0.2);
    return [
      mk(["sensorL", "controller", "driverA", "motorL"]),
      mk(["sensorFront", "controller", "driverB", "motorL"]),
    ];
  }, []);
  const DOTS = 4;
  const geo = useMemo(() => new THREE.SphereGeometry(0.016, 12, 8), []);
  const mats = useMemo(
    () =>
      Array.from({ length: paths.length * DOTS }, () =>
        new THREE.MeshBasicMaterial({ color: COLORS.teal, transparent: true, opacity: 0, depthTest: false, toneMapped: false }),
      ),
    [paths],
  );
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const phase = useRef(0);
  const teal = useMemo(() => new THREE.Color(COLORS.teal), []);
  const haptic = useMemo(() => new THREE.Color(COLORS.haptic), []);

  useFrame((_, dt) => {
    const k = getAmount();
    if (animate) phase.current = (phase.current + Math.min(dt, 0.05) * 0.35) % 1;
    paths.forEach((curve, pi) => {
      for (let d = 0; d < DOTS; d++) {
        const i = pi * DOTS + d;
        const m = refs.current[i];
        if (!m) continue;
        const t = (phase.current + d / DOTS + pi * 0.12) % 1;
        curve.getPointAt(t, m.position);
        const mat = mats[i];
        mat.opacity = k * Math.sin(Math.PI * t) * 0.95;
        mat.color.copy(t > 0.72 ? haptic : teal);
        m.visible = k > 0.01;
      }
    });
  });

  return (
    <>
      {mats.map((m, i) => (
        <mesh
          key={i}
          ref={(r) => {
            refs.current[i] = r;
          }}
          geometry={geo}
          material={m}
          renderOrder={8}
          visible={false}
        />
      ))}
    </>
  );
}
