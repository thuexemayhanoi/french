// Landscape building blocks.
function ridgeFn(y0, amp, base = 3, oct = 4) { const f = fbm(oct, base); return x => y0 - amp * f(x / W); }
function fillBelow(fn, color, yBottom = H) { ctx.beginPath(); ctx.moveTo(0, yBottom); for (let x = 0; x <= W; x += 4) ctx.lineTo(x, fn(x)); ctx.lineTo(W, yBottom); ctx.closePath(); ctx.fillStyle = color; ctx.fill(); }
function pathBelow(fn, yBottom = H) { ctx.moveTo(0, yBottom); for (let x = 0; x <= W; x += 4) ctx.lineTo(x, fn(x)); ctx.lineTo(W, yBottom); ctx.closePath(); }
function mountains(n, yTop, yBase, green = '#4f7a4a', o = {}) {
  let last;
  for (let i = 0; i < n; i++) {
    const t = i / Math.max(1, n - 1), y0 = yTop + (yBase - yTop) * t, amp = (o.amp || 150) * (1 - t * 0.45);
    const fn = ridgeFn(y0 + amp * 0.5, amp, o.base || rnd(2, 4), 5);
    const c = depth(shade(green, -0.15 * t), 0.75 * (1 - t));
    fillBelow(fn, c);
    if (o.mistBetween && i < n - 1) haze(y0 + amp * 0.2, y0 + amp * 0.9, 0.55);
    if (o.forest && t > 0.4) speckle(fn, shade(c, -0.15), 160 * t, 2 + 3 * t);
    last = fn;
  }
  return last;
}
function speckle(fn, color, n, size, depthBand = 80) { for (let i = 0; i < n; i++) { const x = rnd(0, W), y = fn(x) + rnd(4, depthBand); circle(x, y, rnd(size * 0.6, size * 1.4), color); } }
function karst(yBase, count, hmin, hmax, color, o = {}) {
  const towers = []; for (let i = 0; i < count; i++) towers.push({ cx: rnd(-60, W + 60), w: rnd(40, 110) * (o.wide || 1), h: rnd(hmin, hmax), p: rnd(2.2, 4) });
  const n = fbm(3, 30);
  const fn = x => { let m = 0; for (const t of towers) { const d = Math.abs(x - t.cx) / t.w; if (d < 1) m = Math.max(m, t.h * Math.pow(1 - Math.pow(d, t.p), 1 / t.p)); } return yBase - m - n(x / W) * 8; };
  fillBelow(fn, color, yBase + 2);
  if (o.texture !== false) { ctx.save(); ctx.beginPath(); pathBelow(fn, yBase + 2); ctx.clip(); for (let i = 0; i < (o.dots || 500); i++) { const x = rnd(0, W), y = rnd(fn(x), yBase); circle(x, y, rnd(1.2, 3.5), alpha(shade(color, R() < 0.5 ? -0.18 : 0.1), 0.6)); } ctx.restore(); }
  return fn;
}
function water(y0, y1, c1, c2) {
  rect(0, y0, W, y1 - y0, lgrad(0, y0, 0, y1, [[0, c1], [1, c2]]));
  for (let i = 0; i < 140; i++) { const y = rnd(y0 + 2, y1), w = rnd(10, 60) * (0.4 + (y - y0) / (y1 - y0)); rect(rnd(0, W), y, w, 1.4, alpha('#ffffff', rnd(0.08, 0.28))); }
}
function reflect(drawFn, axisY, a = 0.25) { ctx.save(); ctx.globalAlpha = a; ctx.translate(0, axisY * 2); ctx.scale(1, -1); ctx.beginPath(); ctx.rect(0, 0, W, axisY); ctx.clip(); drawFn(); ctx.restore(); }
// Road ribbon from a list of [x,y,width] control points (far → near). Drawn as overlapping quads (no self-intersection artifacts).
function road(pts, o = {}) {
  const c = [];
  for (let i = 0; i < pts.length - 1; i++) for (let k = 0; k < 16; k++) { const t = k / 16, a = pts[i], b = pts[i + 1]; c.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]); }
  c.push(pts[pts.length - 1].slice());
  for (let it = 0; it < 8; it++) for (let i = 1; i < c.length - 1; i++) { c[i][0] = (c[i - 1][0] + c[i][0] * 2 + c[i + 1][0]) / 4; c[i][1] = (c[i - 1][1] + c[i][1] * 2 + c[i + 1][1]) / 4; }
  const nrm = c.map((p, i) => { const q = c[Math.min(i + 1, c.length - 1)], r0 = c[Math.max(i - 1, 0)]; let dx = q[0] - r0[0], dy = q[1] - r0[1]; const l = Math.hypot(dx, dy) || 1; return [-dy / l, dx / l]; });
  const pass = (k, col) => { for (let i = 0; i < c.length - 1; i++) { const a = c[i], b = c[i + 1], na = nrm[i], nb = nrm[i + 1], wa = a[2] * k / 2, wb = b[2] * k / 2; poly([[a[0] + na[0] * wa, a[1] + na[1] * wa], [b[0] + nb[0] * wb, b[1] + nb[1] * wb], [b[0] - nb[0] * wb, b[1] - nb[1] * wb], [a[0] - na[0] * wa, a[1] - na[1] * wa]], col, col, 0.8); } };
  if (o.shoulder) pass(1.3, o.shoulder);
  pass(1.08, o.edge || '#e9e6dc');
  pass(1.0, o.color || '#6c6f73');
  if (o.center !== false) { for (let i = 1; i < c.length; i += 2) { const a = c[i - 1], b = c[i]; line(a[0], a[1], b[0], b[1], o.centerColor || '#f1d36b', Math.max(1, a[2] / 40)); } }
  return c;
}
function palm(x, y, s, c = '#3f7d46') {
  ctx.lineCap = 'round'; const lean = rnd(-0.35, 0.35); const tx = x + lean * s * 1.2, ty = y - s * 1.6;
  ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + lean * s * 0.2, y - s * 0.8, tx, ty); ctx.strokeStyle = '#7b6247'; ctx.lineWidth = s * 0.09; ctx.stroke();
  for (let i = 0; i < 9; i++) { const a = -Math.PI / 2 + (i - 4) * 0.42 + rnd(-0.1, 0.1), l = s * rnd(0.7, 0.95); const ex = tx + Math.cos(a) * l, ey = ty + Math.sin(a) * l * 0.6 + l * 0.35; ctx.beginPath(); ctx.moveTo(tx, ty); ctx.quadraticCurveTo((tx + ex) / 2 + Math.cos(a) * 8, ty + Math.sin(a) * l * 0.5 - 10, ex, ey); ctx.strokeStyle = shade(c, rnd(-0.15, 0.1)); ctx.lineWidth = s * 0.08; ctx.stroke(); }
  circle(tx, ty + 3, s * 0.06, '#6d5a3a');
}
function pine(x, y, s, c = '#355f45') { rect(x - s * 0.04, y - s * 0.3, s * 0.08, s * 0.3, '#5b4634'); for (let i = 0; i < 4; i++) { const yy = y - s * 0.25 - i * s * 0.28, w = s * (0.42 - i * 0.08); poly([[x - w, yy], [x + w, yy], [x, yy - s * 0.5]], shade(c, i * 0.04)); } }
function roundTree(x, y, s, c = '#5a8a4c') { rect(x - s * 0.05, y - s * 0.5, s * 0.1, s * 0.5, '#5e4836'); for (let i = 0; i < 6; i++) circle(x + rnd(-0.35, 0.35) * s, y - s * 0.7 + rnd(-0.3, 0.2) * s, s * rnd(0.28, 0.42), shade(c, rnd(-0.12, 0.1))); }
function bamboo(x, y, s, c = '#6f9a4e') { for (let i = 0; i < 7; i++) { const bx = x + rnd(-0.3, 0.3) * s, top = y - s * rnd(1.2, 1.8); ctx.beginPath(); ctx.moveTo(bx, y); ctx.quadraticCurveTo(bx, (y + top) / 2, bx + rnd(-0.4, 0.4) * s, top); ctx.strokeStyle = shade(c, -0.2); ctx.lineWidth = s * 0.03; ctx.stroke(); for (let k = 0; k < 6; k++) ellipse(bx + rnd(-0.4, 0.4) * s, top + rnd(0, 0.8) * s, s * 0.12, s * 0.03, shade(c, rnd(-0.1, 0.15)), rnd(-0.6, 0.6)); } }
function grass(y0, y1, c, n = 400) { for (let i = 0; i < n; i++) { const x = rnd(0, W), y = rnd(y0, y1), h = 3 + (y - y0) / (y1 - y0 + 1) * 10; line(x, y, x + rnd(-2, 2), y - h, alpha(shade(c, rnd(-0.2, 0.2)), 0.6), 1.2); } }
function paddies(y0, y1, cols = ['#8fbf5a', '#7fb150', '#a4c96a'], vanishX = W / 2) {
  const rows = 9; for (let i = 0; i < rows; i++) { const a = Math.pow(i / rows, 1.7), b = Math.pow((i + 1) / rows, 1.7), ya = y0 + (y1 - y0) * a, yb = y0 + (y1 - y0) * b; rect(0, ya, W, yb - ya + 1, cols[i % cols.length]); line(0, yb, W, yb, alpha('#e9e2c4', 0.6), 1 + b * 3); }
  for (let k = -8; k <= 8; k++) line(vanishX + k * 30, y0, vanishX + k * 260, y1, alpha('#e9e2c4', 0.45), 2);
}
function terraces(hillFn, yBottom, cols, spacing = 16) {
  ctx.save(); ctx.beginPath(); pathBelow(hillFn, yBottom); ctx.clip();
  const off = fbm(3, 4);
  for (let k = 0; k < 40; k++) {
    const y0 = 0 + k * spacing;
    ctx.beginPath(); for (let x = 0; x <= W; x += 8) { const y = Math.min(yBottom + 2, hillFn(x) + y0 + off(x / W + k * 0.03) * 20); x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    ctx.lineTo(W, yBottom); ctx.lineTo(0, yBottom); ctx.closePath(); ctx.fillStyle = cols[k % cols.length]; ctx.fill();
    ctx.beginPath(); for (let x = 0; x <= W; x += 8) { const y = hillFn(x) + y0 + off(x / W + k * 0.03) * 20; x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.strokeStyle = alpha('#f4ecc8', 0.55); ctx.lineWidth = 1.6; ctx.stroke();
  }
  ctx.restore();
}
function sampan(x, y, s, c = '#6b4a2e', person = true) {
  ctx.beginPath(); ctx.moveTo(x - s, y - s * 0.12); ctx.quadraticCurveTo(x, y + s * 0.18, x + s, y - s * 0.14); ctx.lineTo(x + s * 0.8, y - s * 0.02); ctx.quadraticCurveTo(x, y + s * 0.08, x - s * 0.8, y); ctx.closePath(); ctx.fillStyle = c; ctx.fill();
  if (person) { rect(x - s * 0.3, y - s * 0.42, s * 0.1, s * 0.34, '#3e5873'); poly([[x - s * 0.45, y - s * 0.4], [x - s * 0.05, y - s * 0.4], [x - s * 0.25, y - s * 0.58]], '#e7d6a8'); line(x - s * 0.2, y - s * 0.3, x + s * 0.3, y + s * 0.1, '#5a4330', s * 0.03); }
}
function junk(x, y, s) {
  ctx.beginPath(); ctx.moveTo(x - s, y - s * 0.2); ctx.lineTo(x + s, y - s * 0.25); ctx.lineTo(x + s * 0.8, y); ctx.lineTo(x - s * 0.85, y); ctx.closePath(); ctx.fillStyle = '#5b3d28'; ctx.fill();
  rect(x - s * 0.7, y - s * 0.38, s * 1.3, s * 0.18, '#e9e1cf');
  for (const [mx, h] of [[-0.4, 1.1], [0.15, 1.35], [0.6, 0.9]]) { line(x + mx * s, y - s * 0.38, x + mx * s, y - s * (0.38 + h), '#3a2a1e', 2); ctx.beginPath(); ctx.moveTo(x + mx * s, y - s * (0.42 + h)); ctx.quadraticCurveTo(x + (mx + 0.38) * s, y - s * (0.4 + h * 0.6), x + (mx + 0.3) * s, y - s * 0.45); ctx.lineTo(x + mx * s, y - s * 0.45); ctx.closePath(); ctx.fillStyle = '#c4653a'; ctx.fill(); for (let k = 1; k < 5; k++) line(x + mx * s, y - s * (0.45 + h * k / 5), x + (mx + 0.33) * s, y - s * (0.45 + h * k / 5 * 0.9), alpha('#7a3a20', 0.5), 1); }
}
function stiltHouse(x, y, s, roof = '#6b4a35') { for (let i = 0; i < 5; i++) rect(x - s * 0.9 + i * s * 0.44, y - s * 0.6, s * 0.06, s * 0.6, '#5d4532'); rect(x - s, y - s * 1.05, s * 2, s * 0.48, '#a07a52'); for (let i = 0; i < 4; i++) rect(x - s * 0.8 + i * s * 0.45, y - s * 0.95, s * 0.2, s * 0.22, '#4a3627'); poly([[x - s * 1.25, y - s * 1.0], [x + s * 1.25, y - s * 1.0], [x + s * 0.8, y - s * 1.6], [x - s * 0.8, y - s * 1.6]], roof); }
function tileHouse(x, y, s, wall = '#e7dcc0', roof = '#a8553a') { rect(x - s, y - s * 0.8, s * 2, s * 0.8, wall); rect(x - s * 0.25, y - s * 0.55, s * 0.5, s * 0.55, '#5a4330'); rect(x - s * 0.8, y - s * 0.6, s * 0.35, s * 0.28, '#6d5a45'); rect(x + s * 0.45, y - s * 0.6, s * 0.35, s * 0.28, '#6d5a45'); poly([[x - s * 1.2, y - s * 0.78], [x + s * 1.2, y - s * 0.78], [x + s * 0.95, y - s * 1.3], [x - s * 0.95, y - s * 1.3]], roof); for (let i = 0; i < 10; i++) line(x - s * 1.1 + i * s * 0.24, y - s * 0.8, x - s * 0.9 + i * s * 0.2, y - s * 1.28, alpha('#5a2a1a', 0.35), 1); }
function waterfall(x, yTop, w, h) { poly([[x - 14, yTop + 6], [x + w + 14, yTop + 2], [x + w + 22, yTop + h + 10], [x - 22, yTop + h + 12]], '#55604f'); for (let xx = x; xx < x + w; xx += 3) { const top = yTop + rnd(-4, 8), bend = rnd(-3, 3); ctx.beginPath(); ctx.moveTo(xx, top); ctx.quadraticCurveTo(xx + bend, top + h / 2, xx + bend * 2, yTop + h); ctx.strokeStyle = alpha(R() < 0.75 ? '#ffffff' : '#cfe8ef', rnd(0.55, 0.95)); ctx.lineWidth = rnd(2, 4.5); ctx.stroke(); } for (let i = 0; i < 26; i++) ellipse(x + rnd(-10, w + 10), yTop + h + rnd(-6, 10), rnd(12, 26), rnd(5, 10), alpha('#ffffff', 0.55)); for (let i = 0; i < 5; i++) roundTree(x + rnd(0, w), yTop + 4, rnd(14, 22), '#4f7a44'); }
function dunes(y0, cols) { for (let i = 0; i < 4; i++) { const fn = ridgeFn(y0 + i * 55, 60 - i * 8, 1.6 + i * 0.4, 2); fillBelow(fn, cols[i % cols.length]); ctx.save(); ctx.beginPath(); pathBelow(fn); ctx.clip(); for (let k = 0; k < 18; k++) { const yy = y0 + i * 55 + k * 7; ctx.beginPath(); for (let x = 0; x <= W; x += 10) { const y = fn(x) + 10 + k * 7 + Math.sin(x / 40 + k) * 2; x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.strokeStyle = alpha('#fff3d9', 0.25); ctx.lineWidth = 1; ctx.stroke(); } ctx.restore(); } }
function sea(y0, y1, deep = '#2f7fa3', shallow = '#7fc6c8') { rect(0, y0, W, y1 - y0, lgrad(0, y0, 0, y1, [[0, depth(deep, 0.35)], [1, shallow]])); for (let i = 0; i < 160; i++) { const y = rnd(y0 + 3, y1), w = rnd(8, 50) * (0.3 + (y - y0) / (y1 - y0)); rect(rnd(0, W), y, w, 1.3, alpha('#ffffff', rnd(0.15, 0.4))); } }
function beach(fnShore, sand = '#ead7a8') { fillBelow(fnShore, sand); ctx.beginPath(); for (let x = 0; x <= W; x += 6) { const y = fnShore(x); x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.strokeStyle = alpha('#ffffff', 0.85); ctx.lineWidth = 4; ctx.stroke(); }
function lighthouse(x, y, s) { poly([[x - s * 0.18, y], [x + s * 0.18, y], [x + s * 0.11, y - s * 1.3], [x - s * 0.11, y - s * 1.3]], '#f2efe6'); for (let i = 0; i < 3; i++) rect(x - s * 0.17 + i * 0.02 * s, y - s * (0.3 + i * 0.4), s * (0.34 - i * 0.05), s * 0.12, '#c94a3c'); rect(x - s * 0.14, y - s * 1.48, s * 0.28, s * 0.18, '#3a3d42'); poly([[x - s * 0.18, y - s * 1.48], [x + s * 0.18, y - s * 1.48], [x, y - s * 1.66]], '#c94a3c'); }
function teaRows(fnTop, yBottom, c = '#5f9a4a') { ctx.save(); ctx.beginPath(); pathBelow(fnTop, yBottom); ctx.clip(); fillBelow(fnTop, shade(c, 0.25), yBottom); for (let k = 0; k < 30; k++) { ctx.beginPath(); for (let x = -20; x <= W + 20; x += 10) { const y = fnTop(x) + 6 + k * (8 + k * 0.9) + Math.sin(x / 120 + k * 0.4) * 6; x > -20 ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.strokeStyle = shade(c, -0.1 + (k % 2) * 0.05); ctx.lineWidth = 4 + k * 0.6; ctx.lineCap = 'round'; ctx.stroke(); } ctx.restore(); }
function person(x, y, s, o = {}) { const top = o.top || '#3d6fa8'; rect(x - s * 0.08, y - s * 0.5, s * 0.07, s * 0.5, o.pants || '#2f3a4f'); rect(x + s * 0.01, y - s * 0.5, s * 0.07, s * 0.5, o.pants || '#2f3a4f'); rrect(x - s * 0.13, y - s * 1.0, s * 0.26, s * 0.55, s * 0.08, top); circle(x, y - s * 1.12, s * 0.11, o.skin || '#e0b48f'); if (o.hat === 'non') poly([[x - s * 0.22, y - s * 1.12], [x + s * 0.22, y - s * 1.12], [x, y - s * 1.36]], '#e7d6a8'); else if (o.hat === 'helmet') { ctx.beginPath(); ctx.arc(x, y - s * 1.14, s * 0.13, Math.PI, 0); ctx.fillStyle = o.helmet || '#f2f2f2'; ctx.fill(); } else circle(x, y - s * 1.17, s * 0.1, o.hair || '#2b2420'); if (o.backpack) rrect(x - s * 0.26, y - s * 0.95, s * 0.14, s * 0.36, s * 0.04, o.backpack); }
