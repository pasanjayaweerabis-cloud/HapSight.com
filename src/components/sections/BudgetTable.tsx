import { design } from "@/content/site";

const t = design.budget;

/** Prototype parts cost: a real table, so screen readers can move by row and column. */
export function BudgetTable() {
  return (
    <div className="mt-14 max-w-3xl">
      <h3 className="text-xl font-semibold">
        {t.title}
      </h3>
      <div className="mt-5 overflow-hidden rounded-3xl border border-stage-line">
        <table className="w-full border-collapse text-left text-base">
          <caption className="sr-only">{t.caption}</caption>
          <thead>
            <tr className="border-b border-stage-line">
              <th scope="col" className="px-5 py-3 font-semibold">
                {t.columns.part}
              </th>
              <th scope="col" className="px-5 py-3 text-right font-semibold">
                {t.columns.qty}
              </th>
              <th scope="col" className="px-5 py-3 text-right font-semibold">
                {t.columns.cost}
              </th>
            </tr>
          </thead>
          <tbody>
            {t.rows.map((r) => (
              <tr key={r.part} className="border-b border-stage-line/60">
                <th scope="row" className="px-5 py-3 font-normal text-stage-text">
                  {r.part}
                </th>
                <td className="px-5 py-3 text-right tabular-nums text-stage-muted">{r.qty}</td>
                <td className="px-5 py-3 text-right tabular-nums text-stage-muted">{r.cost}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" className="px-5 py-3 font-semibold">
                {t.total.label}
              </th>
              <td className="px-5 py-3" />
              <td className="px-5 py-3 text-right font-semibold tabular-nums text-stage-accent">{t.total.cost}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <p className="mt-3 text-sm text-stage-muted">{t.footnote}</p>
    </div>
  );
}
