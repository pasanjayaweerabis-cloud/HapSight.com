"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { design as t } from "@/content/site";
import { Container, SectionHeading } from "@/components/ui/Section";
import { ExplodeOverlay } from "@/components/visuals/ExplodeOverlay";
import { StageSlot, useStageEnabled, useStageSection } from "@/components/visuals/StageSlot";
import { STILLS, Still } from "@/components/visuals/Still";
import { useIsCompact, useMediaQuery } from "@/lib/useMediaQuery";
import type { LabelOverlayHandles } from "@/three/labelProjection";
import { designExplode } from "@/three/pageTimeline";
import { stageBus } from "@/three/stageBus";
import { PartsList } from "./PartsList";

export function Design() {
  const enabled = useStageEnabled();
  return (
    <section id={t.id} aria-labelledby={`${t.id}-title`} className="stage relative">
      <Container className="pt-24 sm:pt-32">
        <SectionHeading id={t.id} title={t.title} intro={t.intro} stage />
      </Container>
      {enabled ? <ScrollExplode /> : <StaticViews />}
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

/** Scroll scrubs the explode (half → full) on the shared device; numbered callouts follow the parts. */
function ScrollExplode() {
  const compact = useIsCompact();
  // side cards need room beside the device; below 1024px the numbered dots + parts list are clearer
  const narrow = useMediaQuery("(max-width: 1023px)");
  const track = useRef<HTMLDivElement>(null);
  const overlay = useRef<LabelOverlayHandles>(null);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const [stage, setStage] = useState<string>(t.stages.assembled);
  useMotionValueEvent(scrollYProgress, "change", (v) => setStage(stageName(designExplode(v))));
  useStageSection("design", track, "pin");
  useEffect(() => {
    stageBus.setOverlay(overlay);
    return () => stageBus.setOverlay(null);
  }, []);

  return (
    <div ref={track} className={compact ? "h-[240svh]" : "h-[320svh]"}>
      <div className="sticky top-[4.5rem] h-[calc(100svh-4.5rem)]">
        <div className="mx-auto h-full max-w-[max(80rem,92vw)] px-2 sm:px-8">
          <StageSlot id="design" className="size-full">
            <ExplodeOverlay ref={overlay} mode={narrow ? "dots" : "callouts"} />
          </StageSlot>
        </div>
        <p
          aria-hidden="true"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-stage-line bg-stage/80 px-4 py-2 text-label font-medium text-stage-text backdrop-blur"
        >
          {t.currentStageLabel}: {stage}
        </p>
      </div>
    </div>
  );
}

/** Reduced motion or no WebGL: still assembled view and still exploded view, side by side. */
function StaticViews() {
  return (
    <Container className="pt-12">
      <div className="grid gap-6 lg:grid-cols-2">
        {[
          { src: STILLS.assembled, caption: t.stages.assembled },
          { src: STILLS.exploded, caption: t.stages.full },
        ].map((v) => (
          <figure key={v.src} className="glass rounded-card p-4">
            <div aria-hidden="true" className="relative aspect-[4/3]">
              <Still src={v.src} sizes="(min-width: 1024px) 45vw, 100vw" />
            </div>
            <figcaption className="mt-3 text-base font-medium">{v.caption}</figcaption>
          </figure>
        ))}
      </div>
    </Container>
  );
}
