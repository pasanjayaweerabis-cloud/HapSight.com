"use server";

import { headers } from "next/headers";
import { getSupabase } from "@/lib/supabaseServer";
import { CONSENT_VERSION, waitlistSchema, type FieldName, type WaitlistState } from "@/lib/waitlistSchema";

/** Submissions faster than this are almost certainly bots. */
const MIN_FILL_MS = 2500;

/**
 * Best-effort, per-instance rate limit (serverless instances do not share memory).
 * The honeypot, timing check and unique email index do most of the work.
 */
const hits = new Map<string, number[]>();
function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > 5;
}

export async function joinWaitlist(_prev: WaitlistState, formData: FormData): Promise<WaitlistState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    role: String(formData.get("role") ?? ""),
    consent: String(formData.get("consent") ?? ""),
  };
  const values = { name: raw.name, email: raw.email, role: raw.role, consent: raw.consent === "yes" };

  // Honeypot: real people never see or fill this field. Pretend it worked.
  const honeypot = String(formData.get("company_website") ?? "");
  const startedAt = Number(formData.get("started_at") ?? 0);
  if (honeypot.trim() !== "") return { status: "success", fieldErrors: {}, values };

  // Validate before the timing check, so a person who submits too quickly (or empty) always sees
  // the real errors instead of a fake "thank you".
  const parsed = waitlistSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: WaitlistState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as FieldName;
      if (!fieldErrors[field]) fieldErrors[field] = issue.message as WaitlistState["fieldErrors"][FieldName];
    }
    return { status: "error", fieldErrors, values };
  }

  // A valid form filled in under 2.5 s is almost certainly a bot. Pretend it worked.
  if (startedAt > 0 && Date.now() - startedAt < MIN_FILL_MS) {
    return { status: "success", fieldErrors: {}, values };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return { status: "error", fieldErrors: {}, formError: "rateLimited", values };
  }

  const supabase = getSupabase();
  if (!supabase) {
    console.error("[waitlist] SUPABASE_URL or SUPABASE_SECRET_KEY is not set.");
    return { status: "error", fieldErrors: {}, formError: "notConfigured", values };
  }

  const { error } = await supabase.from("waitlist").insert({
    name: parsed.data.name,
    email: parsed.data.email.toLowerCase(),
    role: parsed.data.role,
    consent: true,
    consent_version: CONSENT_VERSION,
  });

  // 23505 = unique violation: already on the list. Report success so the form
  // does not reveal whether an email address is on the waitlist.
  if (error && error.code !== "23505") {
    console.error("[waitlist] insert failed:", error.code, error.message);
    return { status: "error", fieldErrors: {}, formError: "generic", values };
  }

  return { status: "success", fieldErrors: {}, values: { name: "", email: "", role: "", consent: false } };
}
