"use client";

import { useCallback, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import type { LabelId } from "@/content/site";
import { Device } from "../Device";
import { SCENES } from "../deviceConfig";
import { StageCanvas } from "../StageCanvas";
import { ExplodeArrows } from "../effects/ExplodeArrows";
import { LABELLED_PARTS } from "../explode";
import { smooth, v3 } from "../geometry";
import { layoutCallouts, projectToScreen, type LabelOverlayHandles, type ScreenAnchor } from "../labelProjection";
import type { StageSceneProps } from "@/components/visuals/LazyStage";

export interface DesignSceneProps {
  getExplode: () => number;
  /** Where to write label positions; omit for no labels. */
  overlay?: React.RefObject<LabelOverlayHandles | null>;
  /** "callouts": side columns with leader lines; "dots": numbered hotspots only (phones). */
  labelMode: "callouts" | "dots";
  animate: boolean;
  compact: boolean;
}

export default function DesignScene({ active, onReady, ...rest }: DesignSceneProps & StageSceneProps) {
  const s = SCENES.design;
  return (
    <StageCanvas
      active={active}
      onReady={onReady}
      camera={s.camera}
      target={s.target}
      fitAspect={0.88}
      fov={s.fov}
      compact={rest.compact}
      demand={!rest.animate}
    >
      <Exploded {...rest} />
    </StageCanvas>
  );
}

function Exploded({ getExplode, overlay, labelMode, compact }: DesignSceneProps) {
  const parts = useRef<Map<string, THREE.Object3D> | null>(null);
  const onParts = useCallback((m: Map<string, THREE.Object3D>) => {
    parts.current = m;
  }, []);
  const world = useRef(new THREE.Vector3());
  const center = useRef(v3(SCENES.design.target));

  useFrame(({ camera, size }) => {
    const h = overlay?.current;
    const map = parts.current;
    if (!h || !h.container || !map) return;

    const e = getExplode();
    const o = smooth((e - 0.55) / 0.3);
    h.setOpacity(o);
    if (o <= 0.001) return;

    const anchors: ScreenAnchor[] = [];
    for (const part of LABELLED_PARTS) {
      const g = map.get(part.id);
      if (!g) continue;
      world.current.set(...((part.anchor ?? [0, 0, 0]) as [number, number, number]));
      g.localToWorld(world.current);
      const sp = projectToScreen(world.current, camera, size.width, size.height);
      anchors.push({ id: part.label as LabelId, ...sp });
    }

    if (labelMode === "dots") {
      for (const a of anchors) {
        const item = h.items.get(a.id);
        if (!item) continue;
        item.dot.style.transform = `translate(${a.x}px, ${a.y}px) translate(-50%, -50%)`;
      }
      return;
    }

    // read sizes first, then write, to avoid layout thrashing
    const widths = new Map<LabelId, number>();
    const heights = new Map<LabelId, number>();
    for (const a of anchors) {
      const el = h.items.get(a.id)?.label;
      widths.set(a.id, el?.offsetWidth ?? 0);
      heights.set(a.id, el?.offsetHeight ?? 0);
    }
    const c = projectToScreen(center.current, camera, size.width, size.height);
    const layout = layoutCallouts(
      anchors,
      size.width,
      size.height,
      c.x,
      { gap: compact ? 30 : 36, margin: 12, top: 28, bottom: 28 },
      heights,
    );
    for (const a of anchors) {
      const item = h.items.get(a.id);
      const l = layout.get(a.id);
      if (!item || !l) continue;
      const w = widths.get(a.id) ?? 0;
      const left = l.side === "left";
      item.label.style.transform = `translate(${left ? l.lx : l.lx - w}px, ${l.ly}px) translateY(-50%)`;
      const edge = left ? l.lx + w + 6 : l.lx - w - 6;
      const knee = left ? edge + 22 : edge - 22;
      item.line.setAttribute("points", `${edge},${l.ly} ${knee},${l.ly} ${a.x},${a.y}`);
      item.dot.style.transform = `translate(${a.x}px, ${a.y}px) translate(-50%, -50%)`;
    }
  });

  return (
    <>
      <Device getExplode={getExplode} onParts={onParts} quality={compact ? "low" : "high"} />
      <ExplodeArrows getExplode={getExplode} />
    </>
  );
}
