// Canvas illustration engine for SEO images (runs inside Chromium). No dependencies, no network.
const W = 1200, H = 630;
let R = Math.random, ctx = null;
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const rnd = (a = 0, b = 1) => a + (b - a) * R();
const rint = (a, b) => Math.floor(rnd(a, b + 1));
const pick = a => a[Math.floor(R() * a.length)];
function hex(c) { c = c.replace('#', ''); if (c.length === 3) c = c.split('').map(x => x + x).join(''); return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)]; }
function rgb(a, al = 1) { return `rgba(${Math.round(a[0])},${Math.round(a[1])},${Math.round(a[2])},${al})`; }
function mix(c1, c2, t) { const a = hex(c1), b = hex(c2); return '#' + a.map((v, i) => Math.round(v + (b[i] - v) * t).toString(16).padStart(2, '0')).join(''); }
function shade(c, t) { return t >= 0 ? mix(c, '#ffffff', t) : mix(c, '#000000', -t); }
function alpha(c, a) { return rgb(hex(c), a); }

function noise1(n) { const p = []; for (let i = 0; i <= n + 2; i++) p.push(R()); return x => { const i = Math.floor(x), f = x - i, t = (1 - Math.cos(f * Math.PI)) / 2; return p[i] * (1 - t) + p[i + 1] * t; }; }
function fbm(oct, base) { const ns = []; for (let o = 0; o < oct; o++) ns.push(noise1(Math.ceil(base * 2 ** o) + 2)); return u => { let s = 0, a = 1, n = 0; for (let o = 0; o < oct; o++) { s += a * ns[o](Math.max(0, u) * base * 2 ** o); n += a; a *= 0.5; } return s / n; }; }

function poly(pts, fill, stroke, lw = 1) { ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); } }
function rect(x, y, w, h, fill) { ctx.fillStyle = fill; ctx.fillRect(x, y, w, h); }
function rrect(x, y, w, h, r, fill, stroke, lw = 1) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); } }
function circle(x, y, r, fill, stroke, lw = 1) { ctx.beginPath(); ctx.arc(x, y, Math.max(0.1, r), 0, Math.PI * 2); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); } }
function ellipse(x, y, rx, ry, fill, rot = 0) { ctx.beginPath(); ctx.ellipse(x, y, Math.max(0.1, rx), Math.max(0.1, ry), rot, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill(); }
function line(x1, y1, x2, y2, c, lw = 1) { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.stroke(); }
function lgrad(x1, y1, x2, y2, stops) { const g = ctx.createLinearGradient(x1, y1, x2, y2); stops.forEach(([o, c]) => g.addColorStop(o, c)); return g; }
function rgrad(x, y, r0, r1, stops) { const g = ctx.createRadialGradient(x, y, r0, x, y, r1); stops.forEach(([o, c]) => g.addColorStop(o, c)); return g; }
function withClip(pathFn, draw) { ctx.save(); ctx.beginPath(); pathFn(); ctx.clip(); draw(); ctx.restore(); }

const SKY = {
  dawn: { top: '#93acd2', mid: '#f0c4ad', bot: '#fbe4cb', sun: '#fff1d2', haze: '#f2d6c4', light: '#ffe2c4' },
  morning: { top: '#74afdd', mid: '#b7dcf1', bot: '#edf6f8', sun: '#fffbe8', haze: '#d6e8ef', light: '#fff8e6' },
  noon: { top: '#4f9bd8', mid: '#a2d0ee', bot: '#e2f2f7', sun: '#ffffff', haze: '#cfe4ee', light: '#ffffff' },
  golden: { top: '#e39a62', mid: '#f5c58a', bot: '#fde6c1', sun: '#fff0cc', haze: '#f2cfa3', light: '#ffd9a0' },
  dusk: { top: '#323c6b', mid: '#a9667c', bot: '#efa06d', sun: '#ffd498', haze: '#c38787', light: '#ffb684' },
  night: { top: '#0b1530', mid: '#1b2a51', bot: '#37447a', sun: '#f3f0cf', haze: '#2a3863', light: '#ffd27a' },
  overcast: { top: '#8995a1', mid: '#b5bec5', bot: '#dbe0e2', sun: null, haze: '#c5ccd0', light: '#eef0f0' },
  rain: { top: '#56616d', mid: '#808b95', bot: '#aab3b9', sun: null, haze: '#949ea6', light: '#d8dde0' },
  mist: { top: '#b4c2c9', mid: '#d3dcdf', bot: '#edf0ee', sun: '#fbfbf5', haze: '#dfe5e4', light: '#f6f6f0' },
};
let S = SKY.morning, TIME = 'morning';
function sky(time, horizon = 360, opts = {}) {
  TIME = time; S = SKY[time];
  rect(0, 0, W, H, lgrad(0, 0, 0, horizon, [[0, S.top], [0.6, S.mid], [1, S.bot]]));
  if (time === 'night') { for (let i = 0; i < 160; i++) circle(rnd(0, W), rnd(0, horizon * 0.8), rnd(0.4, 1.6), alpha('#ffffff', rnd(0.3, 0.9))); }
  if (S.sun && opts.sun !== false) {
    const sx = opts.sunX ?? rnd(150, 1050), sy = opts.sunY ?? (time === 'noon' ? 80 : time === 'morning' ? 120 : time === 'night' ? 90 : horizon - rnd(60, 120));
    const r = time === 'night' ? 26 : 38;
    rect(0, 0, W, H, rgrad(sx, sy, 0, 420, [[0, alpha(S.light, 0.55)], [1, alpha(S.light, 0)]]));
    circle(sx, sy, r, S.sun);
    if (time === 'night') { circle(sx, sy, r, '#f3efd2'); circle(sx - 8, sy - 5, r * 0.22, alpha('#d8d2b0', 0.7)); circle(sx + 9, sy + 8, r * 0.15, alpha('#d8d2b0', 0.7)); }
  }
  if (opts.clouds !== false) clouds(time === 'overcast' || time === 'rain' ? 14 : rint(3, 7), horizon);
}
function cloud(x, y, s, c) { for (let i = 0; i < 7; i++) ellipse(x + rnd(-1.2, 1.2) * s, y + rnd(-0.25, 0.2) * s, s * rnd(0.6, 1.1), s * rnd(0.35, 0.55), c); }
function clouds(n, horizon) {
  const base = TIME === 'night' ? '#3a4874' : TIME === 'dusk' ? '#e8a99a' : TIME === 'golden' ? '#fff0d8' : TIME === 'rain' ? '#6d7781' : '#ffffff';
  for (let i = 0; i < n; i++) { const y = rnd(40, horizon * 0.7); cloud(rnd(-50, W + 50), y, rnd(30, 70), alpha(base, TIME === 'rain' || TIME === 'overcast' ? 0.55 : 0.5)); }
}
function haze(y0, y1, a = 0.5) { rect(0, y0, W, y1 - y0, lgrad(0, y0, 0, y1, [[0, alpha(S.haze, 0)], [0.5, alpha(S.haze, a)], [1, alpha(S.haze, 0)]])); }
function depth(c, d) { return mix(c, S.haze, d); }

// Grain + vignette: gives a printed, painterly finish and real tonal detail.
function finish(grain = 14, vignette = 0.22) {
  const img = ctx.getImageData(0, 0, W, H), d = img.data;
  for (let i = 0; i < d.length; i += 4) { const n = (R() - 0.5) * grain; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
  ctx.putImageData(img, 0, 0);
  rect(0, 0, W, H, rgrad(W / 2, H / 2, H * 0.45, W * 0.75, [[0, 'rgba(0,0,0,0)'], [1, `rgba(20,15,10,${vignette})`]]));
}
