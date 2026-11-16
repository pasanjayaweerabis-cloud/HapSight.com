# HapSight – landing page

Landing page for **Hapsight**: low-cost haptic smart glasses being designed to help
blind and visually impaired people notice obstacles at head height, silently and hands-free.
Three VL53L1X laser distance sensors in the frame look left, ahead and right; a coin vibration
motor in each ear tip tells the wearer which side the obstacle is on.
Student prototype by ATP Group 14, BEng (Hons) Software Engineering, IIT Sri Lanka
(affiliated with the University of Westminster).

- Next.js 16 (App Router) · TypeScript strict · Tailwind CSS v4
- three.js via @react-three/fiber + @react-three/drei (procedural model, no model files)
- framer-motion (UI motion and scroll progress; GSAP is not needed)
- Supabase (waitlist) · Vercel Analytics (cookieless)

## Run it

Requires Node.js 20.9 or newer.

```bash
npm install
cp .env.example .env.local   # then fill in the Supabase values (see below)
npm run dev                  # http://localhost:3000
```

| Command | What it does |
| --- | --- |
| `npm run build` | Production build (also type-checks) |
| `npm start` | Serve the production build on port 3000 |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run stills` | Re-capture the static 3D stills in `public/stills/` (needs Google Chrome and `npm start` running) |

Without Supabase keys the site still runs; the waitlist form shows "the waitlist is not switched on yet".

## Project structure

```
.
├── src/
│   ├── app/                     Routes: layout (metadata, skip link, a11y boot script), page,
│   │   │                        /privacy, /accessibility, not-found, icon.svg,
│   │   │                        opengraph-image.tsx (1200×630, built from public/stills/hero.png)
│   │   └── actions/waitlist.ts  Server Action: validation, honeypot, Supabase insert
│   ├── content/site.ts          ALL text: name, tagline, sections, part labels, team, roadmap, form copy, legal pages
│   ├── components/
│   │   ├── layout/              Navbar, mobile menu, accessibility settings dialog, footer, logo
│   │   ├── sections/            One file per page section (Hero, Problem, HowItWorks, Features, Design, InsideArms, …)
│   │   ├── ui/                  Small shared pieces: Button, Section, Accordion, Icon
│   │   └── visuals/             StageHost (the one canvas), StageSlot (where the device sits), label overlay, stills
│   ├── lib/                     Accessibility prefs, WebGL check, media queries, Supabase client, form schema
│   └── three/
│       ├── deviceConfig.ts      THE 3D config: every part, placement, explode moves, labels, cameras
│       ├── geometry.ts          Procedural shape helpers (rounded polygons, sweeps, frames)
│       ├── materials.ts         All 3D materials
│       ├── explode.ts           Explode maths shared by the model and the leader lines
│       ├── parts/               Frame (front, lenses, nose pad) · Temples (shells, covers, caps, switch) · Modules (boards, battery, motors)
│       ├── effects/             Detection cones, ear-tip pulse rings, dashed leader lines
│       ├── PersistentStage.tsx  The ONE WebGL canvas for the whole page (camera follows the section slots)
│       ├── pageTimeline.ts      Pure function: page scroll → device state (camera, explode, highlights, cones, motors…)
│       └── stageBus.ts          Registry: sections' scroll ranges, slots, label overlay, waitlist pulse
├── public/stills/               Static 3D stills (reduced motion, no WebGL, OG image) – made by `npm run stills`
├── scripts/capture-stills.mjs   Stills capture (uses your installed Google Chrome)
├── supabase/waitlist.sql        Database setup
└── docs/                        Not shipped with the site: design references, prompts, coursework files
```

To rename the product, change `brand.name` in `src/content/site.ts`.

### The 3D model

Front = +Z (where the sensors look), wearer's left = +X, up = +Y. Each part in `PARTS`
(`src/three/deviceConfig.ts`) has a kind, an assembled position/rotation, explode moves
(`half` stage = temple covers, lenses, nose pad and ear caps come off, scroll 0 → 0.5; `full`
stage = sensors, boards, battery and motors come out, 0.5 → 1), an optional `turn` (pulled-out
boards lie face up) and an optional label. Move a part or change how it explodes there and every
scene follows, including the teal dashed leader lines.

The parts: a front frame with three open sensor windows in the top bar (left corner, centre,
right corner; the corner sensors turn 27° outward and are **not** behind the lenses), two clear
lenses, a rubber nose pad, and two hollow temples with removable outer covers. Left temple:
ESP32-C3 SuperMini + two MOSFET driver boards. Right temple: LiPo 3.7 V 500 mAh + TP4056 USB-C
charger (port through the back wall of the bay) and a slide power switch on top of the arm. Each
ear tip holds a coin vibration motor under a rubber cap. There is no 3.3 V regulator: the
SuperMini's onboard regulator runs from the battery through its 5V pin. The teal strips on the
top bar are decoration (an emissive material), not a part.

Left/right: no object uses a negative scale. Symmetric parts (lenses, corner sensors, temples,
covers, ear caps, motors) are generated per side from mirrored inputs with right-handed local
frames, so lighting, normals and face culling are always correct. The two temples hold different
electronics, so their insides are separate parts, not mirrored copies.

### One device across the page

There is a single fixed, click-through canvas (`src/three/PersistentStage.tsx`, loaded lazily by
`StageHost` through `LazyStage`). Each dark section marks a box with `<StageSlot id="…">`; the camera
is aimed every frame so the device appears inside the current section's slot, and it glides from
one slot to the next as you scroll. Light sections have no slot, so the device fades out and the
canvas stops rendering.

`src/three/pageTimeline.ts` is the story: `pageTimeline(p, ranges)` turns page progress into a
`DeviceState`. Each section's range comes from the DOM (`useStageSection` / `RangeMarker`,
re-measured on resize), and the section's text uses the same range, so text and 3D never
disagree. To change what happens in a section, edit its function in `SECTIONS`.

Reduced motion or no WebGL: no canvas at all. Every slot shows its still and every step is text.
On phones (`front` slots in How it works and Features) the canvas draws above the page while the
device is in that slot, so the cards slide underneath it.

### Colours

Deep navy + teal, from `docs/design/pasan/hapSight-landing-page.html` (colours and style only).
Tokens and WCAG contrast ratios are in `src/app/globals.css`. Bright teal `#14e0c8` is text only on
dark backgrounds; the light theme uses `#0a6b60` for text and links. Orange `--haptic` is only for
vibration (motors and pulses).

### Team photos

See `public/team/README.md`: add `public/team/<name>.jpg` (square, ≥ 400 px, < 150 KB) and set
`photo` for that member in `team.members` in `site.ts`. The Scrum Master role rotates each sprint:
edit `role` there.

## Supabase setup (waitlist)

1. Go to <https://supabase.com>, sign in, **New project**. Pick a region close to Sri Lanka
   (for example *Mumbai* or *Singapore*), set a database password and keep it safe.
2. Open **SQL Editor → New query**, paste the whole of [`supabase/waitlist.sql`](supabase/waitlist.sql)
   and press **Run**. It creates the `public.waitlist` table with checks, a unique index on
   `lower(email)`, Row Level Security **on with no policies** (table grants revoked from `anon` and
   `authenticated`), and `purge_old_waitlist_rows()` for the 12-month retention promise.
3. **Project Settings → Data API**: copy the **Project URL** → `SUPABASE_URL`.
4. **Project Settings → API Keys**: create/copy a **Secret key** (`sb_secret_…`) → `SUPABASE_SECRET_KEY`.
   (A legacy `service_role` key also works as `SUPABASE_SERVICE_ROLE_KEY`.) This key bypasses RLS:
   only ever put it in server env vars, never prefix it with `NEXT_PUBLIC_`, never commit it.
5. Put both values in `.env.local`, restart `npm run dev`, submit the form and check
   **Table Editor → waitlist** for the row.
6. Retention: run `select public.purge_old_waitlist_rows();` monthly, or enable `pg_cron`
   (**Database → Extensions**) and run
   `select cron.schedule('purge-waitlist', '0 3 1 * *', 'select public.purge_old_waitlist_rows()');`
7. Deletion requests: `delete from public.waitlist where lower(email) = lower('person@example.com');`
   then reply within 14 days (as the privacy notice says).

Spam protection: hidden honeypot field, minimum fill time, unique email, zod validation and a
best-effort per-instance rate limit. Duplicate emails show the normal success message, so the
form does not reveal who is on the list.

## Deploy to Vercel with your own domain (HTTPS)

- [ ] Push this repo to GitHub.
- [ ] On <https://vercel.com>: **Add New → Project → Import** the repo (Next.js preset, defaults are fine).
- [ ] **Settings → Environment Variables**: `SUPABASE_URL`, `SUPABASE_SECRET_KEY`,
      `NEXT_PUBLIC_SITE_URL=https://your-domain`.
- [ ] Deploy, submit a test sign-up on the `*.vercel.app` URL, then delete the test row in Supabase.
- [ ] **Settings → Domains → Add** the apex domain and `www`; pick one as primary, redirect the other.
- [ ] At your registrar's DNS, add exactly the records Vercel shows on the Domains page
      (an **A** record for the apex `@` and a **CNAME** for `www`). Remove conflicting old records.
- [ ] When Vercel shows **Valid Configuration** it issues and renews the HTTPS certificate
      automatically; HTTP redirects to HTTPS.
- [ ] Update `NEXT_PUBLIC_SITE_URL` to the final https domain and **redeploy**.
- [ ] **Analytics tab → Enable** Web Analytics (the `<Analytics />` component only loads on Vercel).
- [ ] Check `/`, `/privacy`, `/accessibility`, `/opengraph-image`, `/sitemap.xml`, `/robots.txt` on the live site and run Lighthouse (local before/after results: `docs/evidence/lighthouse/`).
- [ ] Replace the placeholder contact email (`brand.contactEmail` in `site.ts`) with a real inbox.

## Accessibility

Target: WCAG 2.2 AA. Built in: one `h1`, ordered headings, landmarks, skip link, visible focus,
logical tab order, no keyboard traps (3D canvases are `aria-hidden` and not focusable; drag-to-rotate
is mouse only), accessible accordion, native `<dialog>` for settings, error summary + inline errors,
reduced motion (OS setting or the settings panel), high contrast, larger text, light/dark themes,
static stills when WebGL is missing.

### Manual screen reader checks

Test with VoiceOver (macOS and iOS), NVDA (Windows) and TalkBack (Android):

- One h1, section h2s in order, landmarks (banner, Main navigation, main, contentinfo); skip link first.
- The 3D areas are skipped; the device description under the hero is read.
- How it works: three steps read in order; the active step is announced as "current step".
- Features and Inside the arms: every card is in the DOM in reading order; the active one is marked.
- Design: the numbered parts list is read with names, locations and descriptions, then the
  prototype parts cost table (caption, column and row headers).
- FAQ buttons announce expanded/collapsed; the settings dialog traps focus, Escape closes it and
  focus returns to its button.
- Waitlist: submit empty → focus moves to the error summary, links jump to fields, fields announce
  "invalid"; a successful sign-up announces the thank-you message.
- 200% and 400% browser zoom: no sideways scrolling. Keyboard only: everything reachable.

## Known limitations

- The 3D model is procedural and follows the concept renders loosely. Adjust `FRAME`,
  `LENS_LEFT`, `TEMPLE`, `BAY_PROFILE` and `ARM_LEFT` in `deviceConfig.ts`, then `npm run stills`.
- Gallery: off. The concept renders show extra sensor modules on the lower lens corners, which the
  device does not have, so do not crop them for the site. Add real photos (or corrected renders)
  as `public/gallery/front.png`, `side.png`, `three-quarter.png`, check the alt text in `site.ts`,
  then set `gallery.enabled = true`.
- Battery life (3–5 hours) and the parts prices are early estimates; update `site.ts` after testing.
- three.js r187 logs a deprecation warning ("THREE.Clock … use THREE.Timer") from inside
  @react-three/fiber 9. It is a warning, not an error.
- The retention period, contact address and "planned" claims in the comparison are commitments
  the team must keep.
