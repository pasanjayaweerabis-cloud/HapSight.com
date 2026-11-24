import { design as t, type LabelId, type PartGroup } from "@/content/site";

const GROUP_ORDER = Object.keys(t.groups) as PartGroup[];

/** The accessible text version of the exploded view: every labelled part, in words, grouped by
 *  where it sits on the device. Numbering continues across groups and matches the 3D callouts,
 *  which number from the same `Object.keys(design.labels)` order. */
export function PartsList() {
  const ids = Object.keys(t.labels) as LabelId[];
  const groups = GROUP_ORDER.map((group) => ids.filter((id) => t.labels[id].group === group));
  const starts = groups.map((_, i) => 1 + groups.slice(0, i).reduce((sum, g) => sum + g.length, 0));
  return (
    <div className="mt-14 grid gap-10 lg:grid-cols-[2fr_1fr]">
      <div>
        <h3 className="text-card-sm font-semibold">{t.listTitle}</h3>
        <div className="mt-5 grid gap-6 md:grid-cols-2">
          {GROUP_ORDER.map((group, gi) => {
            const groupIds = groups[gi];
            const start = starts[gi];
            return (
              <div key={group}>
                <h4 className="text-base font-semibold text-stage-muted">{t.groups[group]}</h4>
                <ol start={start} className="mt-3 grid gap-6">
                  {groupIds.map((id, i) => (
                    <li key={id} className="flex gap-4">
                      <span
                        aria-hidden="true"
                        className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-stage-accent text-sm font-semibold tabular-nums text-stage-accent"
                      >
                        {start + i}
                      </span>
                      <span className="max-w-measure">
                        <span className="block font-semibold">{t.labels[id].name}</span>
                        <span className="block text-base text-stage-muted">{t.labels[id].where}</span>
                        <span className="mt-1.5 block text-base text-stage-text/90">{t.labels[id].description}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <h3 className="text-card-sm font-semibold">{t.otherPartsTitle}</h3>
        <ul className="mt-5 grid gap-3 text-base text-stage-muted">
          {t.otherParts.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <p className="mt-8 rounded-xl border border-stage-line p-4 text-base font-medium">{t.note}</p>
      </div>
    </div>
  );
}
