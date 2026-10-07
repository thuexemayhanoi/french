# SEO content, topical clusters & internal linking rules

These rules apply to **all existing pages and every new page** created in the French repository before the 500-article factory is enabled.

## SEO content

- One primary search intent per URL.
- French copy must be written for French search intent, not literal translation.
- Foundation/content pages: **1,500–3,000 words**. Contact is intentionally exempt.
- Exactly one H1, unique title, unique canonical and useful meta description.
- Do not invent current prices, inventory, availability, legal rules, road conditions or vehicle specifications.
- Legal/licence content must be rechecked against current official sources before publication.
- Travel content must distinguish evergreen planning advice from conditions that can change.

## Topical clusters

Nine parent clusters remain canonical: Location Hanoi, Honda, Yamaha, Types de motos, Prix, Permis & sécurité, Hanoi, Nord Vietnam, Centre & Sud.

Each new article must:
1. belong to one primary cluster;
2. link back to its parent hub;
3. link to at least two contextually related pages;
4. avoid targeting the same primary intent as an existing URL;
5. use sibling/cross-cluster links only where they help the reader's next decision.

The shared related-content component derives the current cluster from the URL and prioritizes the parent hub, sibling pages and useful cross-cluster hubs.

## Internal links

- Every non-contact page must contain at least **3 static internal links in the body**.
- Shared topical-cluster cards add further contextual links at runtime.
- Prefer descriptive anchors (for example, `Prix de location par mois`) over generic anchors such as `cliquez ici`.
- Do not create sitewide exact-match keyword spam.
- Future 500-article content should normally link: parent hub + 2–4 sibling/related articles + 1–2 supporting hubs such as Prix, Permis or Types where useful.

## Cross-language link

The French homepage contains a body link to the English site:
`https://app.rentbikehanoi.com/`

This is a normal editorial language link, not a claim that every page has an exact English equivalent. Do not add hreflang sitewide unless equivalent page mappings are defined.

## QA enforcement

`scripts/qa.mjs` checks the long-form word range, unique titles/canonicals, sitemap membership, shared data, breadcrumbs, topical-cluster placeholder, minimum static internal links and the English-site homepage link.
