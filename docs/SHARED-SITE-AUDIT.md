# Shared-site architecture audit and operating guide

Audit date: 2026-10-10. Baseline: `9f49b04e6afa8473f2da2e917019c458cc426685`.

## Findings and chosen approach

The existing site has 543 indexable pages (500 factory articles and 43 foundation pages), four legacy redirect pages, one stylesheet with CSS variables, browser-rendered shared components, shared JavaScript config and a factory article template. Existing article HTML contains empty component hooks. Editing the factory template alone cannot update previously published article bodies. Additionally, 254 source pages omit the component script and 94 contain a stray quote in shared hook names; the shared build repairs those hooks and ensures the bootstrap script is loaded. Those pages regain previously missing shared UI, while editorial bytes and CSS remain intact. The previous component code hardcoded CTA copy, footer groups and related-link limits and ignored some feature flags.

Keep this lightweight architecture. `tools/build-site.mjs` copies public assets and pre-renders the existing component hooks into `_site/`. It executes the **same** `assets/js/components.js` used for browser fallback, through a small, explicit adapter for the component's selectors. There is no extra parser/framework dependency, API, runtime server or per-article migration. Unsupported adapter selectors fail the build. The adapter operates only on empty, known source hooks; future HTML changes must be accompanied by QA.

`site/templates/layout.html` controls the outer document shell for every indexable page, preserving the original head, body attributes and editorial body. The factory's `site/templates/article.html` continues to generate new articles. Changing editorial sections or article-specific metadata remains an editorial operation, not an automatic bulk rewrite.

## Edit one source, publish all pages

| Requested change | Single editing location |
| --- | --- |
| Colors, typography, spacing, responsive layout | `assets/css/site.css` (CSS variables and shared rules) |
| Brand, phone, contact channels, hours, CTA text/buttons, footer groups | `assets/js/site-config.js` |
| Enable/disable CTA, related links, schema, breadcrumbs, theme/status, chatbot | `featureFlags` in `assets/js/site-config.js` |
| Related-link count (0–8) and cross-silo rules | `related` in `assets/js/site-config.js` |
| Header/footer/CTA/related/breadcrumb/schema markup or behavior | `assets/js/components.js` |
| Outer document wrapper across existing pages | `site/templates/layout.html` |
| Global banner before main content | `site/slots/before-main.html` |
| Shared block between editorial content and global CTA | `site/slots/after-article.html` |
| Shared block before the existing footer hook | `site/slots/before-footer.html` |
| Enable/disable a slot | `slots` in `assets/js/site-config.js` |
| Shape of newly generated editorial articles | `site/templates/article.html` |

Slot files start empty, so they add no visible UI. Slot HTML may use escaped `{{site.phoneDisplay}}`, `{{site.hours.open}}`, or another scalar config path. An unknown key fails the build. A nonempty slot whose anchor is missing also fails instead of silently omitting content. Footer slots apply to pages that already have a footer hook; the audit retains existing page-specific layout differences.

Browser scripts recognize `data-shared-built="1"`, preserving static blocks and avoiding duplicate schema. Interactive menu, theme, live business status, TOC fallback and local assistant still initialize. A generated asset fingerprint prevents stale JS/CSS after deploy. Existing related navigation remains six links by default, and uses existing tags/silos. It supplements existing editorial links without editing paragraphs or increasing the factory's editorial link limits. FAQ schema uses only existing visible FAQ blocks/marked questions and answers; no invented FAQ, review or rating data is added.

## Business data and scope

The shared closing time was corrected from 21:30 to **21:00**, and the Maps link now uses the owner's canonical CID. The business schema uses the Vietnamese brand, official main website, published phone and daily opening hours. French site title and editorial metadata remain intact. Design colors have a single source in CSS, instead of an unused second color map in config.

**Existing editorial debt:** three source pages contain literal `21:30` inside prose. The home page also contains a passport-as-deposit-alternative claim that requires owner verification. These are pre-existing editorial statements, not introduced by this refactor. They were preserved under the explicit instruction to keep article content. Shared config changes do not silently rewrite prose, historical quotes, legal claims or prices. Future managed business facts in shared blocks should use config bindings. A separately authorized content correction should address those existing claims.

## Build, QA and deployment

```bash
node scripts/qa.mjs
node tools/build-content-index.mjs --check
node tools/build-chat-index.mjs --check
node --test tests/shared-site.test.mjs tests/factory-liveness.test.mjs
node tools/build-site.mjs
node scripts/qa-shared.mjs
```

The shared QA compares exact editorial article bytes, title/meta/OG/canonical, H1 count, unchanged redirects and sitemap/robots/CNAME, generated local resource targets, single valid JSON-LD graph and related-link uniqueness/self-link/limit rules. Regression tests exercise a one-place CTA/contact update, feature flags, slot interpolation and safe schema escaping. Original SEO/factory gates remain in force. `_site/` is ignored by source QA and chatbot indexing, preventing duplicate discovery or index drift.

`Shared Site Publish` validates and builds before uploading `_site` and deploying GitHub Pages. It keeps the current CNAME/domain and selects the verified workflow artifact as Pages source. Pushes to main trigger publication. Factory/review/index bot commits are covered by `workflow_run` because GITHUB_TOKEN-created commits do not trigger new push workflows; unchanged scheduled factory runs skip publication. All deployments use latest main and serialize rather than cancel an active deployment.

Rollback: revert the source refactor commit; restore the previous GitHub Pages source if reverting the publish workflow. No hosting files, WordPress configuration, source URLs, sitemap entries, factory state or article bodies were changed.

## Validation recorded for this rollout

- Original SEO QA: 547 public HTML files passed; content index: 500 articles; chat index: 543 pages.
- Shared output QA: 543 indexable pages, four exact redirects, 543 JSON-LD scripts; article bytes/metadata/sitemap preserved; output resource links and related links passed.
- Ten Node regression tests passed (five shared-site tests and five existing factory-liveness tests).
- Chromium comparisons on home, FAQ and a healthy article at 1440px and 390px: unchanged shared markup and element geometry. Menu/theme/chat initialized and a single shared schema was present.
- With JavaScript disabled, built article navigation, CTA, six related links and schema remained present.
- Pages with missing bootstrap/malformed hooks are the intentional UI repair exceptions described above; they were not falsely counted as visually identical to their broken baseline.
