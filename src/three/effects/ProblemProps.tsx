"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import type { Line2, LineSegments2 } from "three-stdlib";
import { COLORS } from "../deviceConfig";

/** Stylised (not to scale): the ground, a cane's sweep near it, and a branch at head height. */
export const GROUND_Y = -1.95;

/** Fades every mesh in a group (they share two materials, so this is cheap). */
function fadeMeshes(g: THREE.Object3D, k: number) {
  g.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (mesh.isMesh) (mesh.material as THREE.Material).opacity = k;
  });
}

/**
 * The Problem scene: a low-poly branch ahead at head height, and a faint arc near the ground
 * that shows what a cane reaches. Everything above the arc is what the cane misses.
 */
export function ProblemProps({ getAmount }: { getAmount: () => number }) {
  const group = useRef<THREE.Group>(null);
  const leafMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#2f6f5a", roughness: 0.9, flatShading: true, transparent: true }),
    [],
  );
  const barkMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#4a3a2c", roughness: 0.95, flatShading: true, transparent: true }),
    [],
  );
  const arc = useRef<Line2 | LineSegments2>(null);
  const ground = useRef<Line2 | LineSegments2>(null);

  // the cane sweeps from near the feet out to about a metre ahead, close to the ground
  const arcPoints = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i <= 32; i++) {
      const a = -0.9 + (1.8 * i) / 32;
      pts.push([Math.sin(a) * 1.25, GROUND_Y + 0.04, 0.25 + Math.cos(a) * 1.25]);
    }
    return pts;
  }, []);
  const groundPoints = useMemo<[number, number, number][]>(
    () => [
      [0, GROUND_Y, -1.2],
      [0, GROUND_Y, 3.6],
    ],
    [],
  );

  useFrame(() => {
    const k = getAmount();
    const g = group.current;
    if (!g) return;
    g.visible = k > 0.01;
    fadeMeshes(g, k);
    if (arc.current) arc.current.material.opacity = 0.75 * k;
    if (ground.current) ground.current.material.opacity = 0.35 * k;
    g.position.y = (1 - k) * -0.15;
  });

  return (
    <group ref={group} visible={false}>
      <Line ref={ground} points={groundPoints} color={COLORS.teal2} lineWidth={1} transparent opacity={0} dashed dashSize={0.06} gapSize={0.05} />
      <Line ref={arc} points={arcPoints} color={COLORS.teal} lineWidth={1.6} transparent opacity={0} dashed dashSize={0.05} gapSize={0.035} />
      {/* branch reaching in from above, ending just ahead of the face */}
      <group position={[0.05, 0.25, 2.55]} rotation={[0.25, 0, -0.35]}>
        <mesh material={barkMat} position={[0.55, 0.32, 0]} rotation={[0, 0, 0.9]}>
          <cylinderGeometry args={[0.025, 0.05, 1.3, 6]} />
        </mesh>
        {[
          [0, 0, 0, 0.2],
          [0.22, 0.12, 0.05, 0.17],
          [-0.12, 0.1, -0.06, 0.15],
          [0.38, 0.3, 0, 0.16],
          [0.12, -0.08, 0.1, 0.12],
        ].map(([x, y, z, r], i) => (
          <mesh key={i} material={leafMat} position={[x, y, z]}>
            <icosahedronGeometry args={[r, 0]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
