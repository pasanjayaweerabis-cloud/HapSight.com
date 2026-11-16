import Link from "next/link";
import { brand, footer } from "@/content/site";
import { LogoMark } from "./Logo";

export function Footer() {
  const hasSocials = footer.socials.length > 0;
  return (
    <footer className="border-t border-line bg-bg-soft">
      <div
        className={`mx-auto grid max-w-[1160px] gap-10 px-5 py-14 sm:px-8 ${
          hasSocials ? "md:grid-cols-[1.4fr_1fr_1fr_1fr]" : "md:grid-cols-[1.6fr_1fr_1fr]"
        }`}
      >
        <div>
          <p className="flex items-center gap-3 text-xl font-semibold">
            <LogoMark /> {brand.name}
          </p>
          <p className="mt-4 max-w-md text-base text-muted">{footer.disclaimer}</p>
        </div>
        <div>
          <h2 className="text-base font-semibold">{footer.contactLabel}</h2>
          <p className="mt-3 text-base">
            {brand.contactEmail ? (
              <a href={`mailto:${brand.contactEmail}`} className="text-accent underline underline-offset-4">
                {brand.contactEmail}
              </a>
            ) : (
              <span className="text-muted">{footer.contactComingSoon}</span>
            )}
          </p>
        </div>
        {hasSocials ? (
          <div>
            <h2 className="text-base font-semibold">{footer.socialLabel}</h2>
            <ul className="mt-3 grid gap-2">
              {footer.socials.map((s) => (
                <li key={s.href}>
                  <a href={s.href} className="text-base text-accent underline underline-offset-4">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
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
        <p className="mx-auto max-w-[1160px] px-5 py-6 text-sm text-muted sm:px-8">{footer.credit}</p>
      </div>
    </footer>
  );
}
