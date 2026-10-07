# Manual review gate

Rows marked manual_review_required=true are never published directly.

After a draft passes technical QA, the factory stores it here as <ID>.html and marks the row REVIEW.

Approve only after checking the current official legal source and factual claims. Then run the workflow action approve with that ID.
