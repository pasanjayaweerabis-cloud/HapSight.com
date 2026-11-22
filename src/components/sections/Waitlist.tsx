import { waitlist as t } from "@/content/site";
import { Container, SectionHeading } from "@/components/ui/Section";
import { RangeMarker, StageSlot } from "@/components/visuals/StageSlot";
import { STILLS } from "@/components/visuals/Still";
import { WaitlistForm } from "./WaitlistForm";

export function Waitlist() {
  return (
    <section id={t.id} aria-labelledby={`${t.id}-title`} className="relative py-16 sm:py-20">
      <RangeMarker id="waitlist" />
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <div>
          <SectionHeading id={t.id} title={t.title} intro={t.intro} />
          {/* the device returns front-on here; one haptic pulse when you join. A soft panel keeps
              the charcoal glasses visible against a light background. The panel is opaque and sits
              above the canvas, so the slot is "front" (device drawn above the content here). The still fills it until the 3D
              view loads, and stays when there is no 3D (reduced motion, no WebGL). */}
          <div className="mt-10 hidden rounded-card bg-bg-soft lg:block">
            <StageSlot
              id="waitlist"
              className="aspect-[4/3] w-full"
              front
              backdrop={false}
              still={STILLS.assembled}
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          </div>
        </div>
        <div className="self-start">
          <WaitlistForm />
        </div>
      </Container>
    </section>
  );
}
