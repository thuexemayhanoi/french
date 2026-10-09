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

## Writer liveness and recovery

The scheduled factory is a validator/publisher, not a generative AI writer. If the queue contains IDs but no .article drafts, check the Actions job summary for WAITING_FOR_WRITER. It is not proof that new content has been produced. See docs/FACTORY-LIVENESS.md.

An external agent or locally hosted model must create truthful original French drafts for the current queue IDs. Push only QA-ready articles; never reset the matrix or bypass manual legal review. Empty scheduled runs must not produce generated commits.
