"use client";

import { useRef, useState } from "react";
import { design, explore as t, type LabelId } from "@/content/site";
import { Container, SectionHeading } from "@/components/ui/Section";
import { LazyStage } from "@/components/visuals/LazyStage";
import { Still, STILLS } from "@/components/visuals/Still";
import { useStageEnabled } from "@/components/visuals/StageSlot";
import { useIsCompact } from "@/lib/useMediaQuery";
import {
  ACTION_IDS,
  LAYER_EXPLODE,
  LAYER_IDS,
  type ActionId,
  type ExploreSceneProps,
  type LayerId,
} from "@/three/exploreConfig";

const loadScene = () => import("@/three/ExploreScene");
const LABEL_IDS = Object.keys(design.labels) as LabelId[];

const chip = (on: boolean) =>
  `inline-flex min-h-11 items-center rounded-full border px-4 text-label font-medium transition-colors ${
    on
      ? "border-stage-cta bg-stage-cta text-stage-cta-text"
      : "border-stage-line text-stage-text hover:border-stage-accent hover:text-stage-accent"
  }`;

const iconBtn =
  "grid size-11 place-items-center rounded-full border border-stage-line bg-stage/70 text-stage-text backdrop-blur transition-colors hover:border-stage-accent hover:text-stage-accent";

/**
 * "Explore in 3D": the real device model on its own canvas. Drag to turn it, pinch or press the
 * zoom buttons. Click a part on the model (or pick it from the list) and just that area opens up
 * while the camera flies in and the other parts fade back. The demo buttons play how a warning
 * works (beams, an obstacle, the matching ear motor). Without 3D (reduced motion, no WebGL) it
 * shows the still and the same part descriptions.
 */
export function Explore() {
  const enabled = useStageEnabled();
  const compact = useIsCompact();
  const [action, setAction] = useState<ActionId | null>(null);
  const [layer, setLayer] = useState<LayerId>("assembled");
  const [focus, setFocus] = useState<LabelId | null>(null);
  const [zoom, setZoom] = useState<ExploreSceneProps["zoom"]>({ n: 0, dir: 1 });
  const [resetN, setResetN] = useState(0);
  /** The visitor turned or zoomed the camera by hand. */
  const [moved, setMoved] = useState(false);
  const changed = moved || action !== null || layer !== "assembled" || focus !== null;
  /** Bumped on every change, so the reset button's pulse restarts each time. */
  const [pulse, setPulse] = useState(0);
  const bump = () => setPulse((n) => n + 1);
  const lastWheel = useRef(0);

  /** Opens one part's area (the scene brings out just those parts); stops any demo. */
  const pickPart = (id: LabelId | null) => {
    bump();
    setAction(null);
    setFocus(id);
  };
  /** Demos run on the assembled glasses; pressing the playing demo again stops it. */
  const pickAction = (a: ActionId) => {
    bump();
    setFocus(null);
    setLayer("assembled");
    setAction((cur) => (cur === a ? null : a));
  };
  const pickLayer = (l: LayerId) => {
    bump();
    setAction(null);
    setLayer(l);
  };
  const zoomBy = (dir: 1 | -1) => {
    setMoved(true);
    bump();
    setZoom((z) => ({ n: z.n + 1, dir }));
  };
  const reset = () => {
    setFocus(null);
    setAction(null);
    setLayer("assembled");
    setMoved(false);
    setResetN((n) => n + 1);
  };

  const detail = focus ? design.labels[focus] : null;
  const demo = action ? t.actions[action] : null;
  const sceneProps: ExploreSceneProps = {
    action,
    explode: LAYER_EXPLODE[layer],
    focus,
    zoom,
    resetN,
    compact,
    onPick: pickPart,
  };

  /** Demo buttons: on the 3D box from 640px up, at the top of the side panel on phones. */
  const demoButtons = (className: string) => (
    <div role="group" aria-label={t.actionsLabel} className={className}>
      {ACTION_IDS.map((a) => (
        <button key={a} type="button" aria-pressed={action === a} onClick={() => pickAction(a)} className={chip(action === a)}>
          {t.actions[a].label}
        </button>
      ))}
    </div>
  );

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
                {demoButtons("absolute left-4 right-4 top-4 hidden flex-wrap gap-2 sm:flex")}
                <p aria-hidden="true" className="pointer-events-none absolute bottom-4 left-4 hidden max-w-[calc(100%-17rem)] text-label text-stage-muted md:block">
                  {t.hint}
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
                    className={`reset-view flex h-11 items-center gap-2 rounded-full border px-4 text-label font-semibold backdrop-blur transition-colors duration-300 ${
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
            {/* phones: demo buttons first (they don't fit on the small 3D box) */}
            {enabled ? (
              <div className="order-first sm:hidden">
                <h3 className="text-label font-semibold text-stage-muted">{t.actionsLabel}</h3>
                {demoButtons("mt-3 flex flex-wrap gap-2")}
              </div>
            ) : null}
            {enabled ? (
              <div>
                <h3 className="text-label font-semibold text-stage-muted">{t.layersLabel}</h3>
                <div role="group" aria-label={t.layersLabel} className="mt-3 flex flex-wrap gap-2">
                  {LAYER_IDS.map((l) => (
                    <button key={l} type="button" aria-pressed={!action && layer === l} onClick={() => pickLayer(l)} className={chip(!action && layer === l)}>
                      {design.stages[l]}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-label text-stage-muted">{t.fallbackNote}</p>
            )}

            <div>
              <h3 className="text-label font-semibold text-stage-muted">{t.partsLabel}</h3>
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

            {/* What is shown now (demo, part or whole device). Below 1024px it sits near the top of
                the panel, so tapping a part on the model shows its text without scrolling. */}
            <div
              aria-live="polite"
              className="order-first border-b border-stage-line pb-5 lg:order-none lg:mt-auto lg:border-b-0 lg:border-t lg:pb-0 lg:pt-5"
            >
              <p className="text-card-sm font-semibold">{demo ? demo.title : detail ? detail.name : t.allParts}</p>
              {detail && !demo ? <p className="mt-1 text-label text-stage-accent">{detail.where}</p> : null}
              <p className="mt-2 text-pretty text-stage-muted">
                {demo ? demo.body : detail ? detail.description : t.allPartsDescription}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/** "Controller (ESP32-C3 SuperMini)" → "Controller" for the chips; the full name shows below. */
const shortName = (name: string) => name.replace(/\s*\(.*\)\s*$/, "");
