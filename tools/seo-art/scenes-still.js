// Still lifes, studio line-ups and comparison scenes.
const WOOD_FR = { chene: 'en chêne', noyer: 'en noyer', clair: 'en bois clair', teck: 'en teck' };
function zoom(k = 1.18) { ctx.translate(W / 2, H / 2); ctx.scale(k, k); ctx.translate(-W / 2, -H / 2); }
function desk(sp) { const k = sp.wood || pick(Object.keys(WOODS)); table(k); zoom(); return 'sur une table ' + WOOD_FR[k]; }
const PASS_COL = { '#7a2632': 'bordeaux', '#1f3a6a': 'bleu marine', '#2f5a3a': 'vert foncé', '#3a2a24': 'brun' };
SCENES.documents = sp => {
  const on = desk(sp), pc = pick(Object.keys(PASS_COL)), v = sp.variant || 'license';
  const items = [];
  if (v === 'license' || v === 'idp' || v === 'conversion') { passport(300, 300, 150, -0.15, pc); items.push('un passeport ' + PASS_COL[pc]); idCard(640, 230, 260, 0.08); items.push('une carte de permis de conduire vierge'); if (v === 'idp') { paper(900, 360, 260, 340, 0.12); items.push('un livret de permis international stylisé'); } if (v === 'conversion') { paper(900, 360, 260, 340, 0.1, { sign: true }); stamp(960, 450, 40); items.push('un formulaire tamponné'); } pen(620, 470, 180, -0.4); items.push('un stylo'); }
  else if (v === 'deposit') { passport(330, 320, 160, 0.1, pc); items.push('un passeport ' + PASS_COL[pc]); rot(700, 330, -0.08, () => { shadowOn(); rect(-150, -90, 300, 180, '#e9dcc0'); shadowOff(); poly([[-150, -90], [150, -90], [0, 10]], '#dccdaa'); }); items.push('une enveloppe de dépôt fermée'); keyring(980, 260, 50, 0.6); items.push('un trousseau de clés de moto'); }
  else if (v === 'contract') { paper(470, 320, 360, 470, -0.05, { sign: true }); items.push('un contrat de location signé'); pen(760, 420, 200, -0.7, '#1f3a6a'); items.push('un stylo'); keyring(930, 220, 50, 0.4); items.push('des clés'); helmetSide(1020, 560, 90, pick(['#f2f2f2', '#e8c547', '#c83a3a'])); items.push('un casque'); }
  else if (v === 'insurance') { paper(430, 320, 340, 450, 0.06); rot(430, 300, 0.06, () => { poly([[0, -60], [55, -38], [48, 30], [0, 70], [-48, 30], [-55, -38]], '#2f8f5a'); poly([[-18, 0], [-5, 18], [24, -22], [16, -28], [-5, 4], [-10, -6]], '#f4f2ec'); }); items.push('un document d’assurance marqué d’un bouclier vert'); idCard(860, 230, 230, -0.1); items.push('une carte d’immatriculation vierge'); keyring(900, 470, 50, 0.2); items.push('des clés'); }
  else if (v === 'registration') { idCard(450, 300, 300, -0.06, '#e9eef2', '#2f6db5'); items.push('une carte d’immatriculation de moto vierge'); keyring(800, 320, 60, 0.4); items.push('une clé de contact'); passport(1020, 360, 140, 0.15, pc); items.push('un passeport ' + PASS_COL[pc]); }
  else if (v === 'police') { idCard(380, 280, 260, -0.1); items.push('une carte de permis'); idCard(420, 470, 260, 0.06, '#e9eef2', '#2f6db5'); items.push('une carte d’immatriculation'); passport(760, 330, 150, 0.12, pc); items.push('un passeport ' + PASS_COL[pc]); helmetSide(1010, 470, 100, '#f2f2f2'); items.push('un casque blanc'); }
  return `vue de dessus ${on} : ${items.join(', ')}, sans aucune inscription lisible`;
};
SCENES.checklist = sp => {
  const on = desk(sp); clipboard(380, 330, 330, 460, -0.05, rint(3, 5)); phoneMap(760, 300, 130, 0.15, {}); keyring(990, 210, 50, 0.3); helmetSide(1000, 520, 100, pick(['#f2f2f2', '#2b2d31', '#e8c547']));
  return `vue de dessus ${on} : une feuille de contrôle sur porte-bloc avec plusieurs cases cochées, un smartphone affichant un plan, des clés et un casque, préparation ${sp.place || 'd’une moto de location'}`;
};
SCENES.toolkit = sp => {
  deskMat(pick(['#4f6b5a', '#3f4f63', '#5a4f45'])); zoom(); const v = sp.variant || 'tools'; const items = [];
  wrench(300, 200, 260, 0.3); items.push('une clé plate'); screwdriver(320, 440, 220, -0.2); items.push('un tournevis');
  if (v === 'oil') { oilBottle(700, 420, 170); items.push('un bidon d’huile moteur sans marque'); paper(980, 330, 220, 300, 0.1, { checks: 3 }); items.push('une fiche d’entretien cochée'); }
  else if (v === 'chain') { chain(700, 320, 420, -0.15); items.push('un segment de chaîne de transmission'); oilBottle(1000, 470, 120, '#3a8f6a'); items.push('un flacon de lubrifiant'); }
  else if (v === 'engine') { rrect(620, 220, 200, 160, 20, '#8d949a'); circle(720, 300, 46, '#5d6268'); circle(720, 300, 22, '#3a3c40'); items.push('un bloc carburateur'); rrect(880, 380, 60, 200, 20, '#b9bec4'); rect(895, 360, 30, 30, '#2b2d31'); items.push('un injecteur'); oilBottle(1060, 520, 110); items.push('un bidon d’huile'); }
  else { pump(720, 360, 150, 0.2); items.push('une pompe à main rouge'); oilBottle(980, 470, 140); items.push('un bidon d’huile'); gloves(1000, 190, 70, 0.3); items.push('une paire de gants'); }
  return `vue de dessus d’un tapis d’atelier avec des outils d’entretien de moto : ${items.join(', ')}`;
};
SCENES.tire = sp => {
  deskMat('#5a5650'); zoom(1.1); tireTop(420, 320, 230, { nail: sp.variant !== 'tubeless' }); innerTube(860, 230, 110); pump(1000, 470, 130, -0.4); wrench(820, 520, 170, 0.6);
  return `vue de dessus d’une roue de moto posée à plat${sp.variant !== 'tubeless' ? ', un clou planté dans la bande de roulement' : ''}, avec une chambre à air, une pompe à main et une clé, prêts pour la réparation`;
};
SCENES.brakes = sp => {
  deskMat('#3f4f63'); zoom(1.1); const v = sp.variant || 'disc';
  if (v === 'compare') { brakeDisc(380, 320, 190); drumBrake(850, 320, 170); return 'vue de dessus d’un disque de frein ajouré avec son étrier rouge à gauche et d’un frein à tambour à droite, posés côte à côte sur un tapis d’atelier'; }
  brakeDisc(480, 320, 220); wrench(900, 220, 220, 0.5); rrect(860, 400, 120, 50, 10, '#5d6268'); rrect(880, 470, 120, 50, 10, '#5d6268');
  return 'vue de dessus d’un disque de frein ajouré avec son étrier rouge, deux plaquettes de frein et une clé posés sur un tapis d’atelier';
};
SCENES.gear = sp => {
  const on = desk(sp); const hc = pick(['#f2f2f2', '#e8c547', '#c83a3a', '#2b2d31', '#3a5f9a']); const items = [];
  helmetSide(330, 380, 160, hc, { stripe: pick(['#d6403a', '#2f6db5', null]) }); items.push('un casque intégral');
  gloves(700, 220, 90, -0.2); items.push('une paire de gants'); sunglasses(1000, 180, 70, 0.2); items.push('des lunettes de soleil');
  if (sp.variant === 'rain') { raincoat(820, 480, 150, pick(['#2f6db5', '#e0742e', '#3c8a6e'])); items.push('un poncho de pluie plié'); } else if (sp.variant === 'heat') { waterBottle(800, 560, 120); items.push('une bouteille d’eau'); thermometerSun(1060, 450, 70); } else { rrect(720, 380, 360, 200, 30, '#3a4a5a'); for (let i = 0; i < 3; i++) rect(740, 420 + i * 50, 320, 8, '#2b3540'); items.push('un blouson de moto plié'); }
  return `vue de dessus ${on} : ${items.join(', ')}, l’équipement de protection du motard`;
};
SCENES.emergency = sp => {
  const on = desk(sp); firstAid(330, 300, 150, -0.1); warningTriangle(700, 260, 120, 0.15); phoneMap(950, 330, 130, 0.12, {}); keyring(650, 500, 50, -0.3);
  return `vue de dessus ${on} : une trousse de premiers secours à croix verte, un triangle de signalisation rouge, un smartphone et des clés de moto`;
};
SCENES.phone_nav = sp => {
  const on = desk(sp); phoneMap(560, 315, 200, -0.05, { pins: sp.variant === 'pins' ? 5 : 0, water: true }); helmetSide(220, 480, 120, pick(['#f2f2f2', '#e8c547', '#3a5f9a']));
  coffeeTop(960, 200, 60); if (sp.variant === 'mount') { rrect(820, 420, 240, 40, 20, '#2b2d31'); rrect(900, 380, 80, 120, 14, '#3a3c40'); } else sunglasses(960, 470, 70, 0.3);
  return `vue de dessus ${on} : un smartphone affichant un itinéraire tracé sur une carte${sp.variant === 'pins' ? ' avec plusieurs repères' : ''}, un casque, une tasse de café${sp.variant === 'mount' ? ' et un support de téléphone pour guidon' : ' et des lunettes de soleil'}`;
};
SCENES.charging = sp => {
  rect(0, 0, W, H, lgrad(0, 0, 0, H, [[0, '#e9e4da'], [0.62, '#ddd6c8'], [0.62, '#b9ab90'], [1, '#a99a7e']])); socket(240, 260, 40); charger(480, 330, 90, 0); ctx.beginPath(); ctx.moveTo(240, 260); ctx.bezierCurveTo(260, 340, 320, 360, 426, 330); ctx.strokeStyle = '#2b2d31'; ctx.lineWidth = 6; ctx.stroke();
  batteryPack(380, 480, 70); const b = sp.bikes[0]; heroBike(b, 850, 590, 160, {});
  return `${bikeFR(b)} garé${fe(sp)} contre un mur intérieur, une batterie amovible posée au sol, branchée sur un chargeur relié à une prise murale`;
};
SCENES.budget = sp => {
  const on = desk(sp); notebookChart(380, 320, 360, 440, -0.06); calculator(740, 420, 90, 0.12); foldedMap(860, 220, 360, 230, 0.06, { coast: !!sp.coast }); keyring(1050, 520, 50, 0.4);
  return `vue de dessus ${on} : un carnet avec un graphique en barres, une calculatrice, une carte routière pliée où un itinéraire est tracé en pointillés rouges et des clés de moto, pour préparer le budget ${sp.place || 'du voyage'}`;
};
SCENES.keys = sp => {
  const on = desk(sp); smartkey(400, 300, 160, -0.3, pick(['#2b2d31', '#7a2635', '#1f3a6a'])); keyring(720, 250, 100, 0.5); key(600, 500, 130, 2.2, '#b9bec4'); circle(950, 330, 90, null, alpha('#2b2d31', 0.35), 3); ctx.setLineDash([8, 8]); circle(950, 330, 70, null, alpha('#2b2d31', 0.4), 2); ctx.setLineDash([]);
  return `vue de dessus ${on} : une clé électronique de scooter, un trousseau de clés et une clé isolée, à côté d’un emplacement vide en pointillés évoquant une clé perdue`;
};
SCENES.calendar = sp => {
  const on = desk(sp); const acc = pick(['#d6403a', '#2f6db5', '#2f8f5a', '#e0742e']);
  calendarCard(250, 320, 230, 280, 'day', acc, -0.06); calendarCard(590, 300, 300, 230, 'week', acc, 0.03); calendarCard(950, 330, 330, 330, 'month', acc, 0.06); keyring(560, 520, 40, 0.3);
  return `vue de dessus ${on} : trois fiches de calendrier sans chiffres, une journée, une semaine et un mois surlignés, à côté d’un trousseau de clés de moto, pour comparer les durées de location`;
};
SCENES.clock = sp => {
  rect(0, 0, W, H, lgrad(0, 0, 0, H, [[0, '#efe6d6'], [0.66, '#e4d8c3'], [0.66, '#b48a5e'], [1, '#9a744c']])); wallClock(300, 230, 130, sp.hour || 8); hourglass(560, 520, 70);
  const b = sp.bikes[0]; heroBike(b, 860, 590, 160, { helmetOnSeat: '#f2f2f2' });
  return `${bikeFR(b)} garé${fe(sp)} contre un mur clair où est accrochée une horloge sans chiffres, un sablier posé au sol, pour évoquer les horaires et la durée de la location`;
};
SCENES.luggage = sp => {
  const on = desk(sp); backpackTop(330, 320, 160, pick(['#4f8a5b', '#3d5a7a', '#7a5236'])); raincoat(720, 220, 120, '#e0742e'); for (let i = 0; i < 2; i++) { ctx.beginPath(); ctx.moveTo(600, 420 + i * 60); ctx.bezierCurveTo(700, 380 + i * 60, 820, 470 + i * 60, 960, 420 + i * 60); ctx.strokeStyle = i ? '#2f6db5' : '#d6403a'; ctx.lineWidth = 8; ctx.stroke(); } foldedMap(1000, 220, 260, 180, 0.1, {}); waterBottle(1040, 600, 110);
  return `vue de dessus ${on} : un sac à dos, un poncho de pluie plié, deux sangles élastiques, une carte routière et une gourde, le bagage compact d’un voyage à moto`;
};
SCENES.rental_period = sp => {
  const wall = pick(['#efe6d6', '#e3ebe6', '#ece2e6', '#e6e9ef']); rect(0, 0, W, H, lgrad(0, 0, 0, H, [[0, wall], [0.7, shade(wall, -0.06)], [0.7, '#b9ab90'], [1, '#a99a7e']]));
  const acc = pick(['#d6403a', '#2f6db5', '#2f8f5a', '#e0742e']); calendarCard(170, 170, 190, 220, 'day', acc); calendarCard(450, 160, 270, 200, 'week', acc); calendarCard(1000, 190, 280, 270, 'month', acc);
  const b = sp.bikes[0]; heroBike(b, 600, 615, 195, { helmetOnSeat: pick(['#f2f2f2', '#2b2d31', '#e8c547']) });
  return `${bikeFR(b)} garé${fe(sp)} devant un mur où sont affichés trois calendriers sans chiffres, une journée, une semaine et un mois, pour comparer les formules de location`;
};
function studio(c) { rect(0, 0, W, H, lgrad(0, 0, 0, H, [[0, shade(c, 0.2)], [0.72, c], [0.72, shade(c, -0.12)], [1, shade(c, -0.2)]])); rect(0, 0, W, H, rgrad(W / 2, 260, 50, 700, [[0, alpha('#ffffff', 0.35)], [1, alpha('#ffffff', 0)]])); }
SCENES.lineup = sp => {
  const bg = pick(['#d9dee3', '#e6ddd0', '#d8e3dc', '#e3dbe3']); studio(bg); const n = Math.min(sp.bikes.length, 4); const s = n > 3 ? 140 : 168;
  sp.bikes.slice(0, n).forEach((b, i) => heroBike(b, (i + 0.5) * W / n, 600 - (i % 2) * 10, s, { flip: i % 2 === 1 && n > 2 }));
  return `${n} deux-roues alignés dans un studio lumineux, présentés de profil sans aucun logo : ${sp.bikes.slice(0, n).map(b => bikeShort(b)).join(', ')}`;
};
SCENES.duel = sp => {
  const [a, b] = sp.bikes; const ca = pick(['#d8e3ec', '#e9e0cf', '#dfe8d8']), cb = pick(['#ecdcd8', '#e6e0ef', '#efe8d0']);
  const ctxBg = sp.variant || 'studio';
  if (ctxBg === 'city') { sky(sp.time || 'morning', 430); street(430, 9, {}); sidewalk(430, 40); asphalt(470, H); rect(0, 0, W / 2, H, alpha(ca, 0.25)); rect(W / 2, 0, W / 2, H, alpha(cb, 0.25)); }
  else if (ctxBg === 'road') { sky(sp.time || 'morning', 330); mountains(3, 160, 300, '#557c4c', { amp: 130 }); rect(0, 420, W, 210, '#8fbf5a'); road([[-50, 560, 110], [1300, 560, 110]], { shoulder: '#c9b48a' }); }
  else { rect(0, 0, W / 2, H, lgrad(0, 0, 0, H, [[0, shade(ca, 0.2)], [0.72, ca], [0.72, shade(ca, -0.15)], [1, shade(ca, -0.22)]])); rect(W / 2, 0, W / 2, H, lgrad(0, 0, 0, H, [[0, shade(cb, 0.2)], [0.72, cb], [0.72, shade(cb, -0.15)], [1, shade(cb, -0.22)]])); }
  line(W / 2, 40, W / 2, H - 40, alpha('#ffffff', 0.8), 4);
  heroBike(a, 300, 585, 150, {}); heroBike(b, 900, 585, 150, { flip: true });
  const where = ctxBg === 'city' ? ' dans une rue de Hanoi' : ctxBg === 'road' ? ' sur une route de campagne au pied des collines' : ' sur un fond partagé en deux tons';
  return `comparaison face à face${where} : à gauche ${bikeFR(a)}, à droite ${bikeFR(b)}, présentés de profil sans logo`;
};
SCENES.two_up = sp => {
  sky(sp.time, 360); if (sp.variant === 'city') { street(400, 9, {}); sidewalk(400, 40); asphalt(440, H); } else { mountains(3, 160, 320, '#557c4c', { amp: 120 }); rect(0, 420, W, 210, '#8fbf5a'); road([[-50, 590, 110], [1300, 580, 110]], { shoulder: '#c9b48a' }); }
  const b = sp.bikes[0]; heroBike(b, 600, 610, 120, { rider: outfit(), passenger: outfit({ backpack: '#4f6b5a' }) });
  return `${bikeFR(b)} avec un conducteur et un passager casqués, le passager portant un sac à dos, ${sp.variant === 'city' ? 'dans une rue de Hanoi' : 'sur une route de campagne au pied des collines'}, ${TIME_FR[sp.time]}`;
};
SCENES.size_compare = sp => {
  studio(pick(['#d9dee3', '#e6ddd0'])); const [a, b] = sp.bikes; heroBike(a, 330, 560, 105, { rider: { top: '#d0663a', pants: '#2f3a4f', helmet: '#f2f2f2' } }); heroBike(b, 880, 560, 125, { rider: { top: '#3d6fa8', pants: '#3b3b3b', helmet: '#2b2d31' } });
  return `deux motards de gabarits différents assis sur deux deux-roues de tailles différentes, ${bikeShort(a)} à gauche et ${bikeShort(b)} à droite, sur un fond de studio clair`;
};
SCENES.roadside_repair = sp => {
  sky(sp.time, 330); mountains(3, 150, 320, '#557c4c', { amp: 140, forest: true }); rect(0, 440, W, 190, '#7fa75a');
  road([[-50, 560, 120], [1300, 545, 120]], { shoulder: '#b8a98a' });
  const b = sp.bikes[0]; heroBike(b, 520, 600, 110, {}); warningTriangle(900, 600, 40); person(700, 610, 80, { top: '#d0663a', hat: 'helmet' }); wrench(760, 620, 70, 0.2); innerTube(300, 615, 40);
  return `${bikeFR(b)} arrêté${fe(sp)} sur le bas-côté d’une route de montagne, un triangle de signalisation posé derrière, le motard debout près de ses outils et d’une chambre à air, ${TIME_FR[sp.time]}`;
};
