import type { Metadata } from "next";
import { accessibilityPage as t } from "@/content/site";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: t.title,
  description: t.metaDescription,
  alternates: { canonical: "/accessibility" },
};

export default function AccessibilityPage() {
  const r = t.results;
  return (
    <LegalPage title={t.title} updated={t.updated} sections={t.sections}>
      <section>
        <h2>{r.heading}</h2>
        <p>{r.tested}</p>
        <div className="mt-6 overflow-x-auto rounded-xl border border-line" tabIndex={0} role="region" aria-label={r.caption}>
          <table className="w-full border-collapse text-left text-base">
            <caption className="sr-only">{r.caption}</caption>
            <thead>
              <tr className="border-b border-line bg-bg-soft">
                <th scope="col" className="px-4 py-3 font-semibold">{r.columns.check}</th>
                <th scope="col" className="px-4 py-3 font-semibold">{r.columns.result}</th>
                <th scope="col" className="px-4 py-3 font-semibold">{r.columns.notes}</th>
              </tr>
            </thead>
            <tbody>
              {r.rows.map((row) => (
                <tr key={row.check} className="border-b border-line last:border-b-0">
                  <th scope="row" className="px-4 py-3 align-top font-medium">{row.check}</th>
                  <td className="px-4 py-3 align-top font-semibold whitespace-nowrap">{row.result}</td>
                  <td className="px-4 py-3 align-top text-muted">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </LegalPage>
  );
}
