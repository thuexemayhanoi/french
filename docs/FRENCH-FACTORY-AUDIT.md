# French Factory Audit — reference: thuexemayhanoi/web

## What was retained from /web

The English factory has a strong operational core: source matrix, writer queue, inbox contract, duplicate title/canonical checks, canonical enforcement, word-count gates, internal-link gates, repair/block states, sitemap update, manual controls and safe git commits.

At audit time the English factory had a 1,000-page matrix, batch size 10 and 564 published content pages, with the next queue already claimed. It uses a push-triggered inbox rather than a paid AI API.

## Improvements made for /french

- Batch size starts at 2, not 10.
- The existing 43 French foundation pages remain protected and cannot be overwritten.
- The original 500-row planning workbook is normalized losslessly into data/source-plan.zlib.b64 and imported deterministically.
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
