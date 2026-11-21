"use client";

import { useRef, useState } from "react";
import { design, explore as t, type LabelId } from "@/content/site";
import { Container, SectionHeading } from "@/components/ui/Section";
import { LazyStage } from "@/components/visuals/LazyStage";
import { Still, STILLS } from "@/components/visuals/Still";
import { useStageEnabled } from "@/components/visuals/StageSlot";
import { useIsCompact } from "@/lib/useMediaQuery";
import {
  INTERNAL_PARTS,
  LAYER_EXPLODE,
  LAYER_IDS,
  VIEW_IDS,
  type ExploreSceneProps,
  type LayerId,
  type ViewId,
} from "@/three/exploreConfig";

const loadScene = () => import("@/three/ExploreScene");
const LABEL_IDS = Object.keys(design.labels) as LabelId[];

const chip = (on: boolean) =>
  `rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
    on
      ? "border-stage-cta bg-stage-cta text-stage-cta-text"
      : "border-stage-line text-stage-text hover:border-stage-accent hover:text-stage-accent"
  }`;

const iconBtn =
  "grid size-10 place-items-center rounded-full border border-stage-line bg-stage/70 text-stage-text backdrop-blur transition-colors hover:border-stage-accent hover:text-stage-accent";

/**
 * "Explore in 3D": the real device model on its own canvas. Drag to turn it, pinch or press the
 * zoom buttons, pick a view, a layer (assembled / covers off / exploded) or a part, and the camera
 * flies there while the other parts fade back. Without 3D (reduced motion, no WebGL) it shows the
 * still and the same part descriptions.
 */
export function Explore() {
  const enabled = useStageEnabled();
  const compact = useIsCompact();
  const [view, setView] = useState<ViewId>("angle");
  const [layer, setLayer] = useState<LayerId>("assembled");
  const [focus, setFocus] = useState<LabelId | null>(null);
  const [zoom, setZoom] = useState<ExploreSceneProps["zoom"]>({ n: 0, dir: 1 });
  const [resetN, setResetN] = useState(0);
  /** The visitor turned or zoomed the camera by hand. */
  const [moved, setMoved] = useState(false);
  const changed = moved || view !== "angle" || layer !== "assembled" || focus !== null;
  /** Bumped on every change, so the reset button's pulse restarts each time. */
  const [pulse, setPulse] = useState(0);
  const bump = () => setPulse((n) => n + 1);
  const lastWheel = useRef(0);

  const pickPart = (id: LabelId | null) => {
    bump();
    setFocus(id);
    if (id && INTERNAL_PARTS.includes(id) && layer === "assembled") setLayer("full");
  };
  const pickView = (v: ViewId) => {
    bump();
    setFocus(null);
    setView(v);
  };
  const zoomBy = (dir: 1 | -1) => {
    setMoved(true);
    bump();
    setZoom((z) => ({ n: z.n + 1, dir }));
  };
  const reset = () => {
    setFocus(null);
    setView("angle");
    setLayer("assembled");
    setMoved(false);
    setResetN((n) => n + 1);
  };

  const detail = focus ? design.labels[focus] : null;
  const sceneProps: ExploreSceneProps = { view, explode: LAYER_EXPLODE[layer], focus, zoom, resetN, compact };

  return (
    <section id={t.id} aria-labelledby={`${t.id}-title`} className="stage stage-gradient py-20 sm:py-28">
      <Container>
        <SectionHeading id={t.id} eyebrow={t.eyebrow} title={t.title} intro={enabled ? t.intro : undefined} stage />

        <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-6">
          <div
            className="relative aspect-square overflow-hidden rounded-card border border-stage-line sm:aspect-[16/10] lg:sticky lg:top-24 lg:aspect-auto lg:h-[min(80svh,44rem)] lg:self-start"
            style={{ background: "var(--panel-glow)" }}
          >
            {enabled ? (
              <div
                className="absolute inset-0"
                onPointerDown={() => {
                  setMoved(true);
                  bump();
                }}
                onWheel={() => {
                  setMoved(true);
                  // restart the reset button's pulse at most every 0.8 s while zooming
                  const now = performance.now();
                  if (now - lastWheel.current > 800) bump();
                  lastWheel.current = now;
                }}
              >
                <LazyStage
                  load={loadScene}
                  sceneProps={sceneProps}
                  fallback={<Still src={STILLS.assembled} sizes="(min-width: 1024px) 60vw, 100vw" />}
                />
              </div>
            ) : (
              <Still src={STILLS.assembled} sizes="(min-width: 1024px) 60vw, 100vw" />
            )}

            {enabled ? (
              <>
                <div role="group" aria-label={t.viewsLabel} className="absolute left-3 top-3 flex flex-wrap gap-2 sm:left-4 sm:top-4">
                  {VIEW_IDS.map((v) => (
                    <button key={v} type="button" aria-pressed={!focus && view === v} onClick={() => pickView(v)} className={chip(!focus && view === v)}>
                      {t.views[v]}
                    </button>
                  ))}
                </div>
                <p aria-hidden="true" className="pointer-events-none absolute bottom-4 left-4 text-xs uppercase tracking-[0.14em] text-stage-muted">
                  [ {t.hint} ]
                </p>
                <div className="absolute bottom-3 right-3 flex gap-2 sm:bottom-4 sm:right-4">
                  <button type="button" aria-label={t.zoomOut} className={iconBtn} onClick={() => zoomBy(-1)}>
                    <span aria-hidden="true" className="text-xl leading-none">−</span>
                  </button>
                  <button type="button" aria-label={t.zoomIn} className={iconBtn} onClick={() => zoomBy(1)}>
                    <span aria-hidden="true" className="text-xl leading-none">+</span>
                  </button>
                  {/* Text button that lights up (teal, soft pulse) whenever the view differs from the start. */}
                  <button
                    key={changed ? pulse : "idle"}
                    type="button"
                    onClick={reset}
                    aria-disabled={!changed}
                    data-changed={changed || undefined}
                    className={`reset-view flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold backdrop-blur transition-colors duration-300 ${
                      changed
                        ? "border-stage-cta bg-stage-cta text-stage-cta-text hover:bg-stage-accent-2"
                        : "border-stage-line bg-stage/70 text-stage-muted"
                    }`}
                  >
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                      <path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4" />
                    </svg>
                    {t.reset}
                  </button>
                </div>
              </>
            ) : null}
          </div>

          <div className="glass flex flex-col gap-6 rounded-card p-5 sm:p-6">
            {enabled ? (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-stage-muted">{t.layersLabel}</h3>
                <div role="group" aria-label={t.layersLabel} className="mt-3 flex flex-wrap gap-2">
                  {LAYER_IDS.map((l) => (
                    <button key={l} type="button" aria-pressed={layer === l} onClick={() => {
                        bump();
                        setLayer(l);
                      }} className={chip(layer === l)}>
                      {design.stages[l]}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-stage-muted">{t.fallbackNote}</p>
            )}

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-stage-muted">{t.partsLabel}</h3>
              <div role="group" aria-label={t.partsLabel} className="mt-3 flex flex-wrap gap-2">
                <button type="button" aria-pressed={focus === null} onClick={() => pickPart(null)} className={chip(focus === null)}>
                  {t.allParts}
                </button>
                {LABEL_IDS.map((id) => (
                  <button key={id} type="button" aria-pressed={focus === id} onClick={() => pickPart(id)} className={chip(focus === id)}>
                    {shortName(design.labels[id].name)}
                  </button>
                ))}
              </div>
            </div>

            <div aria-live="polite" className="mt-auto border-t border-stage-line pt-5">
              <p className="text-lg font-semibold">{detail ? detail.name : t.allParts}</p>
              {detail ? <p className="mt-1 text-sm text-stage-accent">{detail.where}</p> : null}
              <p className="mt-2 text-pretty text-stage-muted">{detail ? detail.description : t.allPartsDescription}</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/** "Controller (ESP32-C3 SuperMini)" → "Controller" for the chips; the full name shows below. */
const shortName = (name: string) => name.replace(/\s*\(.*\)\s*$/, "");
