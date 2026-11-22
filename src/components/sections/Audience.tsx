import { audience as t } from "@/content/site";
import { Container, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export function Audience() {
  const [first, ...rest] = t.items;
  return (
    <section id={t.id} aria-labelledby={`${t.id}-title`} className="py-16 sm:py-20">
      <Container>
        <SectionHeading id={t.id} title={t.title} />
        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <Reveal index={0}>
            <h3 className="text-3xl font-semibold tracking-[-0.01em]">{first.title}</h3>
            <p className="mt-4 text-xl text-muted">{first.body}</p>
          </Reveal>
          <div className="divide-y divide-line">
            {rest.map((a, i) => (
              <Reveal key={a.title} index={i + 1} className="py-6 first:pt-0 last:pb-0">
                <h3 className="text-xl font-semibold tracking-[-0.01em]">{a.title}</h3>
                <p className="mt-2 text-lg text-muted">{a.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
