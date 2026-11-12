"use client";

import { useImperativeHandle, useRef } from "react";
import { design, type LabelId } from "@/content/site";
import type { LabelOverlayHandles } from "@/three/labelProjection";

export const LABEL_ORDER = Object.keys(design.labels) as LabelId[];

/**
 * Floating part labels for the exploded view. The 3D scene writes their positions directly.
 * Decorative duplicate: the same labels are in the accessible parts list below the view.
 */
export function ExplodeOverlay({ ref, mode }: { ref: React.Ref<LabelOverlayHandles>; mode: "callouts" | "dots" }) {
  const container = useRef<HTMLDivElement>(null);
  const items = useRef(new Map<LabelId, { label: HTMLElement; line: SVGPolylineElement; dot: HTMLElement }>());
  const parts = useRef(new Map<LabelId, { label?: HTMLElement; line?: SVGPolylineElement; dot?: HTMLElement }>());

  const register = (id: LabelId, key: "label" | "line" | "dot", el: HTMLElement | SVGPolylineElement | null) => {
    const entry = parts.current.get(id) ?? {};
    if (el) (entry as Record<string, unknown>)[key] = el;
    parts.current.set(id, entry);
    if (entry.label && entry.line && entry.dot) {
      items.current.set(id, { label: entry.label, line: entry.line, dot: entry.dot });
    }
  };

  useImperativeHandle(
    ref,
    () => ({
      get container() {
        return container.current;
      },
      items: items.current,
      setOpacity: (o: number) => {
        const el = container.current;
        if (!el) return;
        el.style.opacity = String(o);
        el.style.visibility = o < 0.01 ? "hidden" : "visible";
      },
    }),
    [],
  );

  return (
    <div
      ref={container}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-0"
      style={{ visibility: "hidden" }}
    >
      <svg className="absolute inset-0 size-full overflow-visible">
        {LABEL_ORDER.map((id) => (
          <polyline
            key={id}
            ref={(el) => register(id, "line", el)}
            fill="none"
            stroke="var(--stage-accent)"
            strokeWidth={1.25}
            strokeOpacity={0.85}
            strokeDasharray="4 3"
            className={mode === "dots" ? "hidden" : ""}
          />
        ))}
      </svg>
      {LABEL_ORDER.map((id, i) => (
        <div key={id}>
          <span
            ref={(el) => register(id, "dot", el)}
            className={`absolute left-0 top-0 flex items-center justify-center rounded-full border border-stage-accent bg-stage font-semibold tabular-nums text-stage-accent ${
              mode === "dots" ? "size-6 text-xs" : "size-2.5"
            }`}
          >
            {mode === "dots" ? i + 1 : null}
          </span>
          {/* narrow, wrapping labels keep the side columns clear of the parts they point at */}
          <span
            ref={(el) => register(id, "label", el)}
            className={`absolute left-0 top-0 w-max max-w-[14.5rem] items-center gap-2 rounded-2xl border border-stage-line bg-stage/85 py-1 pl-1 pr-3 text-sm font-medium leading-snug text-stage-text backdrop-blur ${
              mode === "dots" ? "hidden" : "flex"
            }`}
          >
            <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-stage-accent text-xs font-semibold tabular-nums text-stage">
              {i + 1}
            </span>
            <span>{design.labels[id].name}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
