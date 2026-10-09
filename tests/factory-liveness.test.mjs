import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {inspectFactory} from "../tools/factory-liveness.mjs";

function fixture(options = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "french-liveness-"));
  const write = (rel, value) => {
    const file = path.join(root, rel);
    fs.mkdirSync(path.dirname(file), {recursive: true});
    fs.writeFileSync(file, typeof value === "string" ? value : JSON.stringify(value));
  };
  write("data/writer-queue.json", {
    status: "READY",
    published: options.remaining === 0 ? 500 : 214,
    target_new_articles: 500,
    remaining_to_target: options.remaining ?? 286,
    queue: options.queue ?? [{id: "FR-151"}, {id: "FR-152"}]
  });
  write("data/factory-state.json", {
    enabled: options.enabled ?? true, blocked: options.blocked ?? false,
    last_successful_id: "FR-140"
  });
  return {root, write, cleanup: () => fs.rmSync(root, {recursive: true, force: true})};
}

test("missing drafts must not be mistaken for production progress", () => {
  const f = fixture();
  try {
    const value = inspectFactory(f.root);
    assert.equal(value.operational_status, "WAITING_FOR_WRITER");
    assert.equal(value.writer_required, true);
    assert.deepEqual(value.queued_ids, ["FR-151", "FR-152"]);
    assert.equal(value.published, 214);
  } finally { f.cleanup(); }
});

test("submitted draft unblocks normal processing without requiring an AI service", () => {
  const f = fixture();
  try {
    f.write("_factory/inbox/FR-151.article", "<html lang='fr'></html>");
    const value = inspectFactory(f.root);
    assert.equal(value.writer_required, false);
    assert.deepEqual(value.draft_files, ["FR-151.article"]);
    assert.equal(value.operational_status, "READY");
  } finally { f.cleanup(); }
});

test("completed and paused queues do not raise a false writer alert", () => {
  for (const opts of [{remaining: 0, queue: []}, {enabled: false}, {blocked: true}]) {
    const f = fixture(opts);
    try { assert.equal(inspectFactory(f.root).writer_required, false); }
    finally { f.cleanup(); }
  }
});

test("empty queue with remaining work is reported separately", () => {
  const f = fixture({queue: []});
  try {
    const v = inspectFactory(f.root);
    assert.equal(v.queue_required, true);
    assert.equal(v.operational_status, "QUEUE_EMPTY");
  } finally { f.cleanup(); }
});

test("manual review count comes from actual files", () => {
  const f = fixture();
  try {
    f.write("_factory/review/FR-321.html", "<html></html>");
    assert.equal(inspectFactory(f.root).review_count, 1);
  } finally { f.cleanup(); }
});
