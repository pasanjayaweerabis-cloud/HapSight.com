"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { COLORS, PARTS, SCENES } from "../deviceConfig";
import { v3 } from "../geometry";

const vert = /* glsl */ `
  varying float vT;
  varying vec3 vN;
  varying vec3 vView;
  uniform float uLength;
  void main() {
    vT = clamp(position.y / uLength, 0.0, 1.0);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-mv.xyz);
    vN = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * mv;
  }
`;
const frag = /* glsl */ `
  varying float vT;
  varying vec3 vN;
  varying vec3 vView;
  uniform vec3 uColor;
  uniform float uOpacity;
  void main() {
    float edge = 1.0 - abs(dot(vN, vView));
    float fade = pow(1.0 - vT, 1.4);
    float a = uOpacity * fade * (0.35 + 0.65 * edge);
    gl_FragColor = vec4(uColor, a);
  }
`;

/** The three sensors in the order left, ahead, right. */
export const SENSOR_IDS = ["sensorL", "sensorFront", "sensorR"] as const;

/** Where each sensor looks from and in which direction: left-forward, straight ahead, right-forward. */
export function sensorDirections() {
  return SENSOR_IDS.map((id) => {
    const part = PARTS.find((p) => p.id === id)!;
    const q = new THREE.Quaternion(...part.quaternion!);
    const dir = new THREE.Vector3(0, 0, 1).applyQuaternion(q);
    const origin = v3(part.position).addScaledVector(dir, 0.025);
    return { origin, dir };
  });
}

/**
 * Translucent detection cones, one per sensor. `getOpacity` sets all three; `getHighlight`
 * (optional) brightens individual cones, e.g. the one that sees an obstacle.
 */
export function SensorCones({
  getOpacity,
  getHighlight,
}: {
  getOpacity: () => number;
  getHighlight?: () => readonly [number, number, number];
}) {
  const { length, halfAngleDeg } = SCENES.sensing;
  const radius = length * Math.tan((halfAngleDeg * Math.PI) / 180);
  const geo = useMemo(() => {
    const g = new THREE.ConeGeometry(radius, length, 48, 1, true);
    g.translate(0, -length / 2, 0); // apex at origin, opening along -Y
    g.rotateX(Math.PI); // now opens along +Y
    return g;
  }, [length, radius]);

  const cones = useMemo(() => sensorDirections(), []);
  const mats = useMemo(
    () =>
      cones.map(
        () =>
          new THREE.ShaderMaterial({
            vertexShader: vert,
            fragmentShader: frag,
            uniforms: {
              uColor: { value: new THREE.Color(COLORS.cyan) },
              uOpacity: { value: 0 },
              uLength: { value: length },
            },
            transparent: true,
            depthWrite: false,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
          }),
      ),
    [cones, length],
  );
  const group = useRef<THREE.Group>(null);

  useFrame(() => {
    const o = getOpacity() * 0.42;
    const h = getHighlight?.();
    mats.forEach((m, i) => (m.uniforms.uOpacity.value = o * (1 + 1.3 * (h ? h[i] : 0))));
    if (group.current) group.current.visible = o > 0.002;
  });

  return (
    <group ref={group}>
      {cones.map((c, i) => {
        const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), c.dir);
        return <mesh key={i} geometry={geo} material={mats[i]} position={c.origin} quaternion={q} renderOrder={2} />;
      })}
    </group>
  );
}
