import { waitlist as t } from "@/content/site";
import { Container, SectionHeading } from "@/components/ui/Section";
import { WaitlistForm } from "./WaitlistForm";

export function Waitlist() {
  return (
    <section id={t.id} aria-labelledby={`${t.id}-title`} className="relative py-24 sm:py-32">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <SectionHeading id={t.id} eyebrow={t.eyebrow} title={t.title} intro={t.intro} />
        <WaitlistForm />
      </Container>
    </section>
  );
}
