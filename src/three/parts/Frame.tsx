"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import {
  FRAME,
  FRAME_OUTLINE,
  LENS_CENTER,
  LENS_LEFT,
  SENSOR_WINDOW,
  sensorWindows,
  type Side,
} from "../deviceConfig";
import { insetCorners, mirrorCorners, mirrorX, roundedPolygon, type V3 } from "../geometry";
import { useParts } from "./context";

const AXIS_Z: [number, number, number] = [Math.PI / 2, 0, 0]; // cylinder Y axis → local Z
const lensCorners = (side: Side) => (side === "left" ? LENS_LEFT : mirrorCorners(LENS_LEFT));

/*
 * Front frame, in the frame's local space: x/y as in the device, z = 0 at the back of the
 * front plate. The plate is one extrusion with the two lens openings and the three open sensor
 * windows cut out; a deeper body behind the top bar closes the windows into pockets.
 */
export function Frame() {
  const { mats, quality } = useParts();
  const seg = quality === "high" ? 8 : 4;
  const plate = useMemo(() => {
    const shape = new THREE.Shape(roundedPolygon(FRAME_OUTLINE, seg));
    for (const side of ["left", "right"] as const) shape.holes.push(new THREE.Path(roundedPolygon(lensCorners(side), seg)));
    for (const w of sensorWindows()) shape.holes.push(new THREE.Path(roundedPolygon(w, seg)));
    const g = new THREE.ExtrudeGeometry(shape, {
      depth: FRAME.plateDepth,
      bevelEnabled: true,
      bevelThickness: FRAME.bevel,
      bevelSize: FRAME.bevel,
      bevelSegments: quality === "high" ? 3 : 1,
      curveSegments: 4,
    });
    g.computeVertexNormals();
    return g;
  }, [seg, quality]);

  const bezels = useMemo(
    () =>
      sensorWindows().map((w) => {
        const ring = new THREE.Shape(roundedPolygon(insetCorners(w, -0.011), seg));
        ring.holes.push(new THREE.Path(roundedPolygon(insetCorners(w, -0.003), seg)));
        return new THREE.ShapeGeometry(ring, 4);
      }),
    [seg],
  );
  useEffect(() => () => bezels.forEach((g) => g.dispose()), [bezels]);

  const front = FRAME.plateDepth + FRAME.bevel;
  const browH = FRAME.top - FRAME.barBottom;

  return (
    <group>
      <mesh geometry={plate} material={mats.frame} castShadow receiveShadow />
      {/* deep top bar behind the plate (holds the sensors; wiring runs through it) */}
      <RoundedBox
        args={[FRAME.halfWidth * 2 - 0.01, browH - 0.006, FRAME.browDepth]}
        radius={0.022}
        smoothness={quality === "high" ? 4 : 2}
        position={[0, FRAME.barCenterY, -FRAME.browDepth / 2 + 0.004]}
        material={mats.frame}
        castShadow
      />
      {/* dark backs of the three open sensor pockets */}
      {[SENSOR_WINDOW.x, 0, -SENSOR_WINDOW.x].map((x) => (
        <mesh key={x} position={[x, FRAME.barCenterY, 0.006]} material={mats.port}>
          <boxGeometry args={[SENSOR_WINDOW.w - 0.01, SENSOR_WINDOW.h - 0.01, 0.004]} />
        </mesh>
      ))}
      {/* thin glowing teal bezel around each sensor window (emissive material, not a part) */}
      {bezels.map((g, i) => (
        <mesh key={i} geometry={g} position={[0, 0, front + 0.0012]} material={mats.accent} />
      ))}
      {/* corner screws */}
      {[0.655, -0.655].map((x) => (
        <group key={x} position={[x, FRAME.barCenterY, front + 0.002]}>
          <mesh material={mats.screw} rotation={AXIS_Z}>
            <cylinderGeometry args={[0.012, 0.012, 0.005, 20]} />
          </mesh>
          <mesh material={mats.port} position={[0, 0, 0.0027]}>
            <boxGeometry args={[0.014, 0.0028, 0.001]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Clear lens with a thin gunmetal rim. Local origin = centre of the lens opening. */
export function Lens({ side }: { side: Side }) {
  const { mats, quality } = useParts();
  const seg = quality === "high" ? 10 : 5;
  const { lens, edge } = useMemo(() => {
    const corners = lensCorners(side);
    const cx = (side === "left" ? 1 : -1) * LENS_CENTER[0];
    const cy = LENS_CENTER[1];
    // a little larger than the opening so the edge tucks into the frame
    const lensShape = new THREE.Shape(roundedPolygon(insetCorners(corners, -0.004), seg));
    const lens = new THREE.ExtrudeGeometry(lensShape, {
      depth: 0.008,
      bevelEnabled: true,
      bevelThickness: 0.002,
      bevelSize: 0.002,
      bevelSegments: 2,
      curveSegments: 4,
    });
    lens.translate(-cx, -cy, -0.004);
    // thin metal rim just inside the visible edge of the opening
    const ring = new THREE.Shape(roundedPolygon(insetCorners(corners, FRAME.bevel), seg));
    ring.holes.push(new THREE.Path(roundedPolygon(insetCorners(corners, FRAME.bevel + 0.008), seg)));
    const edge = new THREE.ShapeGeometry(ring, 4);
    edge.translate(-cx, -cy, 0.0065);
    return { lens, edge };
  }, [side, seg]);
  return (
    <group>
      <mesh geometry={lens} material={mats.lens} renderOrder={3} />
      <mesh geometry={edge} material={mats.lensEdge} renderOrder={4} />
    </group>
  );
}

/** Soft rubber nose pad (a saddle with two feet) under the bridge, from mirrored points. */
export function NosePad() {
  const { mats, quality } = useParts();
  const geo = useMemo(() => {
    const leftHalf: V3[] = [
      [0.118, -0.2, -0.04],
      [0.1, -0.13, -0.025],
      [0.065, -0.05, -0.008],
      [0.025, -0.002, 0],
    ];
    const pts = [...leftHalf, ...leftHalf.map(mirrorX).reverse()].map((p) => new THREE.Vector3(...p));
    const curve = new THREE.CatmullRomCurve3(pts, false, "centripetal");
    return new THREE.TubeGeometry(curve, quality === "high" ? 64 : 32, 0.024, quality === "high" ? 14 : 8, false);
  }, [quality]);
  return (
    <group>
      <mesh geometry={geo} material={mats.rubber} castShadow />
      {/* pads at the two feet */}
      {[0.12, -0.12].map((x) => (
        <mesh key={x} position={[x, -0.205, -0.04]} scale={[0.8, 1.35, 1]} material={mats.rubber}>
          <sphereGeometry args={[0.033, 20, 14]} />
        </mesh>
      ))}
      {/* mount that clips under the bridge */}
      <RoundedBox args={[0.07, 0.04, 0.045]} radius={0.01} smoothness={2} position={[0, 0.02, 0]} material={mats.rubber} />
    </group>
  );
}
