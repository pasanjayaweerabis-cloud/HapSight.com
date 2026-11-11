import { design as t, type LabelId } from "@/content/site";

/** The accessible text version of the exploded view: every labelled part, in words. */
export function PartsList() {
  const ids = Object.keys(t.labels) as LabelId[];
  return (
    <div className="mt-14 grid gap-10 lg:grid-cols-[2fr_1fr]">
      <div>
        <h3 className="text-xl font-semibold">{t.listTitle}</h3>
        <ol className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {ids.map((id, i) => (
            <li key={id} className="flex gap-4">
              <span
                aria-hidden="true"
                className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-stage-accent text-sm font-semibold tabular-nums text-stage-accent"
              >
                {i + 1}
              </span>
              <span>
                <span className="block font-semibold">{t.labels[id].name}</span>
                <span className="block text-base text-stage-muted">{t.labels[id].where}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
      <div>
        <h3 className="text-xl font-semibold">{t.otherPartsTitle}</h3>
        <ul className="mt-5 grid gap-3 text-base text-stage-muted">
          {t.otherParts.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <p className="mt-8 rounded-2xl border border-stage-line p-4 text-base font-medium">{t.note}</p>
      </div>
    </div>
  );
}
