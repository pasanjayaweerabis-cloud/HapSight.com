import { faq as t } from "@/content/site";
import { Container, SectionHeading } from "@/components/ui/Section";
import { Accordion } from "@/components/ui/Accordion";

export function Faq() {
  return (
    <section id={t.id} aria-labelledby={`${t.id}-title`} className="bg-bg-soft py-16 sm:py-20">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
        <SectionHeading id={t.id} title={t.title} />
        <Accordion items={t.items.map((i) => ({ title: i.q, body: i.a }))} />
      </Container>
    </section>
  );
}
