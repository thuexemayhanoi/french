// Generic, logo-free side-view two-wheelers. Unit coordinates: ground y=0, +y up, +x toward the front.
const BIKE_SPEC = {
  scooter_small: { r: 0.25, rx: -0.62, fx: 0.62, wheel: 'alloy' },
  scooter_flat: { r: 0.25, rx: -0.64, fx: 0.64, wheel: 'alloy' },
  scooter_sport: { r: 0.27, rx: -0.64, fx: 0.66, wheel: 'alloy' },
  scooter_premium: { r: 0.32, rx: -0.66, fx: 0.68, wheel: 'alloy' },
  maxi: { r: 0.3, rx: -0.74, fx: 0.76, wheel: 'alloy' },
  electric: { r: 0.25, rx: -0.6, fx: 0.62, wheel: 'hub' },
  underbone: { r: 0.33, rx: -0.66, fx: 0.66, wheel: 'spoke' },
  sport_underbone: { r: 0.33, rx: -0.68, fx: 0.68, wheel: 'alloy' },
  cub: { r: 0.34, rx: -0.64, fx: 0.66, wheel: 'spoke' },
  cub_trail: { r: 0.35, rx: -0.64, fx: 0.68, wheel: 'spoke', knobby: true },
  trail: { r: 0.4, rx: -0.7, fx: 0.76, fr: 0.43, wheel: 'spoke', knobby: true },
};
const BIKE_COLORS = { rouge: '#c8323a', bleu: '#2f6db5', blanc: '#eef0ee', noir: '#2b2d31', gris: '#8d949a', vert: '#4f8a5b', jaune: '#e8b23a', orange: '#e0742e', bordeaux: '#7c2635', beige: '#d9c7a4', turquoise: '#3ba7a5', marron: '#7a5236', 'bleu ciel': '#7fb3d9', rose: '#d98aa0', kaki: '#7d7c4f', argent: '#b9bec4' };

function bike(x, gy, s, type, color, o = {}) {
  const sp = BIKE_SPEC[type] || BIKE_SPEC.scooter_small, dir = o.flip ? -1 : 1;
  const X = u => x + dir * u * s, Y = v => gy - v * s;
  const P = cmds => { ctx.beginPath(); for (const c of cmds) { const [k, ...a] = c; if (k === 'M') ctx.moveTo(X(a[0]), Y(a[1])); else if (k === 'L') ctx.lineTo(X(a[0]), Y(a[1])); else if (k === 'Q') ctx.quadraticCurveTo(X(a[0]), Y(a[1]), X(a[2]), Y(a[3])); else if (k === 'C') ctx.bezierCurveTo(X(a[0]), Y(a[1]), X(a[2]), Y(a[3]), X(a[4]), Y(a[5])); } ctx.closePath(); };
  const F = (cmds, fill, stroke, lw) => { P(cmds); ctx.fillStyle = fill; ctx.fill(); if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw * s; ctx.stroke(); } };
  const L = (a, b, c, d, col, lw) => { ctx.lineCap = 'round'; line(X(a), Y(b), X(c), Y(d), col, lw * s); };
  const C = (u, v, r, col) => circle(X(u), Y(v), r * s, col);
  const dark = '#24262a', mid = '#4a4d52', chrome = '#c9ced3', body = color, bodyD = shade(color, -0.22), bodyL = shade(color, 0.25);
  const rr = sp.r, fr = sp.fr || sp.r;
  // ground shadow
  ellipse(x, gy + 2, s * 1.15, s * 0.07, 'rgba(0,0,0,0.22)');
  const wheel = (cx, r) => {
    C(cx, r, r, '#1d1e21');
    if (sp.knobby) for (let i = 0; i < 22; i++) { const a = i / 22 * Math.PI * 2; C(cx + Math.cos(a) * r * 0.98, r + Math.sin(a) * r * 0.98, r * 0.06, '#1d1e21'); }
    C(cx, r, r * 0.74, '#3a3c40');
    if (sp.wheel === 'spoke') { C(cx, r, r * 0.7, chrome); C(cx, r, r * 0.64, '#2a2b2e'); for (let i = 0; i < 18; i++) { const a = i / 18 * Math.PI * 2; L(cx, r, cx + Math.cos(a) * r * 0.64, r + Math.sin(a) * r * 0.64, '#b8bdc2', 0.008); } C(cx, r, r * 0.16, chrome); }
    else { C(cx, r, r * 0.68, o.rim || '#6b7076'); for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2 + 0.3; ctx.beginPath(); ctx.moveTo(X(cx), Y(r)); ctx.arc(X(cx), Y(r), r * 0.62 * s, a, a + 0.75); ctx.closePath(); ctx.fillStyle = '#2b2d30'; ctx.fill(); } C(cx, r, r * (sp.wheel === 'hub' ? 0.34 : 0.14), sp.wheel === 'hub' ? '#55595f' : chrome); }
  };
  wheel(sp.rx, rr);
  const t = type;
  if (t === 'trail') {
    L(sp.rx, rr, -0.05, 0.62, mid, 0.05); // swingarm
    L(sp.fx, fr, 0.5, 1.12, chrome, 0.05); L(sp.fx, fr, 0.5, 1.12, '#2a2b2e', 0.025);
    F([['M', -0.2, 0.36], ['L', 0.28, 0.36], ['L', 0.32, 0.66], ['L', -0.14, 0.7]], '#55585d');
    for (let i = 0; i < 4; i++) L(-0.14 + i * 0.1, 0.42, -0.12 + i * 0.1, 0.62, '#3b3e42', 0.02);
    L(-0.2, 0.62, 0.42, 1.0, dark, 0.05); L(-0.1, 0.36, 0.42, 0.98, dark, 0.04);
    F([['M', -0.06, 0.86], ['C', 0.05, 1.02, 0.3, 1.04, 0.42, 0.96], ['L', 0.36, 0.78], ['C', 0.2, 0.74, 0.02, 0.74, -0.06, 0.86]], body);
    F([['M', 0.0, 0.62], ['L', 0.24, 0.66], ['L', 0.3, 0.9], ['L', 0.06, 0.88]], bodyL);
    F([['M', -1.05, 0.98], ['L', -0.55, 0.92], ['L', -0.1, 0.94], ['L', -0.08, 0.86], ['L', -0.6, 0.82], ['L', -0.95, 0.88]], body);
    F([['M', -0.85, 0.96], ['C', -0.5, 1.02, -0.1, 1.02, 0.04, 0.98], ['L', 0.0, 0.92], ['L', -0.8, 0.9]], dark);
    F([['M', -0.62, 0.72], ['L', -0.36, 0.8], ['L', -0.45, 0.92], ['L', -0.7, 0.84]], bodyD);
    L(-0.28, 0.46, -0.78, 0.7, '#6d7177', 0.06); L(-0.72, 0.68, -0.98, 0.78, '#3a3c40', 0.08);
    F([['M', 0.5, 0.86], ['C', 0.7, 0.95, 0.95, 0.9, 1.08, 0.78], ['L', 1.0, 0.74], ['C', 0.85, 0.82, 0.65, 0.82, 0.5, 0.78]], body);
    F([['M', 0.44, 1.0], ['L', 0.62, 1.08], ['L', 0.66, 0.9], ['L', 0.5, 0.86]], bodyD);
    L(0.38, 1.2, 0.64, 1.22, dark, 0.03); C(0.6, 1.0, 0.04, '#fff6d8');
    wheel(sp.fx, fr);
  } else if (t === 'underbone' || t === 'cub' || t === 'cub_trail' || t === 'sport_underbone') {
    L(sp.rx, rr, -0.05, 0.38, mid, 0.05);
    F([['M', -0.62, rr + 0.02], ['L', -0.05, 0.34], ['L', -0.05, 0.42], ['L', -0.6, rr + 0.1]], dark); // chain guard
    F([['M', -0.18, 0.18], ['C', -0.2, 0.36, 0.0, 0.44, 0.2, 0.4], ['L', 0.22, 0.2], ['C', 0.1, 0.14, -0.1, 0.14, -0.18, 0.18]], '#7b8086');
    C(-0.02, 0.3, 0.08, '#5d6268');
    L(-0.62, rr + 0.05, -0.58, 0.72, chrome, 0.03);
    L(0.2, 0.22, -0.75, 0.26, '#8a8f95', 0.06); // exhaust
    if (t === 'cub_trail') { L(-0.1, 0.3, -0.6, 0.62, '#9aa0a6', 0.07); F([['M', -0.62, 0.56], ['L', -0.86, 0.62], ['L', -0.86, 0.7], ['L', -0.62, 0.66]], '#555a60'); }
    L(sp.fx, rr, 0.48, 1.06, chrome, 0.045);
    if (t === 'sport_underbone') {
      F([['M', -1.02, 0.86], ['L', -0.6, 0.72], ['L', -0.1, 0.6], ['L', 0.16, 0.42], ['L', 0.32, 0.46], ['L', 0.62, 0.98], ['L', 0.46, 1.06], ['L', 0.12, 0.86], ['L', -0.4, 0.82], ['L', -0.95, 0.94]], body);
      F([['M', 0.18, 0.46], ['L', 0.34, 0.5], ['L', 0.46, 0.76], ['L', 0.26, 0.72]], bodyD);
      F([['M', -0.6, 0.78], ['L', -0.1, 0.66], ['L', 0.1, 0.72], ['L', -0.5, 0.84]], bodyL);
      F([['M', -0.9, 0.95], ['C', -0.6, 0.98, -0.3, 0.92, -0.06, 0.9], ['L', -0.1, 0.84], ['L', -0.86, 0.9]], dark);
      F([['M', 0.0, 0.92], ['L', 0.16, 0.88], ['L', 0.14, 0.84], ['L', 0.0, 0.86]], dark);
      F([['M', 0.48, 1.02], ['L', 0.7, 0.98], ['L', 0.66, 0.9], ['L', 0.5, 0.92]], '#fff3d0');
      F([['M', 0.46, 0.6], ['C', 0.6, 0.72, 0.84, 0.72, 0.92, 0.56], ['L', 0.88, 0.54], ['C', 0.78, 0.64, 0.6, 0.64, 0.48, 0.56]], bodyD);
      L(0.4, 1.12, 0.6, 1.08, dark, 0.03);
    } else if (t === 'underbone') {
      F([['M', -1.0, 0.62], ['C', -1.02, 0.74, -0.9, 0.8, -0.7, 0.78], ['L', -0.1, 0.74], ['C', 0.02, 0.6, 0.08, 0.48, 0.2, 0.44], ['L', 0.3, 0.46], ['L', 0.3, 0.52], ['C', 0.16, 0.56, 0.06, 0.64, 0.0, 0.7], ['L', -0.2, 0.64], ['L', -0.8, 0.6]], body);
      F([['M', 0.26, 0.44], ['C', 0.34, 0.66, 0.42, 0.86, 0.46, 1.02], ['L', 0.58, 1.04], ['C', 0.6, 0.86, 0.58, 0.64, 0.42, 0.46]], bodyD);
      F([['M', 0.44, 0.98], ['L', 0.66, 1.02], ['L', 0.64, 1.12], ['L', 0.44, 1.1]], body);
      C(0.66, 1.05, 0.045, '#fff3d0');
      F([['M', -0.9, 0.8], ['C', -0.6, 0.86, -0.25, 0.86, -0.04, 0.8], ['L', -0.08, 0.74], ['L', -0.86, 0.76]], dark);
      F([['M', 0.46, 0.58], ['C', 0.58, 0.68, 0.8, 0.68, 0.88, 0.56], ['L', 0.84, 0.54], ['C', 0.74, 0.62, 0.58, 0.62, 0.48, 0.55]], body);
      F([['M', -0.6, 0.66], ['L', -0.2, 0.66], ['L', -0.25, 0.72], ['L', -0.62, 0.72]], bodyL);
      L(0.4, 1.14, 0.6, 1.14, dark, 0.03);
    } else {
      // Classic cub: deep curved leg shield and single saddle
      F([['M', 0.24, 0.42], ['C', 0.12, 0.6, 0.18, 0.86, 0.44, 1.0], ['L', 0.56, 0.98], ['C', 0.44, 0.84, 0.42, 0.62, 0.5, 0.5], ['C', 0.42, 0.44, 0.32, 0.4, 0.24, 0.42]], body);
      F([['M', -0.92, 0.6], ['C', -0.92, 0.72, -0.8, 0.76, -0.6, 0.74], ['L', -0.1, 0.62], ['C', 0.0, 0.5, 0.1, 0.44, 0.22, 0.42], ['L', 0.2, 0.36], ['C', 0.0, 0.38, -0.2, 0.5, -0.3, 0.56], ['L', -0.84, 0.56]], o.second || bodyL);
      F([['M', -0.62, 0.76], ['C', -0.5, 0.86, -0.22, 0.86, -0.12, 0.76], ['L', -0.16, 0.7], ['L', -0.58, 0.72]], t === 'cub_trail' ? dark : '#5a3b2a');
      L(-0.86, 0.8, -0.56, 0.8, '#3b3e42', 0.04); L(-0.86, 0.8, -0.82, 0.62, '#3b3e42', 0.025);
      F([['M', 0.44, 0.6], ['C', 0.56, 0.74, 0.82, 0.74, 0.9, 0.58], ['L', 0.86, 0.56], ['C', 0.76, 0.66, 0.58, 0.66, 0.48, 0.56]], t === 'cub_trail' ? '#3b3e42' : body);
      C(0.62, 1.1, 0.075, chrome); C(0.64, 1.1, 0.055, '#fff3d0');
      L(0.38, 1.16, 0.6, 1.16, chrome, 0.028);
      if (t === 'cub_trail') { F([['M', 0.58, 1.04], ['L', 0.78, 1.04], ['L', 0.78, 1.08], ['L', 0.58, 1.08]], '#3b3e42'); }
    }
    wheel(sp.fx, rr);
  } else {
    // automatic scooters & electric
    const hi = t === 'scooter_flat' ? 0.8 : t === 'maxi' ? 0.88 : t === 'scooter_premium' ? 0.86 : 0.76;
    const fl = t === 'scooter_premium' ? 0.38 : t === 'maxi' ? 0.42 : 0.32;
    if (t !== 'electric') { F([['M', -0.48, 0.2], ['L', -0.98, 0.26], ['C', -1.02, 0.3, -1.0, 0.36, -0.96, 0.36], ['L', -0.46, 0.32]], '#8a8f95'); }
    F([['M', -0.35, 0.18], ['L', sp.rx - 0.02, rr + 0.02], ['L', sp.rx + 0.06, rr + 0.1], ['L', -0.25, 0.34]], '#5d6268');
    // rear body
    if (t === 'maxi') F([['M', -1.1, 0.58], ['C', -1.12, 0.74, -1.0, hi, -0.78, hi], ['L', -0.12, 0.8], ['C', 0.0, 0.62, 0.02, 0.5, 0.08, fl], ['L', -0.4, 0.4], ['C', -0.6, 0.42, -0.9, 0.44, -1.04, 0.5]], body);
    else if (t === 'scooter_sport') F([['M', -1.02, 0.5], ['L', -0.98, 0.66], ['L', -0.7, hi], ['L', -0.08, 0.72], ['C', -0.02, 0.56, 0.0, 0.42, 0.06, fl], ['L', -0.36, 0.34], ['L', -0.8, 0.38]], body);
    else F([['M', -1.0, 0.42], ['C', -1.03, 0.62, -0.88, hi, -0.64, hi], ['L', -0.06, hi - 0.04], ['C', -0.02, 0.56, 0.0, 0.42, 0.06, fl], ['L', -0.36, 0.32], ['C', -0.56, 0.32, -0.82, 0.34, -0.94, 0.38]], body);
    if (t === 'scooter_sport') { F([['M', -0.96, 0.5], ['L', -0.4, 0.42], ['L', -0.1, 0.5], ['L', -0.2, 0.58], ['L', -0.9, 0.6]], bodyD); }
    if (t === 'electric') { F([['M', -0.9, 0.5], ['L', -0.1, 0.48], ['L', -0.1, 0.53], ['L', -0.9, 0.56]], o.accent || '#3fb6c6'); }
    if (t === 'scooter_flat' || t === 'scooter_premium') F([['M', -0.92, 0.5], ['C', -0.6, 0.47, -0.3, 0.47, -0.08, 0.5], ['L', -0.08, 0.53], ['C', -0.3, 0.5, -0.6, 0.5, -0.92, 0.54]], bodyL);
    C(-1.0 + (t === 'maxi' ? -0.08 : 0), 0.55, 0.035, '#d23a3a');
    // floorboard
    F([['M', -0.12, fl - 0.06], ['L', 0.34, fl - 0.06], ['L', 0.34, fl + 0.02], ['L', -0.1, fl + 0.02]], '#3a3c40');
    if (t === 'maxi' || t === 'scooter_sport') F([['M', -0.04, fl], ['C', 0.06, fl + 0.2, 0.2, fl + 0.22, 0.3, fl + 0.12], ['L', 0.3, fl], ['Z']], bodyD);
    // front shield
    F([['M', 0.28, fl - 0.02], ['C', 0.34, fl + 0.2, 0.4, 0.8, 0.44, 1.0], ['L', 0.6, 1.04], ['C', 0.68, 0.88, 0.74, 0.68, 0.78, 0.54], ['C', 0.72, 0.46, 0.6, 0.44, 0.52, 0.46], ['L', 0.4, fl - 0.04]], t === 'scooter_sport' ? bodyD : body);
    if (t === 'scooter_sport') F([['M', 0.42, 0.5], ['L', 0.74, 0.54], ['L', 0.62, 0.96], ['L', 0.5, 0.94]], body);
    // front fender
    F([['M', sp.fx - rr * 1.05, rr + 0.08], ['C', sp.fx - rr * 0.8, rr * 2.2, sp.fx + rr * 0.8, rr * 2.2, sp.fx + rr * 1.05, rr + 0.06], ['L', sp.fx + rr * 0.9, rr + 0.04], ['C', sp.fx + rr * 0.7, rr * 1.9, sp.fx - rr * 0.7, rr * 1.9, sp.fx - rr * 0.9, rr + 0.06]], bodyD);
    L(0.52, 0.98, sp.fx, rr, '#55595f', 0.05);
    // headlight & handlebar
    F([['M', 0.5, 0.98], ['L', 0.68, 1.02], ['L', 0.66, 1.12], ['L', 0.46, 1.1]], t === 'maxi' ? bodyD : body);
    F([['M', 0.6, 1.0], ['L', 0.7, 1.02], ['L', 0.68, 1.08], ['L', 0.6, 1.07]], '#fff3d0');
    L(0.38, 1.14, 0.62, 1.16, dark, 0.03);
    if (t === 'maxi') F([['M', 0.5, 1.12], ['L', 0.66, 1.42], ['L', 0.72, 1.4], ['L', 0.64, 1.1]], 'rgba(190,215,230,0.55)');
    // seat
    if (t === 'maxi') F([['M', -0.9, hi + 0.02], ['C', -0.7, hi + 0.16, -0.5, hi + 0.12, -0.42, hi + 0.06], ['C', -0.3, hi + 0.04, -0.2, 0.86, -0.06, 0.84], ['L', -0.1, 0.78], ['L', -0.86, hi - 0.02]], dark);
    else F([['M', -0.8, hi], ['C', -0.62, hi + 0.12, -0.22, hi + 0.12, -0.04, hi + 0.02], ['L', -0.08, hi - 0.05], ['L', -0.74, hi - 0.03]], o.seat || (t === 'scooter_flat' && R() < 0.4 ? '#6b4a33' : '#2a2b2e'));
    wheel(sp.fx, rr);
    L(0.5, 1.15, 0.44, 1.3, dark, 0.012); ellipse(X(0.44), Y(1.31), 0.045 * s, 0.03 * s, dark);
  }
  if (o.rider) rider(X, Y, s, sp, t, o.rider, dir);
  if (o.passenger) rider(X, Y, s, sp, t, o.passenger, dir, true);
  if (o.helmetOnSeat) { const hx = t === 'trail' ? -0.5 : -0.45, hy = t === 'trail' ? 1.0 : (t === 'maxi' ? 0.96 : 0.84); ctx.beginPath(); ctx.arc(X(hx), Y(hy), 0.13 * s, Math.PI, 0); ctx.closePath(); ctx.fillStyle = o.helmetOnSeat; ctx.fill(); rect(X(hx) - 0.1 * s, Y(hy) - 0.02 * s, 0.2 * s, 0.025 * s, '#2a2b2e'); }
  if (o.bag) { const bx = -0.55, by = (t === 'trail' ? 1.0 : 0.86); rrect(X(bx) - 0.18 * s, Y(by + 0.22), 0.36 * s, 0.22 * s, 0.04 * s, o.bag); line(X(bx) - 0.14 * s, Y(by + 0.12), X(bx) + 0.14 * s, Y(by + 0.12), shade(o.bag, -0.3), 0.015 * s); }
}
function rider(X, Y, s, sp, t, cfg, dir, back = false) {
  const off = back ? -0.4 : 0, tall = t === 'trail' ? 0.18 : (t.startsWith('scooter') || t === 'electric' || t === 'maxi') ? 0 : 0.06;
  const hip = [-0.32 + off, 0.86 + tall], sh = [-0.17 + off, 1.3 + tall], head = [-0.11 + off, 1.5 + tall];
  const knee = back ? [-0.18 + off + 0.1, 0.96 + tall] : [0.16, 0.98 + tall], foot = back ? [-0.16, 0.42] : (t.startsWith('scooter') || t === 'electric' || t === 'maxi' ? [0.2, 0.36] : [0.06, 0.4]);
  const grip = [0.46, 1.14];
  const st = (a, b, c, w) => { ctx.lineCap = 'round'; ctx.lineJoin = 'round'; line(X(a[0]), Y(a[1]), X(b[0]), Y(b[1]), c, w * s); };
  st(hip, knee, cfg.pants || '#3b4a63', 0.15); st(knee, foot, cfg.pants || '#3b4a63', 0.12); ellipse(X(foot[0] + 0.04), Y(foot[1] - 0.02), 0.07 * s, 0.035 * s, '#2a2b2e');
  st(hip, sh, cfg.top || '#d0663a', 0.24);
  if (cfg.backpack) rrect(X(sh[0] - 0.2 * dir) - (dir < 0 ? 0.16 * s : 0), Y(1.42 + tall), 0.16 * s, 0.34 * s, 0.05 * s, cfg.backpack);
  const elbow = back ? [sh[0] + 0.16, sh[1] - 0.24] : [0.16, 1.2 + tall * 0.5];
  const hand = back ? [sh[0] + 0.36, 1.12 + tall] : grip;
  st(sh, elbow, cfg.top || '#d0663a', 0.1); st(elbow, hand, cfg.skin || '#e0b48f', 0.07);
  circle(X(head[0]), Y(head[1]), 0.14 * s, cfg.helmet || '#f2f2f2');
  ctx.beginPath(); ctx.arc(X(head[0]), Y(head[1]), 0.14 * s, dir > 0 ? -0.6 : Math.PI - 0.4, dir > 0 ? 0.6 : Math.PI + 0.6); ctx.lineTo(X(head[0]), Y(head[1])); ctx.closePath(); ctx.fillStyle = cfg.visor || 'rgba(30,40,55,0.75)'; ctx.fill();
  st([head[0] - 0.02, head[1] - 0.16], [head[0] + 0.04, head[1] - 0.24], cfg.skin || '#e0b48f', 0.08);
}
// Small background two-wheeler (traffic, parked rows).
function miniBike(x, gy, s, color, flip, withRider) { bike(x, gy, s, pick(['scooter_small', 'scooter_flat', 'underbone', 'scooter_sport']), color, { flip, rider: withRider ? { top: pick(['#d0663a', '#3d6fa8', '#6b8e4e', '#e6d9c2', '#8a3b4f', '#f0c24b']), helmet: pick(['#ffffff', '#e8c547', '#c83a3a', '#3a5f9a', '#2b2d31']), pants: pick(['#2f3a4f', '#5a4a3a', '#3b3b3b']) } : null }); }
