import { z } from "zod";
import { waitlist } from "@/content/site";

export const ROLE_VALUES = waitlist.fields.role.options.map((o) => o.value) as [string, ...string[]];

export type FieldName = "name" | "email" | "role" | "consent";

/** Error keys map to messages in site.ts (waitlist.errors). */
export type ErrorKey = keyof typeof waitlist.errors;

export const waitlistSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "nameRequired" satisfies ErrorKey })
    .max(100, { message: "nameTooLong" satisfies ErrorKey }),
  email: z
    .string()
    .trim()
    .min(1, { message: "emailRequired" satisfies ErrorKey })
    .max(254, { message: "emailInvalid" satisfies ErrorKey })
    .pipe(z.email({ message: "emailInvalid" satisfies ErrorKey })),
  role: z.enum(ROLE_VALUES, { message: "roleRequired" satisfies ErrorKey }),
  consent: z.literal("yes", { message: "consentRequired" satisfies ErrorKey }),
});

export interface WaitlistState {
  status: "idle" | "error" | "success";
  /** Field errors, in form order. */
  fieldErrors: Partial<Record<FieldName, ErrorKey>>;
  /** A form-level error (backend down, not configured, rate limited). */
  formError?: ErrorKey;
  values: { name: string; email: string; role: string; consent: boolean };
}

export const initialWaitlistState: WaitlistState = {
  status: "idle",
  fieldErrors: {},
  values: { name: "", email: "", role: "", consent: false },
};

/** Version of the consent wording stored with each row, so we know what people agreed to. */
export const CONSENT_VERSION = "2026-11-12";
