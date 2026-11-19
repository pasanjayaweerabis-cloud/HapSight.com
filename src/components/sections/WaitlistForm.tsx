"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { waitlist as t } from "@/content/site";
import { joinWaitlist } from "@/app/actions/waitlist";
import { initialWaitlistState, type FieldName } from "@/lib/waitlistSchema";
import { Icon } from "@/components/ui/Icon";
import { buttonClass } from "@/components/ui/Button";
import { stageBus } from "@/three/stageBus";

const FIELD_ORDER: FieldName[] = ["name", "email", "role", "consent"];
const FIELD_TARGET: Record<FieldName, string> = {
  name: "wl-name",
  email: "wl-email",
  role: "wl-role-0",
  consent: "wl-consent",
};

const inputClass =
  "mt-2 block min-h-13 w-full rounded-xl border border-line bg-surface px-4 text-lg text-text placeholder:text-muted aria-[invalid=true]:border-danger aria-[invalid=true]:border-2";

export function WaitlistForm() {
  const [state, formAction, pending] = useActionState(joinWaitlist, initialWaitlistState);
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (startedRef.current) startedRef.current.value = String(Date.now());
  }, [state]);

  // Move focus to the result so screen reader users hear it straight away.
  useEffect(() => {
    if (state.status === "error") summaryRef.current?.focus();
    if (state.status === "success") {
      successRef.current?.focus();
      stageBus.pulse(); // one haptic pulse on the 3D device (decorative)
    }
  }, [state]);

  if (state.status === "success") {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="card rounded-card border-2 border-success bg-accent-soft p-8">
        <p className="flex items-center gap-3 text-2xl font-semibold">
          <Icon name="check" className="size-7 text-success" />
          {t.success.title}
        </p>
        <p className="mt-3 text-lg text-muted">{t.success.body}</p>
        <p className="mt-2 text-base text-muted">{t.success.already}</p>
      </div>
    );
  }

  const errors = state.fieldErrors;
  const errorList = FIELD_ORDER.filter((f) => errors[f]);
  const err = (f: FieldName) => (errors[f] ? t.errors[errors[f]] : undefined);

  return (
    <form action={formAction} noValidate aria-busy={pending} className="card rounded-card border border-line bg-surface p-6 sm:p-8">
      {state.status === "error" ? (
        <div ref={summaryRef} tabIndex={-1} aria-labelledby="wl-summary-title" className="mb-8 rounded-xl border-2 border-danger p-5">
          <p id="wl-summary-title" className="flex items-center gap-2 text-lg font-semibold text-danger">
            <Icon name="alert" />
            {state.formError ? t.errors[state.formError] : t.errors.summaryTitle}
          </p>
          {errorList.length > 0 ? (
            <ul className="mt-3 grid gap-1">
              {errorList.map((f) => (
                <li key={f}>
                  <a href={`#${FIELD_TARGET[f]}`} className="text-base text-danger underline underline-offset-4">
                    {err(f)}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      <p className="mb-6 text-base text-muted">{t.requiredNote}</p>

      <div className="grid gap-6">
        <div>
          <label htmlFor="wl-name" className="text-lg font-semibold">
            {t.fields.name.label}
          </label>
          {err("name") ? <FieldError id="wl-name-error" message={err("name")!} /> : null}
          <input
            id="wl-name"
            name="name"
            type="text"
            autoComplete={t.fields.name.autoComplete}
            required
            maxLength={100}
            defaultValue={state.values.name}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "wl-name-error" : undefined}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="wl-email" className="text-lg font-semibold">
            {t.fields.email.label}
          </label>
          <p id="wl-email-hint" className="text-base text-muted">
            {t.fields.email.hint}
          </p>
          {err("email") ? <FieldError id="wl-email-error" message={err("email")!} /> : null}
          <input
            id="wl-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete={t.fields.email.autoComplete}
            spellCheck={false}
            required
            maxLength={254}
            defaultValue={state.values.email}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={`wl-email-hint${errors.email ? " wl-email-error" : ""}`}
            className={inputClass}
          />
        </div>

        <fieldset aria-describedby={errors.role ? "wl-role-error" : undefined} aria-invalid={errors.role ? true : undefined}>
          <legend className="text-lg font-semibold">{t.fields.role.legend}</legend>
          {err("role") ? <FieldError id="wl-role-error" message={err("role")!} /> : null}
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {t.fields.role.options.map((o, i) => (
              <label
                key={o.value}
                data-radio-card
                className={`flex min-h-13 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 has-[:checked]:border-accent has-[:checked]:bg-accent-soft ${errors.role ? "border-danger" : "border-line"}`}
              >
                <input
                  id={`wl-role-${i}`}
                  type="radio"
                  name="role"
                  value={o.value}
                  required
                  defaultChecked={state.values.role === o.value}
                  className="size-5 shrink-0 accent-[var(--accent)]"
                />
                <span className="text-base">{o.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          {err("consent") ? <FieldError id="wl-consent-error" message={err("consent")!} /> : null}
          <div className={`flex gap-3 rounded-xl border p-4 ${errors.consent ? "border-2 border-danger" : "border-line"}`}>
            <input
              id="wl-consent"
              name="consent"
              type="checkbox"
              value="yes"
              required
              defaultChecked={state.values.consent}
              aria-invalid={errors.consent ? true : undefined}
              aria-describedby={errors.consent ? "wl-consent-error" : undefined}
              className="mt-1 size-5 shrink-0 accent-[var(--accent)]"
            />
            <label htmlFor="wl-consent" className="text-base">
              {t.fields.consent.label}
            </label>
          </div>
          <p className="mt-2 text-base">
            <Link href="/privacy" className="text-accent underline underline-offset-4">
              {t.fields.consent.privacyLinkText}
            </Link>
          </p>
        </div>

        {/* Spam protection: hidden from people and assistive tech, bots tend to fill it. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor="wl-company">{t.fields.honeypot}</label>
          <input id="wl-company" name="company_website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
        </div>
        <input ref={startedRef} type="hidden" name="started_at" defaultValue="0" />

        <button type="submit" disabled={pending} aria-disabled={pending} className={buttonClass("primary", "w-full sm:w-auto")}>
          {pending ? t.submitting : t.submit}
        </button>
        <p role="status" className="sr-only">
          {pending ? t.submitting : ""}
        </p>
      </div>
    </form>
  );
}

function FieldError({ id, message }: { id: string; message: string }) {
  return (
    <p id={id} className="mt-1 flex items-center gap-2 text-base font-semibold text-danger">
      <Icon name="alert" className="size-5 shrink-0" />
      <span>
        <span className="sr-only">{t.errors.fieldPrefix} </span>
        {message}
      </span>
    </p>
  );
}
