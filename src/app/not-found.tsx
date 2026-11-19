import { notFound as t } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { LogoMark } from "@/components/layout/Logo";

export default function NotFound() {
  return (
    <section className="stage stage-gradient grid min-h-[70dvh] place-items-center">
      <Container className="text-center">
        <LogoMark className="mx-auto size-12" />
        <h1 className="mt-6 text-4xl font-semibold tracking-tight">{t.title}</h1>
        <p className="mt-4 text-lg text-stage-muted">{t.body}</p>
        <div className="mt-8">
          <ButtonLink href="/" variant="stagePrimary">
            {t.back}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
