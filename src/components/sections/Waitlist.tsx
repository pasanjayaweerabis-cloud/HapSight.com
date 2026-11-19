import { waitlist as t } from "@/content/site";
import { Container, SectionHeading } from "@/components/ui/Section";
import { RangeMarker, StageSlot } from "@/components/visuals/StageSlot";
import { WaitlistForm } from "./WaitlistForm";

export function Waitlist() {
  return (
    <section id={t.id} aria-labelledby={`${t.id}-title`} className="relative py-24 sm:py-32">
      <RangeMarker id="waitlist" />
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <div>
          <SectionHeading id={t.id} title={t.title} intro={t.intro} />
          {/* the device returns front-on here; one haptic pulse when you join. A soft panel keeps
              the charcoal glasses visible against a light background. */}
          <div className="mt-10 hidden rounded-card bg-bg-soft lg:block">
            <StageSlot id="waitlist" className="aspect-[4/3] w-full" />
          </div>
        </div>
        <div className="self-start">
          <WaitlistForm />
        </div>
      </Container>
    </section>
  );
}
