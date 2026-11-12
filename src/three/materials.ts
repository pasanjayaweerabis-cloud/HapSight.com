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

/** All materials are procedural (no image files) and created in the browser only. */
export function createMaterials(): Record<MaterialKey, THREE.Material> {
  return {
    // matte 3D-printed plastic
    frame: new THREE.MeshPhysicalMaterial({
      color: COLORS.frame,
      roughness: 0.66,
      metalness: 0.04,
      clearcoat: 0.12,
      clearcoatRoughness: 0.7,
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
    // soft cyan glow along each lens edge (decoration only)
    lensEdge: new THREE.MeshBasicMaterial({
      color: COLORS.cyanSoft,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    }),
    // thin decorative accent strips on the top bar: an emissive material, not a real LED part
    accent: new THREE.MeshStandardMaterial({
      color: COLORS.cyan,
      emissive: new THREE.Color(COLORS.cyan),
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
    sensorLens: new THREE.MeshPhysicalMaterial({
      color: COLORS.sensorLens,
      emissive: new THREE.Color("#7c3aed"),
      emissiveIntensity: 0.35,
      roughness: 0.05,
      clearcoat: 1,
    }),
    port: new THREE.MeshStandardMaterial({ color: COLORS.port, roughness: 0.7 }),
    screw: new THREE.MeshStandardMaterial({ color: COLORS.screw, roughness: 0.4, metalness: 0.6 }),
    smd: new THREE.MeshStandardMaterial({ color: COLORS.smd, roughness: 0.5 }),
  };
}
