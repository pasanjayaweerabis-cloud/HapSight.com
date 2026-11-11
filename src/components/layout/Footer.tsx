import Link from "next/link";
import { brand, footer } from "@/content/site";
import { LogoMark } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-line bg-bg-soft">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="flex items-center gap-3 text-xl font-semibold">
            <LogoMark /> {brand.name}
          </p>
          <p className="mt-4 max-w-md text-base text-muted">{footer.disclaimer}</p>
          <p className="mt-3 text-sm text-muted">{footer.nameNote}</p>
        </div>
        <div>
          <h2 className="text-base font-semibold">{footer.contactLabel}</h2>
          <p className="mt-3">
            <a href={`mailto:${brand.contactEmail}`} className="text-base text-accent underline underline-offset-4">
              {brand.contactEmail}
            </a>
          </p>
        </div>
        <div>
          <h2 className="text-base font-semibold">{footer.socialLabel}</h2>
          <ul className="mt-3 grid gap-2 text-base text-muted">
            {footer.socials.map((s) => (
              <li key={s.label}>
                {s.label} <span className="text-sm">({s.note})</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-base font-semibold">{footer.legalLabel}</h2>
          <ul className="mt-3 grid gap-2">
            {footer.links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-base text-accent underline underline-offset-4">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-7xl px-5 py-6 text-sm text-muted sm:px-8">{footer.credit}</p>
      </div>
    </footer>
  );
}
