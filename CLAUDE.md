# Claude entrypoint: full French SEO project

Read and follow **AGENTS.md** first. The current owner assignment is autonomous SEO + AEO + GEO for the entire existing French site, **543 indexable URLs (500 articles + 43 foundation pages)**, with four protected redirects. It replaces the older image-only scope.

## Read on startup and every “tiếp tục”

1. `AGENTS.md`
2. `docs/SEO-MASTER-PLAN.md`
3. `docs/SEO-FACTS.md` and `data/seo-business-facts.json`
4. `data/seo-master-policy.json`, `data/seo-master-matrix.json` and `docs/SEO-PROGRESS.md`
5. `docs/SEO-OWNER-VERIFY-LAST.md` for task-scoped unknowns, never as a reason to stop independent work

```bash
python3 tools/seo_master.py status
python3 tools/seo_master.py next 20
```

Resume the committed matrix. Research, optimize, fix errors, run meaningful checks, update evidence, commit and push verified batches without routine questions/approvals. Keep owner-only verification as the final appendix. The owner has supplied current Nguyễn Hà NAP, hours and reference prices; use those over older Nguyễn Tú repository facts. Do not invent missing policies, stock, biography, rankings or legal rules.

No new article-writing loop: the 500-article target is already reached. No keyword surrender to another owned domain. Preserve existing French canonical paths, useful content, CNAME, verification tokens and redirects. Improve weak content/metadata and reconcile existing component matrices/QA as needed.

All 547 image assets are integrated. The separate Figma photographic replacement is 18/547 at the initial snapshot, with 529 valid vectors remaining. Follow `docs/IMAGE-SEO-WORKFLOW.md` when doing that component. A drawing-tool quota must not stop the other SEO tasks.

After source changes run `python3 tools/seo_master.py refresh` **before recording new DONE evidence**, then export/check the ledger and run applicable repository QA/build. Push to the current `main` without overwriting concurrent work; verify actual build/deploy jobs. See AGENTS.md for exact commands and completion criteria.

Do not claim completion from historical foundation/image status or a passing mechanical check. Report implemented, live-verified, tool-blocked and owner-deferred work separately. If quota/runtime ends, commit durable progress and exact next IDs; the next “tiếp tục” resumes them.
