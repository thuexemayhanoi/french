# Claude: French image SEO production — resume automatically

## Authority and scope
This repo is the French static website `https://fr.rentbikehanoi.com/`. The owner authorizes an autonomous image-SEO production project. Do not ask for routine approvals. Work in small verified batches, commit and push each completed batch. Avoid paid image APIs and do not request API keys. Use the design/image facilities already available to the Claude session (e.g. connected Canvas/Figma) when usable; a GitHub workflow alone cannot synthesize images. Never claim an image exists unless its actual bytes are committed.

## Immutable goal and inventory (2026-10-28)
- `data/image-seo-matrix.json`: **547 unique image assets**; **543 indexable pages each receive a primary image** and **4 important pages receive a secondary editorial image**. Four legacy redirect files are excluded, intentionally: no SEO image is needed on redirects.
- The source has 500 factory articles and 43 foundation URLs. Preserve all canonical URLs, sitemap entries, title, H1, breadcrumbs, existing structured data, French language and content hierarchy.
- Image SEO is separate from article production: do not restart the already completed 500-article writer queue.
- Matrix fields: `id`, `page_path`, `title_fr`, `primary_keyword_fr`, `visual_brief_fr`, `asset_path`, `alt_hint_fr`, `alt_fr`, `status`. A hint is not a verified alt; `alt_fr` stays empty until the final image is visually inspected.
- Existing NAP / contact and rental claims are out of scope. Do not modify them. Do not present a generated fictional storefront or motorcycle as a verified photograph of actual stock.

## Every session, and on every owner message "tiếp tục"
1. Read THIS file, the matrix and the latest commit. Run `node tools/image-seo.mjs status`, then `node tools/image-seo.mjs next 20` (adjust the batch only for tool quota). **Do not restart from row 1.** Already completed entries stay done.
2. For each next pending image: read `page_path` fully (especially H1/lead and subheadings); use its precise topic and search intent to refine `visual_brief_fr`. Do not create generic duplicate scooter artwork across unrelated pages. Design using the already-connected free Canvas/Figma features or equivalent genuinely available tools; never invent tool availability or image delivery.
3. Export an authentic WebP image at **1200 × 630 pixels**, usually **150–300 KB inclusive** (153600–307200 bytes), with true image contents. Optimize with free tools, if available. Check actual file bytes, header and rendered image; don't fake this via filename extension, metadata or placeholder. No watermarks, copyrighted/stock photos without permission, fake logos or numbers, text-in-image SEO, invented photos of the named business, unverified rental availability or prices.
4. Put the file at exactly `asset_path`. Review its pixels; write natural, concise **French** `alt_fr` describing what the image actually depicts (not just a keyword or title); update `status` to `READY`. Alt must be meaningful, not stuffed or duplicated. Give the image a topical asset path as already specified. Files are part of the GitHub Pages build.
5. Run `node tools/image-seo.mjs apply 20`: only verified, valid WebP entries are inserted into their matching HTML. The script adds semantic `figure/img` and, for primary images, Open Graph + Twitter image metadata. For the 4 secondary extras it adds only the on-page figure. It skips absent/oversized/undersized/unreviewed art. Then run `node tools/image-seo.mjs check`, `node scripts/qa.mjs`, `node tools/build-site.mjs`, and other standard repository QA. Inspect layout on mobile and desktop. Fix errors before publishing; never bypass important checks.
6. Commit updated image files, HTML files, matrix and any justified shared CSS in small batches; push to `main` only when checks pass, without asking for routine confirmation. Never overwrite concurrent edits without reconciling. Keep each image entry `DONE` only if the image exists and correctly appears in the page with image metadata where applicable.
7. If a drawing/export tool is missing or unavailable, leave items `PENDING` or `BLOCKED` with a concise obstacle in `note`; continue independent entries when possible. Do not substitute a broken remote image, AI-looking placeholder, or a paid external API. Owner's next "tiếp tục" is a fresh resume instruction based on committed progress.
8. Stop image creation only when `node tools/image-seo.mjs status` shows `547/547` verified assets and `543/543` indexable pages with associated images; then perform full site QA. Distinguish "planned", "generated", "committed", and "published" in any status.

## Page image QA
- Appropriate image subject for each specific article / landing page, with unique composition.
- Correct WebP bitstream, 1200×630, 150–300 KB, no 404 or duplicate asset path.
- `img alt` truthfully reflects actual visible image; width/height and decoding set to reduce layout shift; responsive layout.
- Cover image present on its URL, matching `og:image`, `og:image:alt`, Twitter image; canonical is unchanged.
- Do not alter robots, indexing, hreflang, structured data or article metadata unnecessarily; enrich relevant ImageObject / Article.image only if compatible with existing schema.
- No images added to the four redirect URLs.
- Batch progress is recorded in Git, not in transient chat memory.

## Illustration engine (how the 547 assets were produced)
Canva AI image quota was exhausted and Figma image generation is paid, so the assets are original vector illustrations drawn by `tools/seo-art/` (canvas code rendered in the pre-installed Chromium, no network, no API). `plan.mjs` maps each row (slug, title, H1/subheadings) to a scene; each scene returns the description of exactly what it drew, which becomes `alt_fr`.
```bash
node tools/seo-art/produce.mjs 40 --sheet <png>   # next pending rows → WebP at asset_path + alt_fr + READY; contact sheet for visual review
node tools/seo-art/produce.mjs --force <id,...>   # re-render specific rows (deterministic per id)
tools/seo-art/qa-batch.sh                         # apply in chunks of 20 + every CI check
```

## Quick commands
```bash
node tools/image-seo.mjs status
node tools/image-seo.mjs next 20
node tools/image-seo.mjs apply 20
node tools/image-seo.mjs check
node scripts/qa.mjs
```
