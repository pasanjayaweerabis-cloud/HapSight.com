import { hero as t } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { RangeMarker, StageSlot } from "@/components/visuals/StageSlot";
import { STILLS } from "@/components/visuals/Still";

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="stage stage-gradient relative overflow-hidden">
      <RangeMarker id="hero" />
      {/* Phones: headline, then the device, then the details, so the glasses are on the first screen.
          Desktop: text on the left (two rows), device on the right spanning both. */}
      <Container className="grid items-center gap-x-4 pb-14 pt-10 sm:pt-16 lg:min-h-[calc(100svh-4.5rem)] lg:grid-cols-[1fr_1.15fr] lg:grid-rows-[auto_auto] lg:content-center lg:py-10">
        <div className="hero-rise relative z-10 max-w-xl lg:col-start-1 lg:row-start-1 lg:self-end">
          <p className="kicker text-stage-accent">{t.eyebrow}</p>
          <h1
            id="hero-title"
            className="mt-4 text-balance text-[2.75rem] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-6xl lg:text-7xl"
          >
            {t.headline}
          </h1>
        </div>
        <div className="hero-rise hero-rise-2 relative z-10 order-3 max-w-xl lg:order-none lg:col-start-1 lg:row-start-2 lg:self-start">
          <p className="mt-5 max-w-[34ch] text-pretty text-lg leading-relaxed text-stage-muted sm:text-xl lg:mt-6 lg:text-[1.375rem]">{t.sub}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:mt-10">
            <ButtonLink href={t.primaryCta.href} variant="stagePrimary">
              {t.primaryCta.label}
            </ButtonLink>
            <ButtonLink href={t.secondaryCta.href} variant="stageSecondary">
              {t.secondaryCta.label}
            </ButtonLink>
          </div>
        </div>
        {/* the one 3D device starts here (decorative; described in text below) */}
        <StageSlot
          id="hero"
          still={STILLS.hero}
          sizes="(min-width: 1024px) 55vw, 100vw"
          preload
          label={t.visualLabel}
          className="order-2 -mx-5 -my-2 aspect-[16/9] sm:mx-0 sm:aspect-[2/1] lg:order-none lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:aspect-square"
        />
      </Container>

      <Container className="pb-16 sm:pb-20">
        <div className="max-w-4xl border-t border-stage-line pt-8">
          <h2 className="text-card font-semibold tracking-[-0.01em]">{t.deviceDescriptionTitle}</h2>
          <p className="mt-3 max-w-measure text-base text-stage-muted sm:text-lg">{t.deviceDescription}</p>
        </div>
      </Container>
    </section>
  );
}
