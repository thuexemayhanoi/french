// Still lifes, studio line-ups and comparison scenes.
const WOOD_FR = { chene: 'en chêne', noyer: 'en noyer', clair: 'en bois clair', teck: 'en teck' };
function zoom(k = 1.18) { ctx.translate(W / 2, H / 2); ctx.scale(k, k); ctx.translate(-W / 2, -H / 2); }
function desk(sp) { const k = sp.wood || pick(Object.keys(WOODS)); table(k); zoom(); return 'sur une table ' + WOOD_FR[k]; }
const PASS_COL = { '#7a2632': 'bordeaux', '#1f3a6a': 'bleu marine', '#2f5a3a': 'vert foncé', '#3a2a24': 'brun' };
SCENES.documents = sp => {
  const on = desk(sp), pc = pick(Object.keys(PASS_COL)), v = sp.variant || 'license';
  const items = [];
  if (v === 'license' && sp.kind) {
    const k = sp.kind;
    if (k === 'none50') { passport(330, 320, 160, -0.1, pc); polaroid(700, 300, 200, 0.08, 'flat'); keyring(980, 470, 50, 0.4); return `vue de dessus ${on} : un passeport ${PASS_COL[pc]}, une photo instantanée d’un petit scooter de 50 cm3 et des clés, sans carte de permis`; }
    if (k === 'big') { idCard(380, 280, 280, -0.08); polaroid(760, 300, 200, 0.1, 'trail'); helmetSide(1030, 520, 90, '#2b2d31'); pen(420, 500, 170, -0.3); return `vue de dessus ${on} : une carte de permis de conduire vierge, une photo instantanée d’une moto trail de plus forte cylindrée, un casque noir et un stylo`; }
    if (k === 'small') { idCard(380, 280, 280, -0.08); polaroid(760, 300, 200, 0.1, 'underbone'); keyring(1000, 480, 50, 0.3); pen(420, 500, 170, -0.3); return `vue de dessus ${on} : une carte de permis de conduire vierge, une photo instantanée d’une moto semi-automatique de moins de 125 cm3, des clés et un stylo`; }
    if (k === 'electric') { passport(320, 320, 150, -0.12, pc); polaroid(650, 290, 190, 0.06, 'electric'); charger(960, 300, 70, 0.2); return `vue de dessus ${on} : un passeport ${PASS_COL[pc]}, une photo instantanée d’un scooter électrique et un chargeur de batterie`; }
    if (k === 'kit') { passport(250, 300, 140, -0.1, pc); idCard(530, 230, 240, 0.06); idCard(560, 450, 240, -0.05, '#e9eef2', '#2f6db5'); paper(900, 330, 260, 360, 0.08); keyring(1080, 560, 40, 0.3); return `vue de dessus ${on} : le kit complet du conducteur, un passeport ${PASS_COL[pc]}, une carte de permis, une carte d’immatriculation, un document d’assurance et des clés`; }
    if (k === 'two') { idCard(330, 260, 250, -0.08); idCard(380, 450, 250, 0.05, '#e9eef2', '#2f8f5a'); polaroid(720, 300, 170, -0.06, 'scooter'); polaroid(950, 320, 170, 0.08, 'trail'); return `vue de dessus ${on} : deux cartes de permis de catégories différentes et deux photos instantanées, l’une d’un scooter, l’autre d’une moto trail`; }
    if (k === 'foreign') { idCard(380, 290, 280, -0.08, '#eef0e6', '#3a5f9a'); passport(720, 320, 150, 0.1, pc); stamp(960, 260, 50, '#2f6db5'); pen(950, 500, 170, -0.4); return `vue de dessus ${on} : une carte de permis étranger vierge, un passeport ${PASS_COL[pc]}, un tampon officiel et un stylo`; }
  }
  if (v === 'license' || v === 'idp' || v === 'conversion') { passport(300, 300, 150, -0.15, pc); items.push('un passeport ' + PASS_COL[pc]); idCard(640, 230, 260, 0.08); items.push('une carte de permis de conduire vierge'); if (v === 'idp') { paper(900, 360, 260, 340, 0.12); items.push('un livret de permis international stylisé'); } if (v === 'conversion') { paper(900, 360, 260, 340, 0.1, { sign: true }); stamp(960, 450, 40); items.push('un formulaire tamponné'); if (sp.kind === 'residence') { idCard(640, 470, 220, -0.12, '#e3ecf5', '#2f6db5'); items.push('une carte de séjour vierge'); } if (sp.kind === 'photos') { for (let i = 0; i < 4; i++) rrect(560 + (i % 2) * 70, 430 + Math.floor(i / 2) * 85, 60, 75, 4, '#c9d2d8'); items.push('quatre photos d’identité vierges'); } if (sp.kind === 'visa') { stamp(330, 480, 46, '#2f8f5a'); items.push('un tampon de visa'); } } pen(620, 470, 180, -0.4); items.push('un stylo'); }
  else if (v === 'deposit') { passport(330, 320, 160, 0.1, pc); items.push('un passeport ' + PASS_COL[pc]); rot(700, 330, -0.08, () => { shadowOn(); rect(-150, -90, 300, 180, '#e9dcc0'); shadowOff(); poly([[-150, -90], [150, -90], [0, 10]], '#dccdaa'); }); items.push('une enveloppe de dépôt fermée'); keyring(980, 260, 50, 0.6); items.push('un trousseau de clés de moto'); }
  else if (v === 'contract') { paper(470, 320, 360, 470, -0.05, { sign: true }); items.push('un contrat de location signé'); pen(760, 420, 200, -0.7, '#1f3a6a'); items.push('un stylo'); keyring(930, 220, 50, 0.4); items.push('des clés'); helmetSide(1020, 560, 90, pick(['#f2f2f2', '#e8c547', '#c83a3a'])); items.push('un casque'); }
  else if (v === 'insurance') { paper(430, 320, 340, 450, 0.06); rot(430, 300, 0.06, () => { poly([[0, -60], [55, -38], [48, 30], [0, 70], [-48, 30], [-55, -38]], '#2f8f5a'); poly([[-18, 0], [-5, 18], [24, -22], [16, -28], [-5, 4], [-10, -6]], '#f4f2ec'); }); items.push('un document d’assurance marqué d’un bouclier vert'); idCard(860, 230, 230, -0.1); items.push('une carte d’immatriculation vierge'); keyring(900, 470, 50, 0.2); items.push('des clés'); }
  else if (v === 'registration') { idCard(450, 300, 300, -0.06, '#e9eef2', '#2f6db5'); items.push('une carte d’immatriculation de moto vierge'); keyring(800, 320, 60, 0.4); items.push('une clé de contact'); passport(1020, 360, 140, 0.15, pc); items.push('un passeport ' + PASS_COL[pc]); }
  else if (v === 'police') { idCard(380, 280, 260, -0.1); items.push('une carte de permis'); idCard(420, 470, 260, 0.06, '#e9eef2', '#2f6db5'); items.push('une carte d’immatriculation'); passport(760, 330, 150, 0.12, pc); items.push('un passeport ' + PASS_COL[pc]); helmetSide(1010, 470, 100, '#f2f2f2'); items.push('un casque blanc'); }
  return `vue de dessus ${on} : ${items.join(', ')}, sans aucune inscription lisible`;
};
SCENES.checklist = sp => {
  const on = desk(sp), v = sp.variant || 'inspect';
  if (v === 'photos') { camera(820, 230, 90, 0.1); const pc = pick(['#c8323a', '#2f6db5', '#e8b23a', '#4f8a5b']), pk = pick(['scooter', 'underbone', 'flat']); for (let i = 0; i < 3; i++) polaroid(560 + i * 170, 470 + (i % 2) * 20, 150, -0.15 + i * 0.12, pk, pc); clipboard(260, 300, 280, 420, -0.06, 2); return `vue de dessus ${on} : un appareil photo, trois photos instantanées du même deux-roues et une feuille d’état des lieux sur porte-bloc, pour documenter la moto avant le départ`; }
  if (v === 'compare') { clipboard(260, 320, 280, 430, 0.05, 3); const ks = ['scooter', 'underbone', 'trail']; for (let i = 0; i < 3; i++) polaroid(540 + i * 210, 300 + (i % 2) * 40, 170, -0.1 + i * 0.1, ks[i]); pen(780, 540, 170, -0.2); return `vue de dessus ${on} : trois photos instantanées montrant un scooter, une moto semi-automatique et une moto trail, à côté d’une grille de comparaison sur porte-bloc et d’un stylo, pour choisir sa location`; }
  if (v === 'handover') { paper(380, 320, 330, 440, -0.06, { sign: true }); keyring(760, 250, 70, 0.5); smartkey(880, 420, 110, -0.4); helmetSide(1050, 300, 90, pick(['#f2f2f2', '#e8c547', '#2b2d31'])); pen(640, 520, 170, -0.6); return `vue de dessus ${on} : un bon de remise signé, un trousseau de clés, une clé électronique, un casque et un stylo, le moment de la remise ou du retour de la moto`; }
  clipboard(380, 330, 330, 460, -0.05, rint(3, 5)); phoneMap(760, 300, 130, 0.15, {}); keyring(990, 210, 50, 0.3); helmetSide(1000, 520, 100, pick(['#f2f2f2', '#2b2d31', '#e8c547']));
  return `vue de dessus ${on} : une feuille de contrôle sur porte-bloc avec plusieurs cases cochées, un smartphone affichant un plan, des clés et un casque, préparation ${sp.place || 'd’une moto de location'}`;
};
SCENES.toolkit = sp => {
  deskMat(pick(['#4f6b5a', '#3f4f63', '#5a4f45'])); zoom(); const v = sp.variant || 'tools'; const items = [];
  wrench(300, 200, 260, 0.3); items.push('une clé plate'); screwdriver(320, 440, 220, -0.2); items.push('un tournevis');
  if (v === 'oil' && sp.kind === 'drain') { ellipse(700, 440, 150, 60, '#2b2d31'); ellipse(700, 432, 130, 48, '#5a4a2a'); oilBottle(980, 470, 150); circle(940, 230, 50, '#2f6db5'); circle(940, 230, 22, '#c9ced3'); items.push('un bac de vidange rempli d’huile usagée', 'un bidon d’huile neuve', 'un filtre à huile bleu'); }
  else if (v === 'oil' && sp.kind === 'dipstick') { oilBottle(700, 430, 160); line(860, 200, 1080, 520, '#c9ced3', 8); circle(860, 200, 16, '#e0742e'); line(1040, 460, 1080, 520, '#5a4a2a', 9); rrect(860, 520, 160, 70, 14, '#e6d9c2'); items.push('un bidon d’huile moteur sans marque', 'une jauge d’huile tachée', 'un chiffon'); }
  else if (v === 'oil') { oilBottle(700, 420, 170); items.push('un bidon d’huile moteur sans marque'); calendarCard(980, 330, 200, 230, 'month', '#2f8f5a', 0.1); items.push('une fiche calendrier mensuelle'); }
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
  if (v === 'abs') { brakeDisc(480, 320, 220); for (let i = 0; i < 40; i++) { const a2 = i / 40 * Math.PI * 2; rect(480 + Math.cos(a2) * 128 - 4, 320 + Math.sin(a2) * 128 - 4, 8, 8, '#3a3c40'); } rrect(700, 300, 90, 40, 8, '#2b2d31'); ctx.beginPath(); ctx.moveTo(790, 320); ctx.bezierCurveTo(880, 330, 900, 420, 1000, 430); ctx.strokeStyle = '#2b2d31'; ctx.lineWidth = 5; ctx.stroke(); return 'vue de dessus d’un disque de frein ajouré avec son étrier rouge et la couronne dentée d’un capteur ABS relié à son câble, posés sur un tapis d’atelier'; }
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
  const b = sp.bikes[0], v = sp.variant || 'wall';
  if (v === 'swap') { rect(0, 0, W, H, lgrad(0, 0, 0, H, [[0, '#dfe6ea'], [0.68, '#cfd8dc'], [0.68, '#9a958a'], [1, '#86817a']])); rrect(120, 120, 300, 420, 16, '#2f6db5'); for (let r = 0; r < 4; r++) for (let c = 0; c < 2; c++) { rrect(150 + c * 130, 150 + r * 95, 110, 80, 8, '#1f3a6a'); rect(165 + c * 130, 165 + r * 95, 80 * (r === 2 && c === 1 ? 0 : 1), 10, r === 2 && c === 1 ? '#1f3a6a' : '#3fd17a'); } batteryPack(560, 470, 60, 0.1); heroBike(b, 900, 590, 160, { rider: outfit() }); return `${bikeFR(b)} avec son conducteur arrêté devant une borne d’échange de batteries à casiers, une batterie chargée posée au sol`; }
  if (v === 'hotel') { rect(0, 0, W, H, lgrad(0, 0, 0, H, [[0, '#efe6d6'], [0.66, '#e8dcc8'], [0.66, '#b48a5e'], [1, '#9a744c']])); rrect(640, 260, 520, 170, 14, '#f4f1ea'); rrect(640, 230, 120, 60, 12, '#e6e0d4'); rect(640, 400, 520, 30, '#7a5a3a'); socket(240, 300, 34); charger(420, 380, 80, 0); ctx.beginPath(); ctx.moveTo(240, 300); ctx.bezierCurveTo(260, 360, 300, 380, 372, 380); ctx.strokeStyle = '#2b2d31'; ctx.lineWidth = 6; ctx.stroke(); batteryPack(300, 520, 62, -0.1); return 'chambre d’hôtel avec un lit, une batterie amovible de scooter électrique posée au sol et branchée sur son chargeur relié à une prise murale'; }
  if (v === 'street') { sky(sp.time, 430); street(430, 9, {}); sidewalk(430, 60); asphalt(490, H); rrect(300, 300, 70, 190, 12, '#2f8f5a'); rrect(312, 320, 46, 40, 6, '#cfe8d8'); ctx.beginPath(); ctx.moveTo(370, 400); ctx.bezierCurveTo(460, 420, 520, 470, 600, 470); ctx.strokeStyle = '#2b2d31'; ctx.lineWidth = 6; ctx.stroke(); heroBike(b, 760, 600, 150, {}); return `${bikeFR(b)} garé${fe(sp)} sur le trottoir d’une rue de Hanoi, branché à une borne de recharge verte sans marque, ${TIME_FR[sp.time]}`; }
  if (v === 'fuel') { rect(0, 0, W, H, lgrad(0, 0, 0, H, [[0, '#e9e4da'], [0.62, '#ddd6c8'], [0.62, '#b9ab90'], [1, '#a99a7e']])); line(W / 2, 30, W / 2, H - 30, alpha('#ffffff', 0.9), 4); socket(140, 260, 34); charger(300, 330, 70, 0); heroBike(b, 330, 590, 135, {}); rrect(830, 230, 110, 260, 12, '#c8323a'); rrect(850, 260, 70, 50, 6, '#3a4a5a'); ctx.beginPath(); ctx.moveTo(940, 330); ctx.bezierCurveTo(990, 360, 990, 450, 960, 480); ctx.strokeStyle = '#2b2d31'; ctx.lineWidth = 6; ctx.stroke(); heroBike(sp.bikes[1] || { type: 'scooter_small', color: '#8d949a', cname: 'gris' }, 1000, 590, 120, { flip: true }); return `comparaison en deux panneaux : à gauche ${bikeFR(b)} branché à une prise murale, à droite un scooter à essence à côté d’une pompe à carburant rouge sans marque`; }
  if (v === 'range') { table('clair'); zoom(); phoneMap(560, 315, 200, -0.05, { water: true }); ctx.save(); ctx.setLineDash([10, 8]); circle(560, 300, 150, null, alpha('#2f8f5a', 0.9), 4); ctx.restore(); batteryPack(250, 330, 70, -0.15); keyring(880, 220, 50, 0.4); coffeeTop(900, 470, 50); return 'vue de dessus sur une table en bois clair : un smartphone affichant un itinéraire entouré d’un cercle en pointillés figurant l’autonomie, une batterie de scooter électrique, des clés et une tasse de café'; }
  rect(0, 0, W, H, lgrad(0, 0, 0, H, [[0, '#e9e4da'], [0.62, '#ddd6c8'], [0.62, '#b9ab90'], [1, '#a99a7e']])); socket(240, 260, 40); charger(480, 330, 90, 0); ctx.beginPath(); ctx.moveTo(240, 260); ctx.bezierCurveTo(260, 340, 320, 360, 426, 330); ctx.strokeStyle = '#2b2d31'; ctx.lineWidth = 6; ctx.stroke();
  batteryPack(380, 480, 70); heroBike(b, 850, 590, 160, {});
  return `${bikeFR(b)} garé${fe(sp)} contre un mur intérieur, une batterie amovible posée au sol, branchée sur un chargeur relié à une prise murale`;
};
const POLA_FR = { karst: 'des pitons karstiques', bay: 'une baie karstique', mountain: 'une route de montagne', terraces: 'des rizières en terrasses', road: 'une longue route', city: 'des façades de Hanoi', coast: 'une plage', scooter: 'un scooter', electric: 'un scooter électrique' };
SCENES.budget = sp => {
  const on = desk(sp), lay = rint(0, 2), kind = sp.kind;
  if (lay === 0) { notebookChart(380, 320, 360, 440, -0.06); calculator(740, 420, 90, 0.12); foldedMap(860, 220, 360, 230, 0.06, { coast: !!sp.coast }); keyring(1050, 520, 50, 0.4); if (kind) polaroid(640, 190, 150, -0.12, kind); }
  else if (lay === 1) { foldedMap(330, 230, 420, 260, -0.05, { coast: !!sp.coast }); notebookChart(820, 330, 340, 420, 0.05); calculator(330, 500, 85, -0.2); coffeeTop(560, 520, 46); if (kind) polaroid(1060, 160, 140, 0.15, kind); }
  else { notebookChart(900, 320, 340, 430, 0.04); foldedMap(420, 420, 400, 240, 0.08, { coast: !!sp.coast }); calculator(620, 170, 80, -0.1); keyring(250, 180, 50, 0.6); if (kind) polaroid(300, 320, 150, -0.08, kind); }
  return `vue de dessus ${on} : un carnet avec un graphique en barres, une calculatrice, une carte routière pliée où un itinéraire est tracé en pointillés rouges${lay === 1 ? ', une tasse de café' : ', des clés de moto'}${kind ? ' et une photo instantanée représentant ' + POLA_FR[kind] : ''}, pour préparer le budget ${sp.place || 'du voyage'}`;
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
  rect(0, 0, W, H, lgrad(0, 0, 0, H, [[0, '#efe6d6'], [0.66, '#e4d8c3'], [0.66, '#b48a5e'], [1, '#9a744c']]));
  const b = sp.bikes[0];
  if (sp.variant === 'hourglasses') { for (let i = 0; i < 3; i++) hourglass(170 + i * 170, 470 - i * 10, 60 + i * 12); heroBike(b, 870, 590, 160, { helmetOnSeat: '#f2f2f2' }); return `${bikeFR(b)} garé${fe(sp)} contre un mur clair, à côté de trois sabliers de tailles croissantes posés au sol, pour évoquer des locations de 24, 48 ou 72 heures`; }
  wallClock(300, 230, 130, sp.hour || 8); hourglass(560, 520, 70); heroBike(b, 860, 590, 160, { helmetOnSeat: '#f2f2f2' });
  return `${bikeFR(b)} garé${fe(sp)} contre un mur clair où est accrochée une horloge sans chiffres, un sablier posé au sol, pour évoquer les horaires et la durée de la location`;
};
SCENES.luggage = sp => {
  const on = desk(sp); backpackTop(330, 320, 160, pick(['#4f8a5b', '#3d5a7a', '#7a5236'])); raincoat(720, 220, 120, '#e0742e'); for (let i = 0; i < 2; i++) { ctx.beginPath(); ctx.moveTo(600, 420 + i * 60); ctx.bezierCurveTo(700, 380 + i * 60, 820, 470 + i * 60, 960, 420 + i * 60); ctx.strokeStyle = i ? '#2f6db5' : '#d6403a'; ctx.lineWidth = 8; ctx.stroke(); } foldedMap(1000, 220, 260, 180, 0.1, {}); waterBottle(1040, 600, 110);
  return `vue de dessus ${on} : un sac à dos, un poncho de pluie plié, deux sangles élastiques, une carte routière et une gourde, le bagage compact d’un voyage à moto`;
};
SCENES.rental_period = sp => {
  const wall = pick(['#efe6d6', '#e3ebe6', '#ece2e6', '#e6e9ef', '#f0e9da', '#dde7ee']); const floor = pick(['#b9ab90', '#a8a49a', '#c2a27e']); const bgk = rint(0, 3);
  rect(0, 0, W, H, lgrad(0, 0, 0, H, [[0, wall], [0.7, shade(wall, -0.06)], [0.7, floor], [1, shade(floor, -0.1)]]));
  let place = 'un mur clair';
  if (bgk === 1) { for (let y = 0; y < H * 0.7; y += 22) for (let x = (y / 22) % 2 ? -20 : 0; x < W; x += 44) rect(x + 1, y + 1, 42, 20, shade('#b5623e', rnd(-0.1, 0.08))); place = 'un mur de briques'; }
  if (bgk === 2) { rect(0, 0, W, H * 0.7, '#9aa1a8'); for (let y = 10; y < H * 0.7; y += 16) rect(0, y, W, 3, '#7f868d'); place = 'un rideau métallique de garage'; }
  if (bgk === 3) { for (let y = H * 0.7; y < H; y += 40) for (let x = 0; x < W; x += 40) rect(x + 1, y + 1, 38, 38, ((x + y) / 40) % 2 ? '#d9c7a4' : '#c9b48a'); place = 'un mur de cour carrelée'; }
  const acc = pick(['#d6403a', '#2f6db5', '#2f8f5a', '#e0742e', '#7a4fa0']); const b = sp.bikes[0]; const layout = rint(0, 2); const helmet = pick(['#f2f2f2', '#2b2d31', '#e8c547', '#c83a3a']);
  let extra = '';
  if (layout === 0) { calendarCard(170, 170, 190, 220, 'day', acc); calendarCard(450, 160, 270, 200, 'week', acc); calendarCard(1000, 190, 280, 270, 'month', acc); heroBike(b, 600, 615, 195, { helmetOnSeat: helmet }); }
  else if (layout === 1) { calendarCard(930, 110, 200, 150, 'day', acc); calendarCard(930, 270, 250, 140, 'week', acc); calendarCard(930, 450, 270, 200, 'month', acc); heroBike(b, 400, 615, 200, { helmetOnSeat: helmet }); rect(60, 150, 160, 10, '#8a6a4a'); helmetSide(140, 150, 50, pick(['#3a5f9a', '#e0742e'])); extra = ', une étagère avec un second casque'; }
  else { calendarCard(150, 150, 180, 200, 'day', acc); calendarCard(390, 150, 240, 170, 'week', acc); calendarCard(270, 400, 300, 240, 'month', acc); heroBike(b, 820, 615, 200, { flip: true, helmetOnSeat: helmet }); rrect(1080, 470, 70, 80, 8, '#9a6a42'); for (let i = 0; i < 6; i++) ellipse(1115 + rnd(-30, 30), 450 - rnd(0, 60), 26, 12, '#4f8a4c', rnd(-1, 1)); extra = ', une plante verte dans un coin'; }
  return `${bikeFR(b)} garé${fe(sp)} devant ${place} où sont affichés trois calendriers sans chiffres, une journée, une semaine et un mois${extra}, pour comparer les formules de location`;
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
  else if (ctxBg === 'brick') { rect(0, 0, W, H, '#b5623e'); for (let y = 0; y < H * 0.72; y += 22) for (let x = (y / 22) % 2 ? -20 : 0; x < W; x += 44) rect(x + 1, y + 1, 42, 20, shade('#b5623e', rnd(-0.1, 0.08))); rect(0, H * 0.72, W, H * 0.28, '#a8a49a'); }
  else if (ctxBg === 'garage') { rect(0, 0, W, H * 0.72, '#9aa1a8'); for (let y = 10; y < H * 0.72; y += 16) rect(0, y, W, 3, '#7f868d'); rect(0, H * 0.72, W, H * 0.28, '#8a8475'); }
  else if (ctxBg === 'lake') { sky(sp.time || 'morning', 380); water(380, 470, '#6f9f8a', '#4f857a'); for (let i = 0; i < 12; i++) roundTree(rnd(0, W), 385, 28, depth('#4f7a44', 0.3)); rect(0, 470, W, 160, '#b8ac94'); }
  else if (ctxBg === 'mountain') { sky(sp.time || 'golden', 330); karst(330, 12, 100, 200, depth('#6f8a68', 0.5), { dots: 300 }); fillBelow(ridgeFn(420, 60, 2, 3), '#557c4c'); road([[-50, 580, 120], [1300, 580, 120]], { shoulder: '#b8a98a' }); }
  else if (ctxBg === 'night') { sky('night', 420); street(420, 9, { night: true }); asphalt(420, H, '#33363c'); }
  else { rect(0, 0, W / 2, H, lgrad(0, 0, 0, H, [[0, shade(ca, 0.2)], [0.72, ca], [0.72, shade(ca, -0.15)], [1, shade(ca, -0.22)]])); rect(W / 2, 0, W / 2, H, lgrad(0, 0, 0, H, [[0, shade(cb, 0.2)], [0.72, cb], [0.72, shade(cb, -0.15)], [1, shade(cb, -0.22)]])); }
  line(W / 2, 40, W / 2, H - 40, alpha('#ffffff', 0.8), 4);
  heroBike(a, 290, 595, 172, {}); heroBike(b, 910, 595, 172, { flip: true });
  const where = { city: ' dans une rue de Hanoi', road: ' sur une route de campagne au pied des collines', brick: ' devant un mur de briques', garage: ' devant un rideau métallique de garage', lake: ' au bord d’un lac', mountain: ' sur une route de montagne entre des pitons karstiques', night: ' dans une rue de Hanoi la nuit' }[ctxBg] || ' sur un fond partagé en deux tons';
  return `comparaison face à face${where} : à gauche ${bikeFR(a)}, à droite ${bikeFR(b)}, présentés de profil sans logo`;
};
SCENES.two_up = sp => {
  sky(sp.time, 360); if (sp.variant === 'city') { street(400, 9, {}); sidewalk(400, 40); asphalt(440, H); } else { mountains(3, 160, 320, '#557c4c', { amp: 120 }); rect(0, 420, W, 210, '#8fbf5a'); road([[-50, 590, 110], [1300, 580, 110]], { shoulder: '#c9b48a' }); }
  const b = sp.bikes[0]; heroBike(b, 600, 610, 120, { rider: outfit(), passenger: outfit({ backpack: '#4f6b5a' }) });
  return `${bikeFR(b)} avec un conducteur et un passager casqués, le passager portant un sac à dos, ${sp.variant === 'city' ? 'dans une rue de Hanoi' : 'sur une route de campagne au pied des collines'}, ${TIME_FR[sp.time]}`;
};
SCENES.size_compare = sp => {
  studio(pick(['#d9dee3', '#e6ddd0', '#dfe8d8', '#ecdcd8', '#e3dbe3'])); const [a, b] = sp.bikes; heroBike(a, 300, 590, 140, { rider: { top: '#d0663a', pants: '#2f3a4f', helmet: '#f2f2f2' } }); heroBike(b, 890, 590, 165, { rider: { top: '#3d6fa8', pants: '#3b3b3b', helmet: '#2b2d31' } });
  return `deux motards de gabarits différents assis sur deux deux-roues de tailles différentes, ${bikeShort(a)} à gauche et ${bikeShort(b)} à droite, sur un fond de studio clair`;
};
SCENES.roadside_repair = sp => {
  sky(sp.time, 330); mountains(3, 150, 320, '#557c4c', { amp: 140, forest: true }); rect(0, 440, W, 190, '#7fa75a');
  road([[-50, 560, 120], [1300, 545, 120]], { shoulder: '#b8a98a' });
  const b = sp.bikes[0]; heroBike(b, 520, 600, 110, {}); warningTriangle(900, 600, 40); person(700, 610, 80, { top: '#d0663a', hat: 'helmet' }); wrench(760, 620, 70, 0.2); innerTube(300, 615, 40);
  return `${bikeFR(b)} arrêté${fe(sp)} sur le bas-côté d’une route de montagne, un triangle de signalisation posé derrière, le motard debout près de ses outils et d’une chambre à air, ${TIME_FR[sp.time]}`;
};
