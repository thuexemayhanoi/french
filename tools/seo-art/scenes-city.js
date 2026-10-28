// Urban and Hanoi scenes. Each returns a description of exactly what was drawn.
function heroAction(sp, x, gy, s, extra = {}) {
  const b = sp.bikes[0], o = Object.assign({}, extra); let txt;
  if (sp.parked) { o.helmetOnSeat = o.helmetOnSeat || pick(['#f2f2f2', '#e8c547', '#c83a3a', '#2b2d31']); txt = bikeFR(b) + ' garé' + fe(sp) + ', casque posé sur la selle,'; }
  else { const of = outfit(sp.backpack ? { backpack: '#4f6b5a' } : {}); o.rider = of; if (sp.passenger) { o.passenger = outfit(); txt = bikeFR(b) + ' avec un conducteur et un passager casqués'; } else txt = bikeFR(b) + ' conduit' + fe(sp) + ' par un motard casqué en ' + of.fr; }
  heroBike(b, x, gy + s * 0.12, s * 1.22, o); return txt;
}
function parkedRow(y, n, s, x0 = 0, x1 = W) { for (let i = 0; i < n; i++) miniBike(x0 + (i + 0.5) * (x1 - x0) / n + rnd(-10, 10), y, s, pick(Object.values(BIKE_COLORS)), R() < 0.5, false); }
function cityBase(sp, gy = 440, o = {}) { sky(sp.time, gy, { clouds: sp.time !== 'night', sun: o.sun }); street(gy, 9, { night: sp.time === 'night' || sp.time === 'dusk', minH: o.minH, maxH: o.maxH }); cables(gy - 240, 7); sidewalk(gy, 40); asphalt(gy + 40, H); }
SCENES.old_quarter = sp => {
  cityBase(sp, 440); const lan = sp.variant === 'lanterns' || sp.time === 'night';
  if (lan) for (let i = 0; i < 14; i++) lantern(40 + i * 85 + rnd(-10, 10), rnd(330, 380), rnd(17, 23), pick(['#d6403a', '#e8b23a', '#e0742e']));
  parkedRow(470, 7, 30); for (let i = 0; i < 3; i++) person(rnd(50, 1150), 480, 46, { top: pick(['#d0663a', '#3d6fa8', '#e6d9c2', '#8a3b4f']), hat: R() < 0.3 ? 'non' : null });
  const txt = heroAction(sp, 640, 600, 100);
  return `${txt} dans une rue étroite du Vieux Quartier de Hanoi bordée de maisons-tubes colorées${lan ? ' décorées de lanternes' : ''}, deux-roues garés sur le trottoir et câbles électriques au-dessus, ${TIME_FR[sp.time]}`;
};
SCENES.city_traffic = sp => {
  cityBase(sp, 420, { minH: 230, maxH: 340 });
  for (let i = 0; i < 7; i++) miniBike(rnd(30, 1170), 500, 36, pick(Object.values(BIKE_COLORS)), R() < 0.5, true);
  if (sp.variant === 'bus') bus(950, 540, 60, '#3a8f6a'); else car(980, 545, 70, pick(['#d9d9d9', '#3d6fa8', '#2b2d31']), true);
  for (let i = 0; i < 4; i++) miniBike(rnd(80, 1150), 560 + rnd(0, 20), 50, pick(Object.values(BIKE_COLORS)), R() < 0.3, true);
  const txt = heroAction(sp, 560, 615, 100);
  return `${txt} au milieu d’un flot dense de scooters et de motos dans une avenue commerçante de Hanoi${sp.variant === 'bus' ? ', un bus urbain à côté' : ', une voiture à côté'}, ${TIME_FR[sp.time]}`;
};
SCENES.quiet_street = sp => {
  sky(sp.time, 430); const gy = 450;
  if (sp.variant === 'villa') { villa(60, gy, 420, 200, pick(['#e9c86a', '#e6d6b3', '#d8c7e0'])); villa(640, gy, 480, 210, pick(['#e9c86a', '#cfe0d0'])); } else street(gy, 9, {});
  for (let i = 0; i < 6; i++) roundTree(80 + i * 210 + rnd(-30, 30), gy + 8, rnd(70, 95), pick(['#4f7a44', '#5a8a4c']));
  sidewalk(gy, 50); asphalt(gy + 50, H); parkedRow(475, 3, 28, 800, 1180);
  sp.parked = true; const txt = heroAction(sp, 520, 590, 115, sp.bag ? { bag: '#3d5a7a' } : {});
  if (sp.extra === 'backpack') backpackTop(760, 580, 34, '#4f8a5b');
  return `${txt} dans une rue calme et arborée de Hanoi${sp.variant === 'villa' ? ' bordée de villas de style colonial' : ' bordée de maisons-tubes'}${sp.extra === 'backpack' ? ', un sac à dos posé au sol' : ''}, ${TIME_FR[sp.time]}`;
};
SCENES.lake_hk = sp => {
  const hz = 360; sky(sp.time, hz); for (let i = 0; i < 14; i++) tubeHouse(i * 90 - 20, hz, 86, rnd(60, 110), depth(pick(FACADES), 0.5));
  for (let i = 0; i < 18; i++) roundTree(rnd(0, W), hz + 6, rnd(28, 40), depth('#4f7a44', 0.3));
  water(hz, 520, sp.time === 'night' ? '#2a3a55' : '#6f9f8a', sp.time === 'night' ? '#1f2b40' : '#4f857a');
  turtleTower(rnd(440, 580), 420, 60);
  const br = sp.variant !== 'nobridge'; if (br) redBridge(40, 300, 470, 70);
  rect(0, 520, W, 110, '#a9a08e'); for (let i = 0; i < 5; i++) roundTree(rnd(0, W), 530, rnd(70, 95), pick(['#4f7a44', '#c8473a']));
  const txt = heroAction(sp, 900, 600, 92);
  return `${txt} sur la promenade du lac Hoan Kiem, avec la petite tour sur son îlot${br ? ' et un pont rouge en arc' : ''} au milieu des arbres, ${TIME_FR[sp.time]}`;
};
SCENES.west_lake = sp => {
  const hz = 380; sky(sp.time, hz, { sunY: sp.time === 'golden' || sp.time === 'dusk' ? 300 : undefined });
  for (let i = 0; i < 20; i++) rect(rnd(0, W), hz - rnd(10, 60), rnd(20, 50), 80, depth('#9aa3ab', 0.6));
  water(hz, 540, depth('#5f8fa0', 0.2), '#4f7f90');
  const px = rnd(250, 950); for (let i = 0; i < 8; i++) { const w = 26 - i * 2.2, y = hz - i * 16; rect(px - w / 2, y - 14, w, 14, '#a9563a'); rect(px - w / 2 - 3, y - 15, w + 6, 3, '#6a3a26'); } poly([[px - 5, hz - 128], [px + 5, hz - 128], [px, hz - 150]], '#6a3a26'); ellipse(px, hz + 2, 70, 8, '#4f7a44');
  for (let i = 0; i < 3; i++) roundTree(px + rnd(-60, 60), hz + 4, 22, '#4f7a44');
  rect(0, 540, W, 90, '#b8ac94'); if (sp.variant === 'cafe') { for (let i = 0; i < 4; i++) { stool(80 + i * 70, 600, 26, pick(['#d8443a', '#2f6db5'])); } coffeeCup(170, 560, 22, true); }
  const txt = heroAction(sp, 760, 610, 92);
  return `${txt} au bord du lac de l’Ouest, une haute pagode en briques sur une presqu’île${sp.variant === 'cafe' ? ', tabourets de café sur la rive' : ''}, ${TIME_FR[sp.time]}`;
};
SCENES.long_bien = sp => {
  const hz = 360; sky(sp.time, hz); fillBelow(ridgeFn(hz, 18, 4, 2), depth('#6a8f58', 0.5));
  water(hz + 4, 520, '#b08f6a', '#9a7a55');
  trussBridge(330, 70, '#5f564d', { pierH: 200 });
  if (sp.variant === 'train') { rect(200, 296, 700, 28, '#3a5f7a'); for (let i = 0; i < 14; i++) rect(210 + i * 49, 302, 34, 12, '#d8e2e8'); }
  rect(0, 520, W, 110, '#8fae6a'); for (let i = 0; i < 6; i++) { const x = rnd(0, W); for (let k = 0; k < 5; k++) ellipse(x + rnd(-20, 20), 530 + rnd(-10, 10), 22, 8, '#6f9a4a', rnd(-1, 1)); }
  road([[-50, 600, 60], [1300, 590, 60]], { shoulder: '#b8a98a', center: false });
  const txt = heroAction(sp, 600, 612, 82);
  return `${txt} sur la rive du fleuve Rouge, face à un long pont métallique à poutres en treillis${sp.variant === 'train' ? ' traversé par un train' : ''}, bananiers sur la berge, ${TIME_FR[sp.time]}`;
};
SCENES.french_quarter = sp => {
  const night = sp.time === 'night'; sky(sp.time, 450); const gy = 450;
  const cath = sp.variant === 'cathedral'; if (cath) { villa(-20, gy, 330, 180, '#e9c86a'); cathedral(600, gy, 90, night ? '#5a5650' : '#8d8579'); villa(870, gy, 350, 190, '#e6d6b3'); } else { villa(-20, gy, 400, 200, '#e9c86a'); villa(420, gy, 360, 230, '#e6d6b3'); villa(820, gy, 400, 200, '#f0cf6a'); }
  if (night) { stringLights(0, 300, 600, 320, 18); stringLights(600, 320, 1200, 300, 18); }
  for (let i = 0; i < 5; i++) roundTree(rnd(0, W), gy + 10, rnd(70, 100), '#4f7a44');
  sidewalk(gy, 45); asphalt(gy + 45, H);
  if (sp.extra === 'christmas') { pine(200, 520, 120, '#2f6a45'); for (let i = 0; i < 20; i++) circle(200 + rnd(-40, 40), 520 - rnd(20, 150), 4, pick(['#ffd27a', '#d6403a', '#7fb3d9'])); }
  const txt = heroAction(sp, 760, 600, 100);
  return `${txt} dans une rue du quartier français de Hanoi, devant des villas coloniales aux volets verts${cath ? ' et une cathédrale néogothique à deux tours' : ''}${sp.extra === 'christmas' ? ', sapin illuminé et guirlandes de fête' : night ? ' et des guirlandes lumineuses' : ''}, ${TIME_FR[sp.time]}`;
};
SCENES.night_market = sp => {
  sp.time = 'night'; sky('night', 420); street(420, 9, { night: true }); asphalt(420, H, '#4a4c52');
  stringLights(0, 260, 600, 280, 20, '#ffd27a'); stringLights(600, 280, 1200, 260, 20, '#ffd27a');
  for (let i = 0; i < 6; i++) stall(30 + i * 200, 520, 150, pick(['#d6403a', '#e0742e', '#2f6db5', '#3c8a6e']), true);
  for (let i = 0; i < 8; i++) person(rnd(20, 1180), rnd(530, 560), 48, { top: pick(['#d0663a', '#3d6fa8', '#e6d9c2', '#8a3b4f', '#f0c24b']) });
  parkedRow(615, 6, 34, 600, 1190);
  return `marché de nuit animé dans une rue de Hanoi : étals éclairés sous des guirlandes lumineuses, promeneurs et une rangée de deux-roues garés au premier plan`;
};
SCENES.street_food = sp => {
  cityBase(sp, 420); if (sp.time === 'night' || sp.time === 'dusk') stringLights(0, 250, 1200, 270, 30);
  rect(150, 470, 210, 90, '#8a6a4a'); for (let i = 0; i < 2; i++) { circle(200 + i * 100, 462, 34, '#9aa0a6'); for (let k = 0; k < 6; k++) ellipse(200 + i * 100 + rnd(-20, 20), 420 - k * 14, 14, 8, alpha('#ffffff', 0.35 - k * 0.04)); }
  for (let i = 0; i < 5; i++) { stool(440 + i * 80, 590, 30, pick(['#d8443a', '#2f6db5'])); } rect(470, 528, 300, 14, '#2f6db5'); for (let i = 0; i < 4; i++) { ellipse(500 + i * 70, 522, 22, 8, '#f4f1ea'); ellipse(500 + i * 70, 520, 16, 5, '#c98a5a'); }
  for (let i = 0; i < 3; i++) person(480 + i * 120, 600, 46, { top: pick(['#d0663a', '#3d6fa8', '#e6d9c2']) });
  sp.parked = true; const txt = heroAction(sp, 1000, 610, 85);
  return `étal de cuisine de rue fumant avec grandes marmites, petites tables et tabourets en plastique colorés occupés par des clients, ${txt.replace(/,$/, '')} sur le côté, dans une rue de Hanoi, ${TIME_FR[sp.time]}`;
};
SCENES.cafe = sp => {
  const lakeSide = sp.variant === 'lake'; if (lakeSide) { sky(sp.time, 360); water(360, 470, '#6f9f8a', '#4f857a'); for (let i = 0; i < 10; i++) roundTree(rnd(0, W), 365, 30, depth('#4f7a44', 0.3)); rect(0, 470, W, 160, '#b8ac94'); } else cityBase(sp, 430);
  for (let i = 0; i < 6; i++) { const x = 80 + i * 130; stool(x, 610, 48, pick(['#d8443a', '#2f6db5', '#3c8a6e'])); } for (let i = 0; i < 3; i++) { rect(100 + i * 250, 530, 130, 14, '#7a5a3a'); rect(160 + i * 250, 544, 8, 66, '#5a4330'); coffeeCup(130 + i * 250, 530, 26, true); coffeeCup(190 + i * 250, 530, 22, false); }
  for (let i = 0; i < 3; i++) person(110 + i * 250 + 100, 612, 70, { top: pick(['#d0663a', '#3d6fa8', '#e6d9c2', '#8a3b4f']) });
  sp.parked = true; const txt = heroAction(sp, 1000, 615, 88);
  return `terrasse de café ${lakeSide ? 'au bord d’un lac de Hanoi' : 'sur un trottoir de Hanoi'} avec tabourets bas, verres de café et clients assis, ${txt.replace(/,$/, '')} tout près, ${TIME_FR[sp.time]}`;
};
SCENES.temple = sp => {
  sky(sp.time, 450); for (let i = 0; i < 10; i++) roundTree(rnd(0, W), 430, rnd(60, 90), '#4f7a44');
  rect(0, 400, W, 50, '#a99a7c'); templeGate(600, 450, 100, '#c9b48a', '#7a4a32');
  sidewalk(450, 50, '#cbbf9f'); asphalt(500, H);
  for (let i = 0; i < 4; i++) person(rnd(300, 900), 495, 44, { top: pick(['#d0663a', '#3d6fa8', '#e6d9c2']), hat: R() < 0.3 ? 'non' : null });
  sp.parked = true; const txt = heroAction(sp, 980, 600, 95);
  return `portique traditionnel à trois arches et toits de tuiles d’un temple ancien entouré d’arbres, visiteurs devant l’entrée et ${txt.replace(/,$/, '')} dans la rue, ambiance ${sp.place ? 'inspirée ' + sp.place : 'de Hanoi'}, ${TIME_FR[sp.time]}`;
};
SCENES.ba_dinh = sp => {
  sky(sp.time, 420); villa(80, 420, 520, 170, '#e9c86a'); villa(680, 420, 460, 160, '#e6d6b3');
  rect(0, 420, W, 210, '#c9c1b2'); for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) rect(60 + c * 190, 440 + r * 40, 160, 30, '#7fae55');
  for (let i = 0; i < 8; i++) roundTree(40 + i * 160, 430, 60, '#4f7a44');
  asphalt(560, H); const txt = heroAction(sp, 600, 625, 85);
  return `${txt} longeant une vaste esplanade de pelouses quadrillées bordée de bâtiments officiels jaunes et d’arbres, quartier ${sp.place || 'de Ba Dinh'} à Hanoi, ${TIME_FR[sp.time]}`;
};
SCENES.tet = sp => {
  cityBase(sp, 430); for (let i = 0; i < 14; i++) lantern(40 + i * 85 + rnd(-10, 10), rnd(330, 380), rnd(18, 24), '#d6403a');
  for (let i = 0; i < 3; i++) peachTree(rnd(80, 1100), 470, rnd(60, 90)); for (let i = 0; i < 3; i++) kumquat(rnd(80, 1100), 475, rnd(30, 40));
  const b = sp.bikes[0]; heroBike(b, 600, 610, 100, { rider: outfit() }); peachTree(600 - 60, 610 - 100, 70);
  return `${bikeFR(b)} transportant un pêcher en fleurs dans une rue de Hanoi décorée de lanternes rouges, kumquats en pot et fleurs roses pour le Nouvel An lunaire, ${TIME_FR[sp.time]}`;
};
SCENES.rain_street = sp => {
  sp.time = 'rain'; cityBase(sp, 430); puddles(480, 620, 10);
  for (let i = 0; i < 4; i++) miniBike(rnd(50, 1150), 510, 36, pick(Object.values(BIKE_COLORS)), R() < 0.5, true);
  const b = sp.bikes[0]; const poncho = pick(['#2f6db5', '#e0742e', '#3c8a6e', '#c83a3a']);
  heroBike(b, 620, 615, 100, { rider: { top: poncho, pants: poncho, helmet: '#f2f2f2' } });
  rain(650, 0.4);
  return `${bikeFR(b)} conduit${fe(sp)} par un motard en poncho de pluie ${({ '#2f6db5': 'bleu', '#e0742e': 'orange', '#3c8a6e': 'vert', '#c83a3a': 'rouge' })[poncho]} sur une chaussée mouillée de Hanoi, reflets et flaques, sous une pluie battante`;
};
SCENES.flood_street = sp => {
  sp.time = 'rain'; cityBase(sp, 430);
  const b = sp.bikes[0]; heroBike(b, 560, 640, 120, {}); person(760, 640, 140, { top: '#2f6db5', pants: '#2f6db5', hat: 'helmet', helmet: '#f2f2f2' }); line(700, 520, 640, 520, '#2f6db5', 16);
  rect(0, 575, W, 55, alpha('#8a7a5a', 0.82)); rect(0, 500, W, 75, alpha('#8a7a5a', 0.55)); for (let i = 0; i < 140; i++) rect(rnd(0, W), rnd(505, 630), rnd(10, 40), 1.5, alpha('#d9cfb8', 0.45));
  rain(450, 0.35);
  return `rue de Hanoi inondée après une forte pluie : l’eau boueuse monte jusqu’au milieu des roues et un conducteur en poncho bleu pousse ${bikeShort(b)} à pied`;
};
SCENES.winter_lake = sp => {
  sp.time = 'mist'; sky('mist', 380); for (let i = 0; i < 14; i++) tubeHouse(i * 90 - 20, 380, 86, rnd(60, 110), depth(pick(FACADES), 0.6));
  water(380, 520, '#9fb3b8', '#8aa0a6'); haze(320, 450, 0.7);
  rect(0, 520, W, 110, '#a9a397'); for (let i = 0; i < 5; i++) { const x = rnd(0, W); line(x, 530, x, 400, '#5a4a3a', 6); for (let k = 0; k < 6; k++) line(x, 440 + k * 10, x + rnd(-60, 60), 400 + k * 8, '#5a4a3a', 2); }
  const b = sp.bikes[0]; heroBike(b, 640, 610, 95, { rider: { top: '#7a2635', pants: '#2f3a4f', helmet: '#2b2d31' } });
  return `${bikeFR(b)} conduit${fe(sp)} par un motard en manteau d’hiver le long d’un lac de Hanoi noyé de brume, arbres dénudés sur la rive`;
};
SCENES.heat_street = sp => {
  sp.time = 'noon'; cityBase(sp, 430, { sun: false }); rect(0, 0, W, H, alpha('#ffd98a', 0.12)); thermometerSun(1050, 90, 70);
  roundTree(250, 470, 150, '#4f8a4c'); ellipse(250, 560, 230, 40, alpha('#000000', 0.18));
  const b = sp.bikes[0]; heroBike(b, 300, 600, 100, { rider: { top: '#f2efe6', pants: '#3b4a63', helmet: '#f2f2f2' } }); waterBottle(480, 600, 50);
  return `${bikeFR(b)} arrêté${fe(sp)} à l’ombre d’un grand arbre dans une rue de Hanoi écrasée de soleil, le motard en chemise légère avec une bouteille d’eau à portée de main`;
};
SCENES.night_ride = sp => {
  sp.time = 'night'; sky('night', 420); street(420, 9, { night: true }); asphalt(420, H, '#33363c');
  for (let x = 100; x < W; x += 260) { rect(x, 260, 6, 180, '#5a5d63'); circle(x + 20, 262, 10, '#ffe7a8'); ctx.save(); ctx.globalCompositeOperation = 'lighter'; poly([[x + 12, 268], [x + 28, 268], [x + 90, 600], [x - 60, 600]], alpha('#ffd27a', 0.045)); ctx.restore(); }
  for (let i = 0; i < 5; i++) { const x = rnd(50, 1150); miniBike(x, 500, 34, pick(Object.values(BIKE_COLORS)), R() < 0.5, true); circle(x, 505, 4, '#ff5a4a'); }
  const b = sp.bikes[0]; heroBike(b, 500, 612, 100, { rider: outfit() });
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; poly([[500 + 68, 612 - 105], [1100, 520], [1100, 640]], alpha('#fff6d8', 0.22)); ctx.restore();
  return `${bikeFR(b)} roulant phare allumé dans une rue de Hanoi la nuit, éclairée par des réverbères et les feux arrière rouges des autres deux-roues`;
};
SCENES.intersection = sp => {
  rect(0, 0, W, H, '#8fae6a'); const round = sp.variant === 'roundabout';
  rect(0, 240, W, 150, '#5f6266'); rect(520, 0, 160, H, '#5f6266');
  for (let i = 0; i < 6; i++) { rect(450 + i * 18 - 70, 0, 0, 0, '#000'); rect(530 + i * 24, 210, 14, 26, '#f2f0e6'); rect(530 + i * 24, 394, 14, 26, '#f2f0e6'); rect(490, 252 + i * 22, 26, 14, '#f2f0e6'); rect(684, 252 + i * 22, 26, 14, '#f2f0e6'); }
  for (let x = 0; x < W; x += 60) if (x < 470 || x > 730) rect(x, 314, 34, 4, '#f1d36b');
  for (let y = 0; y < H; y += 60) if (y < 200 || y > 430) rect(598, y, 4, 34, '#f1d36b');
  if (round) { circle(600, 315, 120, '#5f6266'); circle(600, 315, 62, '#7fae55', '#e9e6dc', 6); roundTree(600, 330, 40, '#4f7a44'); }
  const arrow = (x, y, a) => rot(x, y, a, () => { rect(-4, -10, 8, 26, '#f2f0e6'); poly([[-12, -10], [12, -10], [0, -26]], '#f2f0e6'); });
  if (!round) { arrow(420, 350, Math.PI / 2); arrow(780, 280, -Math.PI / 2); arrow(640, 480, 0); arrow(560, 150, Math.PI); arrow(640, 520, -0.8); }
  else { for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + 0.6; arrow(600 + Math.cos(a) * 92, 315 + Math.sin(a) * 92, a + Math.PI); } }
  const topBike = (x, y, a, c) => rot(x, y, a, () => { rrect(-22, -7, 44, 14, 7, c); circle(4, 0, 7, '#f2f2f2'); rect(14, -12, 3, 24, '#2b2d31'); });
  const n = round ? 10 : 12; for (let i = 0; i < n; i++) { if (round) { const a = rnd(0, Math.PI * 2); topBike(600 + Math.cos(a) * 92, 315 + Math.sin(a) * 92, a + Math.PI / 2, pick(Object.values(BIKE_COLORS))); } else if (R() < 0.5) topBike(rnd(0, W), rnd(255, 375), R() < 0.5 ? 0 : Math.PI, pick(Object.values(BIKE_COLORS))); else topBike(rnd(535, 665), rnd(0, H), R() < 0.5 ? Math.PI / 2 : -Math.PI / 2, pick(Object.values(BIKE_COLORS))); }
  for (let i = 0; i < 10; i++) roundTree(rnd(0, 480), rnd(30, 200), 40, '#4f7a44'); for (let i = 0; i < 6; i++) rect(rnd(740, 1150), rnd(440, 580), 80, 60, pick(FACADES));
  return round ? 'vue aérienne d’un rond-point arboré où des deux-roues circulent en suivant les flèches peintes au sol, passages piétons à chaque entrée' : 'vue aérienne d’un carrefour urbain avec passages piétons, lignes de voie et flèches de direction peintes au sol, deux-roues engagés dans chaque branche';
};
SCENES.gas_station = sp => {
  sky(sp.time, 420); street(420, 9, {}); rect(0, 420, W, 210, '#bdb6a8');
  rect(240, 230, 720, 40, '#2f8f5a'); rect(240, 266, 720, 8, '#e9e6dc'); for (const x of [300, 900]) rect(x - 10, 270, 20, 200, '#d9d6cc');
  for (const x of [450, 750]) { rrect(x - 35, 360, 70, 120, 8, '#e9e6dc'); rrect(x - 25, 375, 50, 30, 4, '#3a4a5a'); line(x + 35, 400, x + 70, 470, '#2b2d31', 4); }
  const txt = heroAction(sp, 600, 600, 100);
  return `${txt} arrêté${fe(sp)} sous l’auvent vert d’une station-service, entre deux pompes à carburant sans marque, dans un quartier de Hanoi, ${TIME_FR[sp.time]}`;
};
SCENES.airport = sp => {
  sky(sp.time, 400); plane(820, 140, 160); rect(500, 300, 700, 100, '#c9ced3'); for (let i = 0; i < 14; i++) rect(520 + i * 48, 320, 36, 50, '#7f9fb6'); poly([[480, 300], [1220, 300], [1180, 270], [520, 270]], '#9aa3ab');
  rect(0, 400, W, 230, '#8fae6a'); road([[-50, 520, 120], [1300, 500, 120]], { shoulder: '#b8a98a' });
  for (let i = 0; i < 6; i++) palm(rnd(0, 480), rnd(410, 440), 45);
  const b = sp.bikes[0]; heroBike(b, 450, 560, 95, { rider: outfit({ backpack: '#3d5a7a' }), bag: '#7a5236' });
  return `${bikeFR(b)} chargé${fe(sp)} d’un sac, conduit${fe(sp)} par un voyageur avec sac à dos sur la route qui longe un terminal d’aéroport, un avion de ligne dans le ciel, ${TIME_FR[sp.time]}`;
};
SCENES.hotel = sp => {
  sky(sp.time, 450); tubeHouse(-20, 450, 300, 330, '#e6d6b3'); tubeHouse(880, 450, 340, 300, '#cfe0d0');
  rect(280, 120, 600, 330, '#f2efe8'); for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) { rect(310 + c * 95, 140 + r * 70, 60, 45, '#7f9fb6'); rect(305 + c * 95, 186 + r * 70, 70, 4, '#9a9a9a'); }
  rect(500, 360, 160, 90, '#3a4a5a'); poly([[470, 352], [690, 352], [710, 372], [450, 372]], '#7a2635'); for (const x of [440, 720]) { rect(x - 20, 410, 40, 40, '#9a6a42'); circle(x, 400, 28, '#4f8a4c'); }
  sidewalk(450, 50); asphalt(500, H);
  sp.parked = true; const txt = heroAction(sp, 600, 590, 110); keyring(820, 590, 30, 0.4);
  return `${txt} devant l’entrée d’un hôtel de ville aux plantes en pot, un trousseau de clés posé au premier plan, ${TIME_FR[sp.time]}`;
};
SCENES.transit = sp => {
  cityBase(sp, 430); rect(120, 380, 260, 10, '#3a5f7a'); for (const x of [130, 370]) rect(x, 390, 6, 80, '#5a5d63'); rect(140, 395, 220, 50, alpha('#cfe2ec', 0.5));
  bus(760, 560, 75, '#2f8f5a'); for (let i = 0; i < 3; i++) person(170 + i * 70, 500, 46, { top: pick(['#d0663a', '#3d6fa8', '#e6d9c2']) });
  const txt = heroAction(sp, 330, 615, 95);
  return `${txt} passant devant un arrêt de bus où attendent des passagers, un bus urbain vert garé le long du trottoir dans une rue de Hanoi, ${TIME_FR[sp.time]}`;
};
SCENES.saigon = sp => {
  const hz = 420; sky(sp.time, hz);
  for (let i = 0; i < 14; i++) { const x = rnd(0, W), w = rnd(50, 110), h = rnd(120, 300); rect(x, hz - h, w, h, depth(pick(['#9aa8b5', '#7f93a8', '#b5bfc6', '#6f8299']), 0.3)); for (let k = 0; k < h / 20; k++) rect(x + 6, hz - h + 8 + k * 20, w - 12, 6, alpha(sp.time === 'night' ? '#ffd98a' : '#dfe8ee', 0.5)); }
  if (sp.variant === 'river') { water(hz, 520, '#6f8a9a', '#5a7585'); rect(0, 520, W, 110, '#b9b2a2'); } else { street(hz + 60, 9, {}); asphalt(hz + 60, H); }
  for (let i = 0; i < 6; i++) miniBike(rnd(30, 1170), 545, 36, pick(Object.values(BIKE_COLORS)), R() < 0.5, true);
  const txt = heroAction(sp, 600, 615, 95);
  return `${txt} dans le flot des deux-roues ${sp.variant === 'river' ? 'sur les quais face aux tours de verre' : 'au pied des tours modernes'} d’une grande métropole du Sud inspirée de Hô-Chi-Minh-Ville, ${TIME_FR[sp.time]}`;
};
SCENES.pottery = sp => {
  sky(sp.time, 400); for (let i = 0; i < 5; i++) tileHouse(100 + i * 240, 400, 60, '#c9b48a', '#8f4a32');
  rect(0, 400, W, 230, '#c4a57a');
  for (let r = 0; r < 3; r++) for (let i = 0; i < 9; i++) { const x = 80 + i * 120 + r * 30, y = 470 + r * 60, s = 26 + r * 6, c = pick(['#2f6db5', '#e9e1cf', '#8f4a32', '#5f8a7a']); ellipse(x, y, s * 0.8, s * 1.1, c); rect(x - s * 0.3, y - s * 1.3, s * 0.6, s * 0.3, c); ellipse(x, y - s * 1.3, s * 0.38, s * 0.1, shade(c, -0.3)); if (c === '#e9e1cf') ctx.strokeStyle = '#2f6db5'; }
  sp.parked = true; const txt = heroAction(sp, 1020, 615, 80);
  return `rangées de vases et de jarres en céramique, bleus, blancs et terre cuite, alignés devant des ateliers de potiers aux toits de tuiles, ${txt.replace(/,$/, '')} sur le côté, ambiance ${sp.place ? 'inspirée ' + sp.place : 'd’un village de céramistes'}, ${TIME_FR[sp.time]}`;
};
SCENES.ancient_village = sp => {
  sky(sp.time, 430); for (let i = 0; i < 3; i++) tileHouse(150 + i * 400, 430, 70, '#d8c7a4', '#8f4a32');
  const ramp = sp.variant === 'ramparts';
  if (ramp) { const r = ridgeFn(440, 60, 1.5, 2); fillBelow(r, '#6f9a52'); speckle(r, '#5a8a44', 200, 4, 80); templeGate(850, 400, 60, '#c9b48a', '#7a4a32'); }
  else { for (let i = 0; i < 60; i++) for (let k = 0; k < 4; k++) rect(i * 20 + (k % 2) * 10, 440 + k * 14, 19, 13, shade('#a0603a', rnd(-0.12, 0.08))); poly([[480, 440], [720, 440], [700, 360], [500, 360]], '#8f4a32'); rect(540, 400, 120, 96, '#a0603a'); ctx.beginPath(); ctx.ellipse(600, 470, 34, 40, 0, Math.PI, 0); ctx.lineTo(634, 496); ctx.lineTo(566, 496); ctx.closePath(); ctx.fillStyle = '#3a2e26'; ctx.fill(); }
  roundTree(180, 500, 170, '#4f7a44');
  rect(0, 496, W, 134, '#bfae8e'); const txt = heroAction(sp, 820, 605, 92);
  return ramp ? `${txt} au pied d’anciens remparts de terre couverts d’herbe, un portique de temple et des maisons aux toits de tuiles, ambiance ${sp.place ? 'inspirée ' + sp.place : 'd’une citadelle historique'}, ${TIME_FR[sp.time]}` : `${txt} devant la porte d’un village ancien aux murs de latérite rouge et aux toits de tuiles, un grand banian à l’entrée, ambiance ${sp.place ? 'inspirée ' + sp.place : 'd’un village traditionnel du Nord'}, ${TIME_FR[sp.time]}`;
};
SCENES.park_lake = sp => {
  sky(sp.time, 380); for (let i = 0; i < 12; i++) rect(rnd(0, W), 380 - rnd(20, 90), rnd(30, 60), 100, depth('#e9e6dc', 0.4));
  water(380, 470, '#7fb3b8', '#5f9a9f'); ctx.beginPath(); ctx.moveTo(300, 470); ctx.quadraticCurveTo(450, 380, 600, 470); ctx.strokeStyle = '#f2efe6'; ctx.lineWidth = 10; ctx.stroke();
  rect(0, 470, W, 160, '#8fc06a'); for (let i = 0; i < 8; i++) roundTree(rnd(0, W), 480, rnd(40, 70), '#4f8a4c');
  for (let i = 0; i < 3; i++) person(rnd(100, 500), 560, i === 0 ? 30 : 46, { top: pick(['#d0663a', '#3d6fa8', '#f0c24b']) });
  road([[-50, 600, 60], [1300, 590, 60]], { color: '#c9c1b2', edge: '#e9e6dc', center: false });
  const txt = heroAction(sp, 820, 615, 85);
  return `${txt} sur une allée de parc paysager au bord d’un lac, pelouses, arbres et une famille avec un enfant en promenade, ${TIME_FR[sp.time]}`;
};
SCENES.parking = sp => {
  cityBase(sp, 420); rect(0, 460, W, 170, '#c9c1b2'); for (let x = 0; x < W; x += 110) line(x, 470, x - 30, 630, '#f2f0e6', 3);
  parkedRow(520, 8, 34); const b = sp.bikes[0]; heroBike(b, 560, 615, 105, {}); discLock(560 + 0.66 * 105, 615 - 0.3 * 105, 26, '#e8b23a');
  return `${bikeFR(b)} garé${fe(sp)} dans un parking de trottoir aux places marquées, roue avant équipée d’un bloque-disque jaune, autres deux-roues alignés derrière, ${TIME_FR[sp.time]}`;
};
