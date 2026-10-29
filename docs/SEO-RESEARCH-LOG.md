# French SEO research log

## Initial planning evidence — 2026-10-29

- Repository snapshot: `fd067ab75efa62af373481de1da95df9bba9d14d`; full local inventory and built-HTML checks are separate from live crawl/indexing.
- Owner source: current NAP/hours/reference prices are transcribed in `docs/SEO-FACTS.md` and `data/seo-business-facts.json`. Conflicting legacy config was read directly, not inferred from another site.
- [Google title links](https://developers.google.com/search/docs/appearance/title-link), read 2026-10-29: use unique concise descriptive titles; no fixed character limit.
- [Google generative AI search guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide), read 2026-10-29: useful content, technical clarity and real evidence; no special AI inclusion promise.
- [Google documentation update history](https://developers.google.com/search/updates), read 2026-10-29: FAQ rich result deprecated May 7, 2026, documentation removed June 15, 2026.
- Local inventory findings are signals for task prioritization, not search engine judgments. Inspect `data/seo-master-matrix.json` and `docs/SEO-PROGRESS.md` for measured source counts and examples.

## Pending research: G06, G13, G14, G16, G20, G26

No current French SERP rank, keyword volume, traffic, GSC/GA4/GBP data, AI citation result or field CWV was collected for the initial plan. Do not manufacture any. Research relevant query groups with actual available tools during implementation; no single country is assumed from the French language alone. Distinguish observed search locale, intended francophone traveler audience and pickup location in Hanoi.

For each real research batch append date, task/page IDs, exact question or query, tool and locale (if known), primary source URLs, narrow supported facts, impact on content/ownership, and remaining uncertainty. Legal/licence/safety and current specs/route conditions need current authoritative sources, not unsourced competitor claims. Competitor patterns may inform intent but are not evidence for this business's prices, policies or stock.

## P0 research observations — 2026-10-29

Queries `location moto Hanoi scooter prix semaine mois français` and `louer moto Hanoi location francophone documents caution` were run with the available web search; stronger follow-ups used `"location moto Hanoi" -site:rentbikehanoi.com` and `"location scooter Hanoi" prix -site:rentbikehanoi.com`. Results still included owned subdomains, so exclusions/locale are not assumed to have been honored. No Google position, volume, competitor traffic or country-specific SERP ranking is claimed. The observed questions support separating rate comparison, rental process and commercial contact, but a complete competitor/silo study remains G06.

Observed first-party page examples include https://global.rentbikehanoi.com/fr/topics/tarifs-caution/, https://app.rentbikehanoi.com/hanoi-motorbike-rental/, https://rentbikehanoi.com/motorbike-rental-prices-in-hanoi/ and https://en.rentbikehanoi.com/articles/motorbike-rental-price-hanoi/. These pages contain conflicting business facts; they are not used to override the owner’s current instructions or import deposit/delivery claims. New French copy is original and uses the explicit owner rate source.

Schema implementation references rechecked: https://developers.google.com/search/docs/appearance/structured-data/local-business, https://developers.google.com/search/docs/appearance/structured-data/organization and https://schema.org/LocalBusiness. Applied truthful identity and entity links; optional unknown geo/email/sameAs/authors/dates are omitted rather than invented.

## G06 public French SERP observations — 2026-10-29 (second batch)

Tool: the session's WebSearch, which is a US-hosted index. No country, device or ranking position is implied, and no volume or traffic data was available. Fetching individual pages is blocked in this session: WebFetch and curl are restricted by the network policy and Firecrawl has no credits left. Observations are therefore limited to search titles, URLs and returned snippets.

| Query (French) | Result types observed | Actionable gap for fr.rentbikehanoi.com |
| --- | --- | --- |
| `location moto Hanoi` | Third-party rental directories and guides (vietnamtourism.com/fr/rent/hanoi, a dated shop list mostly in the Vieux Quartier), marketplaces with per-model listings (riderly.com/fr, bikesbooking.com/fr), Routard forum threads, guided-tour listings (Expedia, byfood) | Results are directory-style and centred on the Old Quarter. Our differentiation is a single confirmed shop with an exact Long Biên pickup point, so the quartiers page explains how to reach it from each district. The homepage keeps the commercial intent and the pillar covers the steps. |
| `louer un scooter à Hanoi prix par jour conseils` | Price ranges quoted by third parties: about 100 000–200 000 VND/day for scooters (autoviatest, vietnamtourism, Oct 2026 snippet), €4–12/day (fairmoove), higher bike ranges (bikesbooking); recurring advice to photograph the bike, keep a photocopy of the passport and check insurance | The owner's range (150 000–200 000 VND/day) is consistent with the market observations. Keep the disclaimer and add no € conversion without a dated source. Inspection, passport and insurance questions must stay practical and qualified. |
| `boucle de Ha Giang moto louer à Hanoi conseils permis` | Dated guides (vietnamtourism.com « boucle de Ha Giang 2026 le guide honnête »), agencies (junglebosstours), lepetitjournal, Routard threads; recurring topics include the 1968-Convention IDP with motorcycle category, insurance refusal without a valid licence, police checks and easy riders | Ha Giang and licence pages need dated, sourced licence and insurance statements (G13) and honest skill and vehicle advice. Bus transport of a rented bike and one-way return stay owner questions (O02/O05). |
| `permis international Vietnam moto touriste français 2025` | Mixed: vietnamtourism.com guides (1968 Vienna Convention IDP, category A/A1, stricter enforcement reported from 2025), older Routard answers (2016) now outdated, expat forum claims about passports and insurance | The audience meets contradictory advice, so the permis hub must state the official basis (Law 36/2024/QH15, Decree 168/2024/ND-CP) with check dates and uncertainty. Forum claims are not evidence. |

Competitors observed in French (third parties and owned domains alike) are treated as competitors; no query is ceded. Their prices and policies are not evidence for this business. Next research use: legal and route digests from the hub agents (G13/G14), then per-article verification during the reviews.
