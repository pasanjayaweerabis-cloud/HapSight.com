import * as THREE from "three";
import { COLORS } from "./deviceConfig";

/** Small procedural textures (no image files). Created lazily in the browser only. */
function dotTexture(size: number, dot: number, gap: number, bg: string, fg: string): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = fg;
  for (let y = gap / 2; y < size; y += gap) {
    const row = Math.round(y / gap);
    for (let x = gap / 2 + (row % 2 ? gap / 2 : 0); x < size; x += gap) {
      ctx.beginPath();
      ctx.arc(x, y, dot, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function weaveTexture(): THREE.CanvasTexture {
  const size = 128;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < size; i += 4) {
    ctx.fillStyle = i % 8 ? "#6a6a6a" : "#9a9a9a";
    ctx.fillRect(i, 0, 2, size);
    ctx.fillStyle = i % 8 ? "#9a9a9a" : "#6a6a6a";
    ctx.fillRect(0, i, size, 2);
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(16, 2);
  return t;
}

export type MaterialKey =
  | "teal"
  | "tealDark"
  | "silicone"
  | "silver"
  | "sensorMesh"
  | "sosRed"
  | "pauseGrey"
  | "led"
  | "ledStrip"
  | "pcb"
  | "chip"
  | "gold"
  | "battery"
  | "fabric"
  | "buckle"
  | "ribbon"
  | "padPerforated"
  | "motor"
  | "port"
  | "lens";

export function createMaterials(): Record<MaterialKey, THREE.Material> {
  const meshTex = dotTexture(128, 3, 9, "#121515", "#050606");
  meshTex.repeat.set(2, 2);
  const padTex = dotTexture(128, 4, 12, "#151716", "#030303");
  padTex.repeat.set(1.6, 1.6);

  return {
    teal: new THREE.MeshPhysicalMaterial({
      color: COLORS.teal,
      roughness: 0.52,
      metalness: 0.02,
      clearcoat: 0.25,
      clearcoatRoughness: 0.6,
    }),
    tealDark: new THREE.MeshStandardMaterial({ color: COLORS.tealDark, roughness: 0.6 }),
    silicone: new THREE.MeshStandardMaterial({ color: COLORS.silicone, roughness: 0.92 }),
    silver: new THREE.MeshStandardMaterial({ color: COLORS.silver, roughness: 0.28, metalness: 0.9 }),
    sensorMesh: new THREE.MeshStandardMaterial({ color: "#ffffff", map: meshTex, roughness: 0.9 }),
    sosRed: new THREE.MeshStandardMaterial({ color: COLORS.sos, roughness: 0.45 }),
    pauseGrey: new THREE.MeshStandardMaterial({ color: COLORS.pause, roughness: 0.55 }),
    led: new THREE.MeshStandardMaterial({
      color: COLORS.warm,
      emissive: new THREE.Color(COLORS.warm),
      emissiveIntensity: 2.2,
      toneMapped: false,
    }),
    ledStrip: new THREE.MeshStandardMaterial({
      color: COLORS.warm,
      emissive: new THREE.Color(COLORS.warm),
      emissiveIntensity: 1.6,
      toneMapped: false,
    }),
    pcb: new THREE.MeshStandardMaterial({ color: COLORS.pcb, roughness: 0.55, metalness: 0.1 }),
    chip: new THREE.MeshStandardMaterial({ color: "#151515", roughness: 0.4 }),
    gold: new THREE.MeshStandardMaterial({ color: "#c9a24a", roughness: 0.3, metalness: 0.9 }),
    battery: new THREE.MeshStandardMaterial({ color: "#a9b1b4", roughness: 0.35, metalness: 0.6 }),
    fabric: new THREE.MeshStandardMaterial({ color: "#1b1c1c", roughness: 1, bumpMap: weaveTexture(), bumpScale: 0.6 }),
    buckle: new THREE.MeshStandardMaterial({ color: "#2a2d2c", roughness: 0.45, metalness: 0.2 }),
    ribbon: new THREE.MeshStandardMaterial({ color: COLORS.ribbon, roughness: 0.5, metalness: 0.15 }),
    padPerforated: new THREE.MeshStandardMaterial({ color: "#ffffff", map: padTex, roughness: 0.9 }),
    motor: new THREE.MeshStandardMaterial({ color: "#b7bdbb", roughness: 0.3, metalness: 0.85 }),
    port: new THREE.MeshStandardMaterial({ color: "#0a0a0a", roughness: 0.6 }),
    lens: new THREE.MeshPhysicalMaterial({ color: "#1c2422", roughness: 0.1, metalness: 0, clearcoat: 1 }),
  };
}
