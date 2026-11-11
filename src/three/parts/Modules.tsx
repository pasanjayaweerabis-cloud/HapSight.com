"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { roundedTriangleShape } from "../geometry";
import { useParts } from "./context";

const AXIS_Z: [number, number, number] = [Math.PI / 2, 0, 0]; // cylinder Y axis → local Z

/** Round distance sensor on its small green board. Local +z looks forward out of the band. */
export function SensorModule() {
  const { mats, quality } = useParts();
  const seg = quality === "high" ? 40 : 24;
  return (
    <group>
      <mesh material={mats.pcb}>
        <boxGeometry args={[0.125, 0.115, 0.008]} />
      </mesh>
      <mesh material={mats.chip} position={[0.035, -0.03, 0.006]}>
        <boxGeometry args={[0.022, 0.018, 0.004]} />
      </mesh>
      <mesh material={mats.chip} rotation={AXIS_Z} position={[0, 0, 0.017]}>
        <cylinderGeometry args={[0.05, 0.052, 0.026, seg]} />
      </mesh>
      <mesh material={mats.silver} position={[0, 0, 0.0295]}>
        <torusGeometry args={[0.0535, 0.006, 12, seg]} />
      </mesh>
      <mesh material={mats.sensorMesh} position={[0, 0, 0.0305]}>
        <circleGeometry args={[0.049, seg]} />
      </mesh>
    </group>
  );
}

/** Black perforated rounded-triangle vibration pad. Local +z faces the wearer's temple. */
export function TemplePad() {
  const { mats } = useParts();
  const geo = useMemo(() => {
    const size = 0.13;
    const g = new THREE.ExtrudeGeometry(roundedTriangleShape(size, 0.022), {
      depth: 0.008,
      bevelEnabled: true,
      bevelThickness: 0.003,
      bevelSize: 0.003,
      bevelSegments: 3,
      curveSegments: 10,
    });
    g.translate(0, 0.008, -0.004);
    const uv = g.getAttribute("uv") as THREE.BufferAttribute;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) / size + 0.5, uv.getY(i) / size + 0.5);
    return g;
  }, []);
  return <mesh geometry={geo} material={[mats.padPerforated, mats.silicone]} />;
}

export function VibrationMotor() {
  const { mats } = useParts();
  return (
    <group>
      <mesh material={mats.motor} rotation={AXIS_Z}>
        <cylinderGeometry args={[0.028, 0.028, 0.011, 32]} />
      </mesh>
      <mesh material={mats.ribbon} position={[0.026, -0.014, 0]}>
        <boxGeometry args={[0.02, 0.003, 0.003]} />
      </mesh>
    </group>
  );
}

export function HapticBoard() {
  const { mats } = useParts();
  return (
    <group>
      <mesh material={mats.pcb}>
        <boxGeometry args={[0.06, 0.045, 0.006]} />
      </mesh>
      <mesh material={mats.chip} position={[0, 0.004, 0.005]}>
        <boxGeometry args={[0.02, 0.016, 0.004]} />
      </mesh>
    </group>
  );
}
