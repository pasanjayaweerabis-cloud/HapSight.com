"use client";

import { useId, useState } from "react";
import { Icon } from "./Icon";

/**
 * WAI-ARIA accordion: each question is a heading containing a button with aria-expanded.
 * Panels stay in the DOM (hidden attribute) so in-page find still works when opened.
 */
export function Accordion({ items }: { items: { title: string; body: readonly string[] }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();

  return (
    <div className="divide-y divide-line">
      {items.map((item, i) => {
        const expanded = open === i;
        const btnId = `${base}-b${i}`;
        const panelId = `${base}-p${i}`;
        return (
          <div key={item.title}>
            <h3>
              <button
                id={btnId}
                type="button"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => setOpen(expanded ? null : i)}
                className="flex min-h-16 w-full items-center justify-between gap-6 px-6 py-5 text-left text-lg font-semibold sm:px-8 sm:text-xl"
              >
                {item.title}
                <span
                  aria-hidden="true"
                  className={`inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-line transition-transform duration-200 ${expanded ? "rotate-45" : ""}`}
                >
                  <Icon name="plus" className="size-5" />
                </span>
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={btnId} hidden={!expanded} className="px-6 pb-7 sm:px-8">
              {item.body.map((p) => (
                <p key={p} className="mt-3 max-w-measure text-lg text-muted first:mt-0">
                  {p}
                </p>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
