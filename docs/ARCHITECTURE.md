# French website — current architecture

Last documentation review: **2026-10-10**  
Production domain: **https://fr.rentbikehanoi.com/**  
Default branch: **`main`** — published through GitHub Pages with the existing `CNAME`.

This document describes the repository *after* the French article-production rollout. Earlier statements that the site had no 500-article factory are obsolete.

## 1. Static site and shared presentation

The site consists primarily of pre-rendered HTML pages and lightweight browser-side JavaScript. It does not require a traditional CMS, a Node.js server at runtime or a heavy frontend build chain.

| Component | Responsibility |
| --- | --- |
| `index.html` and `<silo>/<slug>/index.html` | Crawlable static content and article URLs |
| `assets/js/site-config.js` | Central branding, site locale, contact details, menus and feature flags |
| `assets/css/site.css` | Shared design tokens, layout and responsive styles |
| `assets/js/components.js` | Shared UI: navigation, footer, CTA, related content, breadcrumbs and structured-data integration |
| `assets/js/silo-map.js` | Topical silo/navigation map |
| `assets/js/content-index.js` | Generated discovery/related-content data |
| `assets/js/app.js` | Site initialization, theme, mobile navigation and business-status display |
| `assets/js/assistant.js` | Browser-side local chatbot interface |
| `site/templates/article.html` | Common HTML template used by the content factory |

Each published page retains an individual title, meta description, canonical URL, H1 and topical intent. Editorial internal links should be contextual; the common components supplement rather than replace page-level navigation.

## 2. Content model and inventories

The repository has **nine principal topical groups**: `location-moto-hanoi`, `honda`, `yamaha`, `types-motos`, `prix-location`, `hanoi`, `nord-vietnam`, `centre-sud-vietnam`, and `permis-securite`. Supporting pages (including `blog/`) provide navigation, company and policy information. Generated articles primarily live in the topical silos, not directly in `blog/`.

Repository snapshot on 2026-10-10:

- `data/content-matrix.csv`: **515** planned rows, including **500** new published articles and **15** rows merged into foundation pages.
- `data/writer-queue.json`: `TARGET_REACHED`; **500** published, **0** remaining.
- `data/seo-cluster-matrix.json`: **43** mapped foundation URLs.
- `sitemap.xml`: **543** listed site URLs.

These counts describe repository records, not Google indexing. Google Search Console is the source for crawl/index coverage.

## 3. Content production: external writer -> factory -> review -> publication

The key boundary is deliberate: **GitHub Actions does not itself write articles with an LLM**.

1. **Planning:** `data/content-matrix.csv` defines each topic, silo, intent, source constraints, suggested internal links and production status. `data/factory-config.json` holds thresholds and paths.
2. **Draft creation:** an external writer or agent creates French-language `.article` drafts in `_factory/inbox/` using the row's instructions. The factory does not create complete prose from an empty queue.
3. **Validation:** `tools/factory.mjs` processes available inbox drafts, applies the shared article template and performs validation. Related/search and chatbot indexes are rebuilt by `tools/build-content-index.mjs` and `tools/build-chat-index.mjs`.
4. **Human review:** content needing factual/legal confirmation is routed to `_factory/review/`. Approval uses explicit reviewed IDs/batches; `review-approve.yml` is not a substitute for verifying claims.
5. **Publication:** accepted content and updated indexes are committed to `main`; QA and GitHub Pages checks govern deployment.

The production factory is in `tools/factory.mjs`; the entry point is [`article-factory.yml`](../.github/workflows/article-factory.yml). It accepts push triggers, manual controls, and cron runs at **:13 and :43 UTC each hour**. When no draft is ready, its liveness diagnostics should be read-only, avoiding an artificial activity loop. See [factory liveness](FACTORY-LIVENESS.md) and [writer backend feasibility](WRITER-BACKENDS.md).

## 4. Quality assurance and automation

- [`qa.yml`](../.github/workflows/qa.yml) triggers on pushes to `main` (with a trigger-file exception) and supports manual runs.
- `scripts/qa.mjs` checks static SEO/content constraints.
- `tools/build-content-index.mjs --check` and `tools/build-chat-index.mjs --check` verify generated indexes.
- QA also checks browser scripts and the factory's status.
- [`review-approve.yml`](../.github/workflows/review-approve.yml) responds to approved batch-file changes.
- [`local-chat-index.yml`](../.github/workflows/local-chat-index.yml) handles local chatbot index maintenance.

Current factory configuration uses **1,500–5,000 words**, **3–7 internal links**, **SEO score >= 75**, **two drafts per batch**, and up to **two repair attempts**. Content must still satisfy intent uniqueness, correct titles and canonicals, source constraints, and real factual/legal review. A passing automated SEO score is not evidence that all business details or laws have been independently verified.

## 5. Runtime status, deployment and observability

Key state files:

- `data/writer-queue.json` — latest production queue and target summary.
- `data/factory-state.json` — process state and last successful ID.
- `reports/factory-last-run.json` — diagnostics for a particular factory run; it is **not** an overall completion report.
- `data/content-matrix.csv` — item-level publication record.

**Known consistency issue at the 2026-10-10 snapshot:** the writer queue reports `TARGET_REACHED` and 500 published articles, while the factory state still contains `target_reached: false`. This is a state reconciliation item, not evidence of missing published articles; verify the factory's status code before modifying runtime state.

The GitHub Pages deployment for commit `288ff94e1f19c846e14a27dc69b095cf3d100ef2` completed successfully on 2026-10-10 (Vietnam time). Future commits must be checked independently. Successful deploy is separate from indexing or ranking.

## 6. Operational commands

Use a local checkout and Node.js 22:

```bash
node tools/factory.mjs status
node tools/factory-liveness.mjs
node scripts/qa.mjs
node tools/build-content-index.mjs --check
node tools/build-chat-index.mjs --check
```

For any new article production: inspect the matrix and queue first, verify the external writer's actual draft, preserve review gates, check CI, then confirm the deployed URL and Search Console coverage. Do not change target counters or remove QA controls merely to report progress.

See also [SEO content rules](SEO-CONTENT-CLUSTER-RULES.md), [silo map](SILO-MAP.md) and [foundation SEO audit](SEO-FOUNDATION-AUDIT.md).

## 7. Shared build rollout (2026-10-10)

Shared components now render at build time as well as browser fallback. `tools/build-site.mjs` applies `site/templates/layout.html`, shared config/components and optional `site/slots/` to all indexable source pages, emitting `_site/`. The `Shared Site Publish` workflow validates and deploys that output, including successful factory/review/index bot changes. Original editorial HTML and metadata remain source-of-truth; generated output does not enter the factory or chat inventory. See [shared-site audit and editing guide](SHARED-SITE-AUDIT.md) for exact edit points, preservation checks and known pre-existing editorial debt.
