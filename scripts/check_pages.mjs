// Load every live page in headless Chromium at phone and desktop width and
// report sideways scrolling, JavaScript errors and failed local requests.
// Pages changed in the PR (CHANGED_FILES, newline-separated) fail the run;
// problems on other pages are warnings, so old issues don't block new work.
// Needs the site served at BASE_URL (default http://localhost:8899/).
import { execFileSync } from "node:child_process";
import { chromium } from "playwright";

const BASE = process.env.BASE_URL || "http://localhost:8899/";
const pages = execFileSync("python3", ["scripts/site_pages.py", "--no-redirects"], { encoding: "utf8" }).trim().split("\n");
const changed = new Set((process.env.CHANGED_FILES || "").split("\n").map((s) => s.trim()).filter(Boolean));
const sharedChanged = [...changed].some((f) => f.startsWith("css/") || f.startsWith("js/"));
const strict = (page) => sharedChanged || changed.size === 0 || changed.has(page);

const viewports = [
  { name: "390px", width: 390, height: 844 },
  { name: "1440px", width: 1440, height: 900 },
];

const browser = await chromium.launch();
let failures = 0;
for (const vp of viewports) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  // Only the local site is under test; third-party requests are dropped.
  await context.route("**/*", (route) =>
    route.request().url().startsWith(BASE) ? route.continue() : route.abort()
  );
  for (const page of pages) {
    const tab = await context.newPage();
    const problems = [];
    tab.on("pageerror", (e) => problems.push(`JavaScript error: ${e.message}`));
    tab.on("response", (r) => {
      if (r.url().startsWith(BASE) && r.status() >= 400) {
        problems.push(`${r.status()} for ${decodeURIComponent(r.url().slice(BASE.length))}`);
      }
    });
    try {
      await tab.goto(BASE + encodeURI(page), { waitUntil: "load", timeout: 30000 });
      // Scroll through so lazy images and reveal scripts run.
      await tab.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 700) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 30));
        }
      });
      await tab.waitForTimeout(300);
      const overflow = await tab.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (overflow > 1) problems.push(`scrolls sideways by ${overflow}px`);
    } catch (e) {
      problems.push(`did not load: ${e.message.split("\n")[0]}`);
    }
    for (const p of new Set(problems)) {
      const level = strict(page) ? "error" : "warning";
      if (level === "error") failures++;
      console.log(`::${level} file=${page}::${vp.name}: ${p}`);
    }
    await tab.close();
  }
  await context.close();
}
await browser.close();
console.log(`Checked ${pages.length} pages at ${viewports.length} widths: ${failures} failure(s).`);
process.exit(failures ? 1 : 0);
