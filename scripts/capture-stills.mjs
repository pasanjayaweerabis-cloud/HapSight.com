/**
 * Captures the static stills in public/stills/ from the real 3D scenes.
 * Uses your installed Google Chrome (playwright-core, no browser download).
 *
 *   npm run build && npm start            # in one terminal (port 3000)
 *   npm run stills                        # in another
 *
 * Re-run whenever the model in src/three/ changes, then rebuild (the OG image uses hero.png).
 */
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const base = process.argv[2] ?? "http://localhost:3000";
const outDir = process.argv[3] ?? fileURLToPath(new URL("../public/stills", import.meta.url));

const browser = await chromium.launch({ channel: "chrome", headless: true, args: ["--enable-gpu"] });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1.5 });
await ctx.addInitScript(() => localStorage.setItem("waymark-a11y", JSON.stringify({ reduceMotion: true, theme: "dark" })));
const page = await ctx.newPage();
page.on("console", (m) => {
  if (m.type() === "error") console.log("console error:", m.text());
});
await page.goto(base + "/", { waitUntil: "networkidle" });
// transparent backgrounds so the stills sit on any section colour
await page.addStyleTag({ content: "html,body,section,.stage,.stage-gradient,main{background:transparent!important}" });
// keep the pointer hint ("Drag to turn…") out of the hero still and the OG image built from it
await page.addStyleTag({ content: '#top p[aria-hidden="true"]{display:none!important}' });

async function shot(selector, index, file) {
  const loc = page.locator(selector).nth(index);
  await loc.waitFor({ state: "attached", timeout: 30000 });
  await loc.scrollIntoViewIfNeeded();
  await page.waitForTimeout(3500);
  await loc.screenshot({ path: `${outDir}/${file}`, omitBackground: true });
  console.log("saved", file);
}

await page.waitForTimeout(3000);
await shot("#top canvas", 0, "hero.png");
await page.locator("#how-it-works").scrollIntoViewIfNeeded();
await shot("#how-it-works canvas", 0, "how-it-works.png");
await page.locator("#design").scrollIntoViewIfNeeded();
await shot("#design canvas", 0, "assembled.png");
await shot("#design canvas", 1, "exploded.png");
await browser.close();
