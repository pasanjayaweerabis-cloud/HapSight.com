import { hero as t } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { HeroVisual } from "@/components/visuals/HeroVisual";

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="stage stage-gradient relative overflow-hidden">
      <Container className="grid items-center gap-8 pb-16 pt-14 sm:pt-20 lg:min-h-[calc(100svh-4.5rem)] lg:grid-cols-[1fr_1.15fr] lg:gap-4 lg:py-10">
        <div className="relative z-10 max-w-xl">
          <p className="kicker text-stage-accent">{t.eyebrow}</p>
          <h1
            id="hero-title"
            className="mt-5 text-balance text-5xl font-semibold leading-[0.97] tracking-[-0.06em] sm:text-6xl lg:text-7xl"
          >
            {t.headline}
          </h1>
          <p className="mt-6 text-pretty text-xl text-stage-muted sm:text-2xl">{t.sub}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href={t.primaryCta.href} variant="stagePrimary">
              {t.primaryCta.label}
            </ButtonLink>
            <ButtonLink href={t.secondaryCta.href} variant="stageSecondary">
              {t.secondaryCta.label}
            </ButtonLink>
          </div>
        </div>
        <div className="relative -mx-5 aspect-[4/3] sm:mx-0 lg:aspect-square">
          <HeroVisual />
          {/* Pointer-only hint; screen reader users get the written description below. */}
          <p aria-hidden="true" className="absolute bottom-2 left-1/2 hidden -translate-x-1/2 text-sm text-stage-muted lg:block">
            {t.canvasHint}
          </p>
        </div>
      </Container>

      <Container className="pb-16 sm:pb-20">
        <div className="max-w-4xl border-t border-stage-line pt-8">
          <h2 className="text-lg font-semibold">{t.deviceDescriptionTitle}</h2>
          <p className="mt-3 text-base text-stage-muted sm:text-lg">{t.deviceDescription}</p>
        </div>
      </Container>
    </section>
  );
}
