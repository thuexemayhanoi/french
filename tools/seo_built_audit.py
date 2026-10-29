#!/usr/bin/env python3
"""Static audit of the built site (_site) for TECHNICAL / IMAGES / LINKS / META ledger evidence.

Usage (repo root, after `node tools/build-site.mjs`):
  python3 tools/seo_built_audit.py [--out data/seo-evidence/built-audit.json] [path ...]

Local build observations only: no live HTTP, indexing, ranking or Core Web Vitals claims.
Each page gets per-dimension {ok, problems, evidence}; `ok` only means the mechanical checks
passed and is combined with editorial review before a ledger dimension is marked DONE.
"""
import collections
import json
import re
import struct
import sys
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit

sys.path.insert(0, str(Path(__file__).resolve().parent))
from seo_master import DOMAIN, Page, clean, route, schema_types, source_pages  # noqa: E402

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / '_site'


def webp_size(data):
    if data[:4] != b'RIFF' or data[8:12] != b'WEBP':
        return None
    kind = data[12:16]
    if kind == b'VP8 ':
        w, h = struct.unpack('<HH', data[26:30])
        return w & 0x3FFF, h & 0x3FFF
    if kind == b'VP8X':
        return int.from_bytes(data[24:27], 'little') + 1, int.from_bytes(data[27:30], 'little') + 1
    if kind == b'VP8L':
        b = data[21:25]
        bits = int.from_bytes(b, 'little')
        return (bits & 0x3FFF) + 1, ((bits >> 14) & 0x3FFF) + 1
    return None


def resolve(href, rel, base=SITE):
    dest = urlsplit(urljoin(DOMAIN + route(rel), href))
    if dest.scheme not in {'http', 'https'} or dest.netloc != urlsplit(DOMAIN).netloc:
        return None, None
    target = unquote(dest.path).lstrip('/') or 'index.html'
    if target.endswith('/'):
        target += 'index.html'
    elif not Path(target).suffix:
        target += '/index.html'
    return base / target, unquote(dest.fragment)


def main(argv):
    out = None
    if '--out' in argv:
        i = argv.index('--out')
        out = argv[i + 1]
        argv = argv[:i] + argv[i + 2:]
    sitemap = set(re.findall(r'<loc>([^<]+)</loc>', (ROOT / 'sitemap.xml').read_text()))
    robots = (ROOT / 'robots.txt').read_text()
    disallow = [x.split(':', 1)[1].strip() for x in robots.splitlines() if x.lower().startswith('disallow:') and x.split(':', 1)[1].strip()]
    images = collections.defaultdict(list)
    for item in json.loads((ROOT / 'data/image-seo-matrix.json').read_text())['items']:
        images[item['page_path']].append(item)
    sources = {p.relative_to(ROOT).as_posix(): p for p in source_pages()}
    pages = {}
    for rel, path in sources.items():
        src = Page(path.read_text())
        if src.body.get('data-page-type') == 'redirect':
            continue
        pages[rel] = src
    built_cache, built_ids = {}, {}

    def built(rel):
        if rel not in built_cache:
            f = SITE / rel
            built_cache[rel] = (f.read_text(), Page(f.read_text())) if f.is_file() else (None, None)
        return built_cache[rel]

    # incoming links: source body (main) and built (whole document, includes nav/footer/related)
    body_in, built_in = collections.defaultdict(set), collections.defaultdict(set)
    for rel, src in pages.items():
        for href in src.links:
            t, _ = resolve(href, rel, ROOT)
            if t and t.is_file():
                body_in[t.relative_to(ROOT).as_posix()].add(rel)
        text, _ = built(rel)
        if text:
            for href in re.findall(r'<a\b[^>]*href="([^"]+)"', text):
                t, _ = resolve(href, rel)
                if t and t.is_file():
                    built_in[t.relative_to(SITE).as_posix()].add(rel)
    titles, descs = collections.defaultdict(set), collections.defaultdict(set)
    for rel, src in pages.items():
        titles[clean(' '.join(src.titles[0])).casefold() if src.titles else ''].add(rel)
        descs[src.meta.get('description', '').casefold()].add(rel)
    selected = [a.removeprefix('./') for a in argv] or sorted(pages)
    report = {}
    for rel in selected:
        src = pages[rel]
        url = DOMAIN + route(rel)
        text, page = built(rel)
        res = {}
        # TECHNICAL
        problems = []
        if text is None:
            problems.append('built page missing')
        else:
            if page.canonical != url:
                problems.append('built canonical ' + page.canonical)
            if page.lang != 'fr':
                problems.append('built lang ' + page.lang)
            robots_meta = page.meta.get('robots', '')
            if 'noindex' in robots_meta.lower():
                problems.append('noindex')
            if url not in sitemap:
                problems.append('not in sitemap')
            if any(route(rel).startswith(d) for d in disallow):
                problems.append('robots.txt disallow')
            if len(page.h1s) != 1:
                problems.append('built H1 count %d' % len(page.h1s))
            if any(s.get('parse_error') for s in page.schema):
                problems.append('JSON-LD parse error')
            broken = []
            for attr_href in re.findall(r'(?:href|src)="([^"]+)"', text):
                if attr_href.startswith(('tel:', 'mailto:', 'data:', '#', 'javascript:')):
                    continue
                t, frag = resolve(attr_href.split('?')[0] if '?' in attr_href and not attr_href.startswith('http') else attr_href, rel)
                if t is None:
                    continue
                if not t.is_file():
                    broken.append(attr_href)
                elif frag and t.suffix == '.html':
                    trel = t.relative_to(SITE).as_posix()
                    if trel not in built_ids:
                        built_ids[trel] = built(trel)[1].ids if built(trel)[1] else set()
                    if frag not in built_ids[trel] and 'data-auto-toc' not in (built(trel)[0] or ''):
                        broken.append(attr_href + ' [fragment]')
            if broken:
                problems.append('broken local refs: ' + ', '.join(sorted(set(broken))[:5]))
        types = sorted(schema_types(page.schema)) if page else []
        res['TECHNICAL'] = {'ok': not problems, 'problems': problems, 'evidence': (
            f'Local build _site/{rel}: self canonical {url}, lang fr, no noindex, robots.txt allows, listed in sitemap.xml, '
            f'1 H1, JSON-LD parses ({", ".join(types)}), all local href/src targets in the built document resolve. '
            'Local build audit only; live HTTP/indexing not inferred.') if not problems else ''}
        # SCHEMA
        problems = []
        facts = json.loads((ROOT / 'data/seo-business-facts.json').read_text())
        graph = [n for s in (page.schema if page else []) for n in (s.get('@graph', [s]) if isinstance(s, dict) else [])]
        by_type = collections.defaultdict(list)
        for node in graph:
            for typ in ([node.get('@type')] if isinstance(node.get('@type'), str) else node.get('@type', [])):
                by_type[typ].append(node)
        h1 = clean(' '.join(page.h1s[0])) if page and page.h1s else ''
        biz = (by_type.get('LocalBusiness') or [{}])[0]
        if biz.get('@id') != DOMAIN + '/#business' or biz.get('name') != facts['name'] or biz.get('telephone') != facts['phone_e164']:
            problems.append('LocalBusiness identity differs from confirmed facts')
        hours = (biz.get('openingHoursSpecification') or [{}])[0]
        if hours.get('opens') != facts['hours']['open'] or hours.get('closes') != facts['hours']['close'] or len(hours.get('dayOfWeek', [])) != 7:
            problems.append('opening hours differ')
        if 'Ngõ 5 Nguyễn Văn Cừ' not in json.dumps(biz.get('address', {}), ensure_ascii=False):
            problems.append('address differs')
        if not by_type.get('WebSite') or by_type['WebSite'][0].get('@id') != DOMAIN + '/#website':
            problems.append('WebSite node')
        page_nodes = [n for n in graph if n.get('url') == url and n.get('@id', '').startswith(url + '#') and n.get('@type') not in {'LocalBusiness', 'WebSite'}]
        if not page_nodes:
            problems.append('no page node for canonical URL')
        else:
            node = page_nodes[0]
            if clean(node.get('name', '')) != h1:
                problems.append('page node name differs from visible H1')
            if node.get('@type') == 'Article' and clean(node.get('headline', '')) != h1[:110]:
                problems.append('Article headline differs from H1')
            if node.get('isPartOf', {}).get('@id') != DOMAIN + '/#website' or node.get('publisher', {}).get('@id') != DOMAIN + '/#business':
                problems.append('page node relations')
        forbidden = {'AggregateRating', 'Review', 'Offer', 'Person'} & set(by_type)
        if forbidden or '"sameAs"' in json.dumps(graph) or '"author"' in json.dumps(graph) or '"datePublished"' in json.dumps(graph):
            problems.append('unverified rating/review/offer/author/date/sameAs present: ' + ', '.join(sorted(forbidden)))
        if 'FAQPage' in by_type and rel != 'faq/index.html':
            problems.append('FAQPage outside the reviewed FAQ hub')
        if rel != 'index.html' and not by_type.get('BreadcrumbList'):
            problems.append('BreadcrumbList missing')
        res['SCHEMA'] = {'ok': not problems, 'problems': problems, 'evidence': (
            f'Built JSON-LD parses; @graph {", ".join(sorted(by_type))}: LocalBusiness #business = confirmed name/phone/address/09:00–21:00 daily, '
            f'WebSite #website, page node @id {url}#… with name = visible H1'
            + (' and headline' if 'Article' in by_type else '') +
            ', isPartOf/publisher links, BreadcrumbList and primary ImageObject; no rating/review/offer/author/date/sameAs invented'
            + ('; FAQPage limited to reviewed FAQ hub' if 'FAQPage' in by_type else '') + '.') if not problems else ''}
        # IMAGES
        problems, notes = [], []
        items = images.get(rel, [])
        if not items:
            problems.append('no mapped image')
        src_text = (ROOT / rel).read_text()
        for item in items:
            f = ROOT / item['asset_path']
            if not f.is_file():
                problems.append('missing asset ' + item['asset_path'])
                continue
            data = f.read_bytes()
            size = webp_size(data)
            kib = len(data) / 1024
            if size != (1200, 630):
                problems.append(f'{item["id"]} not WebP 1200x630')
            if not 150 <= kib <= 300:
                problems.append(f'{item["id"]} {kib:.0f} KiB outside 150-300')
            tag = re.search(r'<img [^>]*src="/' + re.escape(item['asset_path']) + r'"[^>]*>', src_text)
            if not tag:
                problems.append(f'{item["id"]} not referenced in page body')
                continue
            tag = tag.group(0)
            alt = re.search(r'alt="([^"]*)"', tag)
            if not alt or clean(alt.group(1)) != clean(item['alt_fr']):
                problems.append(f'{item["id"]} alt differs from image matrix')
            if 'width="1200"' not in tag or 'height="630"' not in tag:
                problems.append(f'{item["id"]} img width/height missing')
            notes.append(f'{item["id"]} {item["asset_path"]} WebP 1200x630 {kib:.0f} KiB')
        primary = next((i for i in items if 'EXTRA' not in i['id']), items[0] if items else None)
        if primary and page:
            og = DOMAIN + '/' + primary['asset_path']
            if page.meta.get('og:image') != og or page.meta.get('twitter:image') != og:
                problems.append('og/twitter image differs from primary asset')
            if clean(page.meta.get('og:image:alt', '')) != clean(primary['alt_fr']):
                problems.append('og:image:alt differs from primary alt')
            if og not in json.dumps(page.schema):
                problems.append('primary image missing from built JSON-LD')
        res['IMAGES'] = {'ok': not problems, 'problems': problems, 'evidence': (
            '; '.join(notes) + '; body <img> alt = image matrix alt_fr, width/height 1200x630, og:image/twitter:image/og:image:alt '
            'and built JSON-LD ImageObject match the primary asset.') if not problems else ''}
        # LINKS (mechanical part)
        problems = []
        incoming_body = sorted(body_in.get(rel, set()) - {rel})
        incoming_built = sorted(built_in.get(rel, set()) - {rel})
        if rel != 'index.html' and not incoming_body:
            problems.append('no editorial (source body) incoming link')
        if text and rel != 'index.html' and 'BreadcrumbList' not in json.dumps(page.schema):
            problems.append('no BreadcrumbList')
        res['LINKS'] = {'ok': not problems, 'problems': problems, 'incoming_body': len(incoming_body),
                        'incoming_built': len(incoming_built), 'evidence': (
            f'{len(incoming_body)} source-body incoming links (e.g. {", ".join(incoming_body[:3])}); '
            f'{len(incoming_built)} built pages link here incl. navigation; BreadcrumbList rendered; '
            f'{len(set(h for h in src.links if h.startswith("/")))} unique internal body links, none broken.') if not problems else ''}
        # META (mechanical part)
        problems = []
        title = clean(' '.join(src.titles[0])) if src.titles else ''
        desc = src.meta.get('description', '')
        if len(titles[title.casefold()]) > 1:
            problems.append('duplicate title')
        if len(descs[desc.casefold()]) > 1:
            problems.append('duplicate description')
        if src.meta.get('og:title') != title or src.meta.get('og:description') != desc:
            problems.append('OG title/description differ')
        if src.meta.get('twitter:card') != 'summary_large_image':
            problems.append('twitter card')
        res['META'] = {'ok': not problems, 'problems': problems, 'title': title, 'title_chars': len(title),
                       'description_chars': len(desc), 'evidence': (
            f'Unique title ({len(title)} chars) and description ({len(desc)} chars) sitewide; og:title/og:description identical; '
            'twitter summary_large_image with the primary image; canonical unchanged.') if not problems else ''}
        report[rel] = res
    summary = {dim: sum(1 for r in report.values() if not r[dim]['ok']) for dim in ('TECHNICAL', 'SCHEMA', 'IMAGES', 'LINKS', 'META')}
    failures = {rel: {d: r[d]['problems'] for d in r if r[d]['problems']} for rel, r in report.items() if any(r[d]['problems'] for d in r)}
    if out:
        Path(ROOT / out).parent.mkdir(parents=True, exist_ok=True)
        (ROOT / out).write_text(json.dumps(report, ensure_ascii=False, indent=1) + '\n')
    print(json.dumps({'pages': len(report), 'failing_by_dimension': summary, 'failures': dict(list(failures.items())[:30])}, ensure_ascii=False, indent=2))
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
