# Prompt: HapSight landing page — ChatGPT colours + one 3D device across the page + marking-ready content

> Paste into Claude Code inside the `ATP-SE-14` repo. This UPGRADES the existing site; it is not a rebuild.
> Work on a new branch `feat/persistent-3d-stage`. Small commits per step.

---

## 0. Read first, do not skip
1. Read `AGENTS.md` and the relevant Next.js 16 docs in `node_modules/next/dist/docs/` (this Next version has breaking changes).
2. Read `README.md`, `src/content/site.ts`, `src/app/globals.css`, `src/three/deviceConfig.ts`, `src/three/explode.ts`, `src/three/howItWorksTimeline.ts`, `src/components/visuals/LazyStage.tsx`, `src/three/StageCanvas.tsx`, `src/lib/a11yPrefs.ts`, `docs/prompts/glasses-redesign.md`.
3. Read the attached ChatGPT design file `hapSight-landing-page.html` — use it for **colours, look and section ideas only**, NOT for facts (it contains claims that are wrong for our device, listed in section 4).
4. Summarise back to me in ~10 lines how the site and 3D currently work, list your plan, then build.

**Keep everything that already works:** the procedural model and every part in `PARTS`, `site.ts` as the single source of text, the accessibility system (A11yPanel, reduced motion, high contrast, large text, light/dark, skip link, `public/stills/*`), framer-motion as the scroll engine (no GSAP/Lenis unless you prove it's needed), the Supabase waitlist, `/privacy`, `/accessibility`, security headers.

---

## 1. New colour palette (from the ChatGPT design)
Replace the navy + cyan tokens in `globals.css` with this palette, through the existing CSS variables so every component follows:

```
--bg / stage-bg   #080f1d
--surface         #0d1727
--surface-2       #111f31
--line            rgba(176,205,222,.13)
--teal (accent)   #14e0c8
--teal-2          #8af5e7
--text            #f2f7fa
--text-muted      #a1afbd
--text-soft       #708194   (decorative/captions only — check contrast)
--haptic          #ffcb8a   (ONLY for vibration pulses, motors, haptic ripples)
radius 24px · max width 1160px · Inter
```
Style cues to copy from the ChatGPT file: section kicker with a short teal line before it, very tight negative letter-spacing on big headings, glassmorphism cards with 1px soft borders, subtle teal radial glows, pill buttons (teal filled + quiet outlined).

**Contrast rules (must pass WCAG 2.2 AA, it's in our marking evidence):**
- Recalculate and update the contrast-ratio comments in `globals.css` for every pair.
- Teal `#14e0c8` is fine as text on the dark background but fails on white → in the light theme use a dark teal (e.g. `#0b7a6d` or darker; verify ≥ 4.5:1 on white and on bg-soft) for text/links, bright teal only as decoration.
- `#708194` must not be used for body text if it is below 4.5:1 on its background.
- Update the high-contrast theme so it still works with the new palette.
- Update `app/icon.svg`, `opengraph-image.tsx` and the 3D materials' cyan strips/emissives to the new teal so everything matches. Re-run `npm run stills`.

---

## 2. One 3D device that travels the whole page
Today Hero, How it works and Design each have their own canvas. Change it so it feels like **one physical device following the visitor down the page**.

- ONE persistent canvas (`src/three/PersistentStage.tsx`), loaded via the existing `LazyStage` pattern (lazy import, idle/interaction deferral on phones, pause when hidden).
- One `useScroll` over the page → pure function `pageTimeline(p): DeviceState` in `src/three/pageTimeline.ts` (same style as `howItWorksTimeline.ts`). `DeviceState` = camera position/target, model rotation, explode amount (reuse `explode.ts` half/full stages), highlighted part id, cone opacity/hits, motor left/right, obstacle positions, X-ray amount.
- Sections register their scroll ranges by `id` (real offsets, recomputed on resize — no magic numbers).
- On light-background sections, fade the device out and stop rendering.

### Section → device state
1. **Hero** — assembled 3/4 view, slow float + pointer tilt (≤ 6°), teal strips glow softly, orbit rings behind (like the ChatGPT hero).
2. **Problem** — side view at head height; a low-poly branch/sign appears ahead at head level; a faint arc near the ground shows what a cane reaches vs. misses.
3. **How it works** — keep the current sense → decide → feel steps and text; drive them from the shared device. Give left, ahead and right obstacles each a turn with the matching cone + motor (motor pulses in `--haptic` orange).
4. **Features** — as each card becomes active, rotate to and highlight the part that delivers it (others dim to ~35%): vibration → ear-tip motors; detection → the three sensors; USB-C charging/battery → LiPo + TP4056 in the right arm; on/off → slide switch.
5. **Design (exploded)** — keep the existing half → full explode with numbered leader lines, scrubbed by scroll, `PartsList` highlighting in sync.
6. **Inside the arms (new short beat)** — X-ray the temple shells; left arm: ESP32-C3 SuperMini + 2 MOSFET boards; right arm: LiPo 500 mAh + TP4056. Signal dots travel sensor → ESP32 → MOSFET → motor.
7. **Later sections** — device parks small and slowly rotating on dark sections, hidden on light ones.
8. **Waitlist** — device returns front-on; one haptic pulse ring on successful submit.

Motion: text reveals ≤ 300 ms, `transform`/`opacity` only. No heavy bloom; none on phones.

---

## 3. Team section (exact — this order, these names)
Update `team` in `site.ts` and `Team.tsx`. Order and roles:

| # | Full name | Role on the site |
|---|---|---|
| 1 | Pasan Jayaweera | Team Leader · Technical Lead · Developer (design & web implementation) |
| 2 | Vidurath Jayaweera | Product Owner · Developer (hardware) |
| 3 | Haziq Shafie | Scrum Master (Sprint 1) · Developer |
| 4 | Krishan Wijeyesekera | Developer · Requirements lead |
| 5 | Aynkaran Selvarajan (Vinod) | Developer · UX & ethics lead |

- Each member object: `name`, `role`, `photo?` (path in `public/team/`), `linkedin?`, `github?`.
- **Photo placeholder:** when `photo` is missing, show a round placeholder with the member's initials on a dark teal gradient + a small camera icon and visible text "Photo coming soon" (decorative parts `aria-hidden`). When a photo exists use `next/image`, square 1:1, 400×400 source, `alt="Photo of <full name>"`.
- Create `public/team/README.md` explaining: file names `pasan.jpg`, `vidurath.jpg`, `haziq.jpg`, `krishan.jpg`, `aynkaran.jpg`; square, ≥ 400×400, JPG/WebP, < 150 KB, plain background.
- Show LinkedIn/GitHub icon links only when the URL exists (no fake `#` links).
- Under the grid: "Group 14 · ATP SE-14 · Agile Team Project (5COSC021C) · BEng (Hons) Software Engineering · Informatics Institute of Technology (IIT), Sri Lanka · University of Westminster" and "Supervisor: Nipuna Senanayake".
- Layout: 5 cards — desktop 3 + 2 centred (or 5 in a row ≥ 1280px), tablet 2 per row, phone 1.
- Note for teammates: Scrum Master rotates each sprint, so the role text must be easy to edit in `site.ts`.

---

## 4. Content must be 100% accurate (marking evidence)
`site.ts` is already factually careful — **keep its facts**. When borrowing sections from the ChatGPT file, do NOT copy these wrong or unproven claims:

- ❌ "Mobile app" / "Cloud dashboard" / "Optional companion app" — scope until the CW1 viva is **glasses only, no mobile app, no voice features**. At most mention "a companion app may be explored in future".
- ❌ "ML Engineer" role — there is no ML in the product.
- ❌ "Long battery life" — say the real thing: 500 mAh LiPo, early estimate ~3–5 h, to be measured in testing (already in `site.ts`).
- ❌ "Works in the dark / offline" as a tested fact — only say what the sensor spec supports (VL53L1X Class 1 laser, ~4 cm to ~4 m indoors, shorter in bright sunlight).
- ❌ Any statistic without a source URL. Keep `[Stat]` placeholders out of the live site; either add a real cited figure (WHO / Sri Lankan source with link stored in `site.ts`) or don't show a stats block.
- ❌ Fake contact email `hello@hapsight.example` / `team@hapsight.example` — use a real address or the clearly-labelled placeholder TODO from `site.ts` until Pasan provides it.
- ❌ Do not use `docs/design-reference/` renders as product images (they show sensors the real device doesn't have).
- ✅ Hardware facts must match `deviceConfig.ts` / `PARTS` exactly: 3 × VL53L1X (left corner, centre, right corner, corners angled outward), ESP32-C3 SuperMini, 2 MOSFET drivers, 2 coin motors in the ear tips, LiPo 3.7 V 500 mAh, TP4056 USB-C, slide switch, 3D-printed PLA/PETG frame, clear lenses. Prototype budget ≈ LKR 11,200.
- ✅ Always present it as a **student prototype in development**, designed to work **with** the white cane, not instead of it, and not a medical device.

### Sections to add from the ChatGPT design (with correct content)
- **Who it's for / impact** cards (student, commuter, older adult) — use the target users already in `site.ts` (born blind, lost sight later, families/carers). Illustrations, not stock photos of real people.
- **Roadmap / project status**: Research ✓ → Prototype (in progress) → User testing (only after ethics approval) → Refinement → Future. Tie to Sprint 0–4 where true.
- **Demo**: video placeholder clearly labelled "Prototype demo coming soon" — no fake video.
- Keep existing sections: Problem, How it works, Features, Design (exploded + parts + budget), Comparison (WeWALK, Envision with source links), Team, FAQ, Waitlist.

---

## 5. Landing page marking checklist (B8) — make each one true or flag it
- [ ] Live on our **own domain hapsight.com over HTTPS** (Vercel), working at A4 and the viva.
- [ ] Real **contact email** and real **social links** (or links hidden until real — no dead links).
- [ ] **SEO**: unique title + meta description, Open Graph/Twitter image, canonical URL, `sitemap.xml`, `robots.txt`, JSON-LD (`Organization` + `Product`), one `<h1>`, logical heading order.
- [ ] **Accessibility**: WCAG 2.2 AA, keyboard-only test, VoiceOver test, 200% zoom, reduced motion, high contrast, alt text everywhere. Add a short results table to `/accessibility`.
- [ ] **Performance**: Lighthouse mobile Performance ≥ 85, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95; LCP < 2.5 s, CLS < 0.1. Save before/after reports to `docs/evidence/lighthouse/` (for Appendix D).
- [ ] Waitlist actually works (Supabase env vars set), with success/error states.
- [ ] Privacy page matches what the site really collects.
- [ ] Footer: © 2026 HapSight · ATP Group 14 (SE-14) · IIT Sri Lanka.
- [ ] Team section exactly as in section 3.
> Pasan: paste the exact B8 wording from the marking scheme here so every line can be checked against it.

---

## 6. Performance + accessibility rules
- One WebGL context total (remove per-section canvases once the persistent one works). `frameloop="demand"`, `dpr` max 1.75 desktop / 1.25 phone, drei `PerformanceMonitor` to step down.
- Hero LCP = the static still (AVIF/WebP) until the canvas is ready.
- Reduced motion / no WebGL → stills + all steps as text. Nothing important exists only in 3D.
- Sticky/pinned sections must not trap keyboard or screen-reader users; DOM order = reading order.

## 7. Finish
- After every step: `npm run typecheck` and `npm run lint`. At the end: `npm run build`, Lighthouse before/after, `npm run stills`.
- Update README (palette, persistent stage, `pageTimeline.ts`, team photos).
- Give me: list of changes, before/after Lighthouse numbers, the B8 checklist with ✅/❌, and anything still marked TODO.
