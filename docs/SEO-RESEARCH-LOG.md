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

## G13 legal digest — research batch 2026-10-30 (binding for licence/safety copy)


Check date: 2026-10-30. Status per source: **retrieved** = full text read via a fetch tool during this task; **seen in search result** = only the search snippet/summary was seen, so stay within the wording below and phrase anything more as « à vérifier ».

Network note: WebFetch/Firecrawl blocked in this session; TinyFish fetch worked twice (UN treaty page, Law 36/2024 full text) before being stopped. Decree 168/2024 fine amounts were **not** read: do not publish fine amounts.

### 0. How to use this digest in articles

- Never write « sans permis » or « le permis international suffit » as a blanket rule. Always tie the answer to: vehicle category (xe gắn máy vs xe mô tô A1/A), the driver's documents (national licence category + IDP of the right convention), age, and the vehicle's papers.
- A rental shop accepting a customer is **not** a legal validation. Law 36/2024 art. 9(7) even forbids handing a motor vehicle to someone who does not meet the legal conditions.
- Put « Vérifié le 30 octobre 2026 » (or the actual date of your own check) near legal content, cite the source inline.

### 1. Law No. 36/2024/QH15 on road traffic order and safety (Luật Trật tự, an toàn giao thông đường bộ)

Sources:
- Full text, **retrieved**: https://hcc.nghean.gov.vn/tin-tong-hop/toan-van-luat-trat-tu-an-toan-giao-thong-duong-bo-1545.html (Nghệ An provincial portal, « TOÀN VĂN »).
- Official government record, **seen in search result**: https://chinhphu.vn/?pageid=27160&docid=211194&classid=1&orggroupid=1 (snippet: « Số ký hiệu 36/2024/QH15 ; Ngày ban hành 27-06-2024 ; Ngày có hiệu lực 01-01-2025 »).
- Also seen in search result (not opened): https://thuvienphapluat.vn/van-ban/Giao-thong-Van-tai/Luat-trat-tu-an-toan-giao-thong-duong-bo-2024-so-36-2024-QH15-444251.aspx (bot-blocked for fetch).

| # | Rule (summary / translation) | Article | Uncertainty |
|---|---|---|---|
| 1.1 | Law adopted 27 June 2024, **in force 1 January 2025** (art. 10(3) on child seats in cars from 1 Jan 2026). Replaces Road Traffic Law 23/2008/QH12. | Art. 88 | none |
| 1.2 | **xe gắn máy** (moped) = 2- or 3-wheeler with **design speed ≤ 50 km/h**; if thermal engine, displacement **≤ 50 cm3**; if electric motor, power **≤ 4 kW**; excludes « xe đạp máy ». **xe mô tô** = 2- or 3-wheel motor vehicle other than xe gắn máy. | Art. 34(1)(e)(g) | Both conditions (≤50 cm3/≤4 kW **and** ≤50 km/h design speed) apply. A vehicle sold or rented as « 50cc » must actually fall within this definition; check its registration papers. |
| 1.3 | **xe đạp máy** (incl. electric bicycles) = bicycle with motor assistance cut when the rider stops pedalling or at 25 km/h; classed as « xe thô sơ » (non-motorised). | Art. 34(2)(b) | — |
| 1.4 | Prohibited: driving a motor vehicle **without the licence required by law** (9.1); driving any vehicle with **any alcohol concentration in blood or breath** (9.2, i.e. zero tolerance); drugs (9.3); **holding and using a phone** while moving (9.6); **handing a motor vehicle to a person who does not meet legal conditions** (9.7); fleeing after an accident / not helping a victim when able (9.26). | Art. 9 | none |
| 1.5 | Driver must be of age and health, hold a **valid licence with remaining points matching the vehicle**, **except xe gắn máy riders** (see 1.6). Must carry: (a) vehicle **registration certificate** (or certified copy + bank confirmation if mortgaged); (b) licence matching the vehicle; (c) technical inspection certificate where the law requires it; (d) **compulsory civil-liability insurance certificate of the motor-vehicle owner**. | Art. 56(1) | Inspection (c) applies « theo quy định của pháp luật »; motorbike inspection status not checked. |
| 1.6 | **xe gắn máy riders**: no driving licence required by art. 56(1); they must **understand traffic rules, have riding skills**, and meet **age (≥16) and health** conditions. | Art. 56(4), 59(1)(a) | Registration + insurance documents of 1.5 still listed for « người lái xe ». Travel insurers may treat it differently: verify contract. |
| 1.7 | Documents integrated in the electronic identification account (VNeID) may be shown electronically. | Art. 56(3) | Relevant mainly to Vietnamese residents. |
| 1.8 | Licence classes: **A1** = two-wheel motorcycles **up to 125 cm3** or electric motor **up to 11 kW**; **A** = two-wheel motorcycles **over 125 cm3** or **over 11 kW** + all A1 vehicles; **B1** = three-wheel motorcycles + A1 vehicles. A1, A, B1 have **no expiry**. | Art. 57(1)(a)(b)(c), 57(5)(a) | none |
| 1.9 | Licences **valid in Vietnam**: (a) Vietnamese licences; (b) **an international driving permit (IDP) together with the national licence, matching the vehicle type, issued by a state party to the UN 1968 Convention on Road Traffic (« Công ước Viên »)**; (c) licences of countries/territories with a bilateral mutual-recognition agreement; (d) foreign licences recognised under a treaty to which Vietnam is party. | Art. 57(6) | Which bilateral agreements exist was not checked: present (c)/(d) as « cas particuliers à vérifier ». |
| 1.10 | IDP = issued by a competent authority of a **Vienna Convention state** on the uniform model; valid **max 3 years** and within the validity of the national licence. The holder **must carry the IDP and the national licence of the appropriate class, both valid**, and obey Vietnamese law. A suspension cannot exceed the holder's permitted stay. Residents (temporary/permanent residence card) may obtain a Vietnamese-issued IDP. | Art. 57(8)(a)–(d) | none |
| 1.11 | Minimum ages: **16** for xe gắn máy; **18** for licences A1, A, B1, B, C1. | Art. 59(1)(a)(b) | none |
| 1.12 | A **still-valid foreign licence** can be exchanged (« đổi ») for a Vietnamese licence. | Art. 62(2)(đ) | Conditions are in the implementing circular (see §4). |
| 1.13 | Licences issued before 1 Jan 2025 stay valid until printed expiry. Old **A1** still covers 2-wheelers **50 cm3 to < 175 cm3** (or 4 kW to < 14 kW); old **A2** ≥ 175 cm3 / ≥ 14 kW. On exchange, old A1 becomes **A restricted to < 175 cm3 / < 14 kW**. | Art. 89(1), (2)(a)(b), (3)(a) | Concerns Vietnamese licences only (residents / converted licences). Do not apply to foreign licences. |
| 1.14 | Speed: obey limits and safe distance; adapt speed to road, traffic, terrain, weather; slow down/stop at pedestrian crossings, bends, **passes and slopes (đường đèo, dốc)**, schools/markets/crowded areas, **rain, wind, fog, smoke, dust, slippery or muddy roads**, livestock. Detailed limits set by ministerial regulation. | Art. 12(1)–(4) | Numeric limits (Circular 38/2024/TT-BGTVT) **not verified** in this task: do not quote km/h figures from this digest. |
| 1.15 | Slower vehicles keep right; stay in one marked lane, change only where allowed, one lane at a time, with signal. | Art. 13(1)(2) | — |
| 1.16 | Turning: check, keep distance, slow down, signal continuously, move to the lane nearest the turn; yield to pedestrians, non-motorised vehicles and **oncoming traffic**. No U-turn on pedestrian crossings, bridges, under overpasses, slopes, blind bends, expressways, tunnels, **one-way streets** (unless directed). | Art. 15 | — |
| 1.17 | Headlight on **18:00–06:00** and whenever fog, smoke, dust, rain or bad weather limit visibility; dipped beam in lit populated areas, when meeting oncoming vehicles or pedestrians crossing, when turning at intersections. | Art. 20(1)(2) | — |
| 1.18 | Horn only to warn of a possible danger or to signal overtaking; **no continuous horn**; **no horn 22:00–05:00** in populated areas and near health facilities (except priority vehicles). | Art. 21 | Contradicts the folk idea that constant honking is « the rule ». |
| 1.19 | At intersections: from a minor road yield to the main/priority road; at intersections **without roundabout sign, yield to vehicles from the right**; **at roundabout-signed intersections, yield to vehicles coming from the left**. | Art. 22 | — |
| 1.20 | **xe mô tô, xe gắn máy (and similar), non-motorised vehicles and pedestrians may not use expressways (đường cao tốc)**, except maintenance. | Art. 25(3) | none |
| 1.21 | Two-wheel motorcycle / xe gắn máy may carry **only one passenger**; max **two** when carrying a patient to emergency care, escorting an offender, a **child under 12**, or an elderly/disabled person. | Art. 33(1) | — |
| 1.22 | **Rider and passenger must wear a helmet meeting the national technical regulation, strap correctly fastened.** | Art. 33(2) | Standard = QCVN 2:2021/BKHCN (see §5). |
| 1.23 | Rider may not: ride abreast; use an umbrella or audio device (hearing aids excepted); ride hands-free/one wheel; tow/push, carry bulky objects, passenger standing; etc. Passenger may not carry bulky objects, use an umbrella, hold/tow other vehicles. | Art. 33(3)(4) | — |
| 1.24 | Load on motorbike: max **0.3 m beyond the luggage rack each side**, **0.5 m behind** it, height **≤ 2 m** from the road surface. | Art. 33(5) | — |
| 1.25 | After an accident, drivers involved must: **stop, warn of danger, keep the scene, help victims and notify the police, a health facility or the nearest People's Committee**; stay until police arrive (except to seek/bring emergency care or under threat, then report immediately); give identity information. Witnesses must help, inform authorities, protect scene and victim's property. | Art. 80 | — |

### 2. UN Convention on Road Traffic, Vienna, 8 November 1968 (UN Treaty Collection, chapter XI.B.19)

Source, **retrieved**: https://treaties.un.org/Pages/ViewDetailsIII.aspx?src=TREATY&mtdsg_no=XI-B-19&chapter=11&Temp=mtdsg3&clang=_en

- Convention in force since **21 May 1977**.
- **Viet Nam: accession 20 August 2014**, reservation: not bound by art. 52 (dispute settlement); distinguishing sign « VN ».
- Francophone states in the participant table: **France** (ratification 9 Dec 1971), **Belgium** (16 Nov 1988), **Luxembourg** (25 Nov 1975), **Switzerland** (11 Dec 1991), **Monaco** (accession 6 Jun 1978), **Morocco** (29 Dec 1982), **Senegal** (16 Aug 1972), **Tunisia** (5 Jan 2004). United Kingdom: 28 Mar 2018.
- **Canada, United States and Australia do not appear** in the 1968 participant table (checked by text search of the retrieved page). Consequence with Law 36 art. 57(6)(b)/(8): an IDP issued by a non-party (typically a 1949 Geneva-model permit) is **not** the document named by Vietnamese law. Write: « un permis international délivré par un État non partie à la Convention de 1968 (cas du Canada, y compris le Québec) n'entre pas dans le cas prévu par la loi vietnamienne ; vérifiez auprès des autorités ». Do not claim a specific fine for this case.
- Vietnamese press (Tuổi Trẻ, 2014, **seen in search result**) said mutual IDP recognition would start 1 January 2015: historical context only.

### 3. Decree No. 168/2024/ND-CP on administrative sanctions in road traffic (fines, licence points)

- **Seen in search result**: https://vanban.chinhphu.vn/?pageid=27160&docid=212167&classid=1&orggroupid=2 (title: « Quy định xử phạt vi phạm hành chính về trật tự, an toàn giao thông trong lĩnh vực giao thông đường bộ; trừ điểm, phục hồi điểm giấy phép lái xe »); luatvietnam summary: issued **26/12/2024**, in force **01/01/2025**.
- **Fine amounts NOT read.** Do not print VND ranges from memory or secondary sites. Write: « le décret 168/2024/NĐ-CP fixe les amendes et retraits de points ; consultez le texte officiel pour les montants ».
- Law 36 art. 58: licence holds 12 points; points deducted per violation (retrieved).

### 4. Converting a foreign licence (residents)

- Law basis: art. 62(2)(đ) Law 36/2024 (retrieved): still-valid foreign licence may be exchanged.
- Implementing rule, **seen in search result**: **Circular 12/2025/TT-BCA** (Ministry of Public Security), in force **1 March 2025**; summaries: foreigners **residing, working or studying in Vietnam** with a **valid national licence** and one of: diplomatic ID, official ID, **temporary residence card or permanent residence card**; application file under art. 24(2), form in Annex XIII. URLs: https://thuvienphapluat.vn/ma-so-thue/phap-luat-thue/huong-dan-thuc-hien-doi-giay-phep-lai-xe-theo-thong-tu-122025-201157.html ; https://luatvietnam.vn/bai-viet-lien-quan/12-2025-tt-bca-392101.html
- **Possibly superseded**, seen in search result (luatvietnam related-news list): **Circular 108/2026/TT-BCA** on testing/issuing licences and IDPs, issued 29/6/2026, in force 1/7/2026 (art. 21 lists exchange cases). Not read. Write: « les conditions sont fixées par circulaire du ministère de la Sécurité publique ; vérifiez la version en vigueur ». Do **not** state document lists, fees or delays.
- A tourist without residence card: no source seen allowing conversion; present as « en principe réservé aux résidents, à vérifier ».

### 5. Helmet standard

- **Seen in search result**: QCVN 2:2021/BKHCN « Mũ bảo hiểm cho người đi mô tô, xe máy », issued with Circular 04/2021/TT-BKHCN, replaced QCVN 2:2008; from **1 Jan 2024** imported and domestically produced helmets must meet it before going on the market; conformity mark **CR** on the helmet. URLs: https://thuvienphapluat.vn/tcvn/Giao-thong/QCVN-2-2021-BKHCN-Mu-bao-hiem-cho-nguoi-di-mo-to-xe-may-919120.aspx ; https://lawnet.vn/thong-tin-phap-luat/en/new-text-summary-report/roadmap-for-athe-roadmap-for-applying-the-new-helmet-regulation-in-vietnampplying-the-new-helmet-regulation-in-vietnam-105670.html
- Legal obligation (retrieved): Law 36 art. 33(2).

### 6. Emergency numbers

- **Seen in search result** (secondary legal Q&A citing Circular 22/2014/TT-BTTTT on the telecom numbering plan): **113 police, 114 fire and rescue, 115 medical emergency**; **112** = search and rescue / national emergency line connected with 113/114/115 (Prime Minister's « Quy chế 112 »). URLs: https://thuvienphapluat.vn/hoi-dap-phap-luat/111-113-114-115-la-so-dien-thoai-gi-138013545.html ; https://www.moj.gov.vn/qt/tintuc/Lists/ChiDaoDieuHanh/Attachments/2631/Quy%20ch%E1%BA%BF%20112.doc
- A 17/04/2026 article (luatvietnam, seen) reports a **proposal** to merge 113/114/115 into one number: not in force per that summary. Write « numéros en vigueur à la date de vérification ; vérifiez sur place ».
- Operators' French/English capability: unknown; recommend asking a local person or the hotel to help call.

### 7. French-side sources

- **France-Diplomatie**, conseils aux voyageurs Vietnam, « informations utiles », **seen in search result**: https://www.diplomatie.gouv.fr/fr/information-par-pays/vietnam/conseils-aux-voyageurs-informations-utiles — summary: to drive in Vietnam, the **international driving permit is required together with the French licence**, and the vehicle must be insured. No two-wheel-specific wording was seen.
- **Belgian FPS Foreign Affairs**, seen in search result: https://diplomatie.belgium.be/fr/pays/vietnam/voyager-au-vietnam-conseils-aux-voyageurs/informations-pratiques-pour-voyager-au-vietnam — Vietnam recognises the IDP; for a motorcycle **over 50 cc** the Belgian licence must also be valid for motorcycles (**category A**).
- **France IDP**, seen in search result (ANTS reply on plus.transformation.gouv.fr linking service-public F11534): French IDP issued for **3 years**, or the remaining validity of the French licence if shorter; application online via ANTS. Consistent with Law 36 art. 57(8)(a) (≤ 3 years).
- Not verified: wording on French « B + formation 7 h » 125 cm3 equivalence abroad. Safe statement: an IDP only reproduces the categories printed on the national licence; a B-only licence does not show a motorcycle category. Do not claim more.

### 8. Not verified / do not state as fact

- Fine amounts (Decree 168/2024), speed limits in km/h (Circular 38/2024/TT-BGTVT), Decree 67/2023/ND-CP details on compulsory insurance (amounts, cover), list of bilateral licence-recognition agreements, conversion fees/delays/documents, exact current circular for conversion (12/2025 vs 108/2026), rainy-season months, emergency operators' languages.

### 9. Child-article claims to correct (from H1s and quick scan)

- `/permis-securite/50cc-scooter-license-vietnam/` H1 « 50cc au Vietnam : la cylindrée qui se conduit sans permis »: too absolute. Correct statement: a **xe gắn máy** (≤ 50 cm3 **and** design speed ≤ 50 km/h) is exempt from the driving-licence requirement (Law 36 art. 56(1),(4)), but the rider must be **≥ 16**, know the rules and have riding skills, wear a compliant helmet, have **zero alcohol**, and the vehicle's **registration and compulsory insurance** papers are still required; a vehicle outside the definition is a xe mô tô needing A1.
- `/permis-securite/electrique-scooter-license-vietnam/` H1 « Scooter électrique au Vietnam : quand aucun permis n'est exigé »: same issue. Correct statement: no licence only for electric xe gắn máy (**≤ 4 kW and ≤ 50 km/h design speed**) or pedal-assist xe đạp máy (assistance cut at 25 km/h); electric motorcycles **≤ 11 kW need A1**, **> 11 kW need A** (art. 34, 56, 57).

## G14 route digest — research batch 2026-10-30 (North Vietnam itineraries)


For reuse on the /nord-vietnam/ articles. "Retrieved" means the page was opened (TinyFish fetch_content) during this review. "Seen in search result" means the claim appeared in a WebSearch result or snippet and the page itself was not opened, so the attribution to that exact URL is likely but not certain. Keep every distance approximate ("environ", "autour de"). **Never state a driving time.** Remind readers that weather, closures, checkpoints and road works change.

### 1. Legal and administrative (sitewide)

| Fact | Source | Status | Uncertainty / usage note |
| --- | --- | --- | --- |
| Law 36/2024/QH15 on road traffic order and safety, art. 25(3): motorcycles, mopeds and similar vehicles may not use expressways (cao tốc), except for expressway management/maintenance. The law has been in force since 1 Jan 2025 (art. 88). | https://english.luatvietnam.vn/an-ninh-trat-tu/law-on-road-traffic-order-and-safety-2024-no-36-2024-qh15-360844-d1.html | retrieved | Unofficial English translation; the Vietnamese text is authoritative. Same rule already cited on /centre-sud-vietnam/ and /hanoi/excursions-moto/. |
| 9 Feb 2026: traffic police fined 11 foreign riders VND 5 million each for riding on the Tuyên Quang–Phú Thọ expressway. All held valid licences and visas. VOV adds: "motorcycles are prohibited from using expressways in Vietnam". | https://english.vov.vn/en/society/11-foreign-bikers-fined-for-expressway-violation-in-northern-vietnam-post1267768.vov | retrieved | Single news case; do not generalise the fine amount as the legal scale (Decree 168/2024 not checked here). |
| Same case, Tuổi Trẻ News | https://news.tuoitre.vn/11-foreign-motorcyclists-fined-for-riding-on-expressway-in-northern-vietnam-103260209095334098.htm | seen in search result | — |
| Resolution of 12 June 2025 (Resolution 202/2025/QH15) cut Vietnam to 34 provincial units. New local governments started on 1 July 2025. North: Hà Giang + Tuyên Quang → **Tuyên Quang**; Yên Bái + Lào Cai → **Lào Cai**; Bắc Kạn + Thái Nguyên → **Thái Nguyên**; Vĩnh Phúc + Hòa Bình + Phú Thọ → **Phú Thọ** (so Mai Châu and Tam Đảo are now in Phú Thọ); Hải Dương + Hải Phòng → **Hải Phòng**; Hà Nam + Nam Định + Ninh Bình → **Ninh Bình**. Unchanged: Cao Bằng, Điện Biên, Lai Châu, Lạng Sơn, Quảng Ninh, Thanh Hóa, Sơn La, Hà Nội (and others). Boundaries were redrawn at "provincial and commune levels". | https://news.tuoitre.vn/legislature-approves-mergers-to-reduce-vietnams-cities-provinces-to-34-103250612173225559.htm | retrieved | News summary of the resolution; the resolution number 202/2025/QH15 was seen in search results (luatvietnam.vn, hoatieu.vn, vbpl.vn). |
| Administrative seats: new Lào Cai province centred in present-day Yên Bái; Tuyên Quang in present-day Tuyên Quang; Ninh Bình in present-day Ninh Bình. | https://vietnamnet.vn/en/vietnam-finalizes-names-capitals-for-34-merged-provinces-and-cities-2390857.html | retrieved | April 2025 article, published before the June vote; the seats match the Tuổi Trẻ summary for Tuyên Quang and Lào Cai. |
| Post-merger naming in use: Ô Quy Hồ is on QL4D "between Bình Lư commune (Lai Châu) and Sa Pa ward (Lào Cai)". | https://mia.vn/cam-nang-du-lich/kham-pha-ve-dep-deo-o-quy-ho-mot-trong-tu-dai-dinh-deo-cua-viet-nam-500 | seen in search result | Shows that the former districts are gone from addresses. Travellers still say "Đồng Văn", "Mèo Vạc" and "Sapa". |

### 2. Hà Giang loop (now in Tuyên Quang province)

| Fact | Source | Status | Uncertainty |
| --- | --- | --- | --- |
| The loop is about 350 km, starting and finishing in Hà Giang city, through Quản Bạ, Yên Minh, Đồng Văn and Mèo Vạc. QL4C forms its backbone. Part of it follows the "Happiness Road" (built 1959–1965). It is closely tied to the Đồng Văn Karst Plateau, a UNESCO Global Geopark. | https://en.wikipedia.org/wiki/Ha_Giang_Loop | retrieved | Wikipedia, not official. |
| Lonely Planet (Apr 2026): about 370 km, most often ridden in 4 days (3 to 10). Legs: Hà Giang → Yên Minh ≈ 90 km (Bắc Sum pass, 7 km; Quản Bạ "Heaven Gate"); Yên Minh → Đồng Văn ≈ 100 km (Vương palace, Lũng Cú flag tower); Đồng Văn → Du Già ≈ 100 km (Mã Pì Lèng ≈ 20 km of road; Mèo Vạc about 15 km from the pass; Nho Quế boat trips); Du Già → Hà Giang ≈ 85 km. | https://www.lonelyplanet.com/articles/ultimate-itinerary-ha-giang-loop-vietnam | retrieved | Distances vary by detour (350 vs 370 km). Present them as approximate. |
| Lonely Planet: very rainy June–August; quite cold November–March (jacket, gloves). Increased police presence. Riders without a Vietnamese or international motorcycle licence should take a guided tour as a passenger ("easy rider") or a car; fines are said to start at 2,000,000 VND. | same | retrieved | The licence statement is a travel-media view. Licence validity depends on nationality and Convention status; link /permis-securite/permis/. Wikipedia cites the US State Dept saying US licences and IDPs are not valid, so sources conflict: do not issue blanket statements. |
| Border-area permit: Vietnam has long required foreigners to obtain permission for certain land-border areas, and parts of Hà Giang qualify (Quản Bạ, Yên Minh, Đồng Văn, Mèo Vạc, incl. Mã Pì Lèng/Nho Quế). Usually arranged via a tour company, hostel or homestay; independent riders apply to local immigration/police. Fee commonly reported at around 200,000–250,000 VND. Talk of a "new rule from 1 June 2026" comes from operators and was not backed by an official notice at the time of writing. The permit is separate from the driving licence. | https://www.timeout.com/asia/news/ha-giang-loop-permits-what-travellers-need-to-know-before-riding-vietnams-famous-mountain-route-061426 | retrieved (14 Jun 2026 article) | No official 2025/2026 government text found. Present it as "to check on arrival with your accommodation or immigration/police". Do not quote a fee as fact. |
| Enforcement anecdotes vary; some riders are never asked. | https://hagiangexperience.com/blog/understanding-the-ha-giang-loop-permit-what-you-need-to-know-in-2026/ ; https://www.tripadvisor.com.au/ShowTopic-g2146208-i31869-k15259749-Travel_permit_still_a_thing_for_northern_ha_giang-Ha_Giang_Province.html | seen in search result | Non-official; mention only as "les retours varient". |
| Cao Bằng → Bản Giốc ≈ 80 km; Lonely Planet lists the Hà Giang loop at about 350 km among the best Vietnamese road trips. | https://www.lonelyplanet.com/articles/best-road-trips-in-vietnam | seen in search result | Older list (around 2021); the figures came through press coverage in the snippet. |

**Not sourced:** the Hanoi → Hà Giang city distance (a search snippet said "300 km" but the URL could not be attributed). Do not print a number. Say "long transfer of several hundred km on national roads".

### 3. Sapa / Lào Cai (Lào Cai now includes former Yên Bái)

| Fact | Source | Status | Uncertainty |
| --- | --- | --- | --- |
| Hanoi → Sa Pa ≈ 315–320 km via the Nội Bài–Lào Cai expressway, a route motorbikes may not use. National-road routes are longer. | https://sunparadiseland.com/SunParadiseLandSaPa/tin-tuc/ha-noi-cach-sa-pa-bao-nhieu-km-thong-tin-chi-tiet-nhat-26798 | seen in search result | Commercial page. Other snippets gave ~330 km. Search snippets also cited QL70 (~390 km) and QL32 via Mù Cang Chải (~440–455 km) but could not be tied to a URL: say only "nettement plus long". |
| Ô Quy Hồ pass: nearly 50 km long on QL4D between Lào Cai (Sa Pa side) and Lai Châu. Summit around 2,000 m (sources range ~2,000–2,150 m). The cold season can bring fog, ice and even snow. | https://www.vietnamairlines.com/at/vi/plan-book/travel/travel-guide/o-quy-ho-pass ; https://mia.vn/cam-nang-du-lich/kham-pha-ve-dep-deo-o-quy-ho-mot-trong-tu-dai-dinh-deo-cua-viet-nam-500 | seen in search result | Altitude varies by source: write "environ 2 000 m". |

### 4. Ninh Bình (now includes former Hà Nam and Nam Định)

| Fact | Source | Status | Uncertainty |
| --- | --- | --- | --- |
| Tràng An Landscape Complex: mixed UNESCO World Heritage property, inscribed 2014 (minor boundary change 2016), 6,226 ha. It covers three protected areas: Hoa Lư ancient capital (10th–11th c.), the Tràng An–Tam Cốc–Bích Động scenic landscape and the Hoa Lư special-use forest. Karst towers rise up to 200 m. Caves show more than 30,000 years of human occupation. Visitors go by sampan rowed by local guides. The Bái Đính pagoda complex, recently rebuilt, lies in the buffer zone. | https://whc.unesco.org/en/list/1438 | retrieved | Official. |
| Hanoi → Vân Long ≈ 86 km, Bái Đính ≈ 97 km, Tràng An ≈ 100 km, Tam Cốc ≈ 104 km. | https://oxalisadventure.com/hanoi-to-ninh-binh-best-transport-options/ | seen in search result (F-hanoi review, 2026-10-29) | Operator page, not opened in this session. Use "une centaine de km". |

### 5. Hạ Long / Quảng Ninh (unchanged province)

| Fact | Source | Status | Uncertainty |
| --- | --- | --- | --- |
| UNESCO "Ha Long Bay – Cat Ba Archipelago": inscribed 1994, boundary changes 2000 and 2023 (Cát Bà archipelago added 2023). 65,650 ha, 1,133 islands and islets, in Quảng Ninh province and Hải Phòng city. Cát Bà langur is critically endangered. | https://whc.unesco.org/en/list/672 | retrieved | Official. |
| Hanoi → Hạ Long ≈ 150 km by the Hanoi–Hải Phòng–Hạ Long expressway (closed to motorbikes) and ≈ 165 km by old QL18 via Bắc Ninh–Uông Bí, a road described as narrow and busy. | https://sunparadiseland.com/en/tin-tuc/how-many-km-is-it-from-hanoi-to-ha-long-and-what-is-the-fastest-route-12507 | seen in search result | Other snippets ranged 124–170 km. Write "environ 150 à 170 km selon l'itinéraire". |
| Quảng Ninh suspends tourist-boat departures and overnight stays in the bay when storms approach (e.g. Typhoon Wipha, July 2025; also June/August 2025). Boats sheltered at Tuần Châu port. | https://halongbay.com.vn/en/p/240-tam-ngung-cap-phep-doi-voi-cac-phuong-tien-thuy-hoat-dong-va-luu-tru-tren-bien ; https://vietnamnet.vn/en/ha-long-bay-tourist-boats-suspended-as-storm-approaches-2423885.html ; https://news.tuoitre.vn/ha-long-bay-tourist-boats-banned-from-departing-as-typhoon-wipha-nears-103250720163544717.htm ; https://vietnamnet.vn/en/storm-wipha-freezes-ha-long-bay-operations-2424106.html | seen in search result | halongbay.com.vn is the Hạ Long Bay management board site. The Tuần Châu detail comes from a snippet. |

### 6. Other northern destinations

| Fact | Source | Status | Uncertainty |
| --- | --- | --- | --- |
| Mù Cang Chải ripe-rice season: roughly mid-September to early October, depending on the year. | https://www.vietnamtourism.com/en/mu-cang-chai-rice-terraces-the-complete-guide-for-2026 ; https://news.laodong.vn/du-lich/kham-pha/mua-lua-chin-hoa-buc-tranh-vang-ruc-ro-o-mu-cang-chai-1411188.html | seen in search result | Snippets disagree on dates (end 10 or 20 Oct): use "généralement". Mù Cang Chải is now in Lào Cai province (ex-Yên Bái). Distance from Hanoi: snippets give 250–350 km by route, so no number. |
| Mai Châu (ex-Hòa Bình, now Phú Thọ); Ba Bể (ex-Bắc Kạn, now Thái Nguyên); Cao Bằng (unchanged). | Tuổi Trẻ merger table above | retrieved | No sourced Hanoi distances for Mai Châu or Ba Bể: none printed. |

### 7. Wording rules derived from this digest

- Motorbikes: no expressway (cao tốc), per art. 25(3) of Law 36/2024/QH15. Navigation apps in car mode route onto expressways; choose the motorbike/avoid-expressway option and check the line on the map.
- Use the post-2025 province names once, with the old name in brackets ("Hà Giang, rattachée depuis le 1er juillet 2025 à la province de Tuyên Quang").
- No driving times. No promised weather. Rainy season = summer (June–August is very rainy in Hà Giang per Lonely Planet). Winter in the mountains = cold, fog, possible ice on high passes.
- Shop-related questions for the owner (do not assert): permission to take the bike out of Hanoi or to Hà Giang, one-way return or bus transport of the bike, breakdown assistance, insurance.
