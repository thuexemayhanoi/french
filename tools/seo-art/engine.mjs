// Node side of the illustration engine: renders scene specs in the pre-installed Chromium
// and encodes real WebP bytes sized for the image-SEO matrix (150–300 KiB, 1200×630).
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const SOURCES = ['core', 'bikes', 'land', 'city', 'still', 'scenes-common', 'scenes-land', 'scenes-city', 'scenes-still'];
export const MIN_BYTES = 150 * 1024 + 4096, MAX_BYTES = 300 * 1024 - 4096;

export async function openEngine() {
  const {chromium} = require('playwright');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent('<canvas id="c" width="1200" height="630"></canvas>');
  const src = SOURCES.filter(f => fs.existsSync(path.join(here, f + '.js'))).map(f => fs.readFileSync(path.join(here, f + '.js'), 'utf8')).join('\n;\n');
  await page.addScriptTag({content: src + `
;window.__render = sp => { R = mulberry32(sp.seed >>> 0); const c = document.getElementById('c'); ctx = c.getContext('2d'); ctx.setTransform(1,0,0,1,0,0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.setLineDash([]); shadowOff(); ctx.clearRect(0,0,W,H);
  if (!SCENES[sp.scene]) throw new Error('Unknown scene ' + sp.scene); if (sp.mirror) { ctx.translate(W, 0); ctx.scale(-1, 1); } const desc = SCENES[sp.scene](sp); shadowOff(); if (sp.time === 'rain' && !['rain_street','flood_street'].includes(sp.scene)) rain(420, 0.3); ctx.setTransform(1,0,0,1,0,0); ctx.globalAlpha = 1; finish(sp.grain ?? 14, sp.vignette ?? 0.2); return desc; };
window.__encode = (type, q) => document.getElementById('c').toDataURL(type, q);`});
  async function render(spec, {png = false} = {}) {
    let grain = spec.grain ?? 14, desc, bytes, quality;
    for (let attempt = 0; attempt < 6; attempt++) {
      desc = await page.evaluate(sp => window.__render(sp), {...spec, grain});
      if (png) return {desc, bytes: Buffer.from((await page.evaluate(() => window.__encode('image/png'))).split(',')[1], 'base64')};
      let lo = 0.5, hi = 1, best = null;
      for (let i = 0; i < 9; i++) {
        const q = i === 0 ? 0.86 : (lo + hi) / 2;
        const b = Buffer.from((await page.evaluate(q => window.__encode('image/webp', q), q)).split(',')[1], 'base64');
        if (b.length < MIN_BYTES) lo = q; else if (b.length > MAX_BYTES) hi = q; else { best = {b, q}; if (b.length > (MIN_BYTES + MAX_BYTES) / 2) hi = q; else break; }
      }
      if (best) { bytes = best.b; quality = best.q; break; }
      // Could not land in range: adjust grain texture and retry.
      const probe = Buffer.from((await page.evaluate(() => window.__encode('image/webp', 1))).split(',')[1], 'base64');
      grain = probe.length < MIN_BYTES ? grain + 8 : Math.max(2, grain - 6);
    }
    if (!bytes) throw new Error('Could not reach target WebP size for ' + spec.id);
    return {desc, bytes, quality, grain};
  }
  return {render, close: () => browser.close()};
}
