#!/usr/bin/env node
// Figma image workflow helper (the generation itself is done with the Figma MCP `generate_image` tool,
// the full-resolution PNG is retrieved with `get_screenshot` + enableBase64Response because the
// container cannot reach figma.com directly).
//   node tools/seo-art/figma-batch.mjs next [N]        → next rows not yet replaced by a Figma image, with prompts
//   node tools/seo-art/figma-batch.mjs ingest map.json → [{id, png, alt, node, prompt}] → WebP at asset_path, alt, READY
//   node tools/seo-art/figma-batch.mjs status
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {planItem} from './plan.mjs';

const root = process.cwd();
const matrixFile = path.join(root, 'data/image-seo-matrix.json');
const logFile = path.join(root, 'data/image-seo-figma-log.json');
const matrix = JSON.parse(fs.readFileSync(matrixFile, 'utf8'));
const log = fs.existsSync(logFile) ? JSON.parse(fs.readFileSync(logFile, 'utf8')) : {source: 'Figma generate_image (gemini-3.1-flash-lite-image)', items: {}};
const [cmd = 'status', arg] = process.argv.slice(2);

const BIKE_EN = {
  scooter_small: 'a compact automatic scooter', scooter_flat: 'a step-through automatic scooter with a flat floorboard', scooter_sport: 'a sporty automatic scooter',
  scooter_premium: 'a large-wheel premium automatic scooter', maxi: 'a large maxi-scooter with a windscreen', electric: 'a modern electric scooter',
  underbone: 'a Vietnamese-style semi-automatic underbone motorbike', sport_underbone: 'a sporty underbone motorbike', cub: 'a retro cub-style motorbike',
  cub_trail: 'a retro cub-style trail motorbike with a rear rack', trail: 'a dual-sport trail motorbike',
};
const COLOR_EN = {rouge: 'red', bleu: 'blue', blanc: 'white', noir: 'black', gris: 'grey', vert: 'green', jaune: 'yellow', orange: 'orange', bordeaux: 'burgundy', beige: 'beige', turquoise: 'turquoise', marron: 'brown', 'bleu ciel': 'light blue', argent: 'silver', kaki: 'khaki'};
const TIME_EN = {dawn: 'at dawn', morning: 'in soft morning light', noon: 'in bright daylight', golden: 'in warm late-afternoon golden light', dusk: 'at dusk', night: 'at night', overcast: 'under an overcast sky', rain: 'in the rain', mist: 'in the mist'};
const PLACE_EN = s => (s || '').replace(/^inspiré /, '').replace(/^(de la |de l’|des |du |de |d’)/, '');
const bike = b => `${BIKE_EN[b.type]} in ${COLOR_EN[b.cname] || b.cname}`;
const SCENE_EN = {
  mountain_pass: sp => `a rider on ${bike(sp.bikes[0])} on a winding mountain pass road with hairpin bends between ${sp.variant === 'karst' ? 'jagged limestone karst peaks' : 'forested ridges'} in northern Vietnam${sp.place ? ' (' + PLACE_EN(sp.place) + ')' : ''}`,
  canyon: sp => `${bike(sp.bikes[0])} parked at a stone-wall viewpoint above a deep green gorge with a turquoise river far below, karst mountains of Ha Giang, northern Vietnam`,
  buckwheat: sp => `a rider on ${bike(sp.bikes[0])} on a mountain road beside fields of pink and white buckwheat flowers, limestone peaks of Ha Giang behind`,
  hmong_village: sp => `${bike(sp.bikes[0])} in a Hmong mountain village with earthen houses, grey tile roofs, dry stone walls and peach blossoms, karst peaks behind, northern Vietnam`,
  karst_valley: sp => `a rider on ${bike(sp.bikes[0])} on a country road crossing a flat green rice valley between limestone karst towers with a winding river, ${PLACE_EN(sp.place) || 'northeast Vietnam'}`,
  terraces: sp => `a rider on ${bike(sp.bikes[0])} on a mountain road above ${sp.variant === 'harvest' ? 'golden ripe' : 'green'} rice terraces and stilt houses, ${PLACE_EN(sp.place) || 'northwest Vietnam'}`,
  flooded_terraces: sp => `${bike(sp.bikes[0])} parked on a road above water-filled rice terraces reflecting the sky, farmers in conical hats working, ${PLACE_EN(sp.place) || 'northwest Vietnam'}`,
  karst_river: sp => `a rider on ${bike(sp.bikes[0])} on a road along a calm river with wooden rowing boats beneath limestone karst towers and rice fields, ${PLACE_EN(sp.place) || 'Ninh Binh'}, Vietnam`,
  bay: sp => `a rider on ${bike(sp.bikes[0])} on a coastal road facing a bay full of limestone islets and traditional junk boats, ${PLACE_EN(sp.place) || 'Ha Long Bay'}, Vietnam`,
  ferry: sp => `${bike(sp.bikes[0])} and other motorbikes on the deck of a small car ferry crossing a bay with limestone islets, ${PLACE_EN(sp.place) || 'Cat Ba'}, Vietnam`,
  cruise: sp => `a wooden junk boat with ochre sails cruising between limestone islets in Ha Long Bay, Vietnam, a small rowing boat in the foreground`,
  waterfall: sp => `${bike(sp.bikes[0])} parked by a river facing a wide multi-tiered waterfall in green jungle, ${PLACE_EN(sp.place) || 'Ban Gioc'}, northeast Vietnam`,
  mountain_lake: sp => `a rider on ${bike(sp.bikes[0])} on a lakeside road, a calm mountain lake ${sp.variant === 'islands' ? 'dotted with forested islets' : 'surrounded by forested hills'} with a wooden boat, ${PLACE_EN(sp.place) || 'northern Vietnam'}`,
  tea_plateau: sp => `a rider on ${bike(sp.bikes[0])} on a small road through rolling tea plantation hills with pickers in conical hats, ${PLACE_EN(sp.place) || 'Moc Chau plateau'}, Vietnam`,
  stilt_valley: sp => `a rider on ${bike(sp.bikes[0])} crossing a valley of green rice paddies with traditional wooden stilt houses, mountains behind, ${PLACE_EN(sp.place) || 'Mai Chau'}, Vietnam`,
  pine_hills: sp => `a rider on ${bike(sp.bikes[0])} on a road through pine forest hills${sp.variant === 'greenhouses' ? ' with white greenhouses on the slopes' : sp.variant === 'flowers' ? ' with colorful flower fields' : sp.variant === 'lake' ? ' above a lake' : ''}, ${PLACE_EN(sp.place) || 'Da Lat highlands'}, Vietnam`,
  coast_road: sp => `a rider on ${bike(sp.bikes[0])} on a coastal cliff road above a turquoise sea, green hills, ${PLACE_EN(sp.place) || 'central Vietnam coast'}`,
  beach: sp => `${bike(sp.bikes[0])} on a beach road lined with coconut palms, white sand and turquoise water${sp.variant === 'baskets' ? ', round basket fishing boats on the sand' : sp.variant === 'rocks' ? ', basalt rock columns at the shore' : sp.variant === 'pier' ? ', a wooden pier with fishing boats' : sp.variant === 'headland' ? ', a lighthouse on a green headland' : sp.variant === 'jungle' ? ', jungle hills dropping into the sea' : ''}, ${PLACE_EN(sp.place) || 'Vietnam'}`,
  dunes: sp => `${bike(sp.bikes[0])} parked at the foot of large golden sand dunes with a few walkers, Mui Ne, Vietnam`,
  delta: sp => `a rider on ${bike(sp.bikes[0])} on a riverside dike road in the Mekong Delta, coconut palms, wooden boats on a wide brown river`,
  floating_market: () => 'a floating market on a wide brown river in the Mekong Delta, wooden boats loaded with fruit and vegetables, coconut palms on the banks',
  hoi_an: sp => `${bike(sp.bikes[0])} parked on the riverside quay of an old merchant town with yellow walls and colorful silk lanterns, Hoi An, Vietnam`,
  hue_citadel: sp => `a rider on ${bike(sp.bikes[0])} passing an imperial citadel gate with golden roofs behind a lotus moat, Hue, Vietnam`,
  cave: sp => `${bike(sp.bikes[0])} parked near an emerald river flowing into a large cave entrance at the foot of a jungle-covered karst cliff, Phong Nha, Vietnam`,
  pagoda_karst: () => 'rowing boats on a winding river between limestone karst mountains with a small temple on the bank, near the Perfume Pagoda, Vietnam',
  forest_mountain: sp => `a rider on ${bike(sp.bikes[0])} on a winding road climbing through dense forest mountains${sp.time === 'mist' ? ' in the mist' : ''}, ${PLACE_EN(sp.place) || 'northern Vietnam'}`,
  countryside: sp => `a rider on ${bike(sp.bikes[0])} on a quiet country road through rice paddies, tile-roofed village houses and bamboo, ${sp.place ? 'near ' + PLACE_EN(sp.place).replace(/^environs de /, '') : 'Red River Delta near Hanoi'}`,
  long_road: sp => `a rider with luggage strapped on ${bike(sp.bikes[0])} on a long road through green rice fields toward distant hills, Vietnam road trip`,
  fog_mountain: sp => `a rider on ${bike(sp.bikes[0])} with headlight on, on a mountain road in thick fog, northern Vietnam`,
  highway: sp => `an expressway with cars beside a separate local road where a rider on ${bike(sp.bikes[0])} travels, Vietnam countryside`,
  old_quarter: sp => `${sp.parked ? bike(sp.bikes[0]) + ' parked' : 'a rider on ' + bike(sp.bikes[0])} in a narrow street of Hanoi Old Quarter with colorful tube houses, tangled electric cables and parked scooters`,
  city_traffic: sp => `a rider on ${bike(sp.bikes[0])} in dense scooter traffic on a busy Hanoi street${sp.variant === 'bus' ? ' with a city bus' : sp.variant === 'car' ? ' with taxis' : ''}`,
  quiet_street: sp => `${bike(sp.bikes[0])} parked with a helmet on the seat in a quiet tree-lined Hanoi street${sp.variant === 'villa' ? ' with French colonial villas' : sp.variant === 'lake' ? ' by a lake' : sp.variant === 'alley' ? ', a narrow alley with potted plants' : ''}`,
  lake_hk: sp => `a rider on ${bike(sp.bikes[0])} on the promenade of Hoan Kiem Lake in Hanoi, the small Turtle Tower on its islet, red bridge and trees`,
  west_lake: sp => `a rider on ${bike(sp.bikes[0])} by West Lake in Hanoi, Tran Quoc pagoda tower on a peninsula${sp.variant === 'cafe' ? ', low café stools on the shore' : ''}`,
  long_bien: sp => `a rider on ${bike(sp.bikes[0])} on the bank of the Red River in Hanoi facing the long steel Long Bien bridge${sp.variant === 'train' ? ' with a train crossing' : ''}, banana trees`,
  french_quarter: sp => `a rider on ${bike(sp.bikes[0])} in the French Quarter of Hanoi, yellow colonial villas with green shutters${sp.variant === 'cathedral' ? ' and the twin-tower neo-gothic cathedral' : ''}${sp.extra === 'christmas' ? ', Christmas lights' : ''}`,
  night_market: () => 'a lively night market street in Hanoi with lit stalls, string lights, walkers and a row of parked scooters',
  street_food: sp => `a Hanoi street food stall with steaming pots, low plastic stools and diners, ${bike(sp.bikes[0])} parked nearby`,
  cafe: sp => `a Hanoi sidewalk café with low stools and glasses of iced coffee${sp.variant === 'lake' ? ' by a lake' : ''}, ${bike(sp.bikes[0])} parked nearby`,
  temple: sp => `the traditional triple gate of the Temple of Literature in Hanoi with visitors, ${bike(sp.bikes[0])} parked on the street`,
  ba_dinh: sp => `a rider on ${bike(sp.bikes[0])} on a wide boulevard beside the green lawns of Ba Dinh Square, yellow official buildings, Hanoi`,
  tet: sp => `a rider on ${bike(sp.bikes[0])} carrying a pink peach blossom tree through a Hanoi street decorated with red lanterns for Tet`,
  rain_street: sp => `a rider in a rain poncho on ${bike(sp.bikes[0])} on a wet Hanoi street in heavy rain, reflections and puddles`,
  flood_street: sp => `a person pushing ${bike(sp.bikes[0])} through a flooded Hanoi street after heavy rain, water at wheel height`,
  winter_lake: sp => `a rider in a winter coat on ${bike(sp.bikes[0])} along a misty lake in Hanoi, bare trees`,
  heat_street: sp => `a rider on ${bike(sp.bikes[0])} stopped in the shade of a large tree on a sunny Hanoi street, holding a water bottle`,
  night_ride: sp => `a rider on ${bike(sp.bikes[0])} with headlight on in a Hanoi street at night, street lamps and red tail lights`,
  intersection: sp => `aerial top-down view of a ${sp.variant === 'roundabout' ? 'roundabout' : 'city crossroads'} in Hanoi with scooters, painted arrows and zebra crossings`,
  gas_station: sp => `a rider on ${bike(sp.bikes[0])} at an unbranded fuel pump under a petrol station canopy in Hanoi`,
  airport: sp => `a rider with a backpack on ${bike(sp.bikes[0])} on the road by an airport terminal near Hanoi, a plane in the sky`,
  hotel: sp => `${bike(sp.bikes[0])} parked in front of a small city hotel entrance with potted plants in Hanoi, keys in the foreground`,
  transit: sp => `a rider on ${bike(sp.bikes[0])} passing a bus stop with waiting passengers and a green city bus in Hanoi`,
  saigon: sp => `a rider on ${bike(sp.bikes[0])} in scooter traffic below modern towers in Ho Chi Minh City${sp.variant === 'river' ? ' along the Saigon river' : ''}`,
  pottery: sp => `rows of ceramic vases and jars in front of potters' workshops in Bat Trang village near Hanoi, ${bike(sp.bikes[0])} parked`,
  ancient_village: sp => sp.variant === 'ramparts' ? `a rider on ${bike(sp.bikes[0])} by grassy ancient earthen ramparts and a temple gate, Co Loa near Hanoi` : `a rider on ${bike(sp.bikes[0])} at the gate of an old village with red laterite walls, tile roofs and a big banyan tree, Duong Lam near Hanoi`,
  park_lake: sp => `a rider on ${bike(sp.bikes[0])} on a landscaped park path by a lake with lawns, a family walking, near Hanoi`,
  parking: sp => `${bike(sp.bikes[0])} parked in a sidewalk parking area in Hanoi with a yellow disc lock on the front brake disc`,
  documents: sp => `top-down flat lay on a wooden table: ${({license: 'a passport, a blank driving licence card and a pen', idp: 'a passport, a blank licence card and an international driving permit booklet', conversion: 'a passport, a blank licence card and a stamped form', deposit: 'a passport, a sealed envelope and motorbike keys', contract: 'a signed rental contract, a pen, keys and a helmet', insurance: 'an insurance document with a green shield, a blank registration card and keys', registration: 'a blank motorbike registration card, an ignition key and a passport', police: 'a licence card, a registration card, a passport and a white helmet'})[sp.variant] || 'travel documents and keys'}, all blank with no readable text`,
  checklist: () => 'top-down flat lay on a wooden table: a clipboard checklist with ticked boxes, a smartphone showing a map, motorbike keys and a helmet, no readable text',
  toolkit: sp => `top-down flat lay on a workshop mat of motorbike maintenance tools: wrench, screwdriver, ${sp.variant === 'chain' ? 'a section of drive chain and lubricant' : sp.variant === 'oil' ? 'an unbranded engine oil bottle' : sp.variant === 'engine' ? 'a carburetor and a fuel injector' : 'a hand pump and an oil bottle'}, no text`,
  tire: () => 'top-down view of a motorbike wheel lying flat with a nail in the tread, an inner tube, a hand pump and a wrench on a workshop mat',
  brakes: sp => sp.variant === 'compare' ? 'top-down view of a drilled motorbike brake disc with red caliper next to a drum brake on a workshop mat' : 'top-down close-up of a drilled motorbike brake disc with red caliper and brake pads on a workshop mat',
  gear: () => 'top-down flat lay on a wooden table: a full-face motorbike helmet, gloves, sunglasses and a folded riding jacket',
  emergency: () => 'top-down flat lay: a first aid kit with a green cross, a red warning triangle, a smartphone and motorbike keys on a wooden table',
  phone_nav: () => 'top-down flat lay on a wooden table: a smartphone showing a map route, a helmet, a cup of coffee and sunglasses, no readable text',
  charging: sp => `${bike(sp.bikes[0])} parked indoors next to a removable battery connected to a charger and wall socket`,
  budget: () => 'top-down flat lay on a wooden table: a notebook with a bar chart, a calculator, a folded road map with a dotted red route and motorbike keys, no readable text or numbers',
  keys: () => 'top-down flat lay on a wooden table: a scooter smart key fob, a keyring and a single key',
  calendar: () => 'top-down flat lay on a wooden table: three blank paper calendar sheets without numbers next to motorbike keys',
  clock: sp => `${bike(sp.bikes[0])} parked against a light wall with a wall clock without numbers and an hourglass on the floor`,
  luggage: () => 'top-down flat lay on a wooden table: a backpack, a folded rain poncho, two elastic straps, a road map and a water bottle',
  rental_period: sp => `${bike(sp.bikes[0])} parked in front of a wall with three blank paper calendars without numbers`,
  lineup: sp => `${sp.bikes.map(bike).join(', ')} lined up side by side in a bright studio, side view, no logos`,
  duel: sp => `${bike(sp.bikes[0])} and ${bike(sp.bikes[1])} facing each other side by side, ${({city: 'in a Hanoi street', road: 'on a country road', brick: 'in front of a brick wall', garage: 'in front of a metal garage shutter', lake: 'by a lake', mountain: 'on a karst mountain road', night: 'in a Hanoi street at night'})[sp.variant] || 'in a bright studio'}, side view`,
  two_up: sp => `a rider and a passenger with helmets on ${bike(sp.bikes[0])}${sp.variant === 'city' ? ' in a Hanoi street' : ' on a country road'}`,
  size_compare: sp => `two riders of different heights on ${bike(sp.bikes[0])} and ${bike(sp.bikes[1])} side by side in a bright studio`,
  roadside_repair: sp => `${bike(sp.bikes[0])} stopped on the shoulder of a mountain road with a warning triangle behind, the rider checking it with tools`,
};
const PAPER = ' Any paper sheet is completely blank or shows only faint grey ruled lines: no words, no title, no handwriting, no signature text.';
const STYLE = 'Photorealistic editorial travel photograph, wide 16:9 landscape composition, natural colors, sharp. No text, no letters, no signs, no logos, no brand names, no number plates, no watermark.';
export function promptFor(it) {
  const sp = planItem(it);
  const f = SCENE_EN[sp.scene];
  const still = ['documents', 'checklist', 'toolkit', 'tire', 'brakes', 'gear', 'emergency', 'phone_nav', 'budget', 'keys', 'calendar', 'luggage', 'lineup', 'intersection', 'charging', 'clock', 'rental_period', 'size_compare'].includes(sp.scene);
  return `${f ? f(sp) : it.title_fr}${still ? '' : ', ' + (TIME_EN[sp.time] || '')}.${['documents', 'checklist', 'budget', 'calendar', 'rental_period'].includes(sp.scene) ? PAPER : ''} ${STYLE}`.replace(/\s+/g, ' ').replace(/ ,/g, ',');
}
function status() {
  const n = Object.keys(log.items).length;
  console.log(JSON.stringify({figma_replaced: n, remaining_vector: matrix.items.length - n, total: matrix.items.length}));
}
if (cmd === 'status') status();
else if (cmd === 'next') {
  const n = Number(arg || 5);
  const rows = matrix.items.filter(it => !log.items[it.id]).slice(0, n).map(it => ({id: it.id, title: it.title_fr, prompt: promptFor(it)}));
  console.log(JSON.stringify(rows, null, 1));
} else if (cmd === 'ingest' || cmd === 'ingest-tsv') {
  // ingest-tsv: lines "ID|blob-suffix|node|alt" (prompt = promptFor(row), the prompt sent to Figma), blob dir = argv[4]
  const entries = cmd === 'ingest' ? JSON.parse(fs.readFileSync(arg, 'utf8')) : fs.readFileSync(arg, 'utf8').split('\n').filter(l => l.trim()).map(l => { const [id, suf, node, alt, blur, promptOverride] = l.split('|').map(x => x.trim()); const dir = process.argv[4]; const f = fs.readdirSync(dir).filter(n => n.endsWith('-' + suf + '.png')); if (f.length !== 1) throw new Error('Blob not found ' + suf); const it = matrix.items.find(x => x.id === id); return {id, png: path.join(dir, f[0]), node, file: 'ADjYMc8iK0NclWtULInpOu', alt, prompt: promptOverride || promptFor(it), blur: blur ? blur.split(';').map(b => b.split(',').map(Number)) : []}; });
  for (const e of entries) {
    const it = matrix.items.find(x => x.id === e.id);
    if (!it) throw new Error('Unknown id ' + e.id);
    if (!e.alt || !e.alt.startsWith('Image d’illustration : ') || e.alt.length < 40) throw new Error('Alt must be a reviewed description: ' + e.id);
    const out = path.join(root, it.asset_path);
    // Crop the generated frame to 1200×630 (centered) and encode WebP inside 150–300 KiB.
    const py = `import sys,io,json\nfrom PIL import Image,ImageFilter\nim=Image.open(sys.argv[1]).convert('RGB');w,h=im.size\nfrom PIL import ImageDraw\nbl=json.loads(sys.argv[4])\nif bl:\n  soft=im.filter(ImageFilter.GaussianBlur(4));m=Image.new('L',im.size,0);d=ImageDraw.Draw(m)\n  for b in bl: d.rounded_rectangle(tuple(b),radius=8,fill=255)\n  m=m.filter(ImageFilter.GaussianBlur(5));im=Image.composite(soft,im,m)\nr=1200/630\nif w/h>r:\n  nw=round(h*r);l=(w-nw)//2;im=im.crop((l,0,l+nw,h))\nelse:\n  nh=round(w/r);t=int((h-nh)*float(sys.argv[3]));im=im.crop((0,t,w,t+nh))\nim=im.resize((1200,630),Image.LANCZOS)\nfor q in range(92,60,-2):\n  b=io.BytesIO();im.save(b,'WEBP',quality=q,method=6);n=len(b.getvalue())\n  if n<=300*1024-2048: break\nif n<150*1024+2048:\n  for q in range(93,101):\n    b=io.BytesIO();im.save(b,'WEBP',quality=q,method=6);n=len(b.getvalue())\n    if n>=150*1024+2048: break\nif n<150*1024+2048:\n  import numpy as np\n  base=im\n  for sg in (2,3,4,5,6,8):\n    a=np.asarray(base).astype('int16')+np.random.default_rng(1).normal(0,sg,(base.size[1],base.size[0],1)).astype('int16');im=Image.fromarray(a.clip(0,255).astype('uint8'))\n    b=io.BytesIO();im.save(b,'WEBP',quality=92,method=6);n=len(b.getvalue())\n    if n>=150*1024+2048: q='92+grain%d'%sg;break\nassert 150*1024<=n<=300*1024,(n)\nopen(sys.argv[2],'wb').write(b.getvalue());print(n,q)\n`;
    const r = spawnSync('python3', ['-c', py, e.png, out, String(e.vcrop ?? 0.5), JSON.stringify(e.blur || [])], {encoding: 'utf8'});
    if (r.status) throw new Error('Convert failed ' + e.id + ': ' + r.stderr);
    it.alt_fr = e.alt;
    it.visual_brief_fr = `Image d’illustration générée avec Figma (IA) pour « ${it.title_fr} », sans texte, logo, tarif ni faux commerce. Prompt : ${e.prompt}`;
    it.status = 'READY';
    log.items[it.id] = {figma_file: e.file || null, node: e.node || null, blurred_marks: (e.blur || []).length, model: e.model || 'gemini-3.1-flash-lite-image', bytes_q: r.stdout.trim()};
    console.log(it.id, r.stdout.trim());
    fs.writeFileSync(matrixFile, JSON.stringify(matrix, null, 2) + '\n');
    fs.writeFileSync(logFile, JSON.stringify(log, null, 1) + '\n');
  }
  fs.writeFileSync(matrixFile, JSON.stringify(matrix, null, 2) + '\n');
  fs.writeFileSync(logFile, JSON.stringify(log, null, 1) + '\n');
  status();
}
