"use client";

import { useId, useRef } from "react";
import { a11yPanel as t } from "@/content/site";
import { resetPrefs, setPrefs, useA11yPrefs, type ThemePref } from "@/lib/a11yPrefs";
import { Icon } from "@/components/ui/Icon";

/**
 * Accessibility settings in a native modal <dialog>: the browser handles the focus trap,
 * Escape to close, and making the rest of the page inert while it is open.
 */
export function A11yPanel() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const prefs = useA11yPrefs();
  const titleId = useId();
  const introId = useId();

  const open = () => dialogRef.current?.showModal();
  const close = () => dialogRef.current?.close();

  return (
    <>
      <button
        ref={openerRef}
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        className="inline-flex size-12 items-center justify-center rounded-full border border-stage-line text-stage-text transition-colors hover:border-stage-line-strong hover:bg-stage-surface-2"
      >
        <Icon name="a11y" />
        <span className="sr-only">{t.open}</span>
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        aria-describedby={introId}
        onClose={() => openerRef.current?.focus()}
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
        className="card on-surface m-auto w-[min(92vw,28rem)] rounded-card border border-line bg-surface p-0 text-text shadow-2xl backdrop:bg-black/60"
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <h2 id={titleId} className="text-2xl font-semibold tracking-tight">
              {t.title}
            </h2>
            <button
              type="button"
              onClick={close}
              className="-mr-2 -mt-1 inline-flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-bg-soft"
            >
              <Icon name="close" />
              <span className="sr-only">{t.close}</span>
            </button>
          </div>
          <p id={introId} className="mt-1 text-base text-muted">
            {t.intro}
          </p>

          <fieldset className="mt-6">
            <legend className="text-base font-semibold">{t.theme.legend}</legend>
            <div className="mt-3 grid gap-2">
              {t.theme.options.map((o) => (
                <label
                  key={o.value}
                  className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-line px-4 has-[:checked]:border-accent has-[:checked]:bg-accent-soft"
                >
                  <input
                    type="radio"
                    name="theme"
                    value={o.value}
                    checked={prefs.theme === o.value}
                    onChange={() => setPrefs({ theme: o.value as ThemePref })}
                    className="size-5 accent-[var(--accent)]"
                  />
                  <span className="text-base">{o.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-6 grid gap-2">
            {(
              [
                ["highContrast", t.highContrast],
                ["largeText", t.largeText],
                ["reduceMotion", t.reduceMotion],
              ] as const
            ).map(([key, copy]) => (
              <Toggle
                key={key}
                label={copy.label}
                hint={copy.hint}
                checked={prefs[key]}
                onChange={(v) => setPrefs({ [key]: v })}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={resetPrefs}
            className="mt-6 min-h-12 text-base font-semibold text-accent underline underline-offset-4"
          >
            {t.reset}
          </button>
        </div>
      </dialog>
    </>
  );
}

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  const hintId = useId();
  return (
    <label className="flex min-h-14 cursor-pointer items-center justify-between gap-4 rounded-xl border border-line px-4 py-3 has-[:checked]:border-accent">
      <span>
        <span className="block text-base font-semibold">{label}</span>
        <span id={hintId} className="block text-sm text-muted">
          {hint}
        </span>
      </span>
      <input
        type="checkbox"
        role="switch"
        aria-describedby={hintId}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className="relative h-7 w-12 shrink-0 rounded-full border-2 border-line bg-bg-soft transition-colors peer-checked:border-accent peer-checked:bg-accent peer-focus-visible:outline peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--focus)] after:absolute after:left-0.5 after:top-0.5 after:size-5 after:rounded-full after:bg-text after:transition-transform peer-checked:after:translate-x-5 peer-checked:after:bg-accent-contrast"
      />
    </label>
  );
}
