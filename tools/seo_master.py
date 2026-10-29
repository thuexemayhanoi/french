#!/usr/bin/env python3
"""Repository-only SEO inventory and resumable work ledger; never claims rankings.

Run from the repo root: python3 tools/seo_master.py refresh|check|status|next [N]
Progress lives in data/seo-master-matrix.json; CSV/report are derived exports.
"""
import argparse
import collections
import csv
import hashlib
import html
from html.parser import HTMLParser
import io
import json
from pathlib import Path
import re
import subprocess
import sys
from urllib.parse import unquote, urljoin, urlsplit

ROOT = Path(__file__).resolve().parents[1]
MATRIX = ROOT / 'data/seo-master-matrix.json'
POLICY = ROOT / 'data/seo-master-policy.json'
DOMAIN = 'https://fr.rentbikehanoi.com'
STATES = {'TODO', 'IN_PROGRESS', 'DONE', 'BLOCKED_TOOL', 'DEFERRED_OWNER', 'NOT_APPLICABLE'}
EXCLUDED = {'.git', '_site', '_factory', 'site', 'node_modules', '__pycache__'}


def read(path):
    return json.loads((ROOT / path).read_text())


def save(path, value):
    (ROOT / path).write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


def clean(value):
    return re.sub(r'\s+', ' ', html.unescape(value)).strip()


def route(path):
    return '/' if path == 'index.html' else '/' + path.removesuffix('index.html')


class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.stack, self.main, self.titles, self.h1s, self.paragraphs = [], [], [], [], []
        self.headings, self.links, self.images, self.schema, self.ids = [], [], [], [], set()
        self.meta, self.canonical, self.lang, self.body = {}, '', '', {}
        self.buffer = None
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if a.get('id'):
            self.ids.add(a['id'])
        if tag == 'html':
            self.lang = a.get('lang', '')
        if tag == 'body':
            self.body = a
        if tag == 'meta':
            self.meta[a.get('name', a.get('property', '')).lower()] = a.get('content', '')
        if tag == 'link' and 'canonical' in a.get('rel', '').split():
            self.canonical = a.get('href', '')
        if tag == 'a' and 'main' in self.stack:
            self.links.append(a.get('href', ''))
        if tag == 'img' and 'main' in self.stack:
            self.images.append(a)
        if tag == 'script' and a.get('type') == 'application/ld+json':
            self.buffer = []
        if tag not in {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}:
            self.stack.append(tag)
        if tag == 'title':
            self.titles.append([])
        if tag == 'h1':
            self.h1s.append([])
        if tag in {'h2', 'h3'} and 'main' in self.stack:
            self.headings.append({'tag': tag, 'text': []})
        if tag == 'p' and 'main' in self.stack:
            self.paragraphs.append([])

    def handle_endtag(self, tag):
        if tag == 'script' and self.buffer is not None:
            try:
                self.schema.append(json.loads(''.join(self.buffer)))
            except json.JSONDecodeError:
                self.schema.append({'parse_error': True})
            self.buffer = None
        if tag in self.stack:
            self.stack = self.stack[:len(self.stack) - 1 - self.stack[::-1].index(tag)]

    def handle_data(self, text):
        if self.buffer is not None and 'script' in self.stack:
            self.buffer.append(text)
        if 'script' in self.stack or 'style' in self.stack:
            return
        if 'title' in self.stack and self.titles:
            self.titles[-1].append(text)
        if 'h1' in self.stack and self.h1s:
            self.h1s[-1].append(text)
        if 'main' in self.stack and 'nav' not in self.stack:
            self.main.append(text)
            if 'p' in self.stack and self.paragraphs:
                self.paragraphs[-1].append(text)
            if self.headings and self.headings[-1]['tag'] in self.stack:
                self.headings[-1]['text'].append(text)


def schema_types(value):
    result = set()
    if isinstance(value, dict):
        typ = value.get('@type', [])
        result.update([typ] if isinstance(typ, str) else typ)
        for val in value.values():
            result.update(schema_types(val))
    elif isinstance(value, list):
        for val in value:
            result.update(schema_types(val))
    return result


def source_pages():
    return sorted(p for p in ROOT.rglob('*.html') if not any(x in EXCLUDED for x in p.relative_to(ROOT).parts))


def ledger_statuses(policy):
    return {key: {'status': 'TODO', 'evidence': ''} for key in policy['page_dimensions']}


def snapshot():
    policy = read('data/seo-master-policy.json')
    old = read('data/seo-master-matrix.json') if MATRIX.exists() else {}
    previous = {x['path']: x for x in old.get('pages', [])}
    foundations = {x['path']: x for x in read('data/seo-cluster-matrix.json')['pages']}
    with (ROOT / 'data/content-matrix.csv').open(newline='') as fh:
        articles = {x['path']: x for x in csv.DictReader(fh) if x['path']}
    image_data = read('data/image-seo-matrix.json')
    image_by_page = collections.defaultdict(list)
    for image in image_data['items']:
        image_by_page[image['page_path']].append(image)
    figma = read('data/image-seo-figma-log.json')['items']
    parsed, paragraphs = {}, collections.defaultdict(set)
    for path in source_pages():
        rel = path.relative_to(ROOT).as_posix()
        source = path.read_text()
        page = Page(source)
        parsed[rel] = (page, source)
        if page.body.get('data-page-type') == 'redirect':
            continue
        for chunks in page.paragraphs:
            para = clean(' '.join(chunks))
            if len(para.split()) >= 25:
                paragraphs[para.casefold()].add(rel)
    repeated = {p: paths for p, paths in paragraphs.items() if len(paths) >= 5}
    incoming, broken = collections.defaultdict(set), collections.defaultdict(list)
    for rel, (page, _) in parsed.items():
        for href in page.links:
            if not href or href.startswith(('tel:', 'mailto:', 'javascript:', 'data:')):
                continue
            dest = urlsplit(urljoin(DOMAIN + route(rel), href))
            if dest.netloc != urlsplit(DOMAIN).netloc:
                continue
            target = unquote(dest.path).lstrip('/') or 'index.html'
            if target.endswith('/'):
                target += 'index.html'
            elif not Path(target).suffix:
                target += '/index.html'
            found = (ROOT / target).is_file()
            if not found:
                broken[rel].append(href)
            elif target in parsed and target != rel:
                incoming[target].add(rel)
            if found and dest.fragment and target in parsed and unquote(dest.fragment) not in parsed[target][0].ids:
                broken[rel].append(href + ' [missing fragment]')
    pages, redirects = [], []
    for rel, (page, source) in parsed.items():
        url = DOMAIN + route(rel)
        if page.body.get('data-page-type') == 'redirect':
            redirects.append({'path': rel, 'url': url, 'canonical_target': page.canonical,
                              'robots': page.meta.get('robots', ''), 'status': 'PRESERVE_REDIRECT'})
            continue
        fnd, article = foundations.get(route(rel), {}), articles.get(rel, {})
        old_row = previous.get(rel, {})
        kind = 'ARTICLE' if article else ('HOME' if rel == 'index.html' else 'FOUNDATION')
        title = clean(' '.join(page.titles[0])) if page.titles else ''
        h1 = clean(' '.join(page.h1s[0])) if page.h1s else ''
        words = len(clean(' '.join(page.main)).split())
        repeated_hits = [clean(' '.join(p)).casefold() for p in page.paragraphs if clean(' '.join(p)).casefold() in repeated]
        source_hash = hashlib.sha256(source.encode()).hexdigest()
        flags = []
        if re.search(r'Nguy[eễ]n\s*T[uú]|0942[ .]?467[ .]?674|84942467674|112\s+(?:Nguy|Nguyễ)|21:30', source, re.I):
            flags.append('LEGACY_BUSINESS_FACTS')
        if re.search(r'4[ .\u00a0]?000[ .\u00a0]?000|800[ .\u00a0]?000|passeport comme alternative', source, re.I):
            flags.append('UNCONFIRMED_POLICY_OR_PRICE_CONTEXT')
        if repeated_hits:
            flags.append('REPEATED_EDITORIAL_PARAGRAPHS')
        if re.search(r'cannibalisation|articles futurs|futurs articles|matrix|intention de recherche|page de hub', clean(' '.join(page.main)), re.I):
            flags.append('SEO_PROCESS_LANGUAGE_IN_READER_COPY')
        if page.canonical != url:
            flags.append('CANONICAL_MISMATCH')
        if not title or not page.meta.get('description') or len(page.h1s) != 1:
            flags.append('HEAD_OR_H1_ISSUE')
        if page.lang != 'fr':
            flags.append('LANGUAGE_TAG_REVIEW')
        if broken[rel]:
            flags.append('BROKEN_BODY_LINK_OR_FRAGMENT')
        if not incoming[rel] and rel != 'index.html':
            flags.append('NO_SOURCE_BODY_INLINK')
        if words < 1000 and rel not in {'contact/index.html', 'confidentialite/index.html', 'conditions/index.html', 'a-propos/index.html'}:
            flags.append('SHORT_CONTENT_INTENT_REVIEW')
        priority = 'P0' if rel in {'index.html', 'location-moto-hanoi/index.html', 'prix-location/index.html', 'contact/index.html', 'conditions/index.html', 'confidentialite/index.html', 'faq/index.html'} else fnd.get('priority', article.get('priority', 'P1'))
        if set(flags) & {'CANONICAL_MISMATCH', 'HEAD_OR_H1_ISSUE', 'LEGACY_BUSINESS_FACTS', 'UNCONFIRMED_POLICY_OR_PRICE_CONTEXT'}:
            priority = 'P0'
        checks = old_row.get('checks', ledger_statuses(policy))
        if old_row.get('baseline', {}).get('source_sha256') not in {None, source_hash}:
            for check in checks.values():
                if check['status'] == 'DONE':
                    check.update(status='TODO', evidence='', reopen_reason='Page source changed after verification')
        rendered = ROOT / '_site' / rel
        rendered_page = Page(rendered.read_text()) if rendered.exists() else None
        row = {
            'id': old_row.get('id', fnd.get('id') or article.get('id') or 'PAGE-' + hashlib.sha256(rel.encode()).hexdigest()[:8]),
            'path': rel, 'url': url, 'page_type': kind,
            'role': policy['route_overrides'].get(route(rel), {}).get('role', fnd.get('role', 'SUPPORTING_ARTICLE' if article else 'FOUNDATION')),
            'cluster': fnd.get('cluster', article.get('silo_id', rel.split('/')[0])),
            'parent_hub': article.get('parent_hub_path') or policy['route_overrides'].get(route(rel), {}).get('parent_hub') or (fnd.get('breadcrumbs', [{}])[-2].get('url', '/') if len(fnd.get('breadcrumbs', [])) > 1 else '/'),
            'priority': priority,
            'keyword_seed_fr': policy['route_overrides'].get(route(rel), {}).get('keyword_seed_fr') or fnd.get('primary_keyword') or fnd.get('primary_keyword_fr') or h1,
            'keyword_evidence': 'Editorial candidate from existing French page / owner scope; not search-volume or ranking data',
            'intent_to_validate': policy['route_overrides'].get(route(rel), {}).get('intent') or fnd.get('intent') or article.get('intent_vi', 'Review actual French intent'),
            'content_depth_policy': ('CONTACT_NO_WORD_TARGET' if rel == 'contact/index.html' else 'LEGAL_ACTUAL_PRACTICES_NO_WORD_TARGET' if rel in {'conditions/index.html', 'confidentialite/index.html'} else 'ABOUT_800_1600_VERIFIED_WORDS' if rel == 'a-propos/index.html' else 'ARTICLE_1000_5000_USEFUL_WORDS' if article else 'HUB_HOME_1600_6000_IF_USEFUL'),
            'baseline': {
                'source_sha256': source_hash, 'title': title, 'title_chars': len(title),
                'description': page.meta.get('description', ''), 'description_chars': len(page.meta.get('description', '')),
                'h1': h1, 'h1_count': len(page.h1s), 'canonical': page.canonical,
                'editorial_word_count_estimate': words, 'h2_h3': [clean(' '.join(x['text'])) for x in page.headings],
                'source_body_internal_inlinks': len(incoming[rel]),
                'source_body_internal_inlink_examples': sorted(incoming[rel])[:3],
                'broken_body_links_or_fragments': sorted(set(broken[rel])),
                'repeated_paragraph_count': len(repeated_hits),
                'repeated_paragraph_examples': [x[:180] for x in repeated_hits[:2]],
                'source_schema_types': sorted(schema_types(page.schema)),
                'built_schema_types': sorted(schema_types(rendered_page.schema)) if rendered_page else None,
                'images_planned': len(image_by_page[rel]),
                'figma_photo_assets': sum(x['id'] in figma for x in image_by_page[rel]),
                'image_paths': [x['asset_path'] for x in image_by_page[rel]],
                'live_http_indexing_rank_cwv': 'NOT_MEASURED',
            },
            'findings': flags,
            'next_action': '; '.join(flags) if flags else 'Review intent, French usefulness, factual accuracy and every dimension; a clean mechanical audit is not completion',
            'checks': checks,
            'notes': old_row.get('notes', ''),
        }
        pages.append(row)
    result = {
        'schema_version': 1, 'project': 'French site SEO + AEO + GEO, existing URLs only',
        'domain': DOMAIN, 'created_at': old.get('created_at', '2026-10-29'),
        'initial_source_commit': old.get('initial_source_commit', subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT, text=True).strip()),
        'authority': 'AGENTS.md > docs/SEO-MASTER-PLAN.md > this ledger; owner-provided facts override older repository facts',
        'measurement_scope': 'Local source and built HTML audit only. Live HTTP, Google indexing/rankings, CWV and account data not inferred.',
        'policy_file': 'data/seo-master-policy.json',
        'expected_inventory': {'indexable_pages': 543, 'articles': 500, 'foundation_including_home': 43, 'redirects': 4, 'image_assets': 547},
        'global_tasks': old.get('global_tasks', policy['global_tasks']),
        'pages': pages, 'redirects': redirects,
        'duplicate_paragraph_groups': [{'pages': len(paths), 'example': para[:240], 'example_paths': sorted(paths)[:3]}
                                      for para, paths in sorted(repeated.items(), key=lambda x: (-len(x[1]), x[0]))[:20]],
    }
    return result


def summary(matrix):
    page_states = collections.Counter(c['status'] for p in matrix['pages'] for c in p['checks'].values())
    globals_ = collections.Counter(t['status'] for t in matrix['global_tasks'])
    return {'urls': len(matrix['pages']), 'articles': sum(p['page_type'] == 'ARTICLE' for p in matrix['pages']),
            'redirects': len(matrix['redirects']), 'page_checkpoints': dict(page_states), 'global_tasks': dict(globals_),
            'image_assets': sum(p['baseline']['images_planned'] for p in matrix['pages']),
            'figma_photo_assets': sum(p['baseline']['figma_photo_assets'] for p in matrix['pages']),
            'finding_pages': dict(collections.Counter(f for p in matrix['pages'] for f in p['findings']))}


def csv_export(matrix):
    policy = read('data/seo-master-policy.json')
    columns = ['id', 'priority', 'page_type', 'role', 'cluster', 'url', 'path', 'parent_hub', 'keyword_seed_fr', 'intent_to_validate',
               'title', 'title_chars', 'description_chars', 'editorial_word_count_estimate', 'source_body_internal_inlinks',
               'findings', 'next_action', *policy['page_dimensions'], 'notes']
    fh = io.StringIO(newline='')
    writer = csv.DictWriter(fh, fieldnames=columns, lineterminator='\n')
    writer.writeheader()
    for page in matrix['pages']:
        row = {k: page.get(k, page['baseline'].get(k, '')) for k in columns}
        row['findings'] = ';'.join(page['findings'])
        row.update({k: v['status'] for k, v in page['checks'].items()})
        writer.writerow(row)
    return fh.getvalue()


def progress_export(matrix):
    s = summary(matrix)
    lines = ['# French SEO master progress', '', 'Inventory snapshot: 2026-10-29. Progress is derived from the committed JSON ledger.', '',
             'This is a work plan, not a claim that SEO implementation is complete.', '',
             f"- Existing indexable URLs: **{s['urls']}** (500 articles + 43 foundation URLs including homepage).",
             f"- Protected legacy redirects: **{s['redirects']}**.",
             f"- Image inventory: **{s['image_assets']}** mapped assets; **{s['figma_photo_assets']}** Figma upgrades and **{s['image_assets'] - s['figma_photo_assets']}** other retained assets (from the current component log; actual bytes/integration need image checks).",
             '- Source of truth: `data/seo-master-matrix.json`; CSV is a regenerated view, never a competing ledger.', '',
             '## Work states', '', '| Scope | Status | Count |', '| --- | --- | ---: |']
    for name, states in [('URL checkpoints', s['page_checkpoints']), ('Sitewide tasks', s['global_tasks'])]:
        for state, count in sorted(states.items()):
            lines.append(f'| {name} | {state} | {count} |')
    lines += ['', '## Findings to investigate and repair', '', '| Source audit signal | URLs |', '| --- | ---: |']
    lines += [f'| {key} | {value} |' for key, value in sorted(s['finding_pages'].items())]
    lines += ['', 'Signals are not verdicts: repeated paragraphs need editorial review; zero source-body inlinks does not prove a page is unreachable through built navigation.',
              'Title/meta lengths are editorial diagnostics, not Google limits. Source word counts are estimates and exclude navigation.', '',
              '## Resume', '', 'Read `AGENTS.md`, `docs/SEO-MASTER-PLAN.md` and the ledger, then run:', '',
              '```bash', 'python3 tools/seo_master.py status', 'python3 tools/seo_master.py next 20', '```', '',
              'After actual changes, evidence and validation: refresh, export, check, commit and push. Keep owner verification at the end in `docs/SEO-OWNER-VERIFY-LAST.md`.',
              'Live crawl/indexing, rankings, field CWV, GSC/GA4/GBP and quota recovery remain unmeasured until actual tools provide evidence.', '']
    return '\n'.join(lines)


def exports(matrix):
    with (ROOT / 'data/seo-master-matrix.csv').open('w', newline='', encoding='utf-8-sig') as fh:
        fh.write(csv_export(matrix))
    (ROOT / 'docs/SEO-PROGRESS.md').write_text(progress_export(matrix))


def validate(matrix):
    policy = read('data/seo-master-policy.json')
    errors = []
    paths = [p['path'] for p in matrix['pages']]
    if len(paths) != len(set(paths)) or len(paths) != 543:
        errors.append('Expected 543 unique indexable page paths')
    if sum(p['page_type'] == 'ARTICLE' for p in matrix['pages']) != 500 or len(matrix['redirects']) != 4:
        errors.append('Article / redirect inventory changed: reconcile explicitly')
    live_paths = {p.relative_to(ROOT).as_posix() for p in source_pages() if Page(p.read_text()).body.get('data-page-type') != 'redirect'}
    if set(paths) != live_paths:
        errors.append('Ledger does not cover exactly the current source URLs; run refresh')
    ids = [p['id'] for p in matrix['pages']] + [t['id'] for t in matrix['global_tasks']]
    if len(ids) != len(set(ids)):
        errors.append('Duplicate IDs')
    if {t['id'] for t in matrix['global_tasks']} != {t['id'] for t in policy['global_tasks']}:
        errors.append('Sitewide task catalog/ledger mismatch')
    for p in matrix['pages']:
        if p['url'] != DOMAIN + route(p['path']):
            errors.append(p['id'] + ': incorrect protected URL')
        if set(p['checks']) != set(policy['page_dimensions']):
            errors.append(p['id'] + ': dimensions missing or unknown')
        for dim, check in p['checks'].items():
            if check['status'] not in STATES:
                errors.append(p['id'] + ': unknown state ' + dim)
            if check['status'] in {'DONE', 'NOT_APPLICABLE', 'DEFERRED_OWNER', 'BLOCKED_TOOL'} and not check.get('evidence', '').strip():
                errors.append(p['id'] + ': evidence / reason required for ' + dim)
        if p['baseline']['source_sha256'] != hashlib.sha256((ROOT / p['path']).read_bytes()).hexdigest():
            errors.append(p['id'] + ': source snapshot stale; run refresh')
    for t in matrix['global_tasks']:
        if t['status'] not in STATES:
            errors.append(t['id'] + ': unknown state')
        if t['status'] in {'DONE', 'NOT_APPLICABLE', 'DEFERRED_OWNER', 'BLOCKED_TOOL'} and not t.get('evidence', '').strip():
            errors.append(t['id'] + ': evidence / reason required')
    csv_path = ROOT / 'data/seo-master-matrix.csv'
    if not csv_path.exists() or csv_path.read_bytes().decode('utf-8-sig') != csv_export(matrix):
        errors.append('CSV export stale; run export')
    report = ROOT / 'docs/SEO-PROGRESS.md'
    if not report.exists() or report.read_text() != progress_export(matrix):
        errors.append('Progress report stale; run export')
    print(json.dumps({'errors': errors, **summary(matrix)}, ensure_ascii=False, indent=2))
    return bool(errors)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('command', choices=['refresh', 'export', 'check', 'status', 'next'])
    parser.add_argument('limit', type=int, nargs='?', default=20)
    args = parser.parse_args()
    if args.command == 'refresh':
        matrix = snapshot()
        save('data/seo-master-matrix.json', matrix)
        exports(matrix)
    else:
        matrix = read('data/seo-master-matrix.json')
    if args.command == 'check':
        return validate(matrix)
    if args.command == 'export':
        exports(matrix)
    if args.command in {'status', 'refresh', 'export'}:
        print(json.dumps(summary(matrix), ensure_ascii=False, indent=2))
    if args.command == 'next':
        active = {'TODO', 'IN_PROGRESS'}
        tasks = [dict(scope='GLOBAL', **t) for t in sorted(matrix['global_tasks'], key=lambda t: (t['phase'], t['priority'], t['id'])) if t['status'] in active]
        tasks += [{'scope': 'URL', 'id': p['id'], 'priority': p['priority'], 'url': p['url'], 'path': p['path'],
                   'findings': p['findings'], 'dimensions': [k for k, v in p['checks'].items() if v['status'] in active]}
                  for p in sorted(matrix['pages'], key=lambda p: (p['priority'], p['page_type'] != 'HOME', p['path'])) if any(c['status'] in active for c in p['checks'].values())]
        print(json.dumps(tasks[:max(1, args.limit)], ensure_ascii=False, indent=2))
    return 0


if __name__ == '__main__':
    sys.exit(main())
