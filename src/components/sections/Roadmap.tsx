import { roadmap as t, type RoadmapStatus } from "@/content/site";
import { Container, SectionHeading } from "@/components/ui/Section";
import { RangeMarker, StageSlot } from "@/components/visuals/StageSlot";
import { Reveal } from "@/components/ui/Reveal";

/** The step's status, as a node: filled teal (done), teal ring (now) or muted ring (next). */
/** `display` sets how it shows (default inline-flex); pass e.g. "hidden lg:inline-flex" to hide it. */
function Node({ status, display = "inline-flex" }: { status: RoadmapStatus; display?: string }) {
  if (status === "done") {
    return <span aria-hidden="true" className={`${display} size-3 shrink-0 rounded-full bg-stage-accent`} />;
  }
  return (
    <span
      aria-hidden="true"
      className={`${display} size-3 shrink-0 rounded-full border-2 ${
        status === "now" ? "border-stage-accent" : "border-stage-muted"
      }`}
    />
  );
}

/** Project status in plain words: an ordered list, so screen readers hear the sequence. */
export function Roadmap() {
  return (
    <section id={t.id} aria-labelledby={`${t.id}-title`} className="stage relative py-16 sm:py-20">
      <RangeMarker id="roadmap" />
      <Container>
        <div className="flex items-end justify-between gap-8">
          <SectionHeading id={t.id} eyebrow={t.eyebrow} title={t.title} intro={t.intro} stage />
          {/* the device parks here, small and slowly turning (desktop only) */}
          <StageSlot id="roadmap" className="hidden h-44 w-72 shrink-0 lg:block" />
        </div>
        {/* below lg: a vertical timeline, node + connecting line beside each card.
            at lg: a 3-column grid (3 + 2), 5 columns only on wide screens where each card still has
            a comfortable line length; the node moves inline with the status text. */}
        <ol className="mt-14 grid gap-4 lg:grid-cols-3 2xl:grid-cols-5">
          {t.steps.map((s, i) => (
            <li key={s.title} className="flex gap-4 lg:block">
              <div aria-hidden="true" className="flex w-3 shrink-0 flex-col items-center lg:hidden">
                <Node status={s.status} />
                {i < t.steps.length - 1 ? <span className="mt-1 w-px flex-1 bg-stage-line" /> : null}
              </div>
              <Reveal
                index={i}
                className={`glass relative flex-1 rounded-card p-6 ${s.status === "now" ? "border-stage-accent!" : ""}`}
              >
                <p
                  className={`flex items-center gap-2 text-label font-semibold ${s.status === "next" ? "text-stage-muted" : "text-stage-accent"}`}
                >
                  <Node status={s.status} display="hidden lg:inline-flex" />
                  {t.statusLabels[s.status]}
                </p>
                <h3 className="mt-3 text-card-sm font-semibold tracking-[-0.01em]">{s.title}</h3>
                <p className="mt-2 text-base text-stage-muted">{s.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
