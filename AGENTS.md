# French site: autonomous SEO, AEO and GEO execution

## Current assignment and authority — 2026-10-29

Optimize the **entire existing French site** at `https://fr.rentbikehanoi.com`: homepage, 500 published articles and 42 other foundation pages. The owner explicitly authorizes research, edits, repairs, validation, commits and pushes without routine questions or approvals. This is a **543-URL optimization project**, not another article-production campaign. Preserve the four existing redirect URLs and the 547 committed image assets.

The current execution source of truth is `data/seo-master-matrix.json`, with criteria in `data/seo-master-policy.json` and the runbook in `docs/SEO-MASTER-PLAN.md`. `CLAUDE.md` points to the same assignment. Older reports describing foundation SEO as “complete”, the 500-article factory as not started, immutable titles/H1s or an image-only/NAP-excluded scope are historical and superseded for this assignment.

The French site competes independently for relevant French commercial queries. Do not surrender queries, canonicalize French pages to another owned domain, noindex useful pages, or weaken content to benefit another site. One intent per URL still applies **within this French site**. Positions 1–3 are an ambition, never a promised result or an invented measurement.

## On startup and every “tiếp tục”

1. Read this file, `docs/SEO-MASTER-PLAN.md`, `docs/SEO-FACTS.md`, `docs/SEO-PROGRESS.md`, the policy and current matrix. Fetch the latest `main`; reconcile concurrent edits before committing. Run `python3 tools/seo_master.py status` and `python3 tools/seo_master.py next 20`.
2. Resume unfinished tasks by phase and priority, without restarting completed rows. First fix shared business facts and claims, crawl/indexing blockers, homepage and commercial hubs; then work through all existing URLs. An unavailable image tool or account must not stop independent content/technical work.
3. Read each page in full and check its closest same-intent siblings. Research current facts through actual available tools and primary sources. Rewrite weak, repetitive, misleading or irrelevant passages in natural French. Do not mass-replace a few keywords in a generic template.
4. Make implementation changes in manageable batches. Update shared config/templates/components once where possible. When changing title/meta/H1/canonical/link requirements, reconcile `data/seo-cluster-matrix.json`, `data/seo-foundation-matrix.json`, `data/content-matrix.csv`, indexes and relevant QA with the actual change. Do not loosen meaningful checks to hide failures.
5. After source changes, run `python3 tools/seo_master.py refresh` **before** recording new completion evidence. This reopens previously completed checks for changed page sources. Record each completed dimension in the JSON ledger with specific file/section, source URL and validation evidence as applicable, then `python3 tools/seo_master.py export` and `python3 tools/seo_master.py check`. CSV and progress report are derived views; do not edit them separately.
6. Run the relevant repository checks, fix failures, regenerate indexes/build when required, commit and push each verified batch. The owner has authorized publication through the existing GitHub Pages workflow. Verify the actual build/deploy jobs; a skipped workflow or green idle factory is not a new deployment or writing progress. Record a verified deployed SHA/run URL in the ledger/report; do not use a commit that does not exist yet as evidence.
7. Continue until actionable work is exhausted. If runtime/quota ends, commit current progress and a concrete next task. Never claim a background process is running unless a real scheduled workflow/agent exists. A future “tiếp tục” resumes the committed matrix.

## Facts: no invention and no routine owner questions

`docs/SEO-FACTS.md` and `data/seo-business-facts.json` contain the owner's current authoritative NAP and reference prices: **Thuê xe máy Nguyễn Hà**, **Ngõ 5 Nguyễn Văn Cừ, Bồ Đề, Long Biên, Hà Nội (gần Bến xe Gia Lâm)**, **0334 699 969 / +84 334 699 969**, **09:00–21:00 daily**. These supersede the older Nguyễn Tú / 112 Nguyễn Văn Cừ / 0942 contact data for this assignment. Keep the official Vietnamese brand intact in French copy and schema; French service descriptions may surround it. Do not change the production domain or existing URL paths for branding.

Never present unverified deposits, passport retention, delivery minimums, refund timing, fleet availability, insurance, biography, reviews, coordinates or legal terms as confirmed. Remove or qualify unsupported affirmative claims while continuing the work. Use “conditions et disponibilité à confirmer avant réservation” where appropriate; do not advertise no-deposit rental. Electric daily price stays “selon le modèle, à confirmer”. Reference prices always require confirmation before booking.

All owner/account-only questions go to **`docs/SEO-OWNER-VERIFY-LAST.md` at the end**, with affected URLs, evidence gap, safe interim action and impact. Only that specific fact-dependent task can be `DEFERRED_OWNER`; unrelated SEO continues. Do not ask for GA4/GSC/API keys, image subscriptions, admin access or routine approval during matrix execution. Do not publish fabricated facts while waiting. No invented search volumes, rankings, traffic, AI citations or Core Web Vitals scores.

## Quality and URL protection

- Retain current canonical URL paths, CNAME, verification tokens, redirects and useful content. Fix implementation defects without gratuitous slug changes. If a real duplicate needs consolidation, first document intent overlap, preserve content and map the redirect; do not mass-delete or mass-noindex.
- Use Pillar → Hub → Silo → supporting article architecture; give each keyword group a primary owner URL and contextual bidirectional links where useful. Homepage owns the broad commercial rental query; the rental pillar covers process/options, not a competing copy of the homepage.
- Content depth follows actual intent: homepage/hubs 1,600–6,000 useful words when warranted; articles 1,000–5,000; About 800–1,600 verified words; Contact concise; Privacy/Terms complete for real practices with no quota. These are editorial ranges, not a demand to pad or truncate useful text. Current factory QA may impose narrower legacy thresholds: reconcile it through the global QA task rather than silently bypassing it.
- Titles/meta must be unique, natural, factual and aligned with H1/content. Aim for readable snippet lengths (roughly 50–70 characters for many titles), never fill to a count or claim a Google hard limit. Check search-result display/pixel width if a real tool is available.
- Give direct, useful French answers in the appropriate sections, factual comparisons/checklists and citations for changing/high-stakes facts. FAQ hub: 15–20 helpful Q&As. Do not inject SEO-process talk into customer copy. Do not claim FAQ rich results or guaranteed AI inclusion.
- Use accurate built JSON-LD (WebSite, Organization/LocalBusiness, BreadcrumbList, Article and other suitable types) matching visible content; real authors/dates only. Avoid fictional ratings, offers or unverified sameAs. Hreflang only for verified equivalent URLs with reciprocal/self links; never map every French article to a foreign homepage.
- Keep valid images while the photographic upgrade is blocked. Image integration and Figma replacement are separate completion states. Inspect pixels before changing alt, use natural French descriptions, maintain responsive dimensions and existing 150–300 KiB/1200×630 image policy; never add noise only to inflate bytes. Tool quotas affect only the replacement task. See `docs/IMAGE-SEO-WORKFLOW.md`.
- Validate mobile/desktop layout, keyboard access, contrast, loading and CTA behavior. Label local/lab/field observations honestly. A successful deploy is not Google indexing, ranking or SEO completion.

## Validation commands

Use the applicable checks; changes to shared components need the full build checks:

```bash
python3 tools/seo_master.py refresh
# Record new, actually verified task evidence in the JSON ledger after refresh.
python3 tools/seo_master.py export
python3 tools/seo_master.py check
node tools/image-seo.mjs check
node scripts/qa.mjs
node tools/build-content-index.mjs --check
node tools/build-chat-index.mjs --check
node --test tests/shared-site.test.mjs tests/factory-liveness.test.mjs
node tools/build-site.mjs
node scripts/qa-shared.mjs
```

Completion requires per-URL evidence and completed applicable sitewide tasks. Report finished, pending, tool-blocked and owner-deferred work separately. Never set every row DONE simply because these mechanical checks pass.
