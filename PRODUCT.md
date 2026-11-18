# PRODUCT.md – HapSight

Durable product truth for design work. Visual decisions live in DESIGN.md.
Where this file and the code disagree, `src/content/site.ts` and README.md win; update this file.

## What it is

HapSight (hapsight.com) is a pair of low-cost haptic glasses being designed to help blind and
visually impaired people notice obstacles at head height, silently and hands-free.

- **Sensing:** three VL53L1X laser time-of-flight sensors in open windows in the top bar of the
  frame: left corner (angled left-forward), centre (straight ahead), right corner (angled
  right-forward). Range about 4 cm to 4 m indoors, shorter in bright sun.
- **Feedback:** a coin vibration motor in each ear tip. Left obstacle → left ear, right → right ear,
  straight ahead → both. Pulses get faster as the obstacle gets closer. No sound.
- **Hardware:** ESP32-C3 SuperMini + two MOSFET drivers (left temple); LiPo 3.7 V 500 mAh,
  TP4056 USB-C charger and slide power switch (right temple); 3D-printed PLA/PETG frame;
  clear non-prescription lenses.
- **Works with the white cane, never instead of it.** The cane checks the ground; HapSight is
  meant to add a warning about head-height and side obstacles.

### Differences from the brief given for this design pass (repo wins)

- The brief said "forward-facing obstacle sensors" and "vibration on the left or right side".
  The repo specifies exactly three sensors (left / ahead / right) and motors in the ear tips.
- The brief mentioned **a companion mobile app that lets family members see the wearer's
  location**. The repo has no such app; the roadmap lists "a companion app" only as an idea
  "we may explore later. Nothing is promised yet." The site must not describe location sharing.

## Who builds it

ATP Group 14 (SE-14): five BEng (Hons) Software Engineering students, Agile Team Project module
(5COSC021C), Informatics Institute of Technology (IIT), Sri Lanka, affiliated with the University
of Westminster. Supervisor: Nipuna Senanayake. It is a student prototype in development, not a
commercial product, not for sale, not a medical device.

## Claims policy (hard rules)

- Describe planned behaviour ("is designed to", "will"), never proven results.
- Never claim medical approval, certification, guaranteed safety, or that it replaces the cane,
  O&M training or road-crossing judgement.
- No invented statistics, prices, partners, testimonials or user quotes.
- Battery life (3–5 h) and parts costs are early estimates and must be labelled as such.
- User testing happens only after university ethics approval.

## Audiences (priority order)

1. **Blind and low-vision people.** Screen readers (VoiceOver, NVDA, TalkBack), magnifiers,
   high contrast, keyboard only, often on mid-range Android phones on mobile data.
2. **Family members and carers.** Want to know it is simple, affordable and honest.
3. **Lecturers, evaluators, potential supporters.** Want to see the engineering is real and
   the team is credible.

## Surface: landing page (`/`) – mode: Persuade

Success = within 10 seconds the visitor knows what HapSight does, sees the device, and can
take the main action.

- **Main action:** "Join the waitlist" (Supabase-backed form at `#waitlist`, Server Action with
  zod validation, honeypot, timing check, rate limit; duplicate emails return the normal
  success message so membership isn't revealed).
- **Secondary:** "See how it works".

## Voice

Calm, trustworthy, warm, human. Premium consumer hardware (Apple / Nothing product pages), not
sci-fi, not charity. Confident, not hype. Short sentences, plain words, no jargon in headlines
(part numbers belong in the parts list only). Local context: Sri Lankan streets, tuk-tuks,
signboards.

## Accessibility bar

WCAG 2.2 AA minimum, AAA (7:1) contrast for body text. Works at 200%/400% zoom, in forced-colors
mode, with reduced motion (static stills, no scroll-linked motion), keyboard only, 44×44 px
targets. Everything shown in 3D is also real text.
