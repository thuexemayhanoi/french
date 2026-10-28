#!/usr/bin/env bash
# Apply verified images in chunks of 20, then run every repository check used by CI.
set -euo pipefail
n=$(node -e 'console.log(require("./data/image-seo-matrix.json").items.filter(i=>i.status==="READY").length)')
while [ "$n" -gt 0 ]; do node tools/image-seo.mjs apply 20 >/dev/null; n=$(node -e 'console.log(require("./data/image-seo-matrix.json").items.filter(i=>i.status==="READY").length)'); done
node tools/image-seo.mjs status
node tools/image-seo.mjs check >/dev/null && echo IMAGE_CHECK_OK
node scripts/qa.mjs | tail -1
node tools/build-content-index.mjs --check | tail -1
node tools/build-chat-index.mjs --check | tail -1
node --check assets/js/assistant.js && node --check assets/js/components.js
node --test tests/shared-site.test.mjs tests/factory-liveness.test.mjs 2>&1 | grep -E '^# (pass|fail)'
node tools/build-site.mjs | tail -1
node scripts/qa-shared.mjs | tail -1
