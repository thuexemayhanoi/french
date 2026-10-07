# SEO Cluster Matrix — existing foundation pages

This matrix is now the source of truth for **SEO content, topical clusters and internal links** on the existing French site.

- 43 current foundation URLs are mapped.
- Every non-contact page keeps the 1,500–3,000 word rule.
- Every non-contact page has a primary cluster and contextual internal-link targets.
- QA checks that each required link in `data/seo-cluster-matrix.json` actually exists in the page body.
- New pages must inherit the same logic: one primary intent, one parent cluster, parent link + contextual sibling/support links.
- The homepage keeps one editorial body link to the English site: `https://app.rentbikehanoi.com/`.

The 500-article factory remains separate; when enabled, it should consume this matrix to attach each future article to a parent cluster and prevent orphan pages/cannibalization.
