# Article review protocol (G08): one pass per published article

This protocol covers the 500 factory articles listed in `data/content-matrix.csv`. It applies `docs/SEO-EDITORIAL-GUIDE.md`, which is binding. Rewrite in natural French; do not mass-replace words.

## Inputs per article

- The HTML source, e.g. `honda/honda-vision-location-hanoi/index.html`.
- Its row in `data/content-matrix.csv`:
  - `id` must equal the `data-factory-id` on `<body>`.
  - `parent_hub_path`.
  - `internal_link_targets`: required links, `;`-separated.
- Its row in `data/seo-query-ownership.json`:
  - `primary_query_fr`.
  - `role`: `OWNER` or `DISTINCT_ANGLE`.
  - `group_owner`.
  - `angle`.
  - `closest_pages`.
- Research digests when they exist (scratchpad `evidence/E-legal-digest.md` and `evidence/G-route-digest.md`, copied to `docs/SEO-RESEARCH-LOG.md` once merged). Legal, licence, insurance and route statements must agree with them.

## Steps

1. Run `python3 tools/seo_page_check.py <file>`, then read the whole article. Note every `review` signal.
2. **INTENT**:
   - State the article's main question in one sentence and check the closest pages.
   - If `role` is `DISTINCT_ANGLE`, refocus the title, H1, lead, meta and emphasis on the documented angle. Remove the parts that duplicate the owner's general comparison and link to the owner (`group_owner`) once with a natural anchor.
   - If the article already has a clear distinct purpose, keep it.
3. **FACTS**:
   - Business facts:
     - NAP and hours exactly as in the guide.
     - Prices only from the owner table, with the disclaimer when a rate is quoted.
     - A model without its own owner row (e.g. NVX, Sirius, Wave, Lead, Exciter, WR155R) gets at most the category range « à titre de repère », to confirm. No rate at all for trail or manual sport bikes.
   - Remove or qualify unconfirmed shop policies:
     - deposit amounts or forms, passport retention, delivery, fees or minimums, refunds;
     - insurance, assistance or 24/7 service;
     - fleet, stock or availability;
     - reviews, experience or « nos clients ».
   - Generic market observations must be phrased as such (« certains loueurs… ; demandez la règle applicable »).
   - Legal and route claims: correct anything contradicting the digests or official sources; cite inline when a precise rule is stated.
   - Model specs only with a manufacturer source.
   - No fictional first-hand stories.
4. **CONTENT**:
   - Rewrite every awkward, mannered or abstract passage, including chains of « … qui se … » relatives (« la location qui se décide… », « le point qui compte se lit au message »), empty formulas (« la méthode du site », « sans horaire promis ») and SEO-process wording.
   - Each paragraph must give concrete, accurate information: criteria, steps, numbers with source, what to ask, what to check.
   - Keep the useful material and remove repetition.
   - Main word count stays **1 500–5 000** (QA counts all text inside `<main>`, TOC included). If you remove filler, add useful substance instead of padding.
5. **AEO/GEO**:
   - The first paragraph after the image/TOC answers the H1 question directly in 2–4 sentences. The lead paragraph may do this.
   - Use tables or checklists where they genuinely help.
   - The FAQ keeps 3–7 real questions with short, accurate answers. Delete Q&As that repeat the body.
6. **META**:
   - Natural French title, unique sitewide, roughly 45–65 characters. It must not promise what the page does not deliver (« montant », « prix exact », « garanti »…).
   - Meta description: 120–160 characters, factual.
   - H1 aligned with the title. Eyebrow short and plain.
   - Update `og:title` / `og:description` to exactly the same text as title / description.
7. **LINKS**:
   - Keep every `internal_link_targets` entry and a link to the parent hub.
   - Total unique internal links inside `<main>` must stay between **3 and 7** (legacy QA cap, task G09).
   - Use natural descriptive anchors, and prefer the most useful sibling or owner over generic hubs when there is room.
   - No broken links. Check fragments.
8. **TOC**: the static `<details class="article-toc" data-auto-toc>` lists each H2 with `href="#id"`. When you rename or reorder H2s, keep each H2 `id` and its TOC entry in sync, including `#questions-frequentes` and `#pour-aller-plus-loin` when present.
9. **Never change**:
   - canonical, `og:url`, `og:image*`, the `SEO_IMAGE_META` / `SEO_IMAGE` blocks, `data-factory-id`, `data-page-type`, `data-parent-path`, `data-auto-toc`;
   - the scripts, the `<div data-…></div>` hooks, `lang`;
   - the URL/path. Do not create or delete files.
10. Run `python3 tools/seo_page_check.py <file>` again. Zero `errors` are required, and every remaining `review` sentence must be accurate and qualified.

## Evidence (one JSON object per article)

```json
{"path": "…/index.html",
 "role": "OWNER|DISTINCT_ANGLE",
 "primary_intent": "…",
 "new_meta": {"title": "…", "description": "…", "h1": "…"},
 "evidence": {
   "FACTS": "claims checked/corrected (which sentences), prices used, policies qualified, sources",
   "INTENT": "main question; owner URL; differs from <closest page> because …",
   "CONTENT": "sections rewritten / removed / added; words before→after",
   "META": "title/meta/H1 changed or kept and why",
   "LINKS": "internal links kept/added (targets), count n/7, parent hub present",
   "AEO_GEO": "direct answer location; FAQ count; tables/checklists; citations"},
 "sources": [{"url": "https://…", "checked": "2026-10-29", "used_for": "…"}],
 "owner_gaps": []}
```

Include `new_meta` only when it changed.
