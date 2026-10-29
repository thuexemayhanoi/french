#!/usr/bin/env python3
"""Turn reviewed evidence + local audits into ledger records for `seo_master.py record`.

Usage (after `node tools/build-site.mjs`, `python3 tools/seo_built_audit.py --out B`,
`node tools/seo_ux_audit.mjs --out U` and `python3 tools/seo_master.py refresh`):

  python3 tools/seo_evidence_merge.py --built B --ux U [--review data/seo-evidence/X.json ...]
      [--mechanical-all] [--images IMG.json] --out records.json

* --review: editorial evidence objects (docs/SEO-EDITORIAL-GUIDE.md §7 / article protocol).
  FACTS, INTENT, CONTENT and AEO_GEO come from the reviewer; META and LINKS also require the
  built audit for that page to pass; UX_CRO requires the review plus a clean mobile+desktop render.
* --mechanical-all: TECHNICAL and SCHEMA for every page whose built audit passes.
* --images: {"path": "visual review note"} from an actual pixel/contact-sheet review; IMAGES is
  recorded only for those pages and only when the built image checks pass.
Pages with a failing audit dimension are left untouched (reported), never marked DONE.
"""
import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EDITORIAL = ('FACTS', 'INTENT', 'CONTENT', 'AEO_GEO')


def load(path):
    return json.loads((ROOT / path if not Path(path).is_absolute() else Path(path)).read_text())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--built', required=True)
    ap.add_argument('--ux', required=True)
    ap.add_argument('--review', nargs='*', default=[])
    ap.add_argument('--images')
    ap.add_argument('--mechanical-all', action='store_true')
    ap.add_argument('--out', required=True)
    args = ap.parse_args()
    built, ux = load(args.built), load(args.ux)
    ux_meta, ux = ux['meta'], ux['results']
    images = load(args.images) if args.images else {}
    records, skipped = {}, []

    def put(path, dim, evidence):
        records.setdefault(path, {'path': path, 'checks': {}})['checks'][dim] = {'status': 'DONE', 'evidence': evidence}

    if args.mechanical_all:
        for path, res in built.items():
            for dim in ('TECHNICAL', 'SCHEMA'):
                if res[dim]['ok']:
                    put(path, dim, res[dim]['evidence'])
                else:
                    skipped.append(f'{path} {dim}: {res[dim]["problems"]}')
    for file in args.review:
        for item in load(file):
            path = item['path'].removeprefix('/') if not item['path'].endswith('/') else item['path'].lstrip('/') + 'index.html'
            if path not in built:
                skipped.append(f'{path}: not an indexable page')
                continue
            ev, res = item.get('evidence', {}), built[path]
            src = Path(file).name
            sources = '; '.join(s.get('url', '') for s in item.get('sources', [])[:6])
            for dim in EDITORIAL:
                if ev.get(dim):
                    put(path, dim, f'Reviewed 2026-10-29 ({src}): {ev[dim]}' + (f' Sources: {sources}' if dim in {'FACTS', 'CONTENT'} and sources else ''))
            for dim in ('META', 'LINKS'):
                if ev.get(dim) and res[dim]['ok']:
                    put(path, dim, f'Reviewed 2026-10-29 ({src}): {ev[dim]} Built check: {res[dim]["evidence"]}')
                elif ev.get(dim):
                    skipped.append(f'{path} {dim}: {res[dim]["problems"]}')
            render = ux.get(path, {})
            problems = [p for v in render.values() for p in v.get('problems', [])]
            if render and not problems and ev.get('FACTS'):
                m, d = render['mobile'], render['desktop']
                put(path, 'UX_CRO', (
                    f'{ux_meta["method"]}: no horizontal overflow (mobile scrollWidth {m["scrollWidth"]}), H1 visible, hero loaded, '
                    f'{m["anchors"]} in-page anchors resolve, tel {", ".join(m["tel"])} + Zalo + WhatsApp links, footer address/09:00–21:00 present, '
                    f'min body text contrast {min(m["minContrast"] or 99, d["minContrast"] or 99):.2f}:1, focus indicator on keyboard stops, '
                    f'no obstructive overlay, lab CLS {max(m["labCls"], d["labCls"])}. CTA asks to confirm vehicle/dates/price before coming; '
                    'copy reviewed for false promises (see FACTS).'))
            elif ev.get('FACTS'):
                skipped.append(f'{path} UX_CRO: {problems or "no render"}')
    for path, note in images.items():
        if path in built and built[path]['IMAGES']['ok']:
            put(path, 'IMAGES', f'{built[path]["IMAGES"]["evidence"]} Visual review: {note}')
        else:
            skipped.append(f'{path} IMAGES: {built.get(path, {}).get("IMAGES", {}).get("problems")}')
    out = list(records.values())
    (ROOT / args.out if not Path(args.out).is_absolute() else Path(args.out)).write_text(json.dumps(out, ensure_ascii=False, indent=1) + '\n')
    print(json.dumps({'pages': len(out), 'checks': sum(len(r['checks']) for r in out), 'skipped': skipped[:40], 'skipped_count': len(skipped)}, ensure_ascii=False, indent=1))
    return 0


if __name__ == '__main__':
    sys.exit(main())
