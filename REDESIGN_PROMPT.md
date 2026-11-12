# Claude Code prompt — Redesign Waymark from headband to haptic smart glasses

Paste everything below the line into Claude Code, opened in the `ATP-SE-14` folder.

---

## Context

This repo is our SDGP (Group 14) product site: Next.js 16 + React 19 + React Three Fiber/drei + Tailwind 4 + framer-motion + Supabase waitlist. Read `AGENTS.md` first — this Next.js version has breaking changes, check `node_modules/next/dist/docs/` before touching Next APIs.

The product is changing. **The headband / ear-hook design is dropped. The new product is a pair of haptic smart glasses (spectacles).** Our lecturer asked for a low-budget device that every team member can actually build and that executes correctly, so the new design is deliberately simple: 3 laser ToF sensors, 2 vibration motors, no speaker, no SOS button, no light sensor, no LED-based features that need extra parts.

Reference renders of the new design are in `design-reference/` — study all 5 before writing code:

- `01-exploded-iso.png` — exploded isometric view (main reference for the 3D model and explode animation)
- `02-exploded-flat.png` — exploded front-on layout showing which part goes into which housing
- `03-four-views.png`, `04-eight-views.png` — assembled glasses from front, side, back, top, 3/4 angles
- `05-internal-closeups.png` — close-ups: front ToF pocket, left temple electronics bay, right temple battery bay, ear-tip motor pocket

## Goal

Redesign the **whole site** (3D model, all copy, parts list, stills, metadata, OG image) for the glasses. Keep the existing architecture, section structure, accessibility features (A11yPanel, skip link, reduced motion, light/dark theme), waitlist form and Supabase integration working.

## 1. New 3D model (`src/three/`)

`deviceConfig.ts` is the single source of truth — rewrite it for glasses and keep the same conventions (wearer faces +Z, wearer's left = +X, up = +Y, mirrored inputs not negative scale, `explode` moves with `"half"` / `"full"` stages, `label` ids from `site.ts`).

Geometry to build (procedural three.js shapes are fine — rounded boxes, extrudes, tubes; no external GLB needed):

**Front frame**
- Flat-top rectangular frame, matte dark charcoal (~#2C2E33), thick top bar.
- Two rectangular lenses, clear with a slight blue tint and soft cyan edge glow (`MeshPhysicalMaterial`, transmission or low opacity).
- Separate nose bridge pad (soft dark rubber) under the bridge.
- **3 sensor windows** in the top bar: left corner, centre (above the bridge), right corner. Each holds a small VL53L1X module (black board, gold mounting holes, dark lens with purple tint).
- Left/right sensors are angled ~25–30° outward (left-forward / right-forward); centre faces straight ahead. Reuse `SensorCones.tsx` to show 3 detection cones.
- Thin cyan accent strips on the top bar between the sensor windows (purely decorative — emissive material, NOT a real LED part).

**Left temple (arm)** — hollow shell with a removable outer cover:
- Inside, in order from hinge backwards: **ESP32-C3 SuperMini** (black PCB, silver shield can) then **2 MOSFET driver boards** (small green PCBs).
- Cover lifts off sideways in the "half" explode stage, boards come out in "full".

**Right temple** — hollow shell with removable outer cover:
- Inside: **LiPo 3.7 V 500 mAh** (silver pouch with yellow/kapton edge, red/black lead with JST plug) and **TP4056 USB-C charger board** (blue PCB, USB-C port exposed through the shell).

**Ear tips (both sides)** — each temple ends in a curved tip holding a **coin vibration motor** (silver disc, red lead, small connector) under a soft rubber end cap. The cap and motor explode outward along the arm direction.

**Remove completely:** headband/band shape, ear hooks, ear pods, lining, ribbon, strap, SOS button, pause button, speaker/buzzer, light sensor, night LED strip, and any **3.3 V LDO regulator** (we don't need it — the ESP32-C3 SuperMini's onboard regulator powers it from the battery via its 5V pin).

Update `geometry.ts`, `parts/*` (rename `Pods.tsx` etc. to fit: e.g. `Frame.tsx`, `Temples.tsx`, `Modules.tsx`), `Device.tsx`, `explode.ts`, `materials.ts`, `ExplodeArrows.tsx` (cyan dashed leader lines like the references) and the three scenes (`HeroScene`, `HowItWorksScene`, `DesignScene`). Delete dead code instead of leaving it unused.

Visual style: dark navy background (~#0B1530 → #0A1022 gradient), charcoal matte plastic, cyan (#22D3EE-ish) accents and leader lines, soft studio lighting — match the reference renders. Update `COLORS` and the site theme tokens in `globals.css` so the site palette matches (replace the teal palette with navy + cyan, keep WCAG AA contrast in both light and dark themes).

## 2. Parts / labels (exactly 12 labels)

Replace the 12 `LabelId`s and `design.labels` in `src/content/site.ts` with:

| # | id | name | where |
|---|---|---|---|
| 1 | `tofFront` | Front distance sensor (VL53L1X) | Centre of the frame, above the bridge, facing straight ahead |
| 2 | `tofLeft` | Left distance sensor (VL53L1X) | Left corner of the frame, angled left-forward |
| 3 | `tofRight` | Right distance sensor (VL53L1X) | Right corner of the frame, angled right-forward |
| 4 | `controller` | Controller (ESP32-C3 SuperMini) | Inside the left temple |
| 5 | `motorLeft` | Left vibration motor | Left ear tip, behind the ear |
| 6 | `motorRight` | Right vibration motor | Right ear tip, behind the ear |
| 7 | `drivers` | Motor drivers (2× 2N7000 MOSFET) | Inside the left temple, behind the controller |
| 8 | `battery` | Battery (LiPo 3.7 V, 500 mAh) | Inside the right temple |
| 9 | `charger` | USB-C charging (TP4056 with protection) | Inside the right temple, port on the outside |
| 10 | `frame` | 3D-printed frame (PLA/PETG) | The whole body — front, temples, covers |
| 11 | `lenses` | Clear lenses | Front frame (non-prescription; protect the sensors' view and look like normal glasses) |
| 12 | `wiring` | Wiring and power switch | Runs through the frame and temples; switch on the right temple |

Short descriptions for each (use in the Design section / PartsList):
1–3: Measure distance with an invisible Class 1 laser, about 4 cm to 4 m, regardless of colour; three directions give left / ahead / right.
4: Reads the three sensors over I2C and sets each motor's pulse rate with PWM.
5–6: Vibrate on the side the obstacle is on; both together = straight ahead; closer = faster pulses.
7: Switch battery current to the motors because the ESP32 pins can't drive them directly; flyback diode protects the circuit.
8: Powers everything without a cable.
9: Charges the battery over USB-C and protects it from overcharge, over-discharge and short circuit.
10: Holds every part at the right angle; printable on a normal FDM printer.
11–12: as above.

Update `otherParts` ("Also inside") to only list: flyback diodes, resistors, perfboard, heat-shrink, JST connectors.

## 3. Copy changes (`src/content/site.ts` + all sections)

- Product is now **"haptic smart glasses"**, not a headband. Search the whole repo (`grep -ri "headband\|ear hook\|ear-hook\|pod\|temple pad\|SOS\|speaker\|buzzer\|light sensor\|night LED\|band"`) and update every mention — including `meta`, `hero`, `howItWorks`, `features`, `design`, `gallery`, `faq`, `comparison`, OG alt text, `README.md`.
- Keep the name **Waymark** (it's a working name — `brand.name`).
- Tagline idea: "Feel the path ahead." Short description: "Low-cost haptic glasses being designed to help blind and visually impaired people notice obstacles at head height — silently and hands-free."
- **How it works** (3 steps): (1) Three laser sensors scan left, ahead and right. (2) The controller works out how close and which side. (3) The matching ear vibrates — faster as you get closer.
- **Features**: remove SOS, voice/speaker, night light, light sensor, pause button. Keep/add: 3-direction detection, silent haptic feedback (doesn't block traffic sounds), hands-free, works with the white cane (not instead of it), USB-C rechargeable, low cost / locally buildable, looks like ordinary glasses.
- **Comparison**: our row price → "Target build cost ≈ LKR 11,000 (prototype parts)". Keep competitor rows, update their "why it doesn't fit" text only if it references our old headband.
- **FAQ**: rewrite questions that mention the band; add "Do I need a prescription?" (no — clear lenses; prescription version is a future idea) and "How long does the battery last?" (designed-for target, not a proven result — e.g. "We're aiming for a full day; we'll confirm in testing.").
- **Keep the copy rules at the top of `site.ts`**: design-stage language ("is designed to", "will"), no medical claims, no claim it makes crossing roads safe, no invented statistics.
- Team section stays the same.

## 4. Optional budget block

In the Design section (or PartsList), add a small "Prototype parts cost" table:

| Part | Qty | LKR |
|---|---|---|
| VL53L1X ToF sensor | 3 | 5,250 |
| ESP32-C3 SuperMini | 1 | 800 |
| LiPo 3.7 V 500 mAh | 1 | 950 |
| TP4056 USB-C charger | 1 | 120 |
| Coin vibration motor | 2 | 240 |
| 2N7000 MOSFET + diodes/resistors | 2 | 300 |
| 3D-printed frame | 1 | 3,000 |
| Wiring, switch, perfboard | — | 500 |
| **Total** | | **≈ 11,160** |

Footnote: "Approximate Sri Lankan retail prices, Nov 2026. Some are estimates."

## 5. Stills, OG image, metadata

- After the model is done: `npm run build && npm start`, then `npm run stills` to regenerate `public/stills/*.png` (hero, how-it-works, assembled, exploded). The OG image uses `hero.png`.
- Update `src/app/icon.svg` to a simple glasses glyph in cyan.

## 6. Done criteria

- `npm run typecheck`, `npm run lint` and `npm run build` all pass.
- No remaining references to headband / ear hook / pods / SOS / speaker / light sensor / LDO anywhere in `src/`, `README.md`, or stills.
- Exploded view: "half" stage opens temple covers and lifts lenses + nose pad; "full" stage pulls out the boards, battery, sensors and motors with cyan dashed leader lines — matching `01-exploded-iso.png`.
- All 12 labels appear and point at the right parts; labels are readable at mobile width.
- Reduced-motion mode shows the static stills; keyboard nav and screen-reader text still work; light and dark themes both pass AA contrast.
- Run the dev server and take screenshots of hero, how-it-works, design (assembled + exploded), and mobile width — check them against the reference renders before saying you're done.

Work in small commits. Ask me before deleting anything outside `src/three/`, `src/content/`, `src/components/` and `public/stills/`.
