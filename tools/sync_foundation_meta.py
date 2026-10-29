#!/usr/bin/env python3
"""Reconcile legacy foundation matrices after a deliberate, reviewed title/meta/H1 rewrite (task G09).

Usage: python3 tools/sync_foundation_meta.py <foundation/index.html> [...]

Only the listed pages are synchronized, so an accidental edit elsewhere still fails scripts/qa.mjs.
Updates data/seo-cluster-matrix.json (seo_title, meta_description, h1) and the informational
current_words of data/seo-foundation-matrix.json. Canonical and required links are never changed here.
"""
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from seo_master import Page, clean, route  # noqa: E402

ROOT = Path(__file__).resolve().parents[1]


def main(paths):
    if not paths:
        print(__doc__)
        return 2
    cluster_file, foundation_file = ROOT / 'data/seo-cluster-matrix.json', ROOT / 'data/seo-foundation-matrix.json'
    cluster, foundation = json.loads(cluster_file.read_text()), json.loads(foundation_file.read_text())
    by_path = {p['path']: p for p in cluster['pages']}
    fnd_by_path = {p['path']: p for p in foundation['pages']}
    changes, errors = [], []
    for rel in paths:
        rel = rel.removeprefix('./')
        source = (ROOT / rel).read_text()
        page = Page(source)
        r = route(rel)
        row = by_path.get(r)
        if not row:
            errors.append(f'{rel}: not a foundation page')
            continue
        main_html = re.search(r'<main class="shell">([\s\S]*?)</main>', source).group(1)
        missing = [link for link in row.get('required_internal_links') or [] if f'href="{link}"' not in main_html]
        if missing:
            errors.append(f'{rel}: required links missing {missing}')
            continue
        new = {'seo_title': re.search(r'<title>([\s\S]*?)</title>', source).group(1).strip(),
               'meta_description': re.search(r'<meta name="description" content="([^"]*)"', source).group(1),
               'h1': re.sub(r'<[^>]+>', '', re.search(r'<h1[^>]*>([\s\S]*?)</h1>', source).group(1)).strip()}
        diff = {k: (row[k], v) for k, v in new.items() if row[k] != v}
        row.update(new)
        if r in fnd_by_path:
            words = len(clean(' '.join(page.main)).split())
            fnd_by_path[r]['current_words'] = words
            fnd_by_path[r]['status'] = 'REWRITTEN_2026_10_29'
        changes.append({'path': r, 'changed': diff})
    if errors:
        print(json.dumps({'errors': errors}, ensure_ascii=False, indent=2))
        return 1
    cluster_file.write_text(json.dumps(cluster, ensure_ascii=False, indent=2) + '\n')
    foundation_file.write_text(json.dumps(foundation, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(changes, ensure_ascii=False, indent=1))
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
