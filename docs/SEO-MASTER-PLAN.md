# French site: full SEO + AEO + GEO execution matrix

Created 2026-10-29 for `https://fr.rentbikehanoi.com/`, repository `thuexemayhanoi/french`.

## Goal and scope

Improve the existing French site as an independent commercial and editorial property: homepage, every post/article, every category/pillar/hub, About, FAQ, Contact, Privacy and Terms. The initial inventory is **543 intended indexable URLs = 500 articles + 43 foundation pages including the homepage**, plus **four protected legacy redirects**. There are **547 integrated unique image assets**, including four secondary editorial illustrations. Those counts describe committed inventory, not rankings or proof of content quality.

The owner authorizes autonomous research, implementation, repair, checks, commit, push and the existing GitHub Pages publication. No routine approval, new-topic approval or AI-review handoff is required. The completed 500-article target stays completed: optimize existing URLs rather than restarting an article factory. Do not create a new site, move domains or publish a mass of near-duplicate pages.

Aim to improve French commercial visibility, including the broad rental terms and relevant model/price/duration/local terms. Other sites, including other domains owned by the same person, are not reasons to surrender keywords or canonicalize away from this French site. Do not promise a position or invent SEO measurements. Within this site, assign one primary owner URL to each intent and make supporting pages useful and distinct.

## Files and precedence

| File | Role |
| --- | --- |
| `AGENTS.md` | Current agent instructions and owner authorization |
| `CLAUDE.md` | Claude entrypoint to exactly the same project |
| `data/seo-master-matrix.json` | Canonical mutable ledger: every URL, baseline, findings, 11 dimension checkpoints and 28 sitewide tasks |
| `data/seo-master-policy.json` | Task catalog, acceptance criteria, route overrides and source references |
| `data/seo-master-matrix.csv` | Spreadsheet-friendly export of all 543 URL rows; regenerate from JSON |
| `data/seo-business-facts.json`, `docs/SEO-FACTS.md` | Current owner-confirmed NAP/reference prices and safe handling of unknowns |
| `docs/SEO-PROGRESS.md` | Derived counts, baseline findings and resume guidance |
| `docs/SEO-RESEARCH-LOG.md` | Dated actual primary-source/SERP observations; never synthetic metrics |
| `docs/SEO-OWNER-VERIFY-LAST.md` | Owner/account-only gaps, collected at the end without interrupting independent SEO |
| `docs/IMAGE-SEO-WORKFLOW.md` | Existing image tools and the separate Figma replacement project |

The older production/foundation/image matrices remain valid component inputs and must be synchronized when relevant implementation changes. They do not mark this new whole-site project complete. Do not delete or replace the original 515-row production matrix (500 published + 15 foundation merges), the 43-row foundation mapping, 547-row image mapping, redirect mapping or verification tokens. Older reports and older restrictive image-only instructions are superseded for this assignment.

## Initial findings and what they mean

The local baseline reads every production HTML file, existing matrices, real asset inventory and (when available) the static shared build. It records actual source title/meta/H1/canonical, estimated editorial word count, headings, repeated paragraphs, source-body incoming links, broken links/fragments, schema types and image mapping. It never interprets a historical `seo_score: 100` or `overall_status: COMPLETE` as current editorial quality.

Confirmed baseline conflicts include old Nguyễn Tú identity/contact/address and old policy claims. Owner-confirmed Nguyễn Hà data in `docs/SEO-FACTS.md` is sufficient to correct these; no new NAP approval is needed. Existing email, old Maps CID/coordinates, business website, deposits/passport handling/delivery thresholds and actual fleet are not confirmed by that NAP. Do not transfer them blindly to the new identity. Read the context of prices and policy claims before fixing them.

The homepage also contains repeated generic paragraphs and sentences about SEO/cannibalization/future articles. These are signals for editorial replacement with useful French customer information, not a reason to insert even more words. Repeated-paragraph detection compares exact normalized paragraphs of 25+ words appearing on at least five pages; it identifies review candidates, not a similarity/ranking score. Zero source-body inlinks means no incoming link was found in current editorial HTML, not that built navigation cannot reach that page.

Live HTTP, Google crawl/indexing, actual query performance, AI answer inclusion, field CWV and conversion data are **not measured** by this local inventory. Record actual tool evidence separately. Quota/account limitations affect the smallest relevant task and never stop all other work.

## Sequence: work continuously, owner verification last

1. **Phase 0, P0:** shared entity/contacts/hours/prices; unsupported business claims; canonical/indexability/robots/sitemap/redirect protection; reconcile old task authority. Shared corrections propagate through build/schema/CTA and regenerated indexes.
2. **Phase 1:** research French search intent, assign keyword ownership, improve homepage/commercial pillars, remove generic filler and work all 543 URLs. Fix internal links and sync old metadata/QA matrices with approved page changes. Prefer shared fixes and then batches of related pages rather than editing random URLs.
3. **Phase 2:** direct answers/FAQs, entity/schema integrity, source-backed legal/model/itinerary facts, About/Contact/actual-practice legal pages, language relations and existing images. Resume the Figma photographic upgrade independently when tools permit.
4. **Phase 3:** actual rendered mobile/desktop/accessibility checks, loading/CWV inputs, contact flow, duplication and broken links, static build/indexes and final sitemap/robots review.
5. **Phase 4:** verified publication and live checks, evidence-based search/AI measurement where available, reconcile task states and finish all independent actionable work.
6. **Phase 5:** present only the owner/account facts still unresolved in the final appendix. Do not stop earlier to ask routine questions, request API keys, suggest a paid image plan, or hand the task back to the owner.

`python3 tools/seo_master.py next 20` provides the next active global tasks then URL batches. Use judgment: a global task covering hundreds of pages can remain `IN_PROGRESS` while its per-page work proceeds. Do not wait for a global “all articles” task to finish before fixing individual pages. Dependency or tool limits are task-scoped, not a serial lock on the whole queue.

## Per-URL work: 11 checkpoints

| Dimension | Required outcome |
| --- | --- |
| `FACTS` | Accurate owner NAP/reference prices; no unsupported operational promises; claim-specific sources/defer reasons |
| `INTENT` | One main reader need, distinct from closest siblings, preferred keyword owner, useful parent/cluster role |
| `CONTENT` | Natural, specific French that answers the need; repair repetition, gaps, weak evidence and misleading passages |
| `META` | Unique truthful title/meta/H1 and coherent OG/Twitter; synchronized legacy metadata constraints |
| `LINKS` | Contextual parent/sibling/supporting links and relevant incoming links; correct breadcrumbs/nav/footer/anchors |
| `AEO_GEO` | Clear direct answers, recognizable entities, useful tables/checklists/FAQs and honest sources where relevant |
| `SCHEMA` | Accurate built JSON-LD matching visible facts, page type and real author/date/image relationships |
| `IMAGES` | Actual relevant image, French visual alt, valid bytes/paths/dimensions, responsive placement and social metadata |
| `UX_CRO` | Readable, accessible mobile/desktop page and working appropriate contact CTA with no false promise |
| `TECHNICAL` | Correct canonical/lang/indexability/sitemap/shared rendering/local assets; protected existing route |
| `LIVE_VERIFY` | Actual deployed revision and live URL/asset/CTA observations if reachable; no indexing/rank inference |

The detailed acceptance text in `data/seo-master-policy.json` is part of each checkpoint. Every row starts TODO for this new full-site audit even if an earlier image or foundation task was complete. Do not repeat already verified image production unnecessarily; record its evidence as one completed dimension after checking relevance and integration.

## Content and intent policy

- Homepage owns broad commercial `location moto hanoi` and close rental variants. `/location-moto-hanoi/` explains choosing a vehicle, duration and the booking/rental process, linking toward the relevant category and homepage. These proposed roles solve the observed duplicate broad target; validate actual intent during research.
- Blog index is an editorial discovery hub. Model guides discuss the actual model/use case without claiming stock; duration/pricing pages answer the specific comparison, never invent packages. Local/district/travel pages need distinct practical value; do not turn them into doorway landing pages for imaginary branches.
- Homepage/pillars/hubs: normally 1,600–6,000 useful words when the subject warrants it. Supporting articles: 1,000–5,000. About: about 800–1,600 verified words. Contact concise and exact. Privacy/Terms reflect real practices and applicable requirements with no word quota. Categories need enough unique material to satisfy intent, not a fixed count.
- Do not add hundreds of words solely because a page falls below a threshold. Short and complete is preferable to repetitive padding. A short useful answer may be documented as an exception. Do not truncate useful existing content merely to meet an upper range.
- The current factory QA uses old global 1,500–5,000-word and 3–7 body-link thresholds, and foundation metadata is checked against its legacy matrix. Task `G09` reconciles these **when actual implementation needs it**, retaining meaningful quality/URL/metadata assertions. Do not silence tests, fabricate scores or blindly loosen all constraints.
- Keyword seeds in URL rows are derived from existing French H1s/metadata and explicit route overrides. They are **candidates to validate**, not search volumes, final keyword ownership, or evidence that every H1 should become an exact-match query.
- Titles are concise and descriptive. Roughly 50–70 characters is a starting editorial heuristic, not a hard Google rule. Meta descriptions should be unique and useful; do not force a character quota or stuff location synonyms. No fabricated “best”, rankings, reviews or current availability.

## Evidence and resumable status rules

Allowed statuses: `TODO`, `IN_PROGRESS`, `DONE`, `BLOCKED_TOOL`, `DEFERRED_OWNER`, `NOT_APPLICABLE`.

`DONE` requires concrete evidence in the matching checkpoint: changed file/section, what was checked, actual primary-source URLs and checked date for unstable facts, validation result, actual deployment run/SHA when relevant. It must describe work already done. `NOT_APPLICABLE` requires a reason. `BLOCKED_TOOL` includes actual attempted capability, date/error and safe retained state; continue independent dimensions. `DEFERRED_OWNER` links an exact appendix item and only covers the unverified fact/account dependency, not the rest of a page. Unknowns are never asserted as facts.

Example of a checkpoint after real work (illustrative shape, not current progress):

```json
"FACTS": {
  "status": "DONE",
  "evidence": "contact/index.html contact block and built footer use owner NAP from docs/SEO-FACTS.md; tel/wa/Zalo targets inspected; build and shared QA passed on YYYY-MM-DD."
}
```

Correct edit/update order:

1. Read current ledger and make source changes.
2. Regenerate content/chat indexes and build as needed.
3. Run `python3 tools/seo_master.py refresh`. It preserves progress but reopens old DONE checkpoints for page sources changed since their snapshot.
4. Record new, actually verified completion evidence in `data/seo-master-matrix.json`; update relevant global tasks and appendix.
5. Run `python3 tools/seo_master.py export`, then `python3 tools/seo_master.py check` and relevant existing QA. Commit source + ledger + CSV + progress together, then push.
6. Verify deployment and live state where possible; log evidence in the next small progress commit. Do not invent a future commit SHA. Shared config/schema changes require rechecking affected page dimensions even when source hashes did not change; the ledger cannot substitute for that judgment.

Never auto-mark every checkpoint DONE after a passing local checker. Never reset completed work on a new “tiếp tục”. If local runtime ends, leave durable next task IDs and exact blockers in Git.

## Validation and publication

Run the checks relevant to each change; shared/source changes require existing site QA and build verification:

```bash
python3 tools/seo_master.py status
python3 tools/seo_master.py next 20
node tools/image-seo.mjs check
node scripts/qa.mjs
node tools/build-content-index.mjs --check
node tools/build-chat-index.mjs --check
node --test tests/shared-site.test.mjs tests/factory-liveness.test.mjs
node tools/build-site.mjs
node scripts/qa-shared.mjs
python3 tools/seo_master.py refresh
# Update JSON evidence after actual checks, then:
python3 tools/seo_master.py export
python3 tools/seo_master.py check
```

GitHub Actions may publish automatically on `main`. A green `French Article Factory` idle run or a `Shared Site Publish` run whose build/deploy are skipped does not count as a fresh publish. Inspect actual successful build/deploy jobs and their source revision. Preserve existing verification meta, CNAME, content and redirects. No force-overwriting concurrent agent work.

No credentials/admin work is required to optimize local content, links, metadata, assets and shared rendering. When GSC/GA4/GBP, cross-language reciprocity, server headers or external tools are unavailable, record the smallest remaining task honestly and continue. Do not claim HTTP status or indexing from a filesystem check.

## Current official SEO guidance

Primary documentation checked 2026-10-29:

- [Google title links](https://developers.google.com/search/docs/appearance/title-link): descriptive unique titles; device truncation means no fixed title-character limit.
- [Google generative AI search guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide): useful original content and technical clarity; do not sell special AEO/GEO markup as a visibility guarantee.
- [Google documentation updates](https://developers.google.com/search/updates): FAQ rich results stopped appearing May 7, 2026; the feature documentation was removed June 15, 2026. Useful visible FAQs still serve readers; optional matching Schema.org FAQ data does not promise a Google rich result.

Recheck relevant primary docs while implementing structured data, international SEO, crawling and legal/safety claims. Do not copy old recommendations mechanically.

## Completion definition

Every one of the 543 URL rows has evidence for its applicable checkpoints; sitewide tasks are done or narrowly documented as tool/owner-deferred; no actionable TODO is hidden. Meaningful checks pass and actual deployment is recorded. Report implementation, live verification and measured search results separately. The owner appendix is last. External ranking/indexing outcomes remain unknown until measured and are never conditions for fabricating completion.
