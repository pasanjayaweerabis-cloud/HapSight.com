/**
 * Captures the static stills in public/stills/ from the real persistent 3D stage.
 * Uses your installed Google Chrome (playwright-core, no browser download).
 *
 *   npm run build && npm start            # in one terminal (port 3000)
 *   npm run stills                        # in another
 *
 * Each still is the device inside one section's slot: the page is scrolled to that moment,
 * all page content is hidden, and only the slot's area of the transparent canvas is saved.
 * Re-run whenever the model or pageTimeline.ts changes, then rebuild (the OG image uses hero.png).
 */
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const base = process.argv[2] ?? "http://localhost:3000";
const outDir = process.argv[3] ?? fileURLToPath(new URL("../public/stills", import.meta.url));

const browser = await chromium.launch({ channel: "chrome", headless: true, args: ["--enable-gpu"] });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1.5 });
await ctx.addInitScript(() => localStorage.setItem("hapsight-a11y", JSON.stringify({ theme: "dark" })));
const page = await ctx.newPage();
page.on("console", (m) => {
  if (m.type() === "error") console.log("console error:", m.text());
});
await page.goto(base + "/", { waitUntil: "networkidle" });
// the stage loads after the first interaction on some devices; nudge it, then wait for it
await page.mouse.move(720, 500);
await page.mouse.wheel(0, 10);
await page.waitForSelector("[data-stage-host] canvas", { timeout: 30000 });
await page.waitForTimeout(3000);

// transparent backgrounds; hide every bit of page content so only the device remains
await page.addStyleTag({
  content: `html,body,main,section,.stage,.stage-gradient{background:transparent!important}
    header,footer,main section *{visibility:hidden!important}
    [data-stage-host],[data-stage-host] *{visibility:visible!important}`,
});

/** Scrolls to a moment of a section's story: mode "pin" (sticky track) or "center" (list/section). */
async function scrollTo(selector, mode, local) {
  await page.evaluate(
    ([selector, mode, local]) => {
      const el = document.querySelector(selector);
      const top = el.getBoundingClientRect().top + window.scrollY;
      const vh = window.innerHeight;
      const y = mode === "pin" ? top + (el.offsetHeight - vh) * local : top - vh / 2 + el.offsetHeight * local;
      window.scrollTo(0, Math.max(0, y));
    },
    [selector, mode, local],
  );
  await page.waitForTimeout(2500); // the stage eases into place
}

async function shot(slot, file) {
  const box = await page.locator(`[data-stage-slot="${slot}"]`).boundingBox();
  if (!box) throw new Error(`slot ${slot} not visible`);
  await page.screenshot({ path: `${outDir}/${file}`, clip: box, omitBackground: true });
  console.log("saved", file);
}

await scrollTo("#top", "center", 0.5);
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(2500);
await shot("hero", "hero.png");

// How it works: feel step, obstacle straight ahead, both motors (HOW_STILL_LOCAL in pageTimeline.ts)
await scrollTo("#how-it-works ol", "center", 2.5 / 3);
await shot("how-it-works", "how-it-works.png");

await scrollTo("#design .sticky", "pin", 0);
await page.evaluate(() => {
  const t = document.querySelector("#design .sticky").parentElement;
  window.scrollTo(0, t.getBoundingClientRect().top + window.scrollY);
});
await page.waitForTimeout(2500);
await shot("design", "assembled.png");
await page.evaluate(() => {
  const t = document.querySelector("#design .sticky").parentElement;
  // 95%: fully exploded, before the hand-over to the next section starts fading the device
  window.scrollTo(0, t.getBoundingClientRect().top + window.scrollY + (t.offsetHeight - window.innerHeight) * 0.95);
});
await page.waitForTimeout(3000);
await shot("design", "exploded.png");

await browser.close();
