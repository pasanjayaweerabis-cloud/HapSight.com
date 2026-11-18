"use client";

import { useImperativeHandle, useRef } from "react";
import { design, type LabelId } from "@/content/site";
import type { LabelOverlayHandles } from "@/three/labelProjection";

const LABEL_ORDER = Object.keys(design.labels) as LabelId[];

/** "Battery (LiPo 3.7 V, 500 mAh)" -> title "Battery", detail "LiPo 3.7 V, 500 mAh". */
function splitName(name: string) {
  const m = /^(.*?)\s*\((.+)\)$/.exec(name);
  return m ? { title: m[1], detail: m[2] } : { title: name, detail: "" };
}

/**
 * Floating part labels for the exploded view. The 3D scene writes their positions directly.
 * Decorative duplicate: the same labels are in the accessible parts list below the view.
 */
export function ExplodeOverlay({ ref, mode }: { ref: React.Ref<LabelOverlayHandles>; mode: "callouts" | "dots" }) {
  const container = useRef<HTMLDivElement>(null);
  const items = useRef(new Map<LabelId, { label: HTMLElement; line: SVGPathElement; dot: HTMLElement }>());
  const parts = useRef(new Map<LabelId, { label?: HTMLElement; line?: SVGPathElement; dot?: HTMLElement }>());

  const register = (id: LabelId, key: "label" | "line" | "dot", el: HTMLElement | SVGPathElement | null) => {
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
      mode,
      setOpacity: (o: number) => {
        const el = container.current;
        if (!el) return;
        el.style.opacity = String(o);
        el.style.visibility = o < 0.01 ? "hidden" : "visible";
      },
    }),
    [mode],
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
          <path
            key={id}
            ref={(el) => register(id, "line", el)}
            fill="none"
            stroke="var(--stage-accent)"
            strokeWidth={1.5}
            strokeOpacity={0.8}
            strokeLinejoin="round"
            strokeLinecap="round"
            className={mode === "dots" ? "hidden" : ""}
          />
        ))}
      </svg>
      {LABEL_ORDER.map((id, i) => {
        const { title, detail } = splitName(design.labels[id].name);
        return (
          <div key={id}>
            <span
              ref={(el) => register(id, "dot", el)}
              className={`absolute left-0 top-0 flex items-center justify-center rounded-full font-semibold tabular-nums ${
                mode === "dots"
                  ? "size-6 border border-stage-accent bg-stage text-xs text-stage-accent"
                  : "size-2.5 bg-stage-accent shadow-[0_0_0_3px_color-mix(in_srgb,var(--stage-accent)_22%,transparent)]"
              }`}
            >
              {mode === "dots" ? i + 1 : null}
            </span>
            {/* equal-width cards so both columns line up; the scene stacks them with even gaps */}
            <span
              ref={(el) => register(id, "label", el)}
              className={`absolute left-0 top-0 w-[11.25rem] items-center gap-2.5 rounded-2xl border-[1.5px] border-stage-accent/60 bg-stage/90 py-2 pl-2 pr-3 text-stage-text backdrop-blur xl:w-[13.5rem] xl:gap-3 xl:py-2.5 xl:pl-2.5 xl:pr-3.5 ${
                mode === "dots" ? "hidden" : "flex"
              }`}
            >
              <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-stage-accent text-xs font-bold tabular-nums text-stage xl:size-8 xl:text-sm">
                {i + 1}
              </span>
              <span className="min-w-0 leading-tight">
                <span className="block text-sm font-semibold xl:text-[0.9375rem]">{title}</span>
                {detail ? <span className="mt-0.5 block text-xs text-stage-muted xl:text-[0.8125rem]">{detail}</span> : null}
              </span>
            </span>
          </div>
        );
      })}
    </div>
  );
}
