import { roadmap as t } from "@/content/site";
import { Container, SectionHeading } from "@/components/ui/Section";
import { RangeMarker, StageSlot } from "@/components/visuals/StageSlot";

/** Project status in plain words: an ordered list, so screen readers hear the sequence. */
export function Roadmap() {
  return (
    <section id={t.id} aria-labelledby={`${t.id}-title`} className="stage relative py-24 sm:py-32">
      <RangeMarker id="roadmap" />
      <Container>
        <div className="flex items-end justify-between gap-8">
          <SectionHeading id={t.id} eyebrow={t.eyebrow} title={t.title} intro={t.intro} stage />
          {/* the device parks here, small and slowly turning (desktop only) */}
          <StageSlot id="roadmap" className="hidden h-44 w-72 shrink-0 lg:block" />
        </div>
        <ol className="mt-14 grid gap-4 md:grid-cols-5">
          {t.steps.map((s) => (
            <li
              key={s.title}
              className={`glass relative rounded-3xl p-6 ${s.status === "now" ? "border-stage-accent!" : ""}`}
            >
              <p
                className={`text-sm font-semibold ${s.status === "next" ? "text-stage-muted" : "text-stage-accent"}`}
              >
                <span aria-hidden="true">{s.status === "done" ? "✓ " : s.status === "now" ? "● " : "○ "}</span>
                {t.statusLabels[s.status]}
              </p>
              <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em]">{s.title}</h3>
              <p className="mt-2 text-base text-stage-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
