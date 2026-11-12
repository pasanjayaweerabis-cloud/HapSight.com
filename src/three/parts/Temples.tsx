"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import { ARM_LEFT, BAY_PROFILE, TEMPLE, USB_PORT, sideSign, type Side } from "../deviceConfig";
import { curveSweep, insetCorners, mirrorX, roundedPolygon, roundedRectProfile, smooth, type V3 } from "../geometry";
import { useParts } from "./context";

/*
 * Temple (arm) parts. Shell and cover geometry is built in device space from the bay's side
 * profile and then shifted by the part's position, so the part's origin is its centre.
 */

const AXIS_X: [number, number, number] = [0, 0, Math.PI / 2]; // cylinder Y axis → local X

/** Extrudes a side profile (u back from the hinge, v up) into a slab from x0 to x0 + depth. */
function slab(
  shape: THREE.Shape,
  depth: number,
  x0: number,
  origin: V3,
  bevel?: { thickness: number; size: number },
): THREE.ExtrudeGeometry {
  const g = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: Boolean(bevel),
    bevelThickness: bevel?.thickness ?? 0,
    bevelSize: bevel?.size ?? 0,
    bevelSegments: 3,
    curveSegments: 6,
  });
  // proper rotation (no mirroring): shape x (u) → world −z, extrusion → world +x
  g.rotateY(Math.PI / 2);
  g.translate(x0 - origin[0], -origin[1], TEMPLE.hingeZ - origin[2]);
  g.computeVertexNormals();
  return g;
}

const bayShape = (inset = 0, holeInset?: number) => {
  const s = new THREE.Shape(roundedPolygon(insetCorners(BAY_PROFILE, inset)));
  if (holeInset !== undefined) s.holes.push(new THREE.Path(roundedPolygon(insetCorners(BAY_PROFILE, holeInset))));
  return s;
};

/** The arm's centre line for one side, from mirrored control points. */
export const armPoints = (side: Side): V3[] => (side === "left" ? ARM_LEFT : ARM_LEFT.map(mirrorX));

/**
 * Hollow temple shell: inner wall + rim around the electronics bay, the slim arm with its
 * curved ear tip, standoffs and wires inside. The right shell has the USB-C opening in the
 * back wall of the bay.
 */
export function TempleShell({ side, origin }: { side: Side; origin: V3 }) {
  const { mats, quality } = useParts();
  const sg = sideSign(side);
  const { wall, rim, arm } = useMemo(() => {
    const t = TEMPLE;
    // slabs are built from their lower-x face; on the right side that face is the outer one
    const wallX0 = side === "left" ? t.innerX : -t.innerX - t.wall;
    const rimX0 = side === "left" ? t.innerX + t.wall : -t.innerX - t.wall - t.rimDepth;
    const wall = slab(bayShape(), t.wall, wallX0, origin);
    const rim = slab(bayShape(0, t.wall), t.rimDepth, rimX0, origin, { thickness: 0.003, size: 0.003 });
    const out = new THREE.Vector3(sg, 0, 0);
    const arm = curveSweep(
      armPoints(side),
      () => out,
      roundedRectProfile(t.arm.thickness, t.arm.height, t.arm.radius, quality === "high" ? 4 : 2),
      quality === "high" ? 56 : 28,
      (k) => {
        const e = smooth((k - 0.78) / 0.22);
        return [1 + 0.18 * e, 1 + 0.26 * e];
      },
    );
    arm.translate(-origin[0], -origin[1], -origin[2]);
    return { wall, rim, arm };
  }, [side, sg, origin, quality]);

  // local helper: a point inside the bay (u back from hinge, v up, lift off the inner wall)
  const at = (u: number, v: number, lift: number): [number, number, number] => [
    sg * (TEMPLE.innerX + TEMPLE.wall + lift) - origin[0],
    v - origin[1],
    TEMPLE.hingeZ - u - origin[2],
  ];
  const wireZ = (u0: number, u1: number) => (TEMPLE.hingeZ - (u0 + u1) / 2) - origin[2];

  return (
    <group>
      <mesh geometry={wall} material={mats.frameInside} receiveShadow />
      <mesh geometry={rim} material={mats.frame} castShadow />
      <mesh geometry={arm} material={mats.frame} castShadow />
      {/* standoffs the boards sit on */}
      {quality === "high"
        ? [0.06, 0.24, 0.39, 0.55].map((u) =>
            [0.06, 0.19].map((v) => (
              <mesh key={`${u}-${v}`} position={at(u, v, 0.002)} rotation={AXIS_X} material={mats.frameInside}>
                <cylinderGeometry args={[0.009, 0.009, 0.004, 12]} />
              </mesh>
            )),
          )
        : null}
      {/* wires along the bottom of the bay, running forward into the frame */}
      {[
        [0.0455, mats.wireRed],
        [0.0525, mats.wireBlack],
      ].map(([v, m]) => (
        <mesh
          key={String(v)}
          material={m as THREE.Material}
          position={[sg * (TEMPLE.innerX + TEMPLE.wall + 0.006) - origin[0], (v as number) - origin[1], wireZ(0, 0.56)]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry args={[0.0035, 0.0035, 0.56, 8]} />
        </mesh>
      ))}
      {side === "right" ? (
        // USB-C opening in the back wall of the bay
        <RoundedBox
          args={[USB_PORT.height, USB_PORT.width, 0.006]}
          radius={0.006}
          smoothness={2}
          position={[USB_PORT.x - origin[0], USB_PORT.v - origin[1], TEMPLE.hingeZ - USB_PORT.u - 0.002 - origin[2]]}
          material={mats.port}
        />
      ) : null}
    </group>
  );
}

/** Removable outer cover of a temple bay, held by three screws. */
export function TempleCover({ side, origin }: { side: Side; origin: V3 }) {
  const { mats } = useParts();
  const sg = sideSign(side);
  const { cover, outer } = useMemo(() => {
    const t = TEMPLE;
    const b = t.cover.bevel;
    const inner = t.innerX + t.wall + t.rimDepth; // |x| where the cover meets the rim
    const x0 = side === "left" ? inner + b : -inner - t.cover.depth - b;
    const cover = slab(bayShape(0.004), t.cover.depth, x0, origin, { thickness: b, size: b });
    return { cover, outer: sg * (inner + t.cover.depth + 2 * b) - origin[0] };
  }, [side, sg, origin]);
  return (
    <group>
      <mesh geometry={cover} material={mats.frame} castShadow />
      {[0.05, 0.31, 0.57].map((u) => (
        <mesh
          key={u}
          position={[outer + sg * 0.001, 0.126 - origin[1], TEMPLE.hingeZ - u - origin[2]]}
          rotation={AXIS_X}
          material={mats.screw}
        >
          <cylinderGeometry args={[0.011, 0.011, 0.004, 18]} />
        </mesh>
      ))}
    </group>
  );
}

/** Soft rubber end cap over the ear tip. Local +z points along the tip. */
export function EarCap() {
  const { mats } = useParts();
  return <RoundedBox args={[0.086, 0.108, 0.2]} radius={0.036} smoothness={4} material={mats.rubber} castShadow />;
}

/** Small slide power switch on top of the right arm. Local +z = up, +y = forward. */
export function PowerSwitch() {
  const { mats } = useParts();
  return (
    <group>
      <RoundedBox args={[0.028, 0.08, 0.008]} radius={0.003} smoothness={2} material={mats.port} />
      <RoundedBox args={[0.019, 0.028, 0.014]} radius={0.004} smoothness={2} position={[0, 0.019, 0.006]} material={mats.screw} />
    </group>
  );
}
