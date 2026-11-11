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

/** Direction each sensor looks in: straight ahead, turned slightly outward, overlapping in the middle. */
export function sensorDirections() {
  const out = SCENES.sensing.outwardDeg * (Math.PI / 180);
  return (["sensorModuleL", "sensorModuleR"] as const).map((id) => {
    const part = PARTS.find((p) => p.id === id)!;
    const q = new THREE.Quaternion(...part.quaternion!);
    const facing = new THREE.Vector3(0, 0, 1).applyQuaternion(q);
    // left sensor a little left (+x), right sensor a little right (−x)
    const sign = id === "sensorModuleL" ? 1 : -1;
    const dir = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), sign * out);
    const origin = v3(part.position).addScaledVector(facing, 0.07);
    return { origin, dir };
  });
}

export function SensorCones({ getOpacity }: { getOpacity: () => number }) {
  const { length, radius } = SCENES.sensing;
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
              uColor: { value: new THREE.Color(COLORS.cone) },
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
    const o = getOpacity() * 0.55;
    mats.forEach((m) => (m.uniforms.uOpacity.value = o));
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
