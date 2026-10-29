#!/usr/bin/env python3
"""Create the 800px responsive derivative of every integrated SEO image (task G20).

Usage: python3 tools/image_variants.py [--check]

For each item of data/image-seo-matrix.json, writes <asset>-800.webp next to the 1200x630 master
(800x420, WebP q80, Lanczos). The master stays the canonical/og image within the existing
150–300 KiB policy; the derivative only serves smaller screens through srcset. No noise is added.
--check verifies every derivative exists, is a 800x420 WebP and is newer than its master.
"""
import json
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
WIDTH, HEIGHT, QUALITY = 800, 420, 80


def variant_path(asset):
    p = ROOT / asset
    return p.with_name(p.stem + '-800.webp')


def main(argv):
    items = json.loads((ROOT / 'data/image-seo-matrix.json').read_text())['items']
    check = bool(argv and argv[0] == '--check')
    made, problems, total = 0, [], 0
    for item in items:
        src, dst = ROOT / item['asset_path'], variant_path(item['asset_path'])
        if check:
            if not dst.is_file() or dst.stat().st_mtime < src.stat().st_mtime:
                problems.append(f'missing/stale {dst.relative_to(ROOT)}')
                continue
            with Image.open(dst) as im:
                if im.format != 'WEBP' or im.size != (WIDTH, HEIGHT):
                    problems.append(f'bad derivative {dst.relative_to(ROOT)}')
            total += dst.stat().st_size
            continue
        if dst.is_file() and dst.stat().st_mtime >= src.stat().st_mtime:
            total += dst.stat().st_size
            continue
        with Image.open(src) as im:
            im.convert('RGB').resize((WIDTH, HEIGHT), Image.LANCZOS).save(dst, 'WEBP', quality=QUALITY, method=6)
        made += 1
        total += dst.stat().st_size
    print(json.dumps({'items': len(items), 'created': made, 'problems': problems[:20], 'total_kib': round(total / 1024)}))
    return 1 if problems else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
