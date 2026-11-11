"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { COLORS, PARTS, type Stage } from "../deviceConfig";
import { offsetBeforeStage, stageProgress } from "../explode";
import { v3 } from "../geometry";

interface Arrow {
  stage: Stage;
  start: THREE.Vector3;
  end: THREE.Vector3;
  dir: THREE.Vector3;
}

/** Thin teal arrows along each part's explode path. They fade in as their stage plays. */
export function ExplodeArrows({ getExplode }: { getExplode: () => number }) {
  const arrows = useMemo<Arrow[]>(() => {
    const out: Arrow[] = [];
    for (const part of PARTS) {
      for (const m of part.explode) {
        if (m.arrow === false || m.distance < 0.1) continue;
        const dir = v3(m.direction).normalize();
        const base = v3(part.position).add(offsetBeforeStage(part, m.stage));
        // start a little away from the part, stop short of where it lands
        const start = base.clone().addScaledVector(dir, Math.min(0.06, m.distance * 0.2));
        const end = base.clone().addScaledVector(dir, m.distance * 0.78);
        out.push({ stage: m.stage, start, end, dir });
      }
    }
    return out;
  }, []);

  const lineGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0, 0, 1, 0], 3));
    return g;
  }, []);
  const headGeo = useMemo(() => new THREE.ConeGeometry(0.012, 0.036, 12).translate(0, -0.018, 0), []);

  const groups = useRef<(THREE.Group | null)[]>([]);

  useFrame(() => {
    const e = getExplode();
    arrows.forEach((a, i) => {
      const g = groups.current[i];
      if (!g) return;
      const k = stageProgress(a.stage, e);
      // arrows show while their stage plays and stay visible once it has finished
      const o = Math.min(1, k * 1.6) * 0.95;
      g.visible = o > 0.01;
      g.children.forEach((c) => {
        const mat = (c as THREE.Mesh | THREE.Line).material as THREE.Material;
        mat.opacity = o;
      });
    });
  });

  return (
    <group>
      {arrows.map((a, i) => {
        const len = a.start.distanceTo(a.end);
        const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), a.dir);
        return (
          <group
            key={i}
            ref={(g) => {
              groups.current[i] = g;
            }}
            position={a.start}
            quaternion={q}
            visible={false}
          >
            <lineSegments geometry={lineGeo} scale={[1, len, 1]}>
              <lineBasicMaterial color={COLORS.arrow} transparent opacity={0} depthWrite={false} toneMapped={false} />
            </lineSegments>
            <mesh geometry={headGeo} position={[0, len, 0]}>
              <meshBasicMaterial color={COLORS.arrow} transparent opacity={0} depthWrite={false} toneMapped={false} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
