# French SEO + AEO + GEO — final report (2026-10-31)

Scope: the 543 indexable URLs of https://fr.rentbikehanoi.com/ (500 articles + 43 foundation pages including the homepage), with the four legacy redirects and the 547 image assets preserved.

- Execution authority: `AGENTS.md`, `docs/SEO-MASTER-PLAN.md`, `data/seo-master-matrix.json`.
- Work ran from commit `a7326df` (P0 batch) to the commits listed below. This report separates verified work from what is blocked or owner-dependent. It does not claim rankings, traffic, indexing or AI citations.

## 1. Ledger state (data/seo-master-matrix.json)

| Scope | DONE | BLOCKED_TOOL | TODO / IN_PROGRESS |
| --- | ---: | ---: | ---: |
| URL checkpoints (543 × 11) | 5 430 | 543 (LIVE_VERIFY) | 0 |
| Sitewide tasks (28) | 26 after this report (G01–G17, G19–G25, G27, G28) | 2 (G18, G26) | 0 |

- Audit finding counters are 0 on all 543 URLs: repeated editorial paragraphs, SEO-process language in reader copy, missing source-body inlinks, canonical, head and H1 issues, legacy NAP.
- `python3 tools/seo_master.py check` passes.

## 2. Done, with evidence

All evidence is recorded per URL and per dimension in the ledger. The underlying review files are in `data/seo-evidence/` (59 files). Each one holds one object per page with the claims checked, sections rewritten, words before→after, sources and owner gaps.

### Foundation pages: 43/43

- **Homepage, pricing hub, Contact, FAQ:** P0 batch. Intent and UX re-verified on 2026-10-29.
- **Rental pillar `/location-moto-hanoi/`:**
  - Re-titled « Location de moto à Hanoi : le guide étape par étape ». The homepage keeps the broad commercial query.
  - It now links all 59 rental guides.
- **The other 38 template hubs were rewritten from generic SEO filler into useful French guides:**
  - rental (3)
  - prices (3)
  - vehicle types (6)
  - Honda (4)
  - Yamaha (4)
  - licence & safety (3)
  - Hanoi (3)
  - North (5)
  - Centre/South (3)
  - blog
  - About, Terms, Privacy
- **On the hubs:**
  - Every child article is linked from its hub through grouped guide lists.
  - Filler sections after `</article>` were removed.
  - `data/seo-cluster-matrix.json` was synced via `tools/sync_foundation_meta.py`.

### Articles: 500/500

- **Method:** 31 batches following `docs/SEO-ARTICLE-REVIEW-PROTOCOL.md`.
- **Rewritten in natural, concrete French:** mannered prose (« … qui se … »), SEO-process wording, unsupported shop policies and unsourced numbers.
- **Factual errors corrected, for example:**
  - Wave RSX described with a clutch lever.
  - GEAR 125 Hybrid called an underbone.
  - Wrong roundabout and lane rules.
  - Invented speed limits and fines.
  - « 50cc sans permis » stated as a blanket rule.
  - Ecopark and Long Biên geography.
  - Lạng Sơn placed on the wrong road.
- **Constraints kept:** QA (1 500–5 000 words, 3–7 internal links including the parent hub) and every protected marker.

### Query ownership (G05)

- `data/seo-query-ownership.json` covers 543 URLs and 28 overlap groups.
- 44 pages keep their URL with a documented distinct angle (road/duo, prise en main, cost, budget, first-timer…).
- No redirects, noindex or cross-domain canonicals. No query is ceded to another owned domain.

### Facts (G01/G02)

- Business data: owner NAP, hours and reference prices only, always with the exact disclaimer.
- Model prices: only the 50cc, Vision and Air Blade rows. Other models get the category range « à titre de repère » or no price.
- Unconfirmed policies are phrased as questions to confirm: deposit, passport, delivery, refund, fleet, insurance and assistance.
- A sitewide regex scan finds no legacy NAP, 4 000 000 VND deposit, 800 000 VND delivery threshold, or free-delivery or no-deposit promise.

### Research (G06/G13/G14)

- `docs/SEO-RESEARCH-LOG.md` holds:
  - dated French query observations;
  - the legal digest: Law 36/2024/QH15 read in full and the UN 1968 Convention participant list;
  - the route digest: 2025 province mergers, the expressway ban, UNESCO sites, sourced approximate distances.
- No fine amounts, km/h limits or driving times are published where they were not verified.

### Technical, schema, images and UX

- **G03/G12/G23/G24:** 543 self-canonical, `lang="fr"`, indexable pages in the sitemap. The 4 redirects are unchanged.
- **Built JSON-LD:** LocalBusiness/WebSite/page/Breadcrumb/ImageObject with `headline` = H1. No invented rating, author, date or sameAs.
- **Built-site audit:** 0 broken local refs (`tools/seo_built_audit.py`).
- **G16:** `og:locale` fr_FR on all 543 pages. No hreflang mapping without verified equivalents.
- **G17:**
  - 547 images pass `tools/image-seo.mjs check`.
  - All 547 were visually reviewed on contact sheets.
  - 21 near-identical compositions are listed in `data/seo-evidence/2026-10-29-images-visual-review.json`.
- **G19 (lab, `tools/seo_ux_audit.mjs`):**
  - Covers all pages on mobile and desktop, light and dark.
  - Fixes made: WCAG AA brand blue (#1268DE, plus #4C8DF6 in dark mode); `app.js` storage guarded so the menu keeps working.
- **G20:**
  - 547 responsive 800px WebP derivatives, with srcset on every image block.
  - Lab LCP on emulated slow-4G mobile, before → after (local measurement, not field data):

    | Page | Before | After |
    | --- | --- | --- |
    | Home | 2.04 s | 1.10 s |
    | Rental pillar | 2.04 s | 0.62 s |
    | Pricing hub | 2.06 s | 0.66 s |
    | Contact | 1.89 s | 1.00 s |

  - CLS 0.
- **G21:** the tel/Zalo/WhatsApp CTA was checked on every page. The CTA asks visitors to confirm before coming. No trackers were added.
- **G22:** fixed OG defects on 40 articles and malformed hooks on 94. Duplicate paragraphs and broken links are cleared.
- **G04/G09:**
  - Legacy reports are marked historical.
  - The `scripts/qa.mjs` title-normaliser bug was fixed: digits and the letters « u » and « s » had been stripped, causing false duplicates.

### Tooling added (reusable on « tiếp tục »)

- `tools/seo_page_check.py`
- `tools/seo_built_audit.py`
- `tools/seo_ux_audit.mjs`
- `tools/seo_lab_perf.mjs`
- `tools/seo_evidence_merge.py`
- `tools/seo_ownership.py`
- `tools/sync_foundation_meta.py`
- `tools/image_variants.py`
- `tools/seo_live_compare.py`
- `tools/seo_wave_commit.sh`
- `python3 tools/seo_master.py record`

## 3. Blocked by tools or quota (not claimed done)

| Item | Status | Reason (real attempts) | Effect |
| --- | --- | --- | --- |
| G18 photographic image replacement | BLOCKED_TOOL, 18/547 | Figma MCP Starter-plan call limit (retry 2026-10-29 16:35 UTC refused); Canva credits exhausted | 529 valid vector illustrations stay in place; 4 generated Figma nodes still await retrieval |
| G26 search / AI visibility measurement | BLOCKED_TOOL | OpenRush HTTP 402 (no credits), Firecrawl out of credits, no GSC/GA4 access | No rankings, impressions, clicks or AI citations reported |
| LIVE_VERIFY on 543 URLs | BLOCKED_TOOL | Session network policy blocks fr.rentbikehanoi.com (proxy 403, WebFetch ENOTFOUND); TinyFish fetch permission denied for background use after one main-thread check (home, /location-moto-hanoi/, /honda/ on 2026-10-29) | Publication proven by GitHub Actions runs (§5), not by per-URL live fetches |
| External citation reachability | Partial | 10 of the 153 cited URLs (as of 2026-10-30) fetched OK; fetch permission then denied | Other citations are URLs seen in search results, marked as such in the evidence; re-check when page fetching is allowed |
| Source page reading | Partial | Most legal, spec and route facts come from search snippets, not opened pages; exceptions are Law 36/2024 (full text), the UN treaty list and UNESCO/VOV/Tuổi Trẻ pages | Claims are worded within the snippets and flagged « à vérifier » where needed |

No paid plan, API key or credit purchase was requested.

## 4. Owner verification (last)

See `docs/SEO-OWNER-VERIFY-LAST.md`, items O01–O13. In short:

- deposit and documents;
- delivery;
- Maps/GBP identity and business email;
- fleet and inclusions;
- privacy practices and GSC/GA4 access;
- real author or photo material;
- hreflang equivalents;
- rental time rules (O11);
- geographic use and one-way return (O12);
- model-level offer (O13).

Each affected page already names the condition once as a question to confirm before booking.

## 5. Commits and deployment

- `main` holds 32 commits since `a7326df` for this assignment, from `c3788dd` to `f6f06c6`, plus this report commit.
- GitHub Actions passed for every pushed batch that was checked:
  - QA
  - Local Chat Index
  - Shared Site Publish
  - pages build and deployment
- Final implementation commit `f6f06c6` (responsive images, final re-verification): all 5 runs completed with success on 2026-10-31:
  - [QA](https://github.com/thuexemayhanoi/french/actions/runs/41173814595)
  - [Local Chat Index](https://github.com/thuexemayhanoi/french/actions/runs/41173814546)
  - Shared Site Publish ([1](https://github.com/thuexemayhanoi/french/actions/runs/41173814561), [2](https://github.com/thuexemayhanoi/french/actions/runs/41173836228))
  - [pages build and deployment](https://github.com/thuexemayhanoi/french/actions/runs/41173814810)
- This report commit only touches documentation and the ledger.
- A successful deployment is not Google indexing, ranking or SEO completion.

## 6. Not done / next steps

- Re-check external citations and live URLs (`tools/seo_live_compare.py`) when a fetch tool is permitted.
- Retry the 4 pending Figma nodes and the photographic replacement when the Figma quota resets.
- Apply the owner answers O01–O13, then remove the « à confirmer » wording where facts become confirmed.
- With GSC access: measure indexing, queries and CWV field data (G26).
