#!/usr/bin/env python3
"""Compare live fetch observations with the committed source pages (LIVE_VERIFY evidence).

Usage: python3 tools/seo_live_compare.py <live.jsonl> [--deploy "<run url> <sha>"] [--out records.json]

<live.jsonl>: one JSON object per URL collected by a real external fetcher (e.g. TinyFish
fetch_content with page_metadata): {"url", "final_url", "title", "canonical", "og_image", "h1",
"fetched_at", "tool"}. A URL is LIVE_VERIFY DONE only when the live title, canonical, primary
og:image and H1 equal the current source page; missing or different observations are reported.
This proves the deployed HTML, not Google indexing, ranking or Core Web Vitals.
"""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from seo_master import DOMAIN, Page, clean, route, source_pages  # noqa: E402

ROOT = Path(__file__).resolve().parents[1]


def main(argv):
    if not argv:
        print(__doc__)
        return 2
    deploy = argv[argv.index('--deploy') + 1] if '--deploy' in argv else 'deployment run not given'
    out = argv[argv.index('--out') + 1] if '--out' in argv else None
    live = {}
    for line in Path(argv[0]).read_text().splitlines():
        if line.strip():
            obs = json.loads(line)
            live[obs['url']] = obs
    records, problems = [], {}
    for path in source_pages():
        page = Page(path.read_text())
        if page.body.get('data-page-type') == 'redirect':
            continue
        rel = path.relative_to(ROOT).as_posix()
        url = DOMAIN + route(rel)
        obs = live.get(url)
        if not obs:
            problems[rel] = 'not fetched'
            continue
        expect = {'title': clean(' '.join(page.titles[0])), 'canonical': page.canonical,
                  'og_image': page.meta.get('og:image', ''), 'h1': clean(' '.join(page.h1s[0]))}
        diff = [k for k, v in expect.items() if clean(obs.get(k) or '') != v]
        if obs.get('final_url') and obs['final_url'] != url:
            diff.append('redirected to ' + obs['final_url'])
        if diff:
            problems[rel] = 'live differs: ' + ', '.join(diff)
            continue
        records.append({'path': rel, 'checks': {'LIVE_VERIFY': {'status': 'DONE', 'evidence': (
            f'Live fetch {obs.get("fetched_at", "")} via {obs.get("tool", "external fetcher")}: {url} served (no redirect) with title, '
            f'canonical, og:image and H1 identical to the committed source; deploy {deploy}. Live HTML only — Google indexing, '
            'ranking and field Core Web Vitals not measured (owner appendix O07).')}}})
    if out:
        Path(out).write_text(json.dumps(records, ensure_ascii=False, indent=1) + '\n')
    print(json.dumps({'verified': len(records), 'problems': len(problems), 'examples': dict(list(problems.items())[:15])}, ensure_ascii=False, indent=1))
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
