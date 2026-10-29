#!/usr/bin/env bash
# Publish a verified wave of finished pages while other agents keep editing the working tree.
# Usage: tools/seo_wave_commit.sh "<commit subject>" "<exclude-regex>" [review-evidence.json ...]
#   exclude-regex: paths still being edited (left out of this commit), e.g. '^(yamaha|hanoi)/(index|...)\.html$'
#   review files: editorial evidence (docs/SEO-EDITORIAL-GUIDE.md §7 / article protocol), already copied into data/seo-evidence/
# Extra ledger records (page "checks" or global "task" entries) may be listed in $EXTRA_RECORDS (space-separated paths).
# Steps (in an isolated git worktree at origin/main): copy changed files → regenerate indexes/build → refresh ledger →
# built + UX audits (light and dark) → merge/record evidence → export/check → full QA → commit → push (no force).
set -euo pipefail
subject=$1; exclude=$2; shift 2
reviews=("$@")
repo=$(git rev-parse --show-toplevel)
tmp=$(mktemp -d); wt="$tmp/wt"
git -C "$repo" fetch -q origin main
git -C "$repo" worktree add -q --detach "$wt" origin/main
trap 'git -C "$repo" worktree remove --force "$wt" >/dev/null 2>&1 || true; rm -rf "$tmp"' EXIT
cd "$repo"
{ git diff --name-only origin/main; git ls-files --others --exclude-standard; } | sort -u \
  | grep -Ev "$exclude" | grep -v '^tools/__pycache__' | while read -r f; do [ -e "$f" ] && echo "$f"; done > "$tmp/files"
tar cf - -T "$tmp/files" | (cd "$wt" && tar xf -)
cd "$wt"
node tools/build-content-index.mjs >/dev/null
node tools/build-chat-index.mjs >/dev/null
node tools/build-site.mjs >/dev/null
python3 tools/seo_ownership.py >/dev/null
python3 tools/seo_master.py refresh >/dev/null
python3 tools/seo_built_audit.py --out "$tmp/built.json" >/dev/null
node tools/seo_ux_audit.mjs --out "$tmp/ux.json" >/dev/null 2>&1
node tools/seo_ux_audit.mjs --dark --out "$tmp/ux-dark.json" >/dev/null 2>&1
python3 - "$tmp/ux.json" "$tmp/ux-dark.json" <<'EOF'
import json, sys
light, dark = (json.load(open(p)) for p in sys.argv[1:3])
for path, views in dark['results'].items():
    for name, data in views.items():
        light['results'].setdefault(path, {})[name + '_dark'] = data
light['meta']['method'] += '; also rendered with prefers-color-scheme: dark'
json.dump(light, open(sys.argv[1], 'w'))
EOF
args=()
[ ${#reviews[@]} -gt 0 ] && args=(--review "${reviews[@]}")
images=()
[ -f data/seo-evidence/2026-10-29-images-visual-review.json ] && images=(--images data/seo-evidence/2026-10-29-images-visual-review.json)
python3 tools/seo_evidence_merge.py --built "$tmp/built.json" --ux "$tmp/ux.json" --mechanical-all "${images[@]}" "${args[@]}" --out "$tmp/records.json"
python3 tools/seo_master.py record "$tmp/records.json" | sed -n 2p
for extra in ${EXTRA_RECORDS:-}; do python3 tools/seo_master.py record "$extra" | sed -n 2p; done
python3 tools/seo_master.py check | python3 -c "import json,sys; d=json.load(sys.stdin); print('ledger', d['errors'] or 'ok', d['page_checkpoints'], d['global_tasks']); sys.exit(1 if d['errors'] else 0)"
node scripts/qa.mjs | tail -1
node scripts/qa-shared.mjs | tail -1
node tools/build-content-index.mjs --check | tail -1
node tools/build-chat-index.mjs --check | tail -1
node tools/sync-business-facts.mjs --check
node tools/image-seo.mjs check | grep -q '"errors": \[\]'
node --test tests/shared-site.test.mjs tests/factory-liveness.test.mjs 2>&1 | grep -E '^# fail 0' >/dev/null
python3 tools/seo_ownership.py --check
git add -A
git commit -q -m "$subject" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011a4uftkoDEkMRBeHPeZiHr"
git push -q origin HEAD:main
sha=$(git rev-parse HEAD)
cp data/seo-master-matrix.json data/seo-master-matrix.csv docs/SEO-PROGRESS.md data/seo-query-ownership.json \
   assets/chat/search-index.json assets/js/content-index.js "$tmp/" 2>/dev/null || true
cd "$repo"
git fetch -q origin main
git reset -q "$sha"
for f in data/seo-master-matrix.json data/seo-master-matrix.csv docs/SEO-PROGRESS.md data/seo-query-ownership.json; do git checkout -q -- "$f"; done
echo "PUSHED $sha"
