import * as THREE from "three";

/**
 * Procedural geometry helpers for the glasses.
 *
 * Mirroring note: nothing in the model uses a negative scale. Symmetric parts are generated
 * for each side from mirrored input points, and every local frame is built right-handed
 * (x = up × outward), so triangle winding, face culling and normals are always correct.
 */

export type V3 = readonly [number, number, number];

/** A polygon corner: x, y and how far the rounding reaches along each edge. */
export type Corner = readonly [number, number, number];

export const v3 = (p: V3) => new THREE.Vector3(p[0], p[1], p[2]);
export const mirrorX = (p: V3): V3 => [-p[0], p[1], p[2]];

/** Mirror a counter-clockwise outline across x = 0. The result is still counter-clockwise. */
export const mirrorCorners = (c: readonly Corner[]): Corner[] =>
  c.map(([x, y, r]) => [-x, y, r] as Corner).reverse();

/** Closed outline through the corners, each one rounded with a quadratic curve. */
export function roundedPolygon(corners: readonly Corner[], seg = 8): THREE.Vector2[] {
  const n = corners.length;
  const out: THREE.Vector2[] = [];
  for (let i = 0; i < n; i++) {
    const [px, py, r] = corners[i];
    const P = new THREE.Vector2(px, py);
    if (r <= 0) {
      out.push(P);
      continue;
    }
    const A = new THREE.Vector2(corners[(i + n - 1) % n][0], corners[(i + n - 1) % n][1]);
    const B = new THREE.Vector2(corners[(i + 1) % n][0], corners[(i + 1) % n][1]);
    const t = Math.min(r, A.distanceTo(P) * 0.49, B.distanceTo(P) * 0.49);
    const p0 = P.clone().add(A.clone().sub(P).normalize().multiplyScalar(t));
    const p1 = P.clone().add(B.clone().sub(P).normalize().multiplyScalar(t));
    for (let k = 0; k <= seg; k++) {
      const s = k / seg;
      const a = (1 - s) * (1 - s);
      const b = 2 * (1 - s) * s;
      const c = s * s;
      out.push(new THREE.Vector2(a * p0.x + b * P.x + c * p1.x, a * p0.y + b * P.y + c * p1.y));
    }
  }
  return out;
}

/** Moves every edge of a convex counter-clockwise polygon inward by `d` (outward when negative). */
export function insetCorners(corners: readonly Corner[], d: number): Corner[] {
  const n = corners.length;
  const lines = corners.map((c, i) => {
    const b = corners[(i + 1) % n];
    const e = new THREE.Vector2(b[0] - c[0], b[1] - c[1]).normalize();
    const inward = new THREE.Vector2(-e.y, e.x);
    return { p: new THREE.Vector2(c[0], c[1]).addScaledVector(inward, d), e };
  });
  return corners.map((c, i) => {
    const l1 = lines[(i + n - 1) % n];
    const l2 = lines[i];
    const cross = l1.e.x * l2.e.y - l1.e.y * l2.e.x;
    const diff = l2.p.clone().sub(l1.p);
    const t = (diff.x * l2.e.y - diff.y * l2.e.x) / cross;
    const p = l1.p.clone().addScaledVector(l1.e, t);
    return [p.x, p.y, Math.max(0.004, c[2] - d * 0.6)] as Corner;
  });
}

/** Closed rounded-rectangle corners, counter-clockwise, centred on (cx, cy). */
export function rectCorners(cx: number, cy: number, w: number, h: number, r: number): Corner[] {
  return [
    [cx - w / 2, cy - h / 2, r],
    [cx + w / 2, cy - h / 2, r],
    [cx + w / 2, cy + h / 2, r],
    [cx - w / 2, cy + h / 2, r],
  ];
}

/** Closed rounded-rectangle profile, counter-clockwise, centred on the origin. */
export function roundedRectProfile(w: number, h: number, r: number, seg = 4): THREE.Vector2[] {
  const pts: THREE.Vector2[] = [];
  const rx = Math.min(r, w / 2);
  const ry = Math.min(r, h / 2);
  const corners: [number, number, number][] = [
    [w / 2 - rx, h / 2 - ry, 0],
    [-w / 2 + rx, h / 2 - ry, Math.PI / 2],
    [-w / 2 + rx, -h / 2 + ry, Math.PI],
    [w / 2 - rx, -h / 2 + ry, (3 * Math.PI) / 2],
  ];
  for (const [cx, cy, a0] of corners) {
    for (let i = 0; i <= seg; i++) {
      const a = a0 + (i / seg) * (Math.PI / 2);
      pts.push(new THREE.Vector2(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry));
    }
  }
  return pts;
}

export interface SweepOptions {
  /** Points along the path. */
  points: THREE.Vector3[];
  /** For each point, the direction the profile's +x axis should face (e.g. "outward"). */
  facing: THREE.Vector3[];
  /** Closed CCW profile: x = along `facing` (thickness), y = across (width). */
  profile: THREE.Vector2[];
  /** Optional per-point scale of the profile [thickness, width]. */
  scale?: (t: number) => [number, number];
  caps?: boolean;
}

/**
 * Sweeps a closed profile along a path. Frame per point: T = tangent,
 * W = normalize(facing × T), F = T × W. With a CCW profile in (F, W), the triangle
 * (v[i][j], v[i+1][j], v[i][j+1]) has normal (F·ty − W·tx), i.e. it faces outward.
 */
export function sweep({ points, facing, profile, scale, caps = true }: SweepOptions): THREE.BufferGeometry {
  const n = points.length;
  const m = profile.length;
  const pos: number[] = [];
  const idx: number[] = [];
  const T = new THREE.Vector3();
  const W = new THREE.Vector3();
  const F = new THREE.Vector3();
  const frames: { P: THREE.Vector3; F: THREE.Vector3; W: THREE.Vector3; s: [number, number] }[] = [];

  for (let i = 0; i < n; i++) {
    const prev = points[Math.max(0, i - 1)];
    const next = points[Math.min(n - 1, i + 1)];
    T.subVectors(next, prev).normalize();
    W.crossVectors(facing[i], T).normalize();
    F.crossVectors(T, W).normalize();
    const s = scale ? scale(i / (n - 1)) : ([1, 1] as [number, number]);
    frames.push({ P: points[i].clone(), F: F.clone(), W: W.clone(), s });
    for (let j = 0; j < m; j++) {
      const p = profile[j];
      pos.push(
        points[i].x + F.x * p.x * s[0] + W.x * p.y * s[1],
        points[i].y + F.y * p.x * s[0] + W.y * p.y * s[1],
        points[i].z + F.z * p.x * s[0] + W.z * p.y * s[1],
      );
    }
  }
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < m; j++) {
      const a = i * m + j;
      const b = (i + 1) * m + j;
      const c = i * m + ((j + 1) % m);
      const d = (i + 1) * m + ((j + 1) % m);
      idx.push(a, b, c, b, d, c);
    }
  }

  if (caps) {
    for (const [fi, sign] of [
      [0, -1],
      [n - 1, 1],
    ] as const) {
      const f = frames[fi];
      const base = pos.length / 3;
      pos.push(f.P.x, f.P.y, f.P.z);
      for (let j = 0; j < m; j++) {
        const p = profile[j];
        pos.push(
          f.P.x + f.F.x * p.x * f.s[0] + f.W.x * p.y * f.s[1],
          f.P.y + f.F.y * p.x * f.s[0] + f.W.y * p.y * f.s[1],
          f.P.z + f.F.z * p.x * f.s[0] + f.W.z * p.y * f.s[1],
        );
      }
      for (let j = 0; j < m; j++) {
        const a = base + 1 + j;
        const b = base + 1 + ((j + 1) % m);
        if (sign < 0) idx.push(base, a, b);
        else idx.push(base, b, a);
      }
    }
  }

  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/** Sweep along a Catmull-Rom curve through control points. */
export function curveSweep(
  control: readonly V3[],
  facingFn: (p: THREE.Vector3, t: number) => THREE.Vector3,
  profile: THREE.Vector2[],
  segments = 48,
  scale?: (t: number) => [number, number],
): THREE.BufferGeometry {
  const curve = new THREE.CatmullRomCurve3(control.map(v3), false, "centripetal");
  const points = curve.getPoints(segments);
  const facing = points.map((p, i) => facingFn(p, i / segments));
  return sweep({ points, facing, profile, scale });
}

/** Quaternion whose local +z points along `outward` and local +y stays as close to `up` as possible. */
export function frameQuaternion(outward: THREE.Vector3, up = new THREE.Vector3(0, 1, 0)): THREE.Quaternion {
  const z = outward.clone().normalize();
  const x = new THREE.Vector3().crossVectors(up, z).normalize();
  const y = new THREE.Vector3().crossVectors(z, x).normalize();
  const m = new THREE.Matrix4().makeBasis(x, y, z);
  return new THREE.Quaternion().setFromRotationMatrix(m);
}

export function smooth(x: number): number {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
}
