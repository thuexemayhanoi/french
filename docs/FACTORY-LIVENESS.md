# French Factory — liveness and actual writer dependency

The French factory is a publisher and validator, not a text generation model.
The scheduled run (every 30 minutes) processes draft files from the inbox
and must not be reported as article-writing progress when no drafts exist.

## Diagnosing a stall

Run node tools/factory-liveness.mjs or inspect the French Article Factory
Actions job summary. WAITING_FOR_WRITER means there are active IDs
(from data/writer-queue.json) but zero drafts ready for publication. This is an
external-writer backlog, not an Actions failure and not evidence that
GitHub runners have a free LLM model available.

On an idle scheduled run, health diagnostics run read-only; no generated
matrix, queue, state or report changes are committed. This avoids meaningless
factory process pushes, redundant Pages builds, and inflated activity.

## Resume safely

1. Read fresh data/writer-queue.json; check the matrix on main.
2. Use a real French-language writer (agent or self-hosted model) to author
   each full article according to the inbox README and the row policy.
3. Push up to two QA-ready .article files into _factory/inbox on main.
4. The push trigger runs factory, QA, and Pages. Confirm that each article
   reached PUBLISHED (or REVIEW / REPAIR) before writing the next IDs.
   Never fabricate content or repeat boilerplate to pass word-count gates.
5. Articles in _factory/review require genuine factual/legal review;
   this patch deliberately does not auto-approve them.

No paid API is required for publishing. Truly unattended creation requires
a separate running writer (model/runtime/compute or agent). Do not claim
the target can finish hands-free without such an input source.
