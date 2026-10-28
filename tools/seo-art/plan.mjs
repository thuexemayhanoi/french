// Topic planner: maps each matrix row (and the H1/lead of its page) to a specific, deterministic scene spec.
import fs from 'node:fs';
import {createHash} from 'node:crypto';

const MODELS = [
  ['air-blade-125', 'Honda Air Blade 125', 'scooter_sport'], ['air-blade-160', 'Honda Air Blade 160', 'scooter_sport'], ['air-blade', 'Honda Air Blade', 'scooter_sport'],
  ['ct125', 'Honda CT125', 'cub_trail'], ['cuv-e', 'Honda CUV e:', 'electric'], ['icon-e', 'Honda ICON e:', 'electric'],
  ['future-125', 'Honda Future 125', 'underbone'], ['future', 'Honda Future', 'underbone'], ['lead', 'Honda Lead', 'scooter_flat'], ['sh-mode', 'Honda SH Mode 125', 'scooter_premium'],
  ['sh125i', 'Honda SH125i', 'scooter_premium'], ['super-cub', 'Honda Super Cub C125', 'cub'], ['vario-125', 'Honda Vario 125', 'scooter_sport'], ['vario-160', 'Honda Vario 160', 'scooter_sport'], ['vario', 'Honda Vario', 'scooter_sport'],
  ['vision', 'Honda Vision', 'scooter_small'], ['wave-alpha', 'Honda Wave Alpha 110', 'underbone'], ['wave-rsx', 'Honda Wave RSX', 'underbone'], ['wave', 'Honda Wave', 'underbone'],
  ['winner-x', 'Honda Winner X', 'sport_underbone'], ['adv350', 'Honda ADV350', 'maxi'],
  ['boite-125-hybride', 'Yamaha GEAR 125 Hybride', 'scooter_sport'], ['exciter', 'Yamaha Exciter 155', 'sport_underbone'], ['freego', 'Yamaha FreeGo', 'scooter_small'],
  ['grande', 'Yamaha Grande', 'scooter_flat'], ['janus', 'Yamaha Janus', 'scooter_small'], ['jupiter-finn', 'Yamaha Jupiter Finn', 'underbone'], ['latte', 'Yamaha Latte', 'scooter_flat'],
  ['lexi', 'Yamaha LEXi', 'scooter_sport'], ['neo-s', 'Yamaha NEO’S', 'electric'], ['neos', 'Yamaha NEO’S', 'electric'], ['nmax', 'Yamaha NMAX', 'scooter_premium'], ['nvx', 'Yamaha NVX', 'scooter_sport'],
  ['pg-1', 'Yamaha PG-1', 'cub_trail'], ['pg1', 'Yamaha PG-1', 'cub_trail'], ['sirius-fi', 'Yamaha Sirius FI', 'underbone'], ['sirius', 'Yamaha Sirius', 'underbone'], ['wr155r', 'Yamaha WR155R', 'trail'],
  ['xmax', 'Yamaha XMAX', 'maxi'], ['mio', 'Yamaha Mio', 'scooter_small'],
];
const COLORS = {rouge: '#c8323a', bleu: '#2f6db5', blanc: '#eef0ee', noir: '#2b2d31', gris: '#8d949a', vert: '#4f8a5b', jaune: '#e8b23a', orange: '#e0742e', bordeaux: '#7c2635', beige: '#d9c7a4', turquoise: '#3ba7a5', marron: '#7a5236', 'bleu ciel': '#7fb3d9', argent: '#b9bec4', kaki: '#7d7c4f'};
const CNAMES = Object.keys(COLORS);
const PLACES = [
  // [slug token, scene, place (for "inspiré de …"), extra]
  ['ha-giang-boucle-3-jours', 'canyon', 'du col de Mã Pí Lèng'], ['ha-giang-boucle-4-jours', 'buckwheat', 'de Hà Giang'], ['hanoi-cao-bang-ha-giang', 'hmong_village', 'de Đồng Văn'],
  ['hanoi-sapa-ha-giang', 'canyon', 'de Hà Giang'], ['hanoi-a-cao-bang', 'karst_valley', 'de Cao Bằng'], ['cao-bang-voyage', 'karst_valley', 'de Trùng Khánh'], ['lang-son', 'karst_valley', 'de Lạng Sơn'],
  ['cat-ba-voyage', 'ferry', 'de Cát Bà et de la baie de Lan Ha'], ['hanoi-a-cat-ba', 'ferry', 'de Cát Bà'], ['halong-voyage-moto-2-jours', 'cruise', 'de la baie d’Ha Long'],
  ['moto-de-hanoi-a-halong', 'coast_road', 'de la côte de Quảng Ninh'], ['quang-ninh', 'forest_mountain', 'du mont Yên Tử'],
  ['sapa-moto-2-jours', 'flooded_terraces', 'de Sapa'], ['pu-luong-moto-2-jours', 'flooded_terraces', 'de Pù Luông'], ['hanoi-a-pu-luong', 'stilt_valley', 'de Pù Luông'],
  ['mai-chau-moto-2-jours', 'hmong_village', 'de Mai Châu', {parked: true}], ['ba-be-itineraire', 'forest_mountain', 'de la route du lac Ba Bể'], ['sapa-itineraire-moto-1-jour', 'hmong_village', 'des villages de Sapa'],
  ['ban-gioc', 'waterfall', 'de Bản Giốc'], ['cao-bang-moto-boucle', 'waterfall', 'de Cao Bằng'], ['cao-bang-voyage', 'waterfall', 'de Cao Bằng'],
  ['ha-giang', 'mountain_pass', 'de Hà Giang', {variant: 'karst'}], ['cao-bang', 'mountain_pass', 'de Cao Bằng', {variant: 'karst'}], ['lang-son', 'mountain_pass', 'de Lạng Sơn', {variant: 'karst'}],
  ['mu-cang-chai', 'terraces', 'de Mù Cang Chải', {variant: 'harvest'}], ['pu-luong', 'terraces', 'de Pù Luông'], ['sapa', 'terraces', 'de Sapa'],
  ['mai-chau', 'stilt_valley', 'de Mai Châu'], ['moc-chau', 'tea_plateau', 'de Mộc Châu'], ['ba-be', 'mountain_lake', 'du lac Ba Bể'], ['thac-ba', 'mountain_lake', 'du lac Thác Bà', {variant: 'islands'}],
  ['tuyen-quang', 'mountain_lake', 'de Tuyên Quang'], ['bac-kan', 'forest_mountain', 'de Bắc Kạn'], ['tam-dao', 'forest_mountain', 'de Tam Đảo', {time: 'mist'}], ['ba-vi', 'forest_mountain', 'de Ba Vì'],
  ['perfume-pagoda', 'pagoda_karst', 'de la Pagode des Parfums'], ['ninh-binh', 'karst_river', 'de Ninh Binh'],
  ['cat-ba', 'bay', 'de Cát Bà et de la baie de Lan Ha'], ['halong', 'bay', 'de la baie d’Ha Long'], ['ha-long', 'bay', 'de la baie d’Ha Long'], ['quang-ninh', 'bay', 'de la côte de Quảng Ninh'],
  ['hai-phong', 'countryside', 'de Hai Phong'], ['phong-nha', 'cave', 'de Phong Nha'], ['hue-a-hoi-an', 'coast_road', 'du col de Hải Vân'], ['hue-a-da-nang', 'coast_road', 'du col de Hải Vân'],
  ['hue-a-phong-nha', 'cave', 'de Phong Nha'], ['hue', 'hue_citadel', 'de Huế'], ['da-nang-a-hoi-an', 'hoi_an', 'de Hội An'], ['hoi-an', 'hoi_an', 'de Hội An'], ['da-nang', 'coast_road', 'de Da Nang et du col de Hải Vân'],
  ['nha-trang-a-dalat', 'pine_hills', 'de la route des plateaux vers Đà Lạt', {variant: 'nolake'}], ['da-lat-moto-1-jour', 'pine_hills', 'de Đà Lạt', {variant: 'lake'}], ['da-lat-moto-2-jours', 'pine_hills', 'de Đà Lạt', {variant: 'greenhouses'}], ['da-lat-voyage', 'pine_hills', 'de Đà Lạt', {variant: 'flowers'}], ['dalat', 'pine_hills', 'de Đà Lạt', {variant: 'nolake'}], ['da-lat', 'pine_hills', 'de Đà Lạt'],
  ['mui-ne', 'dunes', 'de Mũi Né'], ['phu-quoc-moto-1-jour', 'beach', 'de Phú Quốc', {variant: 'pier'}], ['phu-quoc-moto-3-jours', 'beach', 'de Phú Quốc', {variant: 'islands', time: 'golden'}], ['phu-quoc', 'beach', 'de Phú Quốc', {variant: 'jungle', parked: true}], ['con-dao', 'beach', 'de Côn Đảo', {variant: 'jungle'}], ['vung-tau', 'beach', 'de Vũng Tàu', {variant: 'headland'}],
  ['phu-yen', 'beach', 'de Phú Yên', {variant: 'rocks'}], ['quy-nhon', 'beach', 'de Quy Nhơn', {variant: 'baskets'}], ['nha-trang', 'beach', 'de Nha Trang', {variant: 'islands'}], ['coastal', 'coast_road', 'de la côte vietnamienne'],
  ['can-tho', 'floating_market', 'de Cần Thơ'], ['chau-doc', 'delta', 'de Châu Đốc'], ['ben-tre', 'delta', 'de Ben Tre'], ['mekong', 'delta', 'du delta du Mékong'],
  ['vung', 'beach', 'de Vũng Tàu'], ['hanoi-a-ho-chi-minh', 'long_road', 'du nord au sud du Vietnam', {variant: 'south'}], ['ho-chi-minh-a-hanoi', 'long_road', 'du sud au nord du Vietnam'],
  ['nord-a-sud', 'long_road', 'du nord au sud du Vietnam', {variant: 'south'}], ['nord-sud', 'long_road', 'du nord au sud du Vietnam', {variant: 'south'}], ['ho-chi-minh-route', 'long_road', 'par la route Hô Chi Minh'], ['saigon', 'saigon', null, {variant: 'river'}], ['ho-chi-minh-ville', 'saigon', null],
  ['soc-son', 'pine_hills', 'de Sóc Sơn'], ['bat-trang', 'pottery', 'de Bát Tràng'], ['duong-lam', 'ancient_village', 'de Đường Lâm'], ['co-loa', 'ancient_village', 'de Cổ Loa', {variant: 'ramparts'}],
  ['ecopark', 'park_lake', null], ['hanoi-hanoi-1-jour-itineraire', 'lake_hk', null], ['hanoi-hanoi-2-jours-itineraire', 'old_quarter', null, {variant: 'lanterns'}], ['hanoi-hanoi-3-jours-itineraire', 'west_lake', null], ['hanoi-hanoi-4-jours-itineraire', 'pottery', 'de Bát Tràng'], ['hanoi-hanoi-5-jours-itineraire', 'street_food', null], ['hanoi-hanoi-7-jours-itineraire', 'countryside', 'de Hanoi', {variant: 'ba_vi'}], ['easy-moto-routes', 'countryside', 'de Hanoi'], ['cafes-itineraire', 'cafe', null, {variant: 'lake'}], ['kids', 'park_lake', null], ['temple-de-literature', 'temple', 'du Temple de la Littérature'], ['ba-dinh', 'ba_dinh', 'de Ba Dinh'],
  ['hoan-kiem', 'lake_hk', null], ['west-lac', 'west_lake', null], ['tay-ho', 'west_lake', null], ['lakes', 'lake_hk', null], ['long-bien', 'long_bien', null], ['red-river', 'long_bien', null, {variant: 'island'}],
  ['vieux-quartier', 'old_quarter', null], ['quartier-francais', 'french_quarter', null], ['french-architecture', 'french_quarter', null, {variant: 'cathedral'}], ['christmas', 'french_quarter', null, {variant: 'cathedral', extra: 'christmas', time: 'night'}],
  ['nuit-market', 'night_market', null], ['at-nuit', 'night_ride', null], ['street-food', 'street_food', null], ['food', 'street_food', null], ['cafes', 'cafe', null],
  ['tet', 'tet', null], ['hiver', 'winter_lake', null], ['heat', 'heat_street', null], ['ete', 'heat_street', null], ['when-it-rains', 'rain_street', null], ['pluie', 'rain_street', null], ['musees', 'rain_street', null],
  ['sunset', 'west_lake', null, {time: 'golden'}], ['couples', 'west_lake', null, {time: 'dusk', variant: 'cafe'}], ['early-morning', 'lake_hk', null, {time: 'dawn'}], ['photo-spots', 'long_bien', null, {variant: 'train'}],
  ['free-que-faire', 'lake_hk', null], ['unique-que-faire', 'countryside', 'de la campagne autour de Hanoi'], ['solo', 'old_quarter', null],
];
let ORDER = null; const ordinal = id => { if (!ORDER) { ORDER = new Map(JSON.parse(fs.readFileSync('data/image-seo-matrix.json', 'utf8')).items.map((x, i) => [x.id, i])); } return ORDER.get(id) ?? 0; };
const hash = s => parseInt(createHash('sha256').update(s).digest('hex').slice(0, 8), 16);
function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

export function pageText(file) {
  const h = fs.readFileSync(file, 'utf8');
  const strip = s => s.replace(/<[^>]+>/g, ' ').replace(/&#39;|&rsquo;/g, '’').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
  const h1 = strip((h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [, ''])[1]);
  const lead = strip((h.match(/<p class="lead">([\s\S]*?)<\/p>/i) || [, ''])[1]);
  const h2 = [...h.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map(m => strip(m[1]));
  return {h1, lead, h2};
}

export function planItem(it) {
  const seed = hash(it.id);
  const r = rng(seed); const pick = a => a[Math.floor(r() * a.length)];
  const slug = it.id.replace(/^IMG-/, '').toLowerCase();
  const txt = pageText(it.page_path);
  const hay = (slug + ' ' + it.title_fr + ' ' + txt.h1).toLowerCase();
  const has = k => slug.includes(k);
  const bikeOf = (type, model) => { const cname = pick(CNAMES); return {type, color: COLORS[cname], cname, model}; };
  // Models named in the slug, in order of appearance (comparisons name two).
  const found = [];
  for (const [k, label, type] of MODELS) { const i = slug.indexOf(k); if (i >= 0 && !found.some(f => f.label === label || (i >= f.i && i < f.i + f.k.length))) found.push({i, k, label, type}); }
  found.sort((a, b) => a.i - b.i);
  const genericType = () => {
    if (/50cc/.test(hay)) return 'scooter_flat';
    if (/electri|batterie|recharge/.test(hay)) return 'electric';
    if (/trail|tout-terrain|wr155|hors bitume|manuelle/.test(hay)) return 'trail';
    if (/semi-auto|underbone|cubique|vitesses|shifting/.test(hay)) return 'underbone';
    if (/scooter|automatique|abs|smartkey|coffre/.test(hay)) return pick(['scooter_small', 'scooter_sport', 'scooter_flat']);
    return pick(['underbone', 'scooter_small', 'scooter_sport', 'cub_trail', 'scooter_flat']);
  };
  let bikes = found.length ? found.map(f => bikeOf(f.type, f.label)) : [bikeOf(genericType())];
  if (bikes.length > 1 && bikes[1].cname === bikes[0].cname) bikes[1] = bikeOf(bikes[1].type, bikes[1].model);
  const times = ['morning', 'morning', 'golden', 'noon', 'dawn', 'dusk', 'overcast'];
  const sp = {id: it.id, seed, time: pick(times), bikes, place: null, rider: true};
  const set = (scene, extra = {}) => Object.assign(sp, {scene}, extra);
  const placeRule = () => { for (const [k, scene, place, extra] of PLACES) if (has(k)) { set(scene, Object.assign({place}, extra || {})); return true; } return false; };

  // Foundation and editorial extras first (hand-picked, specific to the hub's intent).
  const F = {
    'a-propos': () => set('old_quarter', {time: 'morning', parked: true}),
    'blog': () => set('mountain_pass', {variant: 'karst', place: 'des routes du Vietnam'}),
    'centre-sud-vietnam-centre': () => set('coast_road', {place: 'de la côte du Centre Vietnam'}),
    'centre-sud-vietnam': () => set('long_road', {variant: 'south', place: 'vers le Centre et le Sud du Vietnam'}),
    'centre-sud-vietnam-sud': () => set('delta', {place: 'du Sud du Vietnam'}),
    'conditions': () => set('documents', {variant: 'contract'}),
    'confidentialite': () => set('keys'),
    'contact': () => set('phone_nav', {variant: 'pins'}),
    'faq': () => set('checklist'),
    'hanoi-excursions-moto': () => set('countryside', {variant: 'ba_vi', place: 'de Hanoi'}),
    'hanoi': () => set('old_quarter', {variant: 'lanterns', time: 'golden'}),
    'hanoi-que-faire': () => set('lake_hk', {time: 'morning'}),
    'honda-electriques': () => set('charging', {bikes: [bikeOf('electric', null)]}),
    'honda': () => set('city_traffic', {bikes: [bikeOf('scooter_sport', null)]}),
    'honda-scooters': () => set('lineup', {bikes: [bikeOf('scooter_small'), bikeOf('scooter_premium'), bikeOf('scooter_flat'), bikeOf('scooter_sport')]}),
    'honda-semi-automatiques': () => set('mountain_pass', {bikes: [bikeOf('underbone')]}),
    'accueil': () => set('old_quarter', {time: 'golden', bikes: [bikeOf('scooter_small')]}),
    'location-moto-hanoi-courte-duree': () => set('rental_period'),
    'location-moto-hanoi': () => set('quiet_street', {variant: 'villa', bikes: [bikeOf('underbone')]}),
    'location-moto-hanoi-longue-duree': () => set('calendar'),
    'location-moto-hanoi-quartiers': () => set('intersection', {variant: 'roundabout'}),
    'nord-vietnam-ha-giang': () => set('mountain_pass', {variant: 'karst', place: 'de Hà Giang', bikes: [bikeOf('trail')]}),
    'nord-vietnam-ha-long': () => set('bay', {place: 'de la baie d’Ha Long'}),
    'nord-vietnam': () => set('terraces', {place: 'du nord du Vietnam', time: 'golden'}),
    'nord-vietnam-ninh-binh': () => set('karst_river', {place: 'de Ninh Binh', time: 'dawn'}),
    'nord-vietnam-sapa': () => set('terraces', {place: 'de Sapa', time: 'mist'}),
    'permis-securite': () => set('gear'),
    'permis-securite-permis': () => set('documents', {variant: 'license'}),
    'permis-securite-securite': () => set('gear', {variant: 'rain'}),
    'prix-location': () => set('budget', {place: 'd’une location à Hanoi'}),
    'prix-location-jour': () => set('rental_period'),
    'prix-location-mois': () => set('calendar'),
    'prix-location-semaine': () => set('rental_period'),
    'types-motos-50cc': () => set('quiet_street', {bikes: [bikeOf('scooter_flat')]}),
    'types-motos-electrique': () => set('charging', {bikes: [bikeOf('electric')]}),
    'types-motos': () => set('lineup', {bikes: [bikeOf('scooter_small'), bikeOf('underbone'), bikeOf('trail'), bikeOf('electric')]}),
    'types-motos-scooter-automatique': () => set('city_traffic', {bikes: [bikeOf('scooter_small')]}),
    'types-motos-semi-automatique': () => set('countryside', {bikes: [bikeOf('underbone')]}),
    'types-motos-trail': () => set('mountain_pass', {variant: 'karst', bikes: [bikeOf('trail')]}),
    'yamaha': () => set('west_lake', {time: 'golden', bikes: [bikeOf('scooter_sport')]}),
    'yamaha-scooters': () => set('lineup', {bikes: [bikeOf('scooter_premium'), bikeOf('electric'), bikeOf('scooter_small')]}),
    'yamaha-semi-automatiques': () => set('long_bien', {bikes: [bikeOf('underbone')]}),
    'yamaha-trail-aventure': () => set('forest_mountain', {bikes: [bikeOf('trail')]}),
    'extra-002': () => set('lineup', {bikes: [bikeOf('cub'), bikeOf('underbone'), bikeOf('scooter_premium'), bikeOf('electric')]}),
    'extra-001': () => set('long_bien', {time: 'golden', bikes: [bikeOf('scooter_small')]}),
    'extra-004': () => set('calendar'),
    'extra-003': () => set('lineup', {bikes: [bikeOf('maxi'), bikeOf('scooter_flat'), bikeOf('scooter_sport')]}),
  };
  if (F[slug]) { F[slug](); return finalize(sp, it, txt); }

  // Model articles (honda-*/yamaha-*): one angle per suffix.
  const angle = slug.match(/-(hanoi-ville|location-hanoi|longue-distance-vietnam|vietnam-voyage-moto|prix-location-hanoi)$/)?.[1];
  if (found.length && /-ou-/.test(slug)) { set('duel', {variant: ['studio', 'city', 'road', 'brick', 'garage', 'lake', 'mountain', 'night'][(ordinal(it.id) * 3) % 8]}); if (bikes.length < 2) bikes.push(bikeOf(genericType())); return finalize(sp, it, txt); }
  if (found.length && (slug.startsWith('honda-') || slug.startsWith('yamaha-'))) {
    sp.bikes = [bikes[0]];
    const mi = MODELS.findIndex(m => m[1] === found[0].label), rot = (list, k = 0) => list[(mi * 3 + k) % list.length];
    const rough = ['trail', 'cub_trail', 'sport_underbone', 'underbone'].includes(bikes[0].type);
    if (angle === 'hanoi-ville') { const L = ['city_traffic', 'old_quarter', 'night_ride', 'transit', 'rain_street', 'french_quarter', 'long_bien', 'lake_hk', 'gas_station', 'west_lake', 'ba_dinh']; set(L[(mi * 5) % L.length], {variant: rot([null, 'bus', 'lanterns'])}); }
    else if (angle === 'location-hanoi') set(rot(['quiet_street', 'hotel', 'cafe', 'quiet_street', 'parking', 'west_lake', 'lake_hk', 'cafe'], 1), {variant: rot(['villa', null, 'lake'], 2), extra: r() < 0.5 ? 'backpack' : null, parked: true});
    else if (angle === 'longue-distance-vietnam' || angle === 'vietnam-voyage-moto') set(rough ? rot(['mountain_pass', 'forest_mountain', 'terraces', 'mountain_lake', 'stilt_valley', 'tea_plateau', 'waterfall']) : rot(['long_road', 'coast_road', 'countryside', 'karst_river', 'beach', 'delta', 'pine_hills', 'bay', 'stilt_valley', 'tea_plateau']), {backpack: true, variant: rot(['karst', null, 'south', 'islands', 'lake', 'flowers'], 1)});
    else if (angle === 'prix-location-hanoi') set('rental_period');
    else set('quiet_street');
    return finalize(sp, it, txt);
  }
  if (found.length) { // model named in a cross-cutting article
    if (/voyage|tout-terrain/.test(slug)) set(bikes[0].type === 'trail' || bikes[0].type === 'cub_trail' ? pick(['mountain_pass', 'forest_mountain']) : 'countryside', {backpack: true, variant: 'karst'});
    else set(pick(['quiet_street', 'city_traffic']));
    sp.bikes = [bikes[0]]; return finalize(sp, it, txt);
  }
  if (/scooter-jour-voyages/.test(slug)) { set('countryside', {variant: 'hills'}); return finalize(sp, it, txt); }
  if (/jour-voyages/.test(slug)) { set('forest_mountain', {place: 'des environs de Hanoi'}); return finalize(sp, it, txt); }
  // Duration and price pages: scene chosen from each page's own H1/subheadings (see pageText).
  const D = {
    'location-moto-hanoi-1-jour-location-moto-hanoi': () => set('countryside', {place: 'de Hanoi'}),
    'location-moto-hanoi-1-semaine-location-moto-hanoi': () => set('lineup', {bikes: [bikeOf('scooter_small'), bikeOf('underbone'), bikeOf('scooter_flat')]}),
    'location-moto-hanoi-2-jours-location-moto-hanoi': () => set('west_lake'),
    'location-moto-hanoi-2-semaines-location-moto-hanoi': () => set('brakes', {variant: 'disc'}),
    'location-moto-hanoi-3-jours-location-moto-hanoi': () => set('ancient_village', {place: 'des villages autour de Hanoi'}),
    'location-moto-hanoi-3-mois-location-moto-hanoi': () => set('documents', {variant: 'contract'}),
    'location-moto-hanoi-1-mois-location-moto-hanoi': () => set('budget', {place: 'd’un mois de location à Hanoi', kind: 'city'}),
    'location-moto-hanoi-courte-duree-location-moto-hanoi': () => set('clock', {variant: 'hourglasses'}),
    'location-moto-hanoi-location-moto-hanoi-vietnam': () => set('documents', {variant: 'license'}),
    'location-moto-hanoi-weekend-location-moto-hanoi': () => set('phone_nav'),
    'location-moto-hanoi-longue-duree-location-moto-hanoi': () => set('toolkit', {variant: 'oil'}),
    'prix-location-30-jours-location-moto-hanoi-cout': () => set('budget', {place: 'de trente jours de location', kind: 'city'}),
    'prix-location-50cc-ou-125cc-location-scooter-cout-hanoi': () => set('duel', {variant: 'brick', bikes: [bikeOf('scooter_flat'), bikeOf('scooter_small')]}),
    'prix-location-abs-location-scooter-hanoi-prix-premium': () => set('brakes', {variant: 'disc'}),
    'prix-location-cheap-location-moto-hanoi': () => set('checklist'),
    'prix-location-hebdomadaire-ou-mensuelle-location-moto-hanoi-cout': () => set('calendar'),
    'prix-location-longue-duree-location-moto-hanoi-discount': () => set('documents', {variant: 'contract'}),
    'prix-location-vietnam-location-moto-cout-30-jours': () => set('budget', {place: 'd’un mois de voyage au Vietnam', kind: 'road'}),
    'prix-location-automatique-location-scooter-hanoi-prix': () => set('budget', {place: 'd’une location de scooter automatique', kind: 'scooter'}),
    'prix-location-electrique-location-scooter-hanoi-prix': () => set('budget', {place: 'd’une location de scooter électrique', kind: 'electric'}),
    'prix-location-14-jours-location-moto-hanoi-cout': () => set('budget', {place: 'd’une location de deux semaines', kind: 'mountain'}),
    'prix-location-3-jours-location-moto-hanoi-prix': () => set('budget', {place: 'd’une location de trois jours', kind: 'karst'}),
    'prix-location-7-jours-location-moto-hanoi-cout': () => set('budget', {place: 'd’une location d’une semaine', kind: 'terraces'}),
    'prix-location-mensuelle-location-moto-economies-hanoi': () => set('calendar'),
    'prix-location-prix-location-moto-hanoi': () => set('budget', {place: 'd’une location à Hanoi', kind: 'city'}),
  };
  if (D[slug]) { D[slug](); return finalize(sp, it, txt); }
  // Topic rules by keyword (order matters: most specific first).
  const T = [
    [/roundabout|panneaux|lane|left-turn/, () => set('intersection', {variant: /roundabout|panneaux/.test(slug) ? 'roundabout' : /left-turn/.test(slug) ? 'leftturn' : /lane/.test(slug) ? 'lanes' : null})],
    [/accident/, () => set('emergency')], [/emergency/, () => set('emergency')], [/panne-|breakdown/, () => set('roadside_repair')],
    [/crevaison|pneu-controle|tubeless/, () => set('tire', {variant: has('tubeless') ? 'tubeless' : null})],
    [/chain/, () => set('toolkit', {variant: 'chain'})], [/oil|vidange|entretien/, () => set('toolkit', {variant: 'oil', kind: /oil-change|vidange/.test(slug) ? 'drain' : /controle/.test(slug) ? 'dipstick' : null})],
    [/carburateur|injection/, () => set('toolkit', {variant: 'engine'})], [/disc-frein|frein-controle/, () => set('brakes', {variant: has('disc-frein') ? 'compare' : 'disc'})],
    [/abs-ou-cbs/, () => set('brakes', {variant: 'abs'})], [/abs-vietnam-pluie/, () => set('rain_street')],
    [/perdue-cle|smartkey/, () => set('keys')], [/antivol/, () => set('parking')],
    [/rue-inondee/, () => set('flood_street')], [/fog/, () => set('fog_mountain')], [/montagne-pass|descendre/, () => set('mountain_pass', {variant: 'karst', time: 'golden'})],
    [/autoroute/, () => set('highway')], [/nuit-securite/, () => set('night_ride')], [/heat/, () => set('heat_street')], [/pluie-securite|pluie-season/, () => set('rain_street')],
    [/casque|protective/, () => set('gear')], [/deux-personnes|passager|pour-deux/, () => set('two_up', {variant: has('hanoi') ? 'city' : null})],
    [/grand-gabarit|leger-scooter/, () => set('size_compare', {bikes: [bikeOf('scooter_small'), bikeOf('scooter_premium')]})],
    [/assurance/, () => set('documents', {variant: 'insurance'})], [/immatriculation/, () => set('documents', {variant: 'registration'})],
    [/police/, () => set('documents', {variant: 'police'})], [/legal-liste/, () => set('documents', {variant: 'license', kind: 'kit'})], [/contrat|what-is-included/, () => set('documents', {variant: 'contract'})],
    [/passeport|depot/, () => set('documents', {variant: 'deposit'})], [/idp|international/, () => set('documents', {variant: 'idp'})],
    [/conversion|permis-etranger|temporary-residence/, () => set('documents', {variant: 'conversion', kind: /temporary-residence/.test(slug) ? 'residence' : /touriste/.test(slug) ? 'visa' : /permis-etranger-conversion/.test(slug) ? 'photos' : null})],
    [/permis|license|documents-moto/, () => set('documents', {variant: 'license', kind: /50cc/.test(slug) ? 'none50' : /125cc-plus/.test(slug) ? 'big' : /moins-de-125/.test(slug) ? 'small' : /electrique/.test(slug) ? 'electric' : /documents-moto/.test(slug) ? 'kit' : /a1-a/.test(slug) ? 'two' : /etranger-valide/.test(slug) ? 'foreign' : null})],
    [/limite-vitesse|vitesse-limits/, () => set(pick(['long_road', 'highway']))], [/shifting/, () => set('mountain_pass', {bikes: [bikeOf('underbone')]})],
    [/scooter-montagne-pass/, () => set('mountain_pass', {bikes: [bikeOf('scooter_small')]})],
    [/etat-des-lieux/, () => set('checklist', {variant: 'photos'})], [/choisir-location/, () => set('checklist', {variant: 'compare'})], [/retrait|rendre/, () => set('checklist', {variant: 'handover'})],
    [/inspection|liste-controle/, () => set('checklist')],
    [/aeroport/, () => set('airport', {parked: /location-moto-aeroport/.test(slug)})], [/livraison/, () => set('hotel')], [/horaires|opening|same-jour|24-horaires/, () => set('clock', {hour: has('same') ? 10 : 8})],
    [/online|pres-de-moi|google-maps/, () => set('phone_nav', {variant: has('pres-de-moi') ? 'pins' : null})], [/support-telephone/, () => set('phone_nav', {variant: 'mount'})],
    [/station-essence|carburant/, () => set('gas_station')], [/grab/, () => set('two_up', {variant: 'city'})], [/taxi|business-traveler/, () => set('city_traffic', {variant: 'car'})], [/public-transport/, () => set('transit')],
    [/grand-rangement/, () => set('quiet_street', {bikes: [bikeOf('scooter_flat')], bag: true})], [/50cc-electrique/, () => set('duel', {variant: 'city', bikes: [bikeOf('scooter_flat'), bikeOf('electric')]})],
    [/long-distance/, () => set('long_road', {backpack: true})],
    [/recharge|batterie|hanoi-range|electrique-ou-essence|electrique-scooter-ou-essence/, () => set('charging', {bikes: [bikeOf('electric'), bikeOf('scooter_small')], variant: /swap/.test(slug) ? 'swap' : /removable|hotel/.test(slug) ? 'hotel' : /range/.test(slug) ? 'range' : /ou-essence|electrique-ou-essence/.test(slug) ? 'fuel' : /recharge/.test(slug) ? 'street' : null})],
    [/luggage|bagage/, () => set('luggage')], [/budget|cout|prix|cheap|discount|economies|negoc/, () => { if (/voyage|nord|ha-giang|sapa|halong|ninh-binh/.test(slug)) { placeRule(); const pl = sp.place, sc = sp.scene; set('budget', {place: !pl ? 'd’un voyage à moto dans le nord du Vietnam' : /nord au sud/.test(pl) ? 'd’une traversée du Vietnam du nord au sud' : 'du voyage vers ' + pl.replace(/^de la /, 'la ').replace(/^de l’/, 'l’').replace(/^du /, 'le ').replace(/^des /, 'les ').replace(/^de /, ''), coast: sc === 'bay', kind: {karst_river: 'karst', bay: 'bay', mountain_pass: 'mountain', terraces: 'terraces', long_road: 'road'}[sc] || 'mountain'}); } else set(r() < 0.5 ? 'budget' : 'rental_period', {place: 'd’une location à Hanoi'}); }],
    [/circuit-moto/, () => set('mountain_pass', {group: true})],
  ];
  const topic = slug.replace(/^(permis-securite|prix-location|types-motos|location-moto-hanoi|centre-sud-vietnam|nord-vietnam|hanoi)-/, '');
  for (const [re, fn] of T) if (re.test(topic)) { fn(); if (sp.scene) return finalize(sp, it, txt); }
  if (placeRule()) return finalize(sp, it, txt);
  if (/meilleur|quelle-moto|semi-automatique-ou-trail|trail-moto-ou-scooter|scooter-ou-semi|scooter-ou-moto|automatique-ou-semi|50cc-ou|125cc-ou|125cc-location|wave-alpha-ou|moins-de-125|plus-de-125/.test(slug)) {
    const pairs = {trail: ['trail', 'underbone'], semi: ['underbone', 'scooter_small'], '50cc': ['scooter_flat', 'underbone'], '125': ['scooter_small', 'scooter_premium'], '160': ['scooter_small', 'scooter_sport'], plus: ['scooter_premium', 'sport_underbone'], moins: ['underbone', 'scooter_flat'], ville: ['scooter_small', 'underbone']};
    const p = has('trail') ? pairs.trail : has('50cc') ? pairs['50cc'] : has('160cc') ? pairs['160'] : has('plus-de-125') ? pairs.plus : has('moins-de-125') ? pairs.moins : has('circulation') ? pairs.ville : has('125') ? pairs['125'] : pairs.semi;
    set('duel', {variant: ['road', 'studio', 'brick', 'garage', 'lake', 'mountain', 'city'][(ordinal(it.id) * 3) % 7], bikes: [bikeOf(p[0]), bikeOf(p[1])]}); return finalize(sp, it, txt);
  }
  // Remaining durations / generic rental, Hanoi itineraries and type pages.
  if (/jours|semaine|mois|week-end|weekend|courte|longue|1-jour|mensuelle|student|expat|backpacker|tourists|solo|debutant|experienced|louer-ou-buy|1-way|vietnam$/.test(slug)) {
    if (/hanoi-[0-9]-jours?-itineraire|2-jours-moto-voyages|jour-voyages/.test(slug)) set(pick(['lake_hk', 'old_quarter', 'west_lake', 'long_bien', 'countryside']));
    else if (/backpacker|tourists|solo|student|expat/.test(slug)) set('quiet_street', {extra: 'backpack', variant: has('expat') || has('student') ? 'villa' : null});
    else if (/debutant/.test(slug)) set('park_lake');
    else if (/experienced|1-way/.test(slug)) set('long_road', {backpack: true});
    else if (/louer-ou-buy|mois|mensuelle|longue/.test(slug)) set('calendar');
    else set('rental_period');
    return finalize(sp, it, txt);
  }
  if (/routes|easy-moto|scooter-jour|semi-automatique-moto-routes|trail-moto-routes/.test(slug)) { set(has('trail') ? 'forest_mountain' : has('semi-automatique') ? 'mountain_lake' : 'countryside', {variant: 'hills', place: has('semi-automatique') ? 'des environs de Hanoi' : null}); return finalize(sp, it, txt); }
  if (/types-motos/.test(slug)) { set(pick(['quiet_street', 'city_traffic'])); return finalize(sp, it, txt); }
  set(pick(['old_quarter', 'city_traffic', 'quiet_street']));
  return finalize(sp, it, txt);
}
function finalize(sp, it, txt) {
  // Seeded horizontal mirroring for compositions without left/right meaning (keeps sibling pages visually distinct).
  sp.mirror = !['duel', 'size_compare', 'intersection', 'lineup'].includes(sp.scene) && (sp.seed % 2 === 1);
  // Weather/time constraints coming from the topic.
  const t = (it.title_fr + ' ' + txt.h1).toLowerCase();
  if (/pluie|pleut|mousson/.test(t) && !['rain_street', 'flood_street'].includes(sp.scene) && !['documents', 'toolkit', 'tire', 'brakes', 'gear', 'calendar', 'keys', 'budget', 'checklist', 'emergency', 'phone_nav', 'luggage', 'lineup', 'duel', 'rental_period', 'clock', 'charging', 'size_compare', 'intersection'].includes(sp.scene)) sp.time = 'rain';
  if (/nuit|soir|night/.test(t) && ['old_quarter', 'city_traffic', 'french_quarter', 'hoi_an'].includes(sp.scene)) sp.time = 'night';
  if (/brume|brouillard|hiver/.test(t) && !['winter_lake', 'fog_mountain'].includes(sp.scene) && sp.time !== 'night') sp.time = 'mist';
  if (/coucher du soleil|sunset/.test(t)) sp.time = 'golden';
  if (sp.scene === 'rain_street' || sp.scene === 'flood_street') sp.time = 'rain';
  if (sp.time === 'rain' && ['dunes'].includes(sp.scene)) sp.time = 'overcast';
  return sp;
}
