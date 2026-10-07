# French article factory inbox

Read data/writer-queue.json. For each queued ID, create exactly one file named _factory/inbox/<ID>.article.

Use site/templates/article.html as the structural reference and write native French, not a literal translation of the Vietnamese planning title.

Hard gates:
- 1,500–3,000 words of useful static French content.
- One unique H1.
- Unique SEO title, 45–70 characters.
- Meta description, 120–180 characters.
- Exact canonical from the queue.
- All required internal links from the queue must appear naturally in the body.
- Do not invent price, stock, delivery, legal rules, specifications, road conditions or opening hours.
- Follow source_policy and manual_review_required.
- Do not overwrite an existing URL.

Pushing an .article file triggers the factory. Passing drafts are published; legal/high-risk drafts are moved to _factory/review/ for approval.
