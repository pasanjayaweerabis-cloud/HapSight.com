import { waitlist as t } from "@/content/site";
import { Container, SectionHeading } from "@/components/ui/Section";
import { RangeMarker, StageSlot } from "@/components/visuals/StageSlot";
import { WaitlistForm } from "./WaitlistForm";

export function Waitlist() {
  return (
    <section id={t.id} aria-labelledby={`${t.id}-title`} className="stage relative py-24 sm:py-32">
      <RangeMarker id="waitlist" />
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <div>
          <SectionHeading id={t.id} eyebrow={t.eyebrow} title={t.title} intro={t.intro} stage />
          {/* the device returns front-on here; one haptic pulse when you join */}
          <StageSlot id="waitlist" className="mt-10 hidden aspect-[4/3] w-full lg:block" />
        </div>
        {/* the form keeps the page's own (light or dark) theme colours, so every field stays readable */}
        <div className="on-surface self-start text-text">
          <WaitlistForm />
        </div>
      </Container>
    </section>
  );
}
