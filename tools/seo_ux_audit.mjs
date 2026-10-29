#!/usr/bin/env node
// Local lab UX/accessibility audit of the built site (_site) in headless Chromium.
// Usage: node tools/seo_ux_audit.mjs [--out file.json] [--limit N] [path/index.html ...]
// Observations are local lab renders (no network throttling, no field data): they support the
// ledger UX_CRO dimension (layout, anchors, CTA, focus, contrast, tap targets) and G19/G20 inputs.
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const {chromium} = require('playwright');
const root = process.cwd(), site = path.join(root, '_site');
const args = process.argv.slice(2);
const opt = k => { const i = args.indexOf(k); if (i < 0) return null; const v = args[i + 1]; args.splice(i, 2); return v; };
const out = opt('--out'), limit = Number(opt('--limit') || 0);
const facts = JSON.parse(fs.readFileSync('data/seo-business-facts.json', 'utf8'));
const types = {'.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.png': 'image/png', '.xml': 'application/xml', '.txt': 'text/plain', '.ico': 'image/x-icon'};
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join(site, p);
  if (!f.startsWith(site) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end('nf'); }
  res.writeHead(200, {'content-type': types[path.extname(f)] || 'application/octet-stream'});
  fs.createReadStream(f).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

function listPages() {
  const all = [];
  const walk = d => { for (const n of fs.readdirSync(d)) { const f = path.join(d, n); if (fs.statSync(f).isDirectory()) walk(f); else if (n === 'index.html') all.push(path.relative(site, f)); } };
  walk(site);
  return all.filter(p => !/data-page-type="redirect"/.test(fs.readFileSync(path.join(site, p), 'utf8'))).sort();
}
let pages = args.length ? args.map(a => a.replace(/^\.\//, '')) : listPages();
if (limit) pages = pages.slice(0, limit);

const probe = (phone) => {
  const lum = c => { const m = c.match(/[\d.]+/g); if (!m) return null; const [r, g, b] = m.slice(0, 3).map(Number).map(v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }); return .2126 * r + .7152 * g + .0722 * b; };
  const bgOf = el => { for (let e = el; e; e = e.parentElement) { const s = getComputedStyle(e); const g = s.backgroundImage.match(/rgba?\([^)]*\)/); if (g) return g[0]; const c = s.backgroundColor; const a = c.match(/[\d.]+/g); if (a && (a.length < 4 || Number(a[3]) > 0.5)) return c; } return 'rgb(255,255,255)'; };
  const ratio = el => { const L1 = lum(getComputedStyle(el).color), L2 = lum(bgOf(el)); if (L1 == null || L2 == null) return null; const [a, b] = [Math.max(L1, L2), Math.min(L1, L2)]; return (a + .05) / (b + .05); };
  const main = document.querySelector('main');
  const h1 = document.querySelector('h1');
  const h1Box = h1 && h1.getBoundingClientRect();
  const hero = document.querySelector('.seo-image img');
  const anchors = [...document.querySelectorAll('main a[href^="#"]')].map(a => a.getAttribute('href').slice(1)).filter(Boolean);
  const missingAnchors = anchors.filter(id => !document.getElementById(decodeURIComponent(id)));
  const tel = [...document.querySelectorAll('a[href^="tel:"]')].map(a => a.getAttribute('href'));
  const zalo = [...document.querySelectorAll('a[href*="zalo.me"]')].map(a => a.getAttribute('href'));
  const wa = [...document.querySelectorAll('a[href*="wa.me"]')].map(a => a.getAttribute('href'));
  const paras = [...document.querySelectorAll('main p, main li, .eyebrow')].filter(p => p.textContent.trim().length > 12).slice(0, 40);
  const bodyParas = paras.filter(p => p.tagName === 'P' && !p.classList.contains('eyebrow') && p.textContent.trim().length > 40);
  const contrasts = paras.map(ratio).filter(x => x != null);
  const fontSizes = bodyParas.map(p => parseFloat(getComputedStyle(p).fontSize));
  const interactive = [...document.querySelectorAll('header a, header button, .quick-contact a, .quick-contact button, .cta-actions a, .context-links a, button')]
    .filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; });
  const smallTargets = interactive.filter(e => { const r = e.getBoundingClientRect(); return r.width < 24 || r.height < 24; }).map(e => (e.textContent || e.getAttribute('aria-label') || e.tagName).trim().slice(0, 30));
  const unlabeled = interactive.filter(e => !(e.textContent.trim() || e.getAttribute('aria-label') || e.getAttribute('title'))).length;
  const fixedCover = [...document.querySelectorAll('body *')].filter(e => { const s = getComputedStyle(e); if (s.position !== 'fixed' || s.display === 'none' || s.visibility === 'hidden') return false; const r = e.getBoundingClientRect(); return r.width * r.height > innerWidth * innerHeight * .3; }).length;
  const footer = document.querySelector('footer');
  const ftxt = footer ? footer.textContent : '';
  const tables = [...document.querySelectorAll('main table')].filter(t => { const w = t.closest('.table-scroll'); return !w && t.scrollWidth > (main ? main.clientWidth : innerWidth) + 1; }).length;
  const imgsNoDims = [...document.querySelectorAll('main img')].filter(i => !i.getAttribute('width') || !i.getAttribute('height')).length;
  return {
    overflowX: document.documentElement.scrollWidth > innerWidth + 1,
    scrollWidth: document.documentElement.scrollWidth,
    h1: h1 ? h1.textContent.trim() : null,
    h1Visible: !!(h1Box && h1Box.width > 0 && h1Box.height > 0),
    h1Count: document.querySelectorAll('h1').length,
    heroLoaded: !!(hero && hero.complete && hero.naturalWidth === 1200),
    anchors: anchors.length, missingAnchors,
    tocLinks: document.querySelectorAll('.article-toc a').length,
    telOk: tel.length > 0 && tel.every(t => t.replace(/\D/g, '') === phone.replace(/\D/g, '')),
    tel: [...new Set(tel)], zalo: [...new Set(zalo)], wa: [...new Set(wa)],
    footerNap: /Ngõ 5 Nguyễn Văn Cừ/.test(ftxt) && /09:00/.test(ftxt) && /21:00/.test(ftxt),
    minContrast: contrasts.length ? Math.min(...contrasts) : null,
    minFont: fontSizes.length ? Math.min(...fontSizes) : null,
    smallTargets, unlabeled, fixedCover, tablesOverflowing: tables, imgsNoDims,
    lang: document.documentElement.lang,
  };
};

const browser = await chromium.launch();
const viewports = {
  mobile: {viewport: {width: 390, height: 844}, deviceScaleFactor: 2, isMobile: true, hasTouch: true},
  desktop: {viewport: {width: 1366, height: 900}},
};
const results = {};
const contexts = {};
for (const [name, cfg] of Object.entries(viewports)) {
  contexts[name] = await browser.newContext(cfg);
  await contexts[name].addInitScript(() => {
    window.__cls = 0; window.__lcp = 0;
    try {
      new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({type: 'layout-shift', buffered: true});
      new PerformanceObserver(l => { const e = l.getEntries().at(-1); if (e) window.__lcp = e.startTime; }).observe({type: 'largest-contentful-paint', buffered: true});
    } catch (e) { /* unsupported */ }
  });
}
let done = 0;
async function audit(rel, name) {
  const page = await contexts[name].newPage();
  const errors = [], failed = [];
  page.on('pageerror', e => errors.push(String(e).slice(0, 160)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 160)); });
  page.on('requestfailed', r => failed.push(r.url()));
  page.on('response', r => { if (r.status() >= 400 && r.url().startsWith(base)) failed.push(r.status() + ' ' + r.url().replace(base, '')); });
  const url = base + '/' + rel.replace(/index\.html$/, '');
  try {
    await page.goto(url, {waitUntil: 'load', timeout: 30000});
    await page.waitForTimeout(150);
    const data = await page.evaluate(probe, facts.phone_e164);
    // keyboard: first 6 Tab stops must show a focus indicator
    const focus = [];
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Tab');
      focus.push(await page.evaluate(() => { const e = document.activeElement; if (!e || e === document.body) return null; const s = getComputedStyle(e); const r = e.getBoundingClientRect(); return {tag: e.tagName, visible: r.width > 0 && r.height > 0, indicator: (s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0) || s.boxShadow !== 'none'}; }));
    }
    const perf = await page.evaluate(() => ({cls: window.__cls, lcp: window.__lcp}));
    data.focusStops = focus.filter(Boolean).length;
    data.focusWithoutIndicator = focus.filter(f => f && (!f.visible || !f.indicator)).length;
    data.labCls = Number(perf.cls.toFixed(4));
    data.labLcpMs = Math.round(perf.lcp);
    data.consoleErrors = errors;
    data.failedRequests = [...new Set(failed)];
    const problems = [];
    if (data.overflowX) problems.push('horizontal overflow ' + data.scrollWidth);
    if (!data.h1Visible || data.h1Count !== 1) problems.push('H1');
    if (!data.heroLoaded) problems.push('hero image not loaded');
    if (data.missingAnchors.length) problems.push('missing anchors ' + data.missingAnchors.slice(0, 3).join(','));
    if (!data.telOk) problems.push('tel link missing/wrong ' + data.tel.join(','));
    if (!data.zalo.length || !data.wa.length) problems.push('zalo/whatsapp link missing');
    if (!data.footerNap) problems.push('footer NAP/hours missing');
    if (data.minContrast != null && data.minContrast < 4.5) problems.push('text contrast ' + data.minContrast.toFixed(2));
    if (data.minFont != null && data.minFont < 14) problems.push('body font ' + data.minFont);
    if (data.fixedCover) problems.push('fixed overlay covers >30% viewport');
    if (data.tablesOverflowing) problems.push('table overflows without scroll wrapper');
    if (data.imgsNoDims) problems.push('img without dimensions');
    if (data.focusWithoutIndicator) problems.push('focus indicator missing on ' + data.focusWithoutIndicator + ' stops');
    if (data.unlabeled) problems.push(data.unlabeled + ' unlabeled controls');
    if (data.failedRequests.length) problems.push('failed requests ' + data.failedRequests.slice(0, 3).join(','));
    if (data.consoleErrors.length) problems.push('console errors ' + data.consoleErrors.slice(0, 2).join(' | '));
    if (data.labCls > 0.1) problems.push('lab CLS ' + data.labCls);
    data.problems = problems;
    return data;
  } catch (e) {
    return {problems: ['load failed ' + String(e).slice(0, 120)]};
  } finally {
    await page.close();
  }
}
const queue = [...pages];
async function worker() {
  while (queue.length) {
    const rel = queue.shift();
    results[rel] = {};
    for (const name of Object.keys(viewports)) results[rel][name] = await audit(rel, name);
    if (++done % 50 === 0) console.error(`audited ${done}/${pages.length}`);
  }
}
await Promise.all(Array.from({length: 4}, worker));
await browser.close();
server.close();
const failing = Object.entries(results).filter(([, v]) => Object.values(v).some(x => x.problems.length));
const counter = {};
for (const [, v] of failing) for (const x of Object.values(v)) for (const p of x.problems) { const k = p.replace(/[\d.,/:-]+.*$/, '').trim(); counter[k] = (counter[k] || 0) + 1; }
const smallSet = {};
for (const v of Object.values(results)) for (const x of Object.values(v)) for (const s of x.smallTargets || []) smallSet[s] = (smallSet[s] || 0) + 1;
const meta = {generated: new Date().toISOString(), method: 'Local lab: _site served on 127.0.0.1, headless Chromium (Playwright), mobile 390x844 DPR2 touch and desktop 1366x900, no throttling; not field data', pages: pages.length};
if (out) fs.writeFileSync(out, JSON.stringify({meta, results}, null, 1) + '\n');
console.log(JSON.stringify({...meta, failingPages: failing.length, problemCounts: counter, smallTargetsSeen: smallSet, examples: failing.slice(0, 8).map(([k, v]) => [k, v.mobile.problems, v.desktop.problems])}, null, 2));
