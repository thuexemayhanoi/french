# Authoritative business facts for the French SEO project

Source: explicit owner-provided instructions in the 2026-10-29 assignment. These facts take precedence over older repository copy. Machine-readable equivalent: `data/seo-business-facts.json`.

## Confirmed NAP and hours

| Field | Authoritative value |
| --- | --- |
| Official name | Thuê xe máy Nguyễn Hà |
| Address | Ngõ 5 Nguyễn Văn Cừ, Bồ Đề, Long Biên, Hà Nội (gần Bến xe Gia Lâm) |
| Telephone / Zalo / WhatsApp | 0334 699 969 / +84 334 699 969 |
| Machine-readable telephone | +84334699969 |
| Hours | 09:00–21:00 every day, Asia/Ho_Chi_Minh |
| French production site | https://fr.rentbikehanoi.com/ |

Keep the official Vietnamese name. Use the exact address in contact/identity blocks; French explanation may clarify that the pickup point is near Bến xe Gia Lâm. Do not invent coordinates, a Maps CID, email or another official website. The existing Maps CID, `businessWebsite` and email belong to the older config and need verification before reuse as Nguyễn Hà identifiers. Use the confirmed phone channels and text address in the interim.

## Owner reference prices, VND

| Vehicle/category | Per day | Per week | Per month |
| --- | ---: | ---: | ---: |
| Semi-automatic / xe số | 150,000–200,000 | 700,000–800,000 | 1,000,000–1,200,000 |
| Automatic scooter / xe ga | 150,000–200,000 | 600,000–1,000,000 | 1,200,000–2,000,000 |
| Electric | Depends on model; confirm | 600,000–800,000 | 1,500,000–1,800,000 |
| 50cc | 200,000 | 1,000,000 | 2,000,000 |
| Vision | 200,000 | 1,000,000 | 2,000,000 |
| Air Blade (owner entry: “Air Blale”) | 200,000 | 900,000 | 1,500,000 |

French disclaimer near any price table: **« Tarifs indicatifs, à confirmer avant toute réservation selon le véhicule et la durée. »** The model-specific row takes precedence over the generic category range when writing about that model. Preserve the owner's original “Air Blale” spelling in the data provenance; “Air Blade” is the editorial model label, not a new quoted price.

These prices do not establish availability of every model discussed on the blog. Do not infer a daily electric price, multiply a daily price to invent a weekly/monthly package, or add discounts/fees. No exchange-rate conversion without a dated source and a clear distinction from the VND quote.

## Known conflicts requiring implementation, not a new owner question

At baseline `fd067ab75efa62af373481de1da95df9bba9d14d`, `assets/js/site-config.js` identifies Nguyễn Tú, 112 Nguyễn Văn Cừ, 0942 467 674, plus older rental/deposit data. Some source pages state 21:30 closing, a 4,000,000 VND 50cc deposit/passport alternative, or an 800,000 VND delivery threshold. Those are **not** current owner-confirmed facts in this assignment. `G01`/`G02` require reconciliation across source copy, shared config, built schema, CTA/contact links, content indexes and local chatbot data. Update old brand tokens and pricing only where they describe this business; retain factual third-party references when properly attributed.

Do not mass-substitute a number without reading its context. An itinerary budget, a comparison, a third-party example and the business's actual quote are different claims. Never replace a deposit with a rental rate.

## Unconfirmed fields: safe treatment

Deposits/guarantees, passport handling, refund timelines, delivery zones/fees, inclusions, actual available fleet, booking/payment methods, insurance, real team biographies/reviews, exact map identity, email and data-retention/cookie practices have **not** been confirmed by the current owner instructions. Keep a specific verification item in `docs/SEO-OWNER-VERIFY-LAST.md`; remove unsupported promises or use conditional language. Research current driving/licence/road rules from official sources and date the check; this is research work, not automatically a reason to ask the owner.

Never invent legal clauses, customers, years of experience, staff names, author credentials, original photographs or stock availability to satisfy SEO. An AI illustration remains an illustration.
