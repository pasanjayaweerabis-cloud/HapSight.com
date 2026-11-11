import { notFound as t } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";

export default function NotFound() {
  return (
    <Container className="py-28">
      <h1 className="text-4xl font-semibold tracking-tight">{t.title}</h1>
      <p className="mt-4 text-lg text-muted">{t.body}</p>
      <div className="mt-8">
        <ButtonLink href="/">{t.back}</ButtonLink>
      </div>
    </Container>
  );
}
