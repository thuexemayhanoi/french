#!/usr/bin/env node
// Lab loading measurement of built pages (G20): local _site served on 127.0.0.1, headless Chromium,
// mobile 390x844, simulated slow 4G (150 ms RTT, ~1.6 Mbps down, 750 kbps up) and 4x CPU slowdown.
// Reports LCP element/time, CLS, long-task total, request count and transferred bytes per resource type.
// These are lab estimates for regression comparison only — not CrUX/field Core Web Vitals.
// Usage: node tools/seo_lab_perf.mjs [path/index.html ...]
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const {chromium} = require('playwright');
const site = path.join(process.cwd(), '_site');
const pages = process.argv.slice(2).length ? process.argv.slice(2) : ['index.html', 'location-moto-hanoi/index.html', 'prix-location/index.html', 'honda/index.html', 'location-moto-hanoi/same-jour-location-moto-hanoi/index.html', 'contact/index.html'];
const types = {'.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.webp': 'image/webp', '.svg': 'image/svg+xml'};
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join(site, p);
  if (!f.startsWith(site) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, {'content-type': types[path.extname(f)] || 'application/octet-stream'});
  fs.createReadStream(f).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch();
const out = {method: 'Lab: local _site, headless Chromium mobile 390x844, slow-4G emulation (150ms RTT, 1.6Mbps), CPU 4x; not field data', pages: {}};
for (const rel of pages) {
  const ctx = await browser.newContext({viewport: {width: 390, height: 844}, deviceScaleFactor: 2, isMobile: true, hasTouch: true});
  await ctx.addInitScript(() => {
    window.__m = {cls: 0, lcp: 0, lcpEl: '', lt: 0};
    new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__m.cls += e.value; }).observe({type: 'layout-shift', buffered: true});
    new PerformanceObserver(l => { const e = l.getEntries().at(-1); if (e) { window.__m.lcp = e.startTime; window.__m.lcpEl = e.element ? e.element.tagName + (e.element.className ? '.' + e.element.className : '') : ''; } }).observe({type: 'largest-contentful-paint', buffered: true});
    new PerformanceObserver(l => { for (const e of l.getEntries()) window.__m.lt += Math.max(0, e.duration - 50); }).observe({type: 'longtask', buffered: true});
  });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', {offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8});
  await cdp.send('Emulation.setCPUThrottlingRate', {rate: 4});
  const bytes = {};
  let requests = 0;
  page.on('response', async r => { requests++; try { const b = (await r.body()).length; const t = r.request().resourceType(); bytes[t] = (bytes[t] || 0) + b; } catch { /* redirect/no body */ } });
  const t0 = Date.now();
  await page.goto(base + '/' + rel.replace(/index\.html$/, ''), {waitUntil: 'load', timeout: 90000});
  const loadMs = Date.now() - t0;
  await page.waitForTimeout(1500);
  const m = await page.evaluate(() => window.__m);
  out.pages[rel] = {loadMs, labLcpMs: Math.round(m.lcp), lcpElement: m.lcpEl, labCls: Number(m.cls.toFixed(4)), longTaskOver50ms: Math.round(m.lt), requests, kib: Object.fromEntries(Object.entries(bytes).map(([k, v]) => [k, Math.round(v / 1024)]))};
  await ctx.close();
}
await browser.close();
server.close();
console.log(JSON.stringify(out, null, 1));
