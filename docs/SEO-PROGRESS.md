# French SEO master progress

Inventory snapshot: 2026-10-29. Progress is derived from the committed JSON ledger.

This is a work plan, not a claim that SEO implementation is complete.

- Existing indexable URLs: **543** (500 articles + 43 foundation URLs including homepage).
- Protected legacy redirects: **4**.
- Image inventory: **547** mapped assets; **18** Figma upgrades and **529** other retained assets (from the current component log; actual bytes/integration need image checks).
- Source of truth: `data/seo-master-matrix.json`; CSV is a regenerated view, never a competing ledger.

## Work states

| Scope | Status | Count |
| --- | --- | ---: |
| URL checkpoints | TODO | 5973 |
| Sitewide tasks | TODO | 28 |

## Findings to investigate and repair

| Source audit signal | URLs |
| --- | ---: |
| LEGACY_BUSINESS_FACTS | 14 |
| NO_SOURCE_BODY_INLINK | 246 |
| REPEATED_EDITORIAL_PARAGRAPHS | 56 |
| SEO_PROCESS_LANGUAGE_IN_READER_COPY | 45 |
| UNCONFIRMED_POLICY_OR_PRICE_CONTEXT | 17 |

Signals are not verdicts: repeated paragraphs need editorial review; zero source-body inlinks does not prove a page is unreachable through built navigation.
Title/meta lengths are editorial diagnostics, not Google limits. Source word counts are estimates and exclude navigation.

## Resume

Read `AGENTS.md`, `docs/SEO-MASTER-PLAN.md` and the ledger, then run:

```bash
python3 tools/seo_master.py status
python3 tools/seo_master.py next 20
```

After actual changes, evidence and validation: refresh, export, check, commit and push. Keep owner verification at the end in `docs/SEO-OWNER-VERIFY-LAST.md`.
Live crawl/indexing, rankings, field CWV, GSC/GA4/GBP and quota recovery remain unmeasured until actual tools provide evidence.
