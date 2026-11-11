import { audience as t } from "@/content/site";
import { Container, SectionHeading } from "@/components/ui/Section";

export function Audience() {
  return (
    <section id={t.id} aria-labelledby={`${t.id}-title`} className="py-24 sm:py-32">
      <Container>
        <SectionHeading id={t.id} eyebrow={t.eyebrow} title={t.title} />
        <ul className="mt-14 grid gap-5 md:grid-cols-3">
          {t.items.map((a, i) => (
            <li key={a.title} className="card rounded-3xl border border-line p-8">
              <p aria-hidden="true" className="text-sm font-semibold tabular-nums text-accent">
                0{i + 1}
              </p>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight">{a.title}</h3>
              <p className="mt-3 text-lg text-muted">{a.body}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
