#!/usr/bin/env python3
"""Per-page editorial/technical check used while reviewing French pages.

Usage (repo root):
  python3 tools/seo_page_check.py <source.html> [...]   # detailed JSON per page
  python3 tools/seo_page_check.py --all                  # sitewide summary of blocking errors / review signals

Errors are repository constraints (QA parity, broken links, missing markers). "review" lists
sentences that a human/agent must read in context (deposit, passport, delivery, legal, prices...):
a hit is not a verdict. Passing this script is not SEO completion evidence by itself.
"""
import collections
import csv
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from seo_master import DOMAIN, Page, clean, route, source_pages  # noqa: E402

ROOT = Path(__file__).resolve().parents[1]
CLUSTER = {p['path']: p for p in json.loads((ROOT / 'data/seo-cluster-matrix.json').read_text())['pages']}
FACTORY_CFG = json.loads((ROOT / 'data/factory-config.json').read_text())
with (ROOT / 'data/content-matrix.csv').open(newline='') as fh:
    ARTICLES = {r['path']: r for r in csv.DictReader(fh) if r['path']}

PRICE_OK = {'150 000', '200 000', '700 000', '800 000', '1 000 000', '1 200 000', '600 000', '2 000 000',
            '1 500 000', '1 800 000', '900 000'}
SEO_PROCESS = re.compile(r'cannibalis|articles? futurs?|futurs? articles?|intention de recherche|page de hub|\bsilo\b|'
                         r'longue[s]? traîne|référencement|mots?-clés?|requête large|cette page sert|'
                         r'le lecteur doit|cette architecture|point d’entrée solide|(?-i:\bSEO\b)', re.I)
MANNERED = re.compile(r'\b(?:qui se trouve|qui se situe|qui s’avère|qui s\'avère|qui se révèle|'
                      r'la boutique qui|l’établissement qui se|le loueur qui se)\b', re.I)
LEGACY = re.compile(r'Nguy[eễ]n\s*T[uú]\b|0942[ .]?467[ .]?674|84942467674|112\s+Nguy|21:30|21h30|nguyentuantu', re.I)
ENGLISH = re.compile(r'\b(motorbike rental|motorcycle rental|best motorbike|old quarter|things to do|rental price|'
                     r'driving license|for rent|near me)\b', re.I)
RISK = {
    'deposit': re.compile(r'caution|dépôt|garantie financière|\bgarantie\b', re.I),
    'passport': re.compile(r'passeport', re.I),
    'delivery': re.compile(r'livr(?:aison|er|é|ée|ons)|apport(?:er|ée?) (?:la|le) (?:moto|scooter)|à l’hôtel', re.I),
    'refund_payment': re.compile(r'rembours|acompte|paiement|carte bancaire|espèces', re.I),
    'insurance_assistance': re.compile(r'assurance|assistance|dépannage|24 ?h ?/ ?24|24/7|7 ?j ?/ ?7', re.I),
    'legal': re.compile(r'permis|amende|\bloi\b|décret|légal|illégal|police|convention de (?:Vienne|Genève)|PCI|IDP', re.I),
    'fleet_promise': re.compile(r'notre flotte|nos motos|nous proposons|nous disposons|toujours disponible|'
                                r'disponible immédiatement|en stock|garanti[es]?\b', re.I),
    'reviews_experience': re.compile(r'avis clients?|\bétoiles\b|depuis \d+ ans|années d’expérience|des milliers de', re.I),
}
MONEY = re.compile(r'(\d{1,3}(?:[   .,]\d{3})+|\d+(?:[.,]\d+)?\s?(?:k|K|millions?))\s?(?:VND|vnd|₫|dongs?|đ)', re.I)
FOREIGN_MONEY = re.compile(r'\d\s?(?:€|euros?|USD|\$|dollars?)|(?:€|\$)\s?\d', re.I)


def word_count_qa(main_html):
    t = re.sub(r'<script[\s\S]*?</script>|<style[\s\S]*?</style>', ' ', main_html, flags=re.I)
    t = re.sub(r'<[^>]+>', ' ', t)
    t = re.sub(r'&[a-z#0-9]+;', ' ', t, flags=re.I)
    return len(t.split())


def target_file(href, rel):
    from urllib.parse import unquote, urljoin, urlsplit
    dest = urlsplit(urljoin(DOMAIN + route(rel), href))
    if dest.netloc != urlsplit(DOMAIN).netloc:
        return None, None
    target = unquote(dest.path).lstrip('/') or 'index.html'
    if target.endswith('/'):
        target += 'index.html'
    elif not Path(target).suffix:
        target += '/index.html'
    return target, unquote(dest.fragment)


def sentences(text):
    return [s.strip() for s in re.split(r'(?<=[.!?])\s+', text) if s.strip()]


def paragraph_index():
    index = collections.defaultdict(set)
    for path in source_pages():
        rel = path.relative_to(ROOT).as_posix()
        page = Page(path.read_text())
        if page.body.get('data-page-type') == 'redirect':
            continue
        for chunks in page.paragraphs:
            para = clean(' '.join(chunks))
            if len(para.split()) >= 20:
                index[para.casefold()].add(rel)
    return index


def check(rel, para_index=None, titles=None):
    source = (ROOT / rel).read_text()
    page = Page(source)
    main_match = re.search(r'<main class="shell">([\s\S]*?)</main>', source)
    main_html = main_match.group(1) if main_match else ''
    text = clean(' '.join(page.main))
    title = clean(' '.join(page.titles[0])) if page.titles else ''
    h1 = clean(' '.join(page.h1s[0])) if page.h1s else ''
    desc = page.meta.get('description', '')
    url = DOMAIN + route(rel)
    errors, warnings, review = [], [], collections.defaultdict(list)
    if page.canonical != url:
        errors.append('canonical is not self URL')
    if page.lang != 'fr':
        errors.append('lang is not fr')
    if len(page.h1s) != 1:
        errors.append('H1 count %d' % len(page.h1s))
    if not title or not desc:
        errors.append('title/description missing')
    if ENGLISH.search(' '.join([title, desc, h1])):
        errors.append('English SEO phrase in title/description/H1')
    for key in ('og:title', 'og:description', 'og:url', 'og:image', 'og:image:alt', 'twitter:card', 'twitter:image'):
        if not page.meta.get(key):
            warnings.append('missing meta ' + key)
    if page.meta.get('og:title') and page.meta.get('og:title') != title:
        warnings.append('og:title differs from title')
    if page.meta.get('og:description') and page.meta.get('og:description') != desc:
        warnings.append('og:description differs from description')
    if page.meta.get('og:url') and page.meta.get('og:url') != url:
        errors.append('og:url differs from canonical')
    if titles is not None and titles.get(title.casefold(), {rel}) != {rel}:
        errors.append('duplicate title with ' + ', '.join(sorted(titles[title.casefold()] - {rel})))
    # image block
    imgs = re.findall(r'<img [^>]*src="(/assets/images/seo/[^"]+)"[^>]*>', main_html)
    if not imgs:
        errors.append('primary SEO image missing in main')
    for src in imgs:
        if not (ROOT / src.lstrip('/')).is_file():
            errors.append('image file missing ' + src)
    for tag in re.findall(r'<img [^>]*>', main_html):
        if 'width=' not in tag or 'height=' not in tag or 'alt="' not in tag:
            errors.append('img without width/height/alt')
    # links
    internal, external = set(), set()
    for href in re.findall(r'href="([^"]*)"', main_html):
        if href.startswith(('tel:', 'mailto:', 'https://zalo.me', 'https://wa.me')):
            continue
        if href.startswith('#'):
            if href[1:] and href[1:] not in page.ids and 'data-auto-toc' not in source:
                errors.append('missing local fragment ' + href)
            continue
        target, frag = target_file(href, rel)
        if target is None:
            external.add(href)
            continue
        internal.add(href.split('#')[0].split('?')[0])
        if not (ROOT / target).is_file():
            errors.append('broken internal link ' + href)
        elif frag and frag not in Page((ROOT / target).read_text()).ids:
            errors.append('missing fragment ' + href)
    for ext in external:
        if not ext.startswith('https://'):
            warnings.append('non-https external link ' + ext)
    words = word_count_qa(main_html)
    kind = 'ARTICLE' if rel in ARTICLES else ('HOME' if rel == 'index.html' else 'FOUNDATION')
    if kind == 'ARTICLE':
        art = ARTICLES[rel]
        lo, hi = FACTORY_CFG['first_pass_min_words'], FACTORY_CFG['first_pass_max_words']
        if not lo <= words <= hi:
            errors.append(f'article QA word count {words} outside {lo}-{hi}')
        n = len({h for h in internal if h.startswith('/')})
        lo, hi = FACTORY_CFG['first_pass_min_internal_links'], FACTORY_CFG['first_pass_max_internal_links']
        if not lo <= n <= hi:
            errors.append(f'article unique internal links {n} outside {lo}-{hi}')
        for target in filter(None, art['internal_link_targets'].split(';')):
            if f'href="{target}"' not in main_html:
                errors.append('required factory link missing ' + target)
        if f'data-factory-id="{art["id"]}"' not in source:
            errors.append('data-factory-id marker missing')
        if 'data-auto-toc' not in source:
            errors.append('data-auto-toc marker missing')
        if f'href="{art["parent_hub_path"]}"' not in main_html:
            warnings.append('no body link to parent hub ' + art['parent_hub_path'])
    else:
        fnd = CLUSTER.get(route(rel))
        if fnd:
            for key, value in (('seo_title', title), ('meta_description', desc), ('h1', h1)):
                if fnd[key] != value:
                    errors.append(f'{key} differs from data/seo-cluster-matrix.json (sync required)')
            for link in fnd.get('required_internal_links') or []:
                if f'href="{link}"' not in main_html:
                    errors.append('required foundation link missing ' + link)
    for marker in ('data-breadcrumbs', 'data-related'):
        if marker not in source:
            errors.append('shared hook missing ' + marker)
    if LEGACY.search(source):
        errors.append('legacy Nguyễn Tú / old NAP / 21:30 token present')
    for s in sentences(text):
        if SEO_PROCESS.search(s):
            review['seo_process_language'].append(s[:220])
        if MANNERED.search(s):
            review['mannered_phrasing'].append(s[:220])
        for key, rx in RISK.items():
            if rx.search(s):
                review[key].append(s[:220])
        for amount in MONEY.findall(s):
            norm = re.sub(r'[  .,]', ' ', amount).strip()
            if norm not in PRICE_OK:
                review['money_not_in_owner_table'].append(s[:220])
                break
        if FOREIGN_MONEY.search(s):
            review['foreign_currency'].append(s[:220])
    if para_index is not None:
        for chunks in page.paragraphs:
            para = clean(' '.join(chunks))
            others = para_index.get(para.casefold(), set()) - {rel}
            if len(para.split()) >= 20 and others:
                review['paragraph_duplicated_elsewhere'].append(f'{para[:120]}… (+{len(others)} pages, e.g. {sorted(others)[0]})')
    return {
        'path': rel, 'url': url, 'kind': kind, 'title': title, 'title_chars': len(title), 'description': desc,
        'description_chars': len(desc), 'h1': h1, 'words_qa': words, 'internal_links': sorted(internal),
        'external_links': sorted(external), 'h2': [clean(' '.join(h['text'])) for h in page.headings if h['tag'] == 'h2'],
        'errors': errors, 'warnings': warnings, 'review': {k: v for k, v in review.items()},
    }


def title_index():
    titles = collections.defaultdict(set)
    for path in source_pages():
        page = Page(path.read_text())
        if page.body.get('data-page-type') == 'redirect' or not page.titles:
            continue
        titles[clean(' '.join(page.titles[0])).casefold()].add(path.relative_to(ROOT).as_posix())
    return titles


def main(argv):
    if not argv:
        print(__doc__)
        return 2
    para_index, titles = paragraph_index(), title_index()
    if argv[0] == '--all':
        totals, failing = collections.Counter(), []
        for path in source_pages():
            rel = path.relative_to(ROOT).as_posix()
            if Page(path.read_text()).body.get('data-page-type') == 'redirect':
                continue
            res = check(rel, para_index, titles)
            for key, value in res['review'].items():
                totals[key] += 1
            if res['errors']:
                failing.append({'path': rel, 'errors': res['errors']})
        print(json.dumps({'pages_with_errors': len(failing), 'errors': failing[:50],
                          'pages_with_review_signal': dict(totals)}, ensure_ascii=False, indent=2))
        return 1 if failing else 0
    results = [check(a.removeprefix('./'), para_index, titles) for a in argv]
    print(json.dumps(results, ensure_ascii=False, indent=2))
    return 1 if any(r['errors'] for r in results) else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
