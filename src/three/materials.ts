import * as THREE from "three";
import { COLORS } from "./deviceConfig";

export type MaterialKey =
  | "frame"
  | "frameInside"
  | "rubber"
  | "lens"
  | "lensEdge"
  | "accent"
  | "pcbBlack"
  | "pcbGreen"
  | "pcbBlue"
  | "chip"
  | "gold"
  | "silver"
  | "pouch"
  | "kapton"
  | "wireRed"
  | "wireBlack"
  | "connector"
  | "sensorLens"
  | "port"
  | "screw"
  | "smd";

/**
 * Fine stipple for the 3D-printed plastic: a small tiling noise texture used as a bump map, so
 * the frame catches light like the matte, slightly grainy finish in the concept renders.
 */
function stippleTexture(): THREE.DataTexture {
  const n = 128;
  const data = new Uint8Array(n * n * 4);
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < n * n; i++) {
    const v = 110 + Math.floor(rand() * 90);
    data.set([v, v, v, 255], i * 4);
  }
  const t = new THREE.DataTexture(data, n, n);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(9, 9);
  t.magFilter = THREE.LinearFilter;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.generateMipmaps = true;
  t.needsUpdate = true;
  return t;
}

/** All materials are procedural (no image files) and created in the browser only. */
export function createMaterials(): Record<MaterialKey, THREE.Material> {
  const stipple = stippleTexture();
  return {
    // matte 3D-printed plastic with a fine grain
    frame: new THREE.MeshPhysicalMaterial({
      color: COLORS.frame,
      roughness: 0.62,
      metalness: 0.05,
      clearcoat: 0.18,
      clearcoatRoughness: 0.6,
      bumpMap: stipple,
      bumpScale: 0.35,
    }),
    frameInside: new THREE.MeshStandardMaterial({ color: COLORS.frameInside, roughness: 0.85 }),
    rubber: new THREE.MeshStandardMaterial({ color: COLORS.rubber, roughness: 0.95 }),
    // clear, non-prescription lens with a slight blue tint
    lens: new THREE.MeshPhysicalMaterial({
      color: COLORS.lens,
      roughness: 0.03,
      metalness: 0,
      clearcoat: 0.6,
      clearcoatRoughness: 0.05,
      ior: 1.5,
      envMapIntensity: 0.55,
      transparent: true,
      opacity: 0.11,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
    // thin gunmetal rim around each lens, as in the concept renders
    lensEdge: new THREE.MeshStandardMaterial({ color: COLORS.rim, roughness: 0.3, metalness: 0.85 }),
    // thin teal bezels around the three sensor windows: an emissive material, not a real LED part
    accent: new THREE.MeshStandardMaterial({
      color: COLORS.teal,
      emissive: new THREE.Color(COLORS.teal),
      emissiveIntensity: 2,
      toneMapped: false,
    }),
    pcbBlack: new THREE.MeshStandardMaterial({ color: COLORS.pcbBlack, roughness: 0.5, metalness: 0.1 }),
    pcbGreen: new THREE.MeshStandardMaterial({ color: COLORS.pcbGreen, roughness: 0.5, metalness: 0.1 }),
    pcbBlue: new THREE.MeshStandardMaterial({ color: COLORS.pcbBlue, roughness: 0.5, metalness: 0.1 }),
    chip: new THREE.MeshStandardMaterial({ color: COLORS.chip, roughness: 0.4 }),
    gold: new THREE.MeshStandardMaterial({ color: COLORS.gold, roughness: 0.3, metalness: 0.9 }),
    silver: new THREE.MeshStandardMaterial({ color: COLORS.silver, roughness: 0.28, metalness: 0.9 }),
    pouch: new THREE.MeshStandardMaterial({ color: COLORS.pouch, roughness: 0.32, metalness: 0.75 }),
    kapton: new THREE.MeshStandardMaterial({ color: COLORS.kapton, roughness: 0.35, metalness: 0.2 }),
    wireRed: new THREE.MeshStandardMaterial({ color: COLORS.wireRed, roughness: 0.5 }),
    wireBlack: new THREE.MeshStandardMaterial({ color: COLORS.wireBlack, roughness: 0.5 }),
    connector: new THREE.MeshStandardMaterial({ color: COLORS.connector, roughness: 0.6 }),
    // the sensor's lens glows teal through its window (styling: the real laser is invisible infrared)
    sensorLens: new THREE.MeshPhysicalMaterial({
      color: COLORS.sensorLens,
      emissive: new THREE.Color(COLORS.teal),
      emissiveIntensity: 1.4,
      roughness: 0.05,
      clearcoat: 1,
    }),
    port: new THREE.MeshStandardMaterial({ color: COLORS.port, roughness: 0.7 }),
    screw: new THREE.MeshStandardMaterial({ color: COLORS.screw, roughness: 0.4, metalness: 0.6 }),
    smd: new THREE.MeshStandardMaterial({ color: COLORS.smd, roughness: 0.5 }),
  };
}
