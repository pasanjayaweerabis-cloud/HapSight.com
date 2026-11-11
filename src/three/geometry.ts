import * as THREE from "three";

/**
 * Procedural geometry helpers for the headband.
 *
 * Mirroring note: nothing in the model uses a negative scale. Symmetric parts are generated
 * for each side from mirrored input points, and every local frame is built right-handed
 * (x = up × outward), so triangle winding, face culling and normals are always correct.
 */

export type V3 = readonly [number, number, number];

export const v3 = (p: V3) => new THREE.Vector3(p[0], p[1], p[2]);
export const mirrorX = (p: V3): V3 => [-p[0], p[1], p[2]];

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

/* ---------- The forehead band ---------- */

/** The band is an ellipse arc in the XZ plane. θ = 0 is the centre of the forehead, +θ = wearer's left. */
export interface BandShape {
  a: number; // half width (x)
  b: number; // half depth (z, front)
  zShift: number; // ellipse centre z
  thetaMax: number; // where the band ends at each temple
  y: number;
}

export function bandNormal(s: BandShape, theta: number): THREE.Vector3 {
  // gradient of the ellipse: (x/a², z/b²)
  return new THREE.Vector3(Math.sin(theta) / s.a, 0, Math.cos(theta) / s.b).normalize();
}

export function bandPoint(s: BandShape, theta: number, offset = 0, dy = 0): THREE.Vector3 {
  // offset is applied along the outward normal so layers stay parallel.
  const x = s.a * Math.sin(theta);
  const z = s.b * Math.cos(theta) + s.zShift;
  const n = bandNormal(s, theta);
  return new THREE.Vector3(x + n.x * offset, s.y + dy, z + n.z * offset);
}

/** Quaternion whose local +z points along `outward` and local +y stays as close to world up as possible. */
export function frameQuaternion(outward: THREE.Vector3, up = new THREE.Vector3(0, 1, 0)): THREE.Quaternion {
  const z = outward.clone().normalize();
  const x = new THREE.Vector3().crossVectors(up, z).normalize();
  const y = new THREE.Vector3().crossVectors(z, x).normalize();
  const m = new THREE.Matrix4().makeBasis(x, y, z);
  return new THREE.Quaternion().setFromRotationMatrix(m);
}

/** Right-handed frame on the band: z = outward, y = up, x = up × outward. */
export function bandFrame(s: BandShape, theta: number, offset = 0, dy = 0) {
  const position = bandPoint(s, theta, offset, dy);
  const quaternion = frameQuaternion(bandNormal(s, theta));
  return { position, quaternion };
}

export function smooth(x: number): number {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
}

export function bandSweep(
  s: BandShape,
  opts: {
    offset: number;
    thickness: number;
    height: number;
    radius: number;
    dy?: number;
    taper?: number;
    segments?: number;
    thetaMax?: number;
  },
): THREE.BufferGeometry {
  const seg = opts.segments ?? 96;
  const tmax = opts.thetaMax ?? s.thetaMax;
  const points: THREE.Vector3[] = [];
  const facing: THREE.Vector3[] = [];
  for (let i = 0; i <= seg; i++) {
    const th = -tmax + (2 * tmax * i) / seg;
    points.push(bandPoint(s, th, opts.offset, opts.dy ?? 0));
    facing.push(bandNormal(s, th));
  }
  const taper = opts.taper ?? 1;
  return sweep({
    points,
    facing,
    profile: roundedRectProfile(opts.thickness, opts.height, opts.radius, 4),
    scale: (t) => {
      // narrow the band towards the temples so it meets the ear hooks smoothly
      const e = Math.abs(t - 0.5) * 2; // 0 centre → 1 ends
      const k = e < 0.78 ? 1 : 1 - (1 - taper) * smooth((e - 0.78) / 0.22);
      return [1, k];
    },
  });
}

/** Sweep along a Catmull-Rom curve through control points. */
export function curveSweep(
  control: V3[],
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

/** Rounded equilateral-ish triangle, apex up, symmetric about the y axis. */
export function roundedTriangleShape(size: number, r: number): THREE.Shape {
  const h = (size * Math.sqrt(3)) / 2;
  const verts = [
    new THREE.Vector2(0, (2 * h) / 3),
    new THREE.Vector2(-size / 2, -h / 3),
    new THREE.Vector2(size / 2, -h / 3),
  ];
  const shape = new THREE.Shape();
  for (let i = 0; i < 3; i++) {
    const p = verts[i];
    const prev = verts[(i + 2) % 3];
    const next = verts[(i + 1) % 3];
    const a = p.clone().add(prev.clone().sub(p).normalize().multiplyScalar(r));
    const b = p.clone().add(next.clone().sub(p).normalize().multiplyScalar(r));
    if (i === 0) shape.moveTo(a.x, a.y);
    else shape.lineTo(a.x, a.y);
    shape.quadraticCurveTo(p.x, p.y, b.x, b.y);
  }
  shape.closePath();
  return shape;
}
