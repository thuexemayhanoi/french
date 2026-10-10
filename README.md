# Nguyen Tu — French static SEO website

Production site: **https://fr.rentbikehanoi.com/**  
Repository: **https://github.com/thuexemayhanoi/french** (default branch: `main`)

A French-language, dependency-light static website about motorcycle and scooter rental in Hanoi and travel in Vietnam. Pages use shared site configuration, styles and JavaScript components. GitHub Pages serves the published site; the existing `CNAME` is retained.

## Content and publishing status

Snapshot checked on **2026-10-10** against the repository's content matrix, queue, sitemap and GitHub Pages deployment:

| Measure | Repository-reported result |
| --- | ---: |
| New French articles with `PUBLISHED` status | **500 / 500** |
| Additional matrix rows merged into existing foundation pages | **15** |
| Total production matrix rows | **515** |
| Foundation URLs managed by the foundation SEO matrix | **43** |
| URLs listed in `sitemap.xml` | **543** |
| New articles remaining in `data/writer-queue.json` | **0** |

The writer queue reports `TARGET_REACHED`. This means the production target is fulfilled **in the repository**, not that all URLs have been indexed or ranked by Google. Check Google Search Console for actual crawl and indexing coverage.

**State consistency note:** at this snapshot, `data/factory-state.json` still has `target_reached: false` even though the writer queue reports `TARGET_REACHED` and 500 published articles. Treat the queue and the production matrix as the evidence for article counts. The inconsistent flag needs separate investigation; do not change it merely to make the README agree.

## Main content silos

- `location-moto-hanoi/` — rental information in Hanoi
- `honda/` and `yamaha/` — motorcycle and scooter models
- `types-motos/` — vehicle types
- `prix-location/` — rental pricing information
- `hanoi/` — local Hanoi guidance
- `nord-vietnam/` and `centre-sud-vietnam/` — Vietnam itineraries
- `permis-securite/` — licensing and road-safety information

Supporting pages include `a-propos/`, `faq/`, `contact/`, `conditions/`, `confidentialite/` and `blog/`. The `blog/` directory currently contains a landing page; generated articles are organized under the topical silos rather than that directory.

## Repository map

| Path | Purpose |
| --- | --- |
| `assets/js/site-config.js` | Brand, contact details, navigation and feature flags |
| `assets/css/site.css` | Shared styling and design tokens |
| `assets/js/components.js` | Shared header, footer, related links, CTAs, breadcrumbs and schema |
| `assets/js/content-index.js` | Generated local content index |
| `assets/js/assistant.js` | Local assistant/browser integration |
| `site/templates/article.html` | Static article HTML template |
| `data/content-matrix.csv` | 515-row new-content plan and production statuses |
| `data/seo-cluster-matrix.json` | Foundation-page SEO requirements and cluster map |
| `data/factory-config.json` | Factory thresholds, paths and targets |
| `data/writer-queue.json` | Writer queue and production target summary |
| `data/factory-state.json` | Factory runtime status (see consistency note above) |
| `_factory/inbox/` and `_factory/review/` | Draft intake and items requiring review |
| `tools/` | Factory, imports, liveness diagnostics and index builders |
| `scripts/qa.mjs` | Local sitewide QA |
| `sitemap.xml`, `robots.txt`, `CNAME` | Crawl and publishing configuration |

## Editorial factory and GitHub Actions

**Important:** the scheduled factory is a **validator and publisher**, not an AI writing model. Full French article drafts are created by an external writer/agent and placed in `_factory/inbox/`. A schedule without drafts cannot generate articles on its own.

1. An external writer follows the applicable content-matrix row, prepares a native French `.article` draft, and commits it to the inbox.
2. [French Article Factory](.github/workflows/article-factory.yml) processes available drafts, checks the content, builds local indexes and updates production files. Its scheduled runs occur at minute 13 and 43 of every hour; an idle run should not be counted as writing progress.
3. Items requiring factual or legal review enter `_factory/review/`. [Review Approve](.github/workflows/review-approve.yml) handles approved batches; review must be genuine, not bypassed.
4. [QA](.github/workflows/qa.yml) validates the site on pushes to `main`; [local chat index](.github/workflows/local-chat-index.yml) maintains the local assistant index.
5. GitHub Pages builds and deploys the latest committed static site.

The configured first-pass article thresholds are **1,500–5,000 words**, **3–7 internal links**, and **SEO score at least 75**. These are automated acceptance thresholds, not a substitute for accurate facts, useful writing, or external source checks. Do not invent pricing, stock, model specifications or legal requirements.

## Useful verification commands

From a repository checkout with Node.js 22:

```bash
node tools/factory.mjs status
node tools/factory-liveness.mjs
node scripts/qa.mjs
node tools/build-content-index.mjs --check
node tools/build-chat-index.mjs --check
```

For production changes, verify the relevant GitHub Actions run and deployed Pages version. For search visibility, verify index coverage and canonical URLs in Google Search Console rather than assuming successful deployment equals indexing.

## Project documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Factory liveness and external-writer requirements](docs/FACTORY-LIVENESS.md)
- [Writer backend feasibility](docs/WRITER-BACKENDS.md)
- [SEO content cluster rules](docs/SEO-CONTENT-CLUSTER-RULES.md)
- [Silo map](docs/SILO-MAP.md)

This README describes the current state; it does not modify factory settings or promise unattended AI content generation.

## Modifier une fois, synchroniser tout le site

Le build partagé pré-rend les composants sur les **543 pages indexables**, tout en conservant les quatre redirections et le contenu éditorial. Modifier le CTA, le téléphone, les options ou les liens associés dans `assets/js/site-config.js`; les couleurs et dimensions dans `assets/css/site.css`; les blocs globaux dans `site/slots/`. Le layout commun est `site/templates/layout.html`.

Chaque publication valide le contenu, les métadonnées, les URL, le sitemap et les composants avant de déployer `_site/` avec **Shared Site Publish**. Aucun framework ni dépendance runtime supplémentaire. Voir [l’audit et le guide des points d’édition](docs/SHARED-SITE-AUDIT.md).
