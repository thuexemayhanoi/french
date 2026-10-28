// Landscape scenes. Each returns a description of exactly what was drawn.
function placeFR(sp, fallback) { return sp.place ? 'inspiré ' + sp.place : fallback; }
function riderBike(sp, x, gy, s, i = 0, extra = {}) {
  const b = sp.bikes[i % sp.bikes.length];
  const o = Object.assign({}, extra);
  let who = '';
  if (sp.rider !== false && !extra.parked) { const of = outfit(sp.backpack ? { backpack: '#4f6b5a' } : {}); o.rider = of; who = ' conduit' + fe(sp, i) + ' par un motard en ' + of.fr; if (sp.passenger) { o.passenger = outfit(); who = ' avec un conducteur et un passager casqués'; } }
  heroBike(b, x, gy + s * 0.08, s * 1.18, o);
  return bikeFR(b) + who;
}
SCENES.mountain_pass = sp => {
  const hz = 300; sky(sp.time, hz + 40);
  const greens = sp.variant === 'karst' ? '#5f7f58' : '#557c4c';
  if (sp.variant === 'karst') { karst(260, 14, 90, 190, depth('#7b8f74', 0.6), { dots: 300 }); karst(330, 10, 80, 200, depth('#5e7b55', 0.35), { dots: 400 }); fillBelow(ridgeFn(380, 60, 2, 3), depth('#557c4c', 0.15)); }
  else mountains(4, 150, 300, greens, { amp: 170, mistBetween: sp.time === 'mist' || sp.time === 'dawn', forest: true });
  const near = ridgeFn(470, 120, 2.2, 4); fillBelow(near, shade(greens, -0.12)); speckle(near, shade(greens, -0.28), 220, 4, 140);
  const dirL = R() < 0.5; const xs = dirL ? [760, 380, 820, 300, 700] : [440, 820, 380, 900, 500];
  const pts = [[xs[0], 330, 6], [xs[1], 360, 12], [xs[2], 400, 22], [xs[3], 455, 40], [xs[4], 560, 110], [600, 680, 200]];
  road(pts, { shoulder: '#b8a98a' });
  const bx = dirL ? 470 : 760;
  const who = riderBike(sp, bx, 600, 112, 0);
  if (sp.group) { for (let i = 1; i <= 2; i++) heroBike(sp.bikes[i % sp.bikes.length], xs[3] + (i - 1) * 40, 470 - i * 4, 38 - i * 6, { rider: outfit() }); }
  const extra = sp.variant === 'karst' ? 'des pics karstiques' : 'des crêtes montagneuses boisées';
  return `${who}, sur une route de col en lacets qui serpente entre ${extra}${sp.group ? ', suivie de deux autres motos' : ''}, paysage ${placeFR(sp, 'du nord du Vietnam')}, ${TIME_FR[sp.time]}`;
};
SCENES.terraces = sp => {
  sky(sp.time, 260); mountains(3, 120, 220, '#5c7f55', { amp: 140, mistBetween: true });
  const hill = ridgeFn(330, 150, 1.6, 3);
  const harvest = sp.variant === 'harvest';
  const cols = harvest ? ['#d9b44a', '#c9a23c', '#e2c15a', '#bf9a3a'] : ['#8fbf5a', '#7fb150', '#9cc965', '#76a84a'];
  terraces(hill, H, cols, 15);
  for (let i = 0; i < 3; i++) stiltHouse(rnd(80, 1100), hill(600) + rnd(30, 90), rnd(16, 24), '#5d4a3a');
  const rd = road([[1250, 470, 30], [900, 520, 60], [500, 590, 120], [200, 700, 180]], { shoulder: '#c9b48a', center: false });
  const who = riderBike(sp, 520, 600, 100, 0, sp.parked ? { parked: true, helmetOnSeat: '#f2f2f2' } : {});
  return `${who}${sp.parked ? ' garé${fe(sp)} au bord d’une route' : ' sur une route'} qui longe des rizières en terrasses ${harvest ? 'dorées au moment de la récolte' : 'vert tendre'} et des maisons sur pilotis, paysage ${placeFR(sp, 'des montagnes du nord-ouest du Vietnam')}, ${TIME_FR[sp.time]}`;
};
SCENES.karst_river = sp => {
  const hz = 360; sky(sp.time, hz);
  const k1 = () => karst(hz, 12, 110, 220, depth('#6f8a68', 0.55), { dots: 250 });
  const k2 = () => karst(hz + 2, 8, 120, 260, depth('#4f7448', 0.25), { dots: 500, wide: 1.2 });
  k1(); k2(); water(hz, 470, '#7fa7a0', '#5e8f86');
  reflect(() => { karst(hz, 8, 120, 260, '#4f7448', { texture: false }); }, hz, 0.18);
  const boats = rint(1, 3); for (let i = 0; i < boats; i++) sampan(rnd(150, 1050), rnd(400, 450), rnd(28, 45), '#5b3d28');
  rect(0, 470, W, 160, '#8fbf5a'); paddies(470, 520, ['#9ccc66', '#86b955']);
  road([[-50, 560, 70], [600, 548, 80], [1300, 565, 90]], { shoulder: '#b8a98a' });
  const who = riderBike(sp, sp.dir ? 380 : 820, 590, 92, 0, { flip: !!sp.dir });
  return `${who} le long d’une rivière où glissent ${boats > 1 ? boats + ' barques' : 'une barque'} au pied de pitons karstiques couverts de végétation, paysage ${placeFR(sp, 'karstique du nord du Vietnam')}, ${TIME_FR[sp.time]}`;
};
SCENES.bay = sp => {
  const hz = 330; sky(sp.time, hz); sea(hz, H, '#2f7f8f', '#6fb3b0');
  for (let l = 0; l < 3; l++) { const n = 5 + l * 2; for (let i = 0; i < n; i++) { const cx = rnd(0, W), w = rnd(30, 80) * (1 + l * 0.5), h = rnd(50, 120) * (1 + l * 0.6), base = hz + l * 40 + rnd(0, 20), c = depth('#4f7448', 0.6 - l * 0.25); ctx.beginPath(); ctx.moveTo(cx - w, base); ctx.bezierCurveTo(cx - w, base - h, cx - w * 0.3, base - h * 1.1, cx, base - h); ctx.bezierCurveTo(cx + w * 0.4, base - h * 1.05, cx + w, base - h * 0.8, cx + w, base); ctx.closePath(); ctx.fillStyle = c; ctx.fill(); ellipse(cx, base, w * 1.05, 4, alpha('#ffffff', 0.3)); } }
  const nj = rint(1, 3); for (let i = 0; i < nj; i++) junk(rnd(200, 1000), rnd(450, 520), rnd(30, 50));
  if (sp.bikes.length && sp.variant !== 'nobike') { const shore = x => 560 + Math.sin(x / 200) * 10; fillBelow(shore, '#d8c79a'); road([[-50, 600, 60], [1300, 590, 60]], { shoulder: '#c9b48a' }); const who = riderBike(sp, 300, 615, 80, 0); return `${who} sur la route côtière face à une baie parsemée d’îlots karstiques et de ${nj > 1 ? 'jonques aux voiles ocre' : 'une jonque aux voiles ocre'}, paysage ${placeFR(sp, 'd’une baie karstique du nord du Vietnam')}, ${TIME_FR[sp.time]}`; }
  return `baie parsemée d’îlots karstiques avec ${nj > 1 ? nj + ' jonques aux voiles ocre' : 'une jonque aux voiles ocre'}, paysage ${placeFR(sp, 'd’une baie karstique du nord du Vietnam')}, ${TIME_FR[sp.time]}`;
};
SCENES.waterfall = sp => {
  sky(sp.time, 260); mountains(3, 120, 230, '#5a8050', { amp: 120, forest: true });
  const cliff = ridgeFn(250, 40, 2, 3); fillBelow(cliff, '#4f6e44');
  const tiers = [[260, 245, 240, 95], [560, 262, 300, 85], [380, 335, 420, 80]];
  for (const [x, y, w, h] of tiers) { rect(x - 10, y + h - 8, w + 20, 30, '#4a5f45'); waterfall(x, y, w, h); }
  water(430, 520, '#7fb7b0', '#5f9a90'); for (let i = 0; i < 3; i++) roundTree(rnd(20, 250), 470, rnd(40, 60), '#4f7a44'); for (let i = 0; i < 3; i++) roundTree(rnd(950, 1180), 470, rnd(40, 60), '#4f7a44');
  rect(0, 520, W, 110, '#7fa75a'); road([[-50, 590, 70], [1300, 575, 70]], { shoulder: '#b8a98a' });
  const who = riderBike(sp, 900, 600, 85, 0, { parked: true, helmetOnSeat: '#f2f2f2' });
  return `${who} garé${fe(sp)} face à une large cascade en plusieurs paliers dans un écrin de forêt, paysage ${placeFR(sp, 'du nord-est du Vietnam')}, ${TIME_FR[sp.time]}`;
};
SCENES.mountain_lake = sp => {
  const hz = 330; sky(sp.time, hz); mountains(4, 140, 300, '#4f7a4a', { amp: 150, mistBetween: true, forest: true });
  water(hz, 500, '#6f9f9a', '#4f857f'); reflect(() => mountains(2, 220, 300, '#4f7a4a', { amp: 120 }), hz, 0.15);
  const nb = rint(1, 2); for (let i = 0; i < nb; i++) sampan(rnd(300, 900), rnd(390, 460), 36, '#4a3626');
  rect(0, 500, W, 130, '#6f9a52'); for (let i = 0; i < 4; i++) bamboo(rnd(0, 200) + (i % 2) * 1000, 520, 60);
  road([[-50, 585, 70], [1300, 570, 70]], { shoulder: '#b8a98a', center: false });
  const who = riderBike(sp, 640, 600, 90, 0);
  return `${who} au bord d’un lac de montagne entouré de collines forestières, avec ${nb > 1 ? 'deux barques' : 'une barque'} sur l’eau calme, paysage ${placeFR(sp, 'du nord du Vietnam')}, ${TIME_FR[sp.time]}`;
};
SCENES.tea_plateau = sp => {
  sky(sp.time, 280); mountains(3, 150, 250, '#6a9a5a', { amp: 100 });
  const h1 = ridgeFn(340, 70, 1.4, 3); teaRows(h1, H, '#4f9a4a');
  const h2 = ridgeFn(470, 50, 1.2, 2); teaRows(h2, H, '#5aa452');
  road([[1250, 520, 40], [800, 560, 80], [300, 640, 170]], { shoulder: '#c9b48a', center: false });
  for (let i = 0; i < 2; i++) person(rnd(100, 400), h2(200) + 60, 40, { hat: 'non', top: '#5a7aa0' });
  const who = riderBike(sp, 760, 610, 92, 0);
  return `${who} sur une petite route qui traverse un plateau couvert de rangées de théiers, avec des cueilleuses coiffées du chapeau conique, paysage ${placeFR(sp, 'd’un plateau du nord du Vietnam')}, ${TIME_FR[sp.time]}`;
};
SCENES.stilt_valley = sp => {
  sky(sp.time, 280); mountains(4, 120, 280, '#557c4c', { amp: 150, mistBetween: true, forest: true });
  rect(0, 360, W, 270, '#9ccc66'); paddies(360, 520, ['#a6d36d', '#92c25c', '#b4d97a']);
  for (let i = 0; i < 6; i++) stiltHouse(rnd(60, 1140), rnd(380, 430), rnd(16, 26), pick(['#6b4a35', '#7a5a3a', '#5d4a3a']));
  for (let i = 0; i < 4; i++) palm(rnd(0, W), rnd(400, 440), rnd(40, 55), '#4f8a4a');
  road([[-50, 590, 80], [1300, 570, 80]], { shoulder: '#b8a98a', center: false });
  const who = riderBike(sp, 420, 610, 90, 0);
  return `${who} traversant une vallée de rizières ponctuée de maisons traditionnelles sur pilotis, au pied de montagnes ${sp.time === 'mist' ? 'voilées' : 'boisées'}, paysage ${placeFR(sp, 'd’une vallée du nord-ouest du Vietnam')}, ${TIME_FR[sp.time]}`;
};
SCENES.pine_hills = sp => {
  const hz = 360; sky(sp.time, hz); mountains(3, 180, 300, '#4f7a5a', { amp: 110, mistBetween: true });
  const v = sp.variant || pick(['lake', 'greenhouses', 'flowers', 'lake']);
  if (v === 'lake') water(hz, 440, '#7fa8b8', '#5f8fa0');
  const g = ridgeFn(v === 'lake' ? 470 : 420, 60, 1.5, 3); fillBelow(g, '#6f9a5a');
  let extra = '';
  if (v === 'greenhouses') { for (let r = 0; r < 3; r++) for (let i = 0; i < 7; i++) { const x = 60 + i * 160 + r * 40 + rnd(-10, 10), y = 400 + r * 40; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 60, y - 40, x + 120, y); ctx.closePath(); ctx.fillStyle = alpha('#f4f6f2', 0.92); ctx.fill(); rect(x, y - 2, 120, 6, alpha('#c9d2cc', 0.9)); } extra = ', serres blanches alignées sur les pentes'; }
  if (v === 'flowers') { for (let i = 0; i < 700; i++) { const x = rnd(0, W), y = rnd(430, 540); circle(x, y, rnd(2, 4), pick(['#e8b23a', '#d6403a', '#c86aa0', '#f2efe6', '#7a4fa0'])); } extra = ', champs de fleurs multicolores'; }
  const nTrees = v === 'lake' ? 26 : 16; for (let i = 0; i < nTrees; i++) { const x = rnd(-20, W + 20); pine(x, g(x) + rnd(10, 40), rnd(70, 140), shade('#2f5a40', rnd(-0.1, 0.1))); }
  road([[1300, 560, 60], [700, 580, 80], [-50, 610, 110]], { shoulder: '#b8a98a' });
  const who = riderBike(sp, rnd(380, 820), 615, 88, 0);
  return `${who} sur une route bordée de forêts de pins${v === 'lake' ? ' au-dessus d’un lac' : ''}${extra}, collines d’altitude en arrière-plan, paysage ${placeFR(sp, 'des hauts plateaux')}, ${TIME_FR[sp.time]}`;
};
SCENES.coast_road = sp => {
  const hz = 300; sky(sp.time, hz); sea(hz, H, '#2a7fa8', '#7fc6c8');
  const hill = x => 180 + (x / W) * 260 + Math.sin(x / 90) * 18; ctx.beginPath(); ctx.moveTo(W * 0.35, H); for (let x = W * 0.35; x <= W; x += 6) ctx.lineTo(x, hill(x) - 60 * (1 - (x - W * 0.35) / (W * 0.65))); ctx.lineTo(W, H); ctx.closePath(); ctx.fillStyle = '#5a7f4a'; ctx.fill();
  for (let i = 0; i < 220; i++) { const x = rnd(W * 0.42, W), y0 = hill(x) - 60 * (1 - (x - W * 0.35) / (W * 0.65)); circle(x, rnd(y0 + 6, H), rnd(2, 5), '#466b3a'); }
  road([[1250, 200, 20], [980, 290, 40], [1080, 380, 60], [800, 470, 90], [520, 650, 170]], { shoulder: '#c9b48a' });
  for (let i = 0; i < 5; i++) ellipse(rnd(100, 600), rnd(560, 620), rnd(30, 60), 6, alpha('#ffffff', 0.5));
  const who = riderBike(sp, 690, 560, 92, 0);
  return `${who} sur une route de corniche qui domine la mer turquoise, entre colline verdoyante et littoral, paysage ${placeFR(sp, 'de la côte du Centre Vietnam')}, ${TIME_FR[sp.time]}`;
};
function basketBoat(x, y, s) { ellipse(x, y, s, s * 0.42, '#5b4a32'); ellipse(x, y - s * 0.06, s * 0.86, s * 0.3, '#3e3222'); for (let i = 0; i < 8; i++) line(x - s * 0.8 + i * s * 0.23, y - s * 0.3, x - s * 0.7 + i * s * 0.2, y + s * 0.3, alpha('#2a2016', 0.5), 1.5); }
SCENES.beach = sp => {
  const hz = 320; sky(sp.time, hz); const v = sp.variant || 'plain';
  sea(hz, 470, '#2a86a8', '#86d0cc');
  let extra = '';
  if (v === 'headland') { ctx.beginPath(); ctx.moveTo(800, hz); ctx.bezierCurveTo(900, 200, 1100, 190, 1210, 240); ctx.lineTo(1210, hz); ctx.closePath(); ctx.fillStyle = depth('#4f7448', 0.35); ctx.fill(); lighthouse(1040, 222, 50); extra = ', un phare blanc et rouge sur le cap'; }
  if (v === 'islands') { for (let i = 0; i < 3; i++) ellipse(rnd(100, 1100), hz, rnd(60, 140), rnd(15, 30), depth('#4f7448', 0.4)); extra = ', îles boisées au large'; }
  if (v === 'jungle') { mountains(2, 160, 300, '#2f6a3f', { amp: 150, forest: true }); sea(300, 470, '#2a86a8', '#86d0cc'); extra = ', collines couvertes de forêt tropicale qui plongent dans la mer'; }
  const shore = x => 470 + Math.sin(x / 160) * 12; beach(shore, '#ead7a8');
  if (v === 'baskets') { for (let i = 0; i < 6; i++) basketBoat(rnd(80, 1100), rnd(490, 540), rnd(26, 36)); for (let i = 0; i < 3; i++) sampan(rnd(200, 1000), rnd(380, 440), rnd(30, 45), '#3f5a7a'); extra = ', bateaux-paniers ronds de pêcheurs échoués sur le sable et barques au large'; }
  if (v === 'rocks') { ctx.beginPath(); ctx.moveTo(620, 480); ctx.quadraticCurveTo(820, 400, 1210, 410); ctx.lineTo(1210, 490); ctx.closePath(); ctx.fillStyle = '#4a443d'; ctx.fill(); for (let i = 0; i < 40; i++) { const x = 640 + i * 14, top = 470 - Math.min(60, (x - 620) * 0.18) + rnd(-6, 6); rect(x, top, 13, 490 - top, shade('#4f4840', rnd(-0.12, 0.12))); poly([[x, top], [x + 6.5, top - 4], [x + 13, top]], '#6e665c'); } for (let i = 0; i < 24; i++) ellipse(rnd(620, 1200), rnd(470, 492), rnd(10, 30), 5, alpha('#ffffff', 0.7)); extra = ', un cap de roches basaltiques en colonnes battu par les vagues'; }
  if (v === 'pier') { rect(300, 400, 420, 12, '#7a5a3a'); for (let i = 0; i < 12; i++) rect(310 + i * 36, 410, 6, 40, '#5a4330'); sampan(760, 420, 50, '#c84a3a', false); sampan(820, 445, 40, '#3f5a7a', false); extra = ', une jetée en bois avançant dans la mer avec des bateaux de pêche colorés'; }
  for (let i = 0; i < (v === 'rocks' ? 3 : 6); i++) palm(v === 'rocks' ? rnd(0, 560) : rnd(0, W), rnd(500, 560), rnd(55, 85));
  road([[-50, 600, 70], [1300, 590, 70]], { shoulder: '#d8c79a', center: false });
  const who = riderBike(sp, rnd(380, 760), 615, 86, 0, sp.parked ? { parked: true, helmetOnSeat: '#f2f2f2' } : {});
  return `${who}${sp.parked ? ' garé' + fe(sp) : ''} sur une route de bord de mer bordée de cocotiers, plage de sable clair et eau turquoise${extra}, paysage ${placeFR(sp, 'du littoral vietnamien')}, ${TIME_FR[sp.time]}`;
};
SCENES.dunes = sp => {
  sky(sp.time, 300); dunes(250, ['#f0cf95', '#e7bf7f', '#ddb06c', '#f2d7a2']);
  const who = riderBike(sp, 650, 600, 90, 0, { parked: true, helmetOnSeat: '#f2f2f2' });
  for (let i = 0; i < 3; i++) person(rnd(150, 450), rnd(470, 520), 40, { top: pick(['#d0663a', '#3d6fa8', '#e6d9c2']) });
  return `${who} garé${fe(sp)} au pied de grandes dunes de sable ondulées où marchent quelques promeneurs, paysage ${placeFR(sp, 'du littoral du Sud-Centre')}, ${TIME_FR[sp.time]}`;
};
SCENES.delta = sp => {
  const hz = 330; sky(sp.time, hz); const far = ridgeFn(hz, 25, 4, 3); fillBelow(far, depth('#4f7a44', 0.5));
  for (let i = 0; i < 30; i++) palm(rnd(0, W), hz + rnd(-5, 10), rnd(25, 40), depth('#3f7d46', 0.4));
  water(hz + 10, 500, '#a68f6a', '#8a7655');
  const nb = rint(2, 4); for (let i = 0; i < nb; i++) sampan(rnd(100, 1100), rnd(380, 480), rnd(30, 50), pick(['#5b3d28', '#3f5a7a', '#6a4a2e']));
  rect(0, 500, W, 130, '#7fae55'); for (let i = 0; i < 7; i++) palm(rnd(0, W), rnd(520, 560), rnd(50, 75), '#3f8a46');
  road([[-50, 600, 70], [1300, 590, 70]], { shoulder: '#b8a98a', center: false });
  const who = riderBike(sp, 700, 615, 85, 0);
  return `${who} sur une digue au bord d’un large fleuve brun où naviguent ${nb} barques, entre cocotiers et vergers, paysage ${placeFR(sp, 'd’un delta du sud du Vietnam')}, ${TIME_FR[sp.time]}`;
};
SCENES.floating_market = sp => {
  const hz = 300; sky(sp.time, hz); fillBelow(ridgeFn(hz, 20, 4, 2), depth('#4f7a44', 0.5)); for (let i = 0; i < 25; i++) palm(rnd(0, W), hz, rnd(22, 35), depth('#3f7d46', 0.4));
  water(hz + 5, H, '#a68f6a', '#7f6c4e');
  for (let i = 0; i < 7; i++) { const y = 380 + i * 34 + rnd(-10, 10), x = rnd(80, 1120), s = 45 + (y - 360) / 2.2; sampan(x, y, s, pick(['#5b3d28', '#6a4a2e', '#3f5a7a']), R() < 0.7); for (let k = 0; k < 6; k++) circle(x + rnd(-0.5, 0.5) * s, y - s * 0.15 - rnd(0, 0.15) * s, s * 0.09, pick(['#e8b23a', '#7aa858', '#d0574a', '#f0a024', '#9ccc66'])); line(x + s * 0.6, y - s * 0.1, x + s * 0.6, y - s * 1.4, '#4a3626', 2); }
  return `marché flottant animé : barques en bois chargées de fruits et de légumes colorés sur un fleuve brun bordé de cocotiers, paysage ${placeFR(sp, 'du delta du Mékong')}, ${TIME_FR[sp.time]}`;
};
SCENES.hoi_an = sp => {
  const gy = 420; sky(sp.time, gy);
  let x = -10; while (x < W) { const w = rnd(90, 140), h = rnd(150, 210); rect(x, gy - h, w, h, pick(['#e9c25a', '#e6b84a', '#f0cf6a'])); poly([[x - 8, gy - h], [x + w + 8, gy - h], [x + w - 10, gy - h - 40], [x + 10, gy - h - 40]], '#8f5a3e'); rect(x + w * 0.2, gy - h * 0.6, w * 0.25, h * 0.3, '#5a3d2a'); rect(x + w * 0.55, gy - h * 0.6, w * 0.25, h * 0.3, '#5a3d2a'); rect(x + w * 0.3, gy - h * 0.25, w * 0.4, h * 0.25, '#4a3226'); x += w + 4; }
  const night = sp.time === 'night' || sp.time === 'dusk';
  for (let i = 0; i < 16; i++) lantern(40 + i * 75 + rnd(-15, 15), rnd(300, 360), rnd(20, 27), pick(['#d6403a', '#e8b23a', '#e0742e', '#c83a6a']));
  water(gy, 520, night ? '#2a3a55' : '#7f9fa0', night ? '#1f2b40' : '#5f8a88'); if (night) for (let i = 0; i < 30; i++) circle(rnd(0, W), rnd(gy + 10, 510), rnd(2, 4), alpha('#ffcf7a', 0.6));
  sampan(420, 480, 75, '#5b3d28'); rect(0, 520, W, 110, '#b9ab90');
  const who = riderBike(sp, 850, 600, 85, 0, { parked: true });
  return `${who} garé${fe(sp)} sur le quai face à des maisons anciennes aux murs jaunes ornées de lanternes, une barque sur la rivière, ambiance ${placeFR(sp, 'd’une vieille ville marchande du Centre')}, ${TIME_FR[sp.time]}`;
};
SCENES.hue_citadel = sp => {
  const gy = 380; sky(sp.time, gy); for (let i = 0; i < 8; i++) roundTree(rnd(0, W), gy - 20, rnd(40, 70), '#4f7a44');
  rect(150, gy - 70, 900, 70, '#9a8a72'); for (let i = 0; i < 45; i++) rect(150 + i * 20, gy - 70, 1, 70, alpha('#000', 0.08));
  templeGate(600, gy - 70, 110, '#c9a86a', '#d4a03a');
  water(gy, 500, '#6f9f8a', '#4f857a'); for (let i = 0; i < 30; i++) { const x = rnd(0, W), y = rnd(gy + 40, 495); ellipse(x, y, 14, 5, '#5a8f4a'); if (R() < 0.3) circle(x + 4, y - 6, 4, '#f2a6bd'); }
  rect(0, 500, W, 130, '#b9ab90'); road([[-50, 580, 80], [1300, 575, 80]], { center: false });
  const who = riderBike(sp, 380, 600, 85, 0);
  return `${who} devant une porte monumentale de citadelle impériale aux toits dorés, au-delà d’un fossé couvert de lotus, ambiance ${placeFR(sp, 'd’une ancienne cité impériale')}, ${TIME_FR[sp.time]}`;
};
SCENES.countryside = sp => {
  const hz = 330; sky(sp.time, hz); if (sp.variant === 'ba_vi' || sp.variant === 'hills') mountains(2, 180, 300, '#5a7f50', { amp: 150, mistBetween: true }); else fillBelow(ridgeFn(hz, 20, 3, 2), depth('#5a7f50', 0.5));
  rect(0, hz, W, H - hz, '#9ccc66'); paddies(hz, 560, ['#a6d36d', '#92c25c', '#b4d97a', '#c9d98a']);
  for (let i = 0; i < 4; i++) tileHouse(rnd(50, 1150), hz + rnd(10, 40), rnd(18, 28));
  for (let i = 0; i < 6; i++) bamboo(rnd(0, W), hz + rnd(15, 40), rnd(25, 40));
  if (R() < 0.6) person(rnd(100, 500), rnd(420, 480), 34, { hat: 'non', top: '#5a7aa0' });
  road([[560, hz + 4, 6], [540, 400, 34], [520, 500, 110], [470, 700, 300]], { shoulder: '#c9b48a', center: false });
  const who = riderBike(sp, 520, 560, 80, 0, { flip: true });
  return `${who} sur une route de campagne qui traverse des rizières, des maisons aux toits de tuiles et des bosquets de bambous${sp.variant === 'ba_vi' || sp.variant === 'hills' ? ', collines boisées à l’horizon' : ''}, ${sp.place ? 'environs ' + (sp.place.startsWith('de ') ? sp.place : 'de ' + sp.place) : 'campagne du delta du fleuve Rouge'}, ${TIME_FR[sp.time]}`;
};
SCENES.long_road = sp => {
  const hz = 300; sky(sp.time, hz); const south = sp.variant === 'south', hills = R() < 0.5;
  mountains(2, hills ? 170 : 210, 290, south ? '#6a8a5a' : '#557c4c', { amp: hills ? 140 : 90 });
  rect(0, hz, W, H - hz, south ? '#b9c97a' : '#8fbf5a'); paddies(hz, H, south ? ['#c4cf86', '#b3c274'] : ['#9ccc66', '#86b955']);
  const vx = rnd(480, 720), curve = R() < 0.5;
  road(curve ? [[vx, hz, 4], [vx - 60, 360, 40], [vx + 40, 460, 140], [600, 700, 520]] : [[vx, hz, 4], [vx, 400, 60], [(vx + 600) / 2, 500, 200], [600, 700, 520]], { shoulder: '#c9b48a' });
  const tree = south ? palm : (x, y, s) => roundTree(x, y, s * 0.6, '#4f7a44');
  for (let i = 0; i < 8; i++) { const t = rnd(0.1, 0.8); tree(vx - 120 - 600 * t * t, hz + (H - hz) * t * t, 30 + 80 * t); }
  for (let i = 0; i < 4; i++) { const t = (i + 1) / 5, y = hz + (H - hz) * t * t, x = vx + 90 + 340 * t * t; rrect(x, y - 30 * t - 8, 14 * t + 6, 30 * t + 8, 4, '#f2f0e6'); rect(x, y - 30 * t - 8, 14 * t + 6, 8 * t + 3, '#d6403a'); }
  const who = riderBike(sp, 560, 585, 88, 0, { bag: '#3d5a7a' });
  return `${who}, bagage arrimé à l’arrière, sur une longue route ${curve ? 'sinueuse' : 'droite'} qui file vers l’horizon${hills ? ' et les collines' : ''} entre rizières et ${south ? 'cocotiers' : 'arbres'}, bornes kilométriques blanches et rouges sans inscription, image du grand voyage ${sp.place ? sp.place : 'à travers le Vietnam'}, ${TIME_FR[sp.time]}`;
};
SCENES.cave = sp => {
  sky(sp.time, 260); karst(300, 10, 120, 220, depth('#5e7b55', 0.45), { dots: 400 }); fillBelow(ridgeFn(340, 50, 3, 3), depth('#4f7448', 0.25)); const cn = fbm(4, 6);
  const cliff = x => { const d = Math.abs(x - 600) / 430; return (d < 1 ? 380 - 250 * Math.pow(1 - Math.pow(d, 2.2), 1 / 2.2) : 420) - cn(x / W) * 70 + 20; };
  fillBelow(cliff, '#58704f', 420); ctx.save(); ctx.beginPath(); pathBelow(cliff, 420); ctx.clip(); for (let i = 0; i < 900; i++) { const x = rnd(170, 1030), y = rnd(cliff(x), 420); circle(x, y, rnd(1.5, 4), alpha(shade('#58704f', R() < 0.5 ? -0.2 : 0.12), 0.7)); } ctx.restore();
  ctx.beginPath(); ctx.moveTo(470, 420); ctx.bezierCurveTo(470, 300, 730, 300, 730, 420); ctx.closePath(); ctx.fillStyle = rgrad(600, 400, 10, 160, [[0, '#0f1210'], [1, '#2a332b']]); ctx.fill();
  for (let i = 0; i < 6; i++) { const x = 500 + i * 42; line(x, 330 + Math.abs(2.5 - i) * 6, x + rnd(-4, 4), 360 + rnd(0, 20), alpha('#7d8f78', 0.6), 3); }
  water(418, 520, '#4f8a7f', '#3f6f66'); sampan(600, 470, 60, '#5b3d28');
  rect(0, 520, W, 110, '#6f9a52'); for (let i = 0; i < 4; i++) roundTree(rnd(0, 250) + (i % 2) * 950, 530, rnd(40, 60), '#3f6a3a'); road([[-50, 590, 70], [1300, 580, 70]], { shoulder: '#b8a98a', center: false });
  const who = riderBike(sp, 950, 610, 85, 0, { parked: true, helmetOnSeat: '#f2f2f2' });
  return `${who} garé${fe(sp)} près d’une rivière émeraude qui s’enfonce dans l’entrée d’une grotte, au pied d’une falaise karstique couverte de jungle, paysage ${placeFR(sp, 'd’une région karstique du Centre')}, ${TIME_FR[sp.time]}`;
};
SCENES.forest_mountain = sp => {
  sky(sp.time, 320); mountains(5, 110, 330, '#3f6a45', { amp: 160, mistBetween: true, forest: true });
  const n = ridgeFn(520, 90, 2, 3); fillBelow(n, '#3a6040'); for (let i = 0; i < 30; i++) { const x = rnd(0, W); roundTree(x, n(x) + rnd(20, 60), rnd(30, 55), '#3f6a3a'); }
  road([[900, 360, 10], [700, 410, 25], [950, 470, 50], [600, 560, 110], [500, 700, 200]], { shoulder: '#9a8f72' });
  const who = riderBike(sp, 620, 600, 92, 0);
  return `${who} dans une montée en lacets à travers une forêt dense${sp.time === 'mist' ? ' noyée de brume' : ''}, sommets boisés en arrière-plan, paysage ${placeFR(sp, 'de moyenne montagne')}, ${TIME_FR[sp.time]}`;
};
SCENES.pagoda_karst = sp => {
  const hz = 380; sky(sp.time, hz); karst(hz, 12, 120, 230, depth('#5e7b55', 0.35), { dots: 500 });
  const px = rnd(250, 900), py = hz - 6; rect(px - 70, py - 4, 140, 12, '#8f877a'); rect(px - 40, py - 30, 80, 40, '#c9a86a'); poly([[px - 60, py - 30], [px + 60, py - 30], [px + 40, py - 60], [px - 40, py - 60]], '#8f4a32');
  water(hz, H, '#6f9f8a', '#4f857a'); for (let i = 0; i < 5; i++) { const y = 420 + i * 40; sampan(rnd(120, 1080), y, 40 + (y - 400) * 0.35, '#5b3d28'); }
  return `rivière sinueuse au milieu de montagnes karstiques où glissent cinq barques à rames, avec un petit temple niché sur la rive, paysage ${placeFR(sp, 'karstique du nord du Vietnam')}, ${TIME_FR[sp.time]}`;
};
SCENES.fog_mountain = sp => {
  sp.time = 'mist'; sky('mist', 330); mountains(4, 140, 320, '#5a7a62', { amp: 150, mistBetween: true });
  road([[700, 360, 10], [560, 420, 30], [760, 500, 70], [520, 700, 210]], { shoulder: '#a8a28f' });
  haze(300, 560, 0.8); rect(0, 0, W, H, alpha('#e6ebea', 0.25));
  const b = sp.bikes[0]; heroBike(b, 640, 610, 95, { rider: outfit() });
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; poly([[640 + 0.68 * 95, 610 - 1.05 * 95], [1100, 470], [1100, 650]], alpha('#fff6d8', 0.22)); ctx.restore();
  return `${bikeFR(b)} conduit${fe(sp)} phare allumé sur une route de montagne en lacets enveloppée d’un épais brouillard, crêtes à peine visibles`;
};
SCENES.highway = sp => {
  const hz = 300; sky(sp.time, hz); mountains(2, 210, 290, '#5a7f50', { amp: 70 }); rect(0, hz, W, H - hz, '#8fbf5a');
  poly([[560, hz], [640, hz], [1300, H], [200, H]], '#6c6f73'); rect(0, 0, 0, 0, '#000');
  for (let i = 0; i < 6; i++) { const t = (i + 1) / 7, y = hz + (H - hz) * t * t; line(600 + 2 * t * 300 * 0.1, y, 600 + 260 * t * t, y + 20 * t, '#f2f0e6', 2 + 4 * t); }
  poly([[540, hz], [555, hz], [180, H], [60, H]], '#c9c1b2');
  poly([[500, hz], [535, hz], [40, H], [-200, H]], '#7a7d81');
  car(800, 520, 70, '#d9d9d9'); car(660, 400, 30, '#3d6fa8'); car(980, 600, 90, '#c8323a');
  const b = sp.bikes[0]; heroBike(b, 150, 600, 80, { rider: outfit() });
  return `voie rapide réservée aux voitures, séparée par une bande de sécurité d’une route parallèle où circule ${bikeShort(b)} avec son conducteur, campagne verte en arrière-plan`;
};
