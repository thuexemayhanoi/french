# French Factory Audit — reference: thuexemayhanoi/web

## What was retained from /web

The English factory has a strong operational core: source matrix, writer queue, inbox contract, duplicate title/canonical checks, canonical enforcement, word-count gates, internal-link gates, repair/block states, sitemap update, manual controls and safe git commits.

At audit time the English factory had a 1,000-page matrix, batch size 10 and 564 published content pages, with the next queue already claimed. It uses a push-triggered inbox rather than a paid AI API.

## Improvements made for /french

- Batch size starts at 2, not 10.
- The existing 43 French foundation pages remain protected and cannot be overwritten.
- The original 500-row planning workbook is normalized losslessly into four compressed source payload parts (data/source-plan.part1.b64 through part4.b64) and imported deterministically.
- Fifteen broad topics that now duplicate foundation URLs are marked FOUNDATION_MERGE instead of creating cannibalizing pages.
- The factory reports the resulting 15 plan gaps rather than silently claiming 500 unique new URLs.
- Drafts must be native French and pass a French-language signal.
- Required internal links are all enforced.
- Permit/legal rows can enter a manual REVIEW gate before publication.
- New articles automatically update sitemap and the shared content index.
- New article breadcrumbs inherit the existing silo automatically.
- Global QA understands both foundation pages and future factory pages.

## Production model

Plan -> claim 2 tasks -> writer creates _factory/inbox/<ID>.article -> factory validates -> publish or repair/review -> sitemap + content index -> QA -> commit.

No cron is enabled. No paid AI API is required. The workflow only processes drafts explicitly pushed to the inbox.

## Gap closure — 15 replacement intents

The initial audit found 15 source topics that correctly merge into the 43 protected foundation pages. To preserve the user's target of 500 genuinely new articles, the importer now appends FR-501 through FR-515 as distinct intent gaps rather than creating duplicate synonym pages.

These replacements cover navigation, phone mounting/charging, passenger/luggage setup, anti-theft habits, flooded streets, refuelling logistics, handover/return checklists, breakdown/accident handling, and five traffic-law topics. The legal topics enter the manual review gate before publication.

Expected matrix after preparation: 515 rows = 15 FOUNDATION_MERGE + 500 new article rows.
