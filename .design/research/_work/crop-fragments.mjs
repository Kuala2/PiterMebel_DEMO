import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { loadPlaywright } from "file:///C:/Users/Titar/.codex/skills/reference-scout/scripts/lib.mjs";

const root = process.cwd();
const refs = path.join(root, ".design", "research", "references");
const out = path.join(root, ".design", "research", "fragments");
fs.mkdirSync(out, { recursive: true });

const specs = [
  ["F01-ft-home-hero.png", "ft-bespoke-desktop-first.png", 0, 0, 1440, 650],
  ["F02-ft-portfolio-media.png", "ft-bespoke-portfolio-desktop-first.png", 0, 0, 1440, 720],
  ["F03-matthew-tables-listing.png", "matthew-cox-tables-desktop-first.png", 0, 0, 1440, 720],
  ["F04-matthew-fire-detail.png", "matthew-cox-fire-table-desktop-first.png", 0, 0, 1440, 720],
  ["F05-dis-portfolio-commercial.png", "dis-mebel-portfolio-desktop-first.png", 0, 0, 1440, 760],
  ["F06-dis-production-proof.png", "dis-mebel-production-desktop-first.png", 0, 180, 1440, 700],
  ["F07-london-what-we-do-type.png", "london-furniture-studio-what-we-do-desktop-first.png", 0, 0, 1440, 720],
  ["F08-london-projects-grid.png", "london-furniture-studio-projects-desktop-first.png", 0, 0, 1440, 760],
  ["F09-ft-home-mobile.png", "ft-bespoke-mobile-first.png", 0, 0, 390, 844],
  ["F10-dis-home-mobile.png", "dis-mebel-mobile-first.png", 0, 0, 390, 844]
];

const { chromium } = loadPlaywright();
const browser = await chromium.launch({ headless: true });
try {
  for (const [name, source, x, y, width, height] of specs) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    try {
      await page.goto(pathToFileURL(path.join(refs, source)).href, { waitUntil: "load" });
      await page.evaluate(() => {
        document.documentElement.style.margin = "0";
        document.body.style.margin = "0";
        const img = document.querySelector("img");
        if (img) {
          img.style.display = "block";
          img.style.margin = "0";
        }
      });
      await page.screenshot({ path: path.join(out, name), clip: { x, y, width, height } });
      console.log(`[OK] ${name} <- ${source}`);
    } finally {
      await page.close();
    }
  }
} finally {
  await browser.close();
}
