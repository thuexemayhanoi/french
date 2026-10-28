#!/usr/bin/env node
// Produce the next pending SEO images: plan → render (local Chromium canvas) → real WebP at asset_path
// → alt_fr from the drawn scene → status READY. Never touches rows that already have a valid image.
// Usage: node tools/seo-art/produce.mjs [count=20] [--sheet <png>] [--force <id,...>]
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {openEngine, MIN_BYTES, MAX_BYTES} from './engine.mjs';
import {planItem} from './plan.mjs';

const root = process.cwd();
const matrixFile = path.join(root, 'data/image-seo-matrix.json');
const matrix = JSON.parse(fs.readFileSync(matrixFile, 'utf8'));
const args = process.argv.slice(2);
const count = Number(args.find(a => /^\d+$/.test(a)) || 20);
const sheet = args.includes('--sheet') ? args[args.indexOf('--sheet') + 1] : null;
const force = args.includes('--force') ? args[args.indexOf('--force') + 1].split(',') : [];

function webpInfo(b) {
  if (b.toString('ascii', 0, 4) !== 'RIFF' || b.toString('ascii', 8, 12) !== 'WEBP') return null;
  const t = b.toString('ascii', 12, 16);
  if (t === 'VP8 ') return {w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff};
  if (t === 'VP8X') return {w: b.readUIntLE(24, 3) + 1, h: b.readUIntLE(27, 3) + 1};
  return null;
}
const valid = it => { const p = path.join(root, it.asset_path); if (!fs.existsSync(p)) return false; const b = fs.readFileSync(p), d = webpInfo(b); return d && d.w === 1200 && d.h === 630 && b.length >= 150 * 1024 && b.length <= 300 * 1024 && it.alt_fr && it.alt_fr.length >= 12; };
const todo = matrix.items.filter(it => force.includes(it.id) || (!valid(it) && it.status !== 'DONE')).slice(0, force.length ? force.length : count);
if (!todo.length) { console.log('Nothing to produce.'); process.exit(0); }
const usedAlts = new Set(matrix.items.filter(it => !todo.includes(it) && it.alt_fr).map(it => it.alt_fr));
const engine = await openEngine();
const made = [];
try {
  for (const it of todo) {
    let spec = planItem(it), out, alt;
    for (let k = 0; k < 4; k++) {
      out = await engine.render(spec);
      const desc = out.desc.replace(/\s+/g, ' ').replace(/ ,/g, ',').trim().replace(/\.$/, '');
      alt = 'Illustration : ' + desc.replace(/,? sans aucune inscription lisible/g, '').replace(/,? présentés de profil sans aucun logo/g, ', présentés de profil').replace(/,? présentés de profil sans logo/g, ', présentés de profil') + '.';
      if (!usedAlts.has(alt)) break;
      spec = {...planItem(it), seed: spec.seed + 7919};
    }
    const d = webpInfo(out.bytes);
    if (!d || d.w !== 1200 || d.h !== 630 || out.bytes.length < MIN_BYTES || out.bytes.length > MAX_BYTES) throw new Error('Invalid output for ' + it.id);
    const file = path.join(root, it.asset_path);
    fs.mkdirSync(path.dirname(file), {recursive: true});
    fs.writeFileSync(file, out.bytes);
    usedAlts.add(alt);
    it.alt_fr = alt;
    it.visual_brief_fr = `Illustration éditoriale originale (dessin vectoriel rendu localement, sans photo ni IA payante) pour « ${it.title_fr} » : ${out.desc.replace(/\.$/, '')}. Sans texte incrusté, logo, tarif, faux commerce ni preuve de disponibilité.`;
    it.status = 'READY';
    made.push({id: it.id, scene: spec.scene, bytes: out.bytes.length, q: Number(out.quality.toFixed(3)), file: it.asset_path, alt});
    console.log(`${it.id}\t${spec.scene}\t${out.bytes.length} B\t${alt}`);
  }
} finally { await engine.close(); }
fs.writeFileSync(matrixFile, JSON.stringify(matrix, null, 2) + '\n');
if (sheet) {
  const py = `import sys\nfrom PIL import Image\nfs=sys.argv[2:];c=3;w,h=400,210\nr=(len(fs)+c-1)//c\ns=Image.new('RGB',(w*c,h*r),'white')\nfor i,f in enumerate(fs):\n  im=Image.open(f);im.load();assert im.size==(1200,630),f\n  s.paste(im.convert('RGB').resize((w,h)),((i%c)*w,(i//c)*h))\ns.save(sys.argv[1])\n`;
  const res = spawnSync('python3', ['-c', py, sheet, ...made.map(m => path.join(root, m.file))], {stdio: 'inherit'});
  if (res.status) throw new Error('Contact sheet failed (WebP decode)');
}
console.log(JSON.stringify({produced: made.length}, null, 0));
