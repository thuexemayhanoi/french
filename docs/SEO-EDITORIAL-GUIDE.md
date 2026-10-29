# French editorial and evidence guide for page reviews

Working standard for the 543-URL matrix (`data/seo-master-matrix.json`). It applies to agents and humans who rewrite or review a page. It sits under `AGENTS.md`, `docs/SEO-MASTER-PLAN.md` and `docs/SEO-FACTS.md`.

## 1. Facts you may state

- Business: **Thuê xe máy Nguyễn Hà**, **Ngõ 5 Nguyễn Văn Cừ, Bồ Đề, Long Biên, Hà Nội (gần Bến xe Gia Lâm)**, **0334 699 969 / +84 334 699 969** (`tel:+84334699969`, `https://zalo.me/84334699969`, `https://wa.me/84334699969`), **09:00–21:00 every day**.
- Reference prices in VND (day / week / month):

  | Category | Day | Week | Month |
  | --- | --- | --- | --- |
  | Semi-automatic | 150 000–200 000 | 700 000–800 000 | 1 000 000–1 200 000 |
  | Automatic scooter | 150 000–200 000 | 600 000–1 000 000 | 1 200 000–2 000 000 |
  | Electric | « selon le modèle, à confirmer » | 600 000–800 000 | 1 500 000–1 800 000 |
  | 50cc | 200 000 | 1 000 000 | 2 000 000 |
  | Honda Vision | 200 000 | 1 000 000 | 2 000 000 |
  | Honda Air Blade | 200 000 | 900 000 | 1 500 000 |

- Put the disclaimer next to any price table or quoted rate: « Tarifs indicatifs, à confirmer avant toute réservation selon le véhicule et la durée. »
- Never derive packages by multiplying a day rate, convert to €/$ without a dated source, or quote a price for another model.

## 2. Facts you must not invent

- Deposit amount or form, passport retention, refund timing, delivery zones, fees or minimums, insurance, roadside assistance, fleet or stock, payment methods, reviews, years of experience, founder story, staff names and coordinates are **unconfirmed**.
  - Do not affirm them.
  - Do not advertise « sans caution » or free delivery.
  - Say the condition must be confirmed before booking, once, where it helps the reader.
  - Never stack the same disclaimer in every paragraph.
- Generic, attributed market observations are allowed when phrased as general practice, e.g. « certains loueurs demandent une caution ; demandez la règle applicable avant de réserver ». Never present them as this shop's policy.
- Legal, licence, insurance and road rules:
  - Cite a primary or official source with its URL and the check date, e.g. Vietnamese legislation (Law 36/2024/QH15 on road traffic order and safety, in force since 1 January 2025), Decree 168/2024/ND-CP on fines, government portals, France-Diplomatie conseils aux voyageurs, or the UN treaty collection for the 1968 Vienna Convention.
  - State the uncertainty: rules depend on nationality, licence category and vehicle; tell readers to check their situation.
  - Do not give a blanket « sans permis » or « permis international suffit » statement.
- Model specs: use the manufacturer's Vietnamese site (honda.com.vn, yamaha-motor.com.vn) when stating displacement, fuel tank, seat height or range. Otherwise stay qualitative. Model-year specs vary.
- Itineraries and weather: give approximate distances only when sourced, never exact driving times. Remind readers that closures, weather and checkpoints change.

## 3. French style

- Write native, direct French that addresses the reader as « vous ». Open with a 2–4 sentence direct answer to the page's main question.
- Be concrete: decision criteria, comparisons, checklists, tables, what to ask and what to inspect, real local context (Long Biên, Bến xe Gia Lâm, Vieux Quartier, Hoàn Kiếm, Tây Hồ, the Red River bridges, the rainy season, traffic patterns).
- Banned in reader copy:
  - SEO-process talk: « cannibalisation », « intention de recherche », « hub », « silo », « futurs articles », « longue traîne », « mots-clés », « cette page sert à… », « le lecteur doit… », « référencement ».
  - Generic template sentences reused across pages.
  - Mannered constructions such as « la boutique qui se trouve… », « qui s’avère… ».
  - Keyword stuffing, English boilerplate, fictional first-hand anecdotes (« lors de notre dernier voyage… »).
- Keep the Vietnamese brand name intact.
  - Vietnamese place names may stay without diacritics in running French (Hanoi, Ha Giang), as the site already does, or use the official form in addresses.
- Length follows usefulness:
  - Hubs and pillars: about 1 600–3 000 words.
  - Articles: 1 500–5 000 words (current factory QA floor).
  - About: 800–1 600 words.
  - Contact: concise.
  - Never pad.

## 4. HTML skeleton (keep existing classes; no new CSS required)

```html
<main class="shell"><div data-breadcrumbs></div><article class="seo-longform"[ data-factory-id=… data-auto-toc on articles]>
<header class="seo-article-head"><p class="eyebrow">…</p><h1>…</h1><p class="lead">…</p></header>
<!-- SEO_IMAGE:…:START --> … unchanged … <!-- SEO_IMAGE:…:END -->
<section class="seo-section"><h2>…</h2><p>…</p></section>
<section class="seo-section"><h2>…</h2><div class="table-scroll" tabindex="0" role="region" aria-label="…"><table class="price-table"><caption>…</caption>…</table></div></section>
<section class="seo-section"><h2>…</h2><ul class="seo-checklist"><li>…</li></ul></section>
<section class="seo-section seo-faq"><h2>Questions fréquentes</h2><article class="faq-item"><h3>…?</h3><p>…</p></article>…</section>
<section class="seo-section"><h2>…</h2><p>…</p><div class="context-links"><a href="/…/">… →</a></div></section>
</article><div data-global-cta></div><div data-related></div></main>
```

- Never modify `SEO_IMAGE` blocks, `SEO_IMAGE_META`, canonical, `og:url`, `og:image*`, scripts, `data-*` hooks, `data-factory-id`/`data-auto-toc` markers or `lang`. The extra image block on a page stays.
- When changing title or description, also change `og:title` / `og:description` to the same text. Do not add `twitter:title`.
- External citation links:
  - Use `<a href="https://…" rel="noopener">…</a>` inside the sentence that uses the source.
  - Only use URLs you actually opened or saw in a search result during the review.

## 5. Links

- Every article links its parent hub and the required `internal_link_targets` from `data/content-matrix.csv`.
- Articles currently have 3–7 unique internal links in `<main>`. This legacy QA cap is under review in G09; respect it until changed.
- Hubs link the parent, sibling hubs and **every child article**, grouped by sub-topic with descriptive natural anchors. Use the article titles from `data/content-matrix.csv` (`working_title_fr`) or the actual H1, never « cliquez ici ».
  - Markup: inside a `seo-section`, one `<h3>` per sub-topic followed by `<ul class="guide-list"><li><a href="/…/">Anchor</a> : one short useful sentence on what the guide answers</li></ul>`.
  - Sub-hubs also link the children relevant to their sub-topic.
- Foundation pages must keep every `required_internal_links` entry from `data/seo-cluster-matrix.json`.
- Verify each target exists: `python3 tools/seo_page_check.py <file>` reports broken links.

## 6. Self-check before reporting

```bash
python3 tools/seo_page_check.py path/to/index.html
```

- Fix every `errors` item except `… differs from data/seo-cluster-matrix.json (sync required)`. That one is expected after a deliberate title/meta/H1 change: report the new values so the coordinator syncs the matrix.
- Read every `review` sentence in context and fix or justify it: deposit, passport, delivery, legal, prices not in the owner table, duplicated paragraphs, SEO-process language.

## 7. Evidence record (per page, for the coordinator)

JSON object per reviewed page:

```json
{"path": "honda/index.html",
 "new_meta": {"title": "…", "description": "…", "h1": "…"},
 "evidence": {"FACTS": "…", "INTENT": "primary intent …; owner URL …; distinct from … because …", "CONTENT": "sections rewritten …; sources …",
              "META": "…", "LINKS": "…", "AEO_GEO": "…"},
 "sources": [{"url": "https://…", "checked": "2026-10-29", "used_for": "…"}],
 "owner_gaps": ["…"]}
```

- `new_meta` appears only when title, description or H1 changed.
- Evidence must be specific (sections, claims, links and sources), not « OK ».
- The coordinator records it only after `python3 tools/seo_master.py refresh`.
