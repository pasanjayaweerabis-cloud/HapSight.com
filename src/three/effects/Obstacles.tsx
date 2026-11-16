"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { sensorDirections } from "./SensorCones";

/** A simple signboard-like obstacle at head height, in the middle of one sensor's view. */
function Obstacle({
  which,
  getVisible,
  getDistance,
}: {
  which: 0 | 1 | 2;
  getVisible: () => number;
  getDistance: () => number;
}) {
  const ref = useRef<THREE.Group>(null);
  const box = useRef<THREE.Mesh>(null);
  const mat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#e6eef2", roughness: 0.7, transparent: true, opacity: 0 }),
    [],
  );
  const cone = useMemo(() => sensorDirections()[which], [which]);
  const forward = useMemo(() => new THREE.Vector3(0, 0, 1), []);
  useFrame(() => {
    const v = getVisible();
    if (box.current) (box.current.material as THREE.MeshStandardMaterial).opacity = v * 0.92;
    const g = ref.current;
    if (!g) return;
    g.visible = v > 0.01;
    g.position.copy(cone.origin).addScaledVector(cone.dir, getDistance());
    g.quaternion.setFromUnitVectors(forward, cone.dir);
  });
  return (
    <group ref={ref} visible={false}>
      <RoundedBox ref={box} args={[0.42, 0.34, 0.05]} radius={0.02} smoothness={3} material={mat} />
    </group>
  );
}

/** Left, ahead and right obstacles for How it works. */
export function Obstacles({
  getVisible,
  getDistance,
}: {
  getVisible: (i: 0 | 1 | 2) => number;
  getDistance: () => number;
}) {
  return (
    <>
      {([0, 1, 2] as const).map((i) => (
        <Obstacle key={i} which={i} getVisible={() => getVisible(i)} getDistance={getDistance} />
      ))}
    </>
  );
}
