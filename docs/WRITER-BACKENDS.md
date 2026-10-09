# Writer backends: verified feasibility (2026-10-09)

The GitHub Actions factory (`.github/workflows/article-factory.yml`) is a
validator and publisher, not a generative writer. When queue IDs exist but no
`_factory/inbox/<ID>.article` draft is committed, the run reports
WAITING_FOR_WRITER and exits without a commit (see docs/FACTORY-LIVENESS.md).
An external writer must create each draft. This note records the measured
feasibility of candidate writer backends so the constraint is documented, not
assumed.

## Measured in a real sandbox session (2 vCPU Xeon, 1 GB cgroup RAM cap)

Backend under test: llama.cpp `b11515` prebuilt CPU binaries, GGUF models,
llama-cli with an instruct prompt, French generation task
("write a ~100-word French blog intro about renting an automatic scooter in
Hanoi; do not invent prices").

- Qwen2.5-3B-Instruct Q4_K_M (2.1 GB): process killed at model load — exceeds
  the 1 GB cgroup limit. Not runnable on RAM-constrained CPU hosts.
- Qwen2.5-0.5B-Instruct Q4_K_M (491 MB): loads and generates ~150 tokens in
  ~14 s wall (about 10 tok/s including load, 2 threads). Output quality
  disqualifies it: the sampled French intro contained anglicisms ("les bici"),
  a broken final sentence ("vous plairent ?") and no usable factual structure.
  A model this size cannot produce site-quality French long-form content.

Conclusion from the sample: models small enough to fit constrained CPU
environments fail the site's quality bar by a wide margin.

## GitHub-hosted runners (ubuntu-latest, public repo)

Specs: 4 vCPU, 16 GB RAM, ~14 GB SSD, 6 h job limit, no per-minute billing on
public repositories.

- Feasible in principle: a 7B-8B Q4 GGUF (about 4.7-5 GB) fits in RAM; at CPU
  generation speeds the article-sized output (2,500-5,000 tokens) takes roughly
  5-20 minutes per article, within job limits.
- Not adopted as the production writer, for two reasons:
  1. Quality risk: long-form (1,500-3,000 words), template-exact, natural
     French with per-model topical accuracy is not reliably achieved at this
     model class; QA REPAIR loops would multiply runtime and still fail.
  2. Fabrication risk: small models invent prices, specs and rules; the site
     policy (NO_INVENTED_STOCK_OR_SPECS) treats that as a hard error, and
     manual legal review cannot be delegated to a model.
- Verdict: allowed as an experiment, never as the default content source. The
  workflow must keep reporting WAITING_FOR_WRITER rather than publishing
  low-quality generated drafts.

## Self-hosted runner option (not present in this project)

A self-hosted runner with a 24-32 GB class model (or GPU hosting a 30B-class
instruct model) would raise fluency, but the factory still needs the same
guards: no invented facts, exact template, unique title/canonical, legal
topics routed to REVIEW. Deploying one requires hardware and maintenance the
repository does not have today; until it exists, the factory must not pretend
to write.

## Current production writer (working, verified)

The working writer today is the external agent session: it reads
data/writer-queue.json, writes native French drafts for the assigned WRITING
IDs, passes them through the local factory harness (`node tools/factory.mjs
process`, index builds, `node scripts/qa.mjs`, verify-last), then commits the
drafts to main. The scheduled factory validates, publishes, updates the
sitemap, and verifies. This pipeline produced every published article to
date; nothing in the repository generates content autonomously.
