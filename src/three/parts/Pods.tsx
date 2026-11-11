"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import { DIMS } from "../deviceConfig";
import { useParts } from "./context";

/*
 * Pod parts live in a pod-local frame: +z = out of the pod (away from the head) on BOTH
 * sides, +y = up. The right and left pods have different controls; they are separate
 * components, not mirrored copies.
 */

const AXIS_Z: [number, number, number] = [Math.PI / 2, 0, 0];

/** One half of the pebble-shaped pod: flat outer face, rounded edges. */
function usePodHalfGeometry() {
  return useMemo(() => {
    const bevel = 0.014;
    const w = DIMS.pod.depth - 2 * bevel;
    const h = DIMS.pod.height - 2 * bevel;
    const r = 0.055;
    const s = new THREE.Shape();
    s.moveTo(-w / 2 + r, -h / 2);
    s.lineTo(w / 2 - r, -h / 2);
    s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    s.lineTo(w / 2, h / 2 - r);
    s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
    s.lineTo(-w / 2 + r, h / 2);
    s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
    s.lineTo(-w / 2, -h / 2 + r);
    s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
    const depth = DIMS.pod.half - 2 * bevel;
    const g = new THREE.ExtrudeGeometry(s, {
      depth,
      bevelEnabled: true,
      bevelThickness: bevel,
      bevelSize: bevel,
      bevelSegments: 5,
      curveSegments: 14,
    });
    g.translate(0, 0, -depth / 2);
    g.computeVertexNormals();
    return g;
  }, []);
}

const FACE = DIMS.pod.half / 2; // outer face of a shell half, from its centre

export function PodShellInner() {
  const { mats } = useParts();
  const geo = usePodHalfGeometry();
  return <mesh geometry={geo} material={mats.teal} castShadow />;
}

/** LEFT outer shell: USB-C port opening on the outer face. */
export function PodShellOuterLeft() {
  const { mats } = useParts();
  const geo = usePodHalfGeometry();
  return (
    <group>
      <mesh geometry={geo} material={mats.teal} castShadow />
      <RoundedBox
        args={[0.034, 0.012, 0.004]}
        radius={0.0055}
        smoothness={3}
        position={[0, -0.08, FACE + 0.0005]}
        material={mats.port}
      />
      <mesh position={[0, -0.08, FACE + 0.0026]} material={mats.silver}>
        <boxGeometry args={[0.018, 0.0025, 0.001]} />
      </mesh>
    </group>
  );
}

/** RIGHT outer shell: small speaker grille on the outer face. */
export function PodShellOuterRight() {
  const { mats } = useParts();
  const geo = usePodHalfGeometry();
  const holes = useMemo(() => {
    const out: [number, number][] = [];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) out.push([(c - 2) * 0.011, -0.074 - r * 0.011]);
    return out;
  }, []);
  return (
    <group>
      <mesh geometry={geo} material={mats.teal} castShadow />
      {holes.map(([x, y]) => (
        <mesh key={`${x}-${y}`} position={[x, y, FACE + 0.0004]} material={mats.port}>
          <circleGeometry args={[0.0034, 10]} />
        </mesh>
      ))}
    </group>
  );
}

/** Large red SOS button with raised tactile dots (right pod). */
export function SosButton() {
  const { mats } = useParts();
  const dots: [number, number][] = [[0, 0]];
  for (let i = 0; i < 6; i++) dots.push([Math.cos((i * Math.PI) / 3) * 0.022, Math.sin((i * Math.PI) / 3) * 0.022]);
  return (
    <group>
      <mesh material={mats.sosRed} rotation={AXIS_Z}>
        <cylinderGeometry args={[0.044, 0.046, 0.014, 40]} />
      </mesh>
      {dots.map(([x, y]) => (
        <mesh key={`${x}-${y}`} material={mats.sosRed} position={[x, y, 0.0065]}>
          <sphereGeometry args={[0.0056, 12, 8]} />
        </mesh>
      ))}
    </group>
  );
}

/** Small grey pause button with one raised ridge (left pod). */
export function PauseButton() {
  const { mats } = useParts();
  return (
    <group>
      <mesh material={mats.pauseGrey} rotation={AXIS_Z}>
        <cylinderGeometry args={[0.024, 0.025, 0.01, 32]} />
      </mesh>
      <RoundedBox args={[0.032, 0.0065, 0.007]} radius={0.003} smoothness={2} position={[0, 0, 0.006]} material={mats.pauseGrey} />
    </group>
  );
}

/** Small warm white status LED. */
export function Led() {
  const { mats } = useParts();
  return (
    <mesh material={mats.led} rotation={AXIS_Z}>
      <cylinderGeometry args={[0.0075, 0.0075, 0.004, 16]} />
    </mesh>
  );
}

/** Controller board with Bluetooth module and antenna (right pod). */
export function Controller() {
  const { mats } = useParts();
  return (
    <group>
      <mesh material={mats.pcb}>
        <boxGeometry args={[0.1, 0.19, 0.006]} />
      </mesh>
      <mesh material={mats.chip} position={[0, -0.01, 0.005]}>
        <boxGeometry args={[0.03, 0.03, 0.004]} />
      </mesh>
      {/* Bluetooth module (metal shield) */}
      <mesh material={mats.silver} position={[0, 0.045, 0.006]}>
        <boxGeometry args={[0.04, 0.03, 0.006]} />
      </mesh>
      {/* antenna trace */}
      <mesh material={mats.gold} position={[0, 0.083, 0.0035]}>
        <boxGeometry args={[0.07, 0.005, 0.001]} />
      </mesh>
      <mesh material={mats.gold} position={[0.033, 0.07, 0.0035]}>
        <boxGeometry args={[0.005, 0.03, 0.001]} />
      </mesh>
      <mesh material={mats.chip} position={[-0.025, -0.06, 0.004]}>
        <boxGeometry args={[0.018, 0.014, 0.003]} />
      </mesh>
    </group>
  );
}

/** Small speaker / buzzer (right pod, behind the grille). */
export function Speaker() {
  const { mats } = useParts();
  return (
    <group>
      <mesh material={mats.chip} rotation={AXIS_Z}>
        <cylinderGeometry args={[0.028, 0.028, 0.012, 32]} />
      </mesh>
      <mesh material={mats.silver} position={[0, 0, 0.0062]}>
        <torusGeometry args={[0.024, 0.003, 8, 32]} />
      </mesh>
      <mesh material={mats.sensorMesh} position={[0, 0, 0.0063]}>
        <circleGeometry args={[0.021, 24]} />
      </mesh>
    </group>
  );
}

/** Flat rechargeable battery (left pod). */
export function Battery() {
  const { mats } = useParts();
  return (
    <group>
      <RoundedBox args={[0.105, 0.16, 0.012]} radius={0.004} smoothness={3} material={mats.battery} />
      <mesh material={mats.ribbon} position={[0.02, 0.083, 0]}>
        <boxGeometry args={[0.02, 0.01, 0.003]} />
      </mesh>
    </group>
  );
}

/** USB-C charging board with its port (left pod). */
export function ChargingBoard() {
  const { mats } = useParts();
  return (
    <group>
      <mesh material={mats.pcb}>
        <boxGeometry args={[0.065, 0.045, 0.006]} />
      </mesh>
      <RoundedBox args={[0.03, 0.011, 0.01]} radius={0.004} smoothness={2} position={[0, 0, 0.008]} material={mats.silver} />
      <mesh material={mats.chip} position={[0.02, 0.012, 0.005]}>
        <boxGeometry args={[0.012, 0.01, 0.003]} />
      </mesh>
    </group>
  );
}

/** Sliding strap buckle. Local +z faces away from the head. */
export function Buckle() {
  const { mats } = useParts();
  return (
    <group>
      <RoundedBox args={[0.075, 0.056, 0.016]} radius={0.006} smoothness={3} material={mats.buckle} />
      <mesh material={mats.port} position={[-0.018, 0, 0.0082]}>
        <boxGeometry args={[0.008, 0.04, 0.001]} />
      </mesh>
      <mesh material={mats.port} position={[0.018, 0, 0.0082]}>
        <boxGeometry args={[0.008, 0.04, 0.001]} />
      </mesh>
    </group>
  );
}

/** Tiny ambient light sensor (back strap). */
export function LightSensor() {
  const { mats } = useParts();
  return (
    <group>
      <mesh material={mats.buckle} rotation={AXIS_Z}>
        <cylinderGeometry args={[0.016, 0.016, 0.004, 24]} />
      </mesh>
      <mesh material={mats.lens} position={[0, 0, 0.002]} rotation={AXIS_Z}>
        <sphereGeometry args={[0.01, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
    </group>
  );
}
