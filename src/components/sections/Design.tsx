"use client";

import { useCallback, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { design as t } from "@/content/site";
import { Container, SectionHeading } from "@/components/ui/Section";
import { DesignVisual } from "@/components/visuals/DesignVisual";
import { useReducedMotion } from "@/lib/a11yPrefs";
import { useWebGLSupport } from "@/lib/webgl";
import { useIsCompact } from "@/lib/useMediaQuery";
import { PartsList } from "./PartsList";

/** Scroll → explode: hold assembled briefly, then 0 → 0.5 (covers off) → 1 (fully exploded). */
const toExplode = (p: number) => Math.min(1, Math.max(0, (p - 0.06) / 0.8));

export function Design() {
  const reduced = useReducedMotion();
  const webgl = useWebGLSupport();
  const compact = useIsCompact();
  return (
    <section id={t.id} aria-labelledby={`${t.id}-title`} className="stage relative">
      <Container className="pt-24 sm:pt-32">
        <SectionHeading id={t.id} eyebrow={t.eyebrow} title={t.title} intro={t.intro} stage />
      </Container>
      {reduced || !webgl ? <StaticViews compact={compact} /> : <ScrollExplode compact={compact} />}
      <Container className="pb-24 sm:pb-32">
        <PartsList />
      </Container>
    </section>
  );
}

function stageName(e: number) {
  if (e < 0.2) return t.stages.assembled;
  if (e < 0.7) return t.stages.half;
  return t.stages.full;
}

function ScrollExplode({ compact }: { compact: boolean }) {
  const track = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const getExplode = useCallback(() => toExplode(scrollYProgress.get()), [scrollYProgress]);
  const [stage, setStage] = useState<string>(t.stages.assembled);
  useMotionValueEvent(scrollYProgress, "change", (v) => setStage(stageName(toExplode(v))));

  return (
    <div ref={track} className={compact ? "h-[230svh]" : "h-[320svh]"}>
      <div className="sticky top-[4.5rem] h-[calc(100svh-4.5rem)]">
        <div className="mx-auto h-full max-w-7xl px-2 sm:px-8">
          <DesignVisual getExplode={getExplode} animate compact={compact} />
        </div>
        <p
          aria-hidden="true"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-stage-line bg-stage/80 px-4 py-2 text-sm font-medium text-stage-text backdrop-blur"
        >
          {t.currentStageLabel}: {stage}
        </p>
      </div>
    </div>
  );
}

/** Reduced motion or no WebGL: still assembled view and still exploded view, side by side. */
function StaticViews({ compact }: { compact: boolean }) {
  const assembled = useCallback(() => 0, []);
  const exploded = useCallback(() => 1, []);
  return (
    <Container className="pt-12">
      <div className="grid gap-6 lg:grid-cols-2">
        <figure className="card rounded-3xl border border-stage-line p-4">
          <div className="aspect-[4/3]">
            <DesignVisual getExplode={assembled} animate={false} compact={compact} labels={false} />
          </div>
          <figcaption className="mt-3 text-base font-medium">{t.stages.assembled}</figcaption>
        </figure>
        <figure className="card rounded-3xl border border-stage-line p-4">
          <div className="aspect-[4/3]">
            <DesignVisual getExplode={exploded} animate={false} compact={compact} labelMode="dots" still="exploded" />
          </div>
          <figcaption className="mt-3 text-base font-medium">{t.stages.full}</figcaption>
        </figure>
      </div>
    </Container>
  );
}
