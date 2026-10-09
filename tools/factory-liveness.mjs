#!/usr/bin/env node
// Read-only liveness check: GitHub Actions processes drafts, but cannot invent
// original French prose without a writer. Make idle runs unmistakable.
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

function json(root, rel) {
  return JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));
}
function names(root, rel, suffix) {
  const dir = path.join(root, rel);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, {withFileTypes: true})
    .filter(entry => entry.isFile() && entry.name.endsWith(suffix))
    .map(entry => entry.name).sort();
}

export function inspectFactory(root = process.cwd()) {
  const queue = json(root, "data/writer-queue.json");
  const state = json(root, "data/factory-state.json");
  const queuedIds = (queue.queue || []).map(item => item.id);
  const draftFiles = names(root, "_factory/inbox", ".article");
  const reviewFiles = names(root, "_factory/review", ".html");
  const remaining = Number(queue.remaining_to_target || 0);
  const running = state.enabled === true && state.blocked !== true;
  const writerRequired = running && remaining > 0 && queuedIds.length > 0 && draftFiles.length === 0;
  const queueRequired = running && remaining > 0 && queuedIds.length === 0;
  let operationalStatus = queue.status;
  if (writerRequired) operationalStatus = "WAITING_FOR_WRITER";
  if (queueRequired) operationalStatus = "QUEUE_EMPTY";
  return {
    operational_status: operationalStatus,
    published: Number(queue.published || 0),
    target: Number(queue.target_new_articles || 0),
    remaining,
    queued_ids: queuedIds,
    draft_files: draftFiles,
    review_count: reviewFiles.length,
    writer_required: writerRequired,
    queue_required: queueRequired,
    last_successful_id: state.last_successful_id || null,
    last_run: state.last_run || null,
    blocked: state.blocked === true,
    enabled: state.enabled === true
  };
}

function run() {
  const result = inspectFactory();
  console.log("FACTORY_LIVENESS " + JSON.stringify(result));
  let notice = "";
  if (result.writer_required) {
    notice = "No .article drafts exist for " + result.queued_ids.join(", ") +
      ". GitHub Actions only validates/publishes writer-provided content; an external writer must submit drafts.";
  } else if (result.queue_required) {
    notice = "Queue is empty with unpublished rows remaining; run refresh-queue or inspect matrix.";
  }
  if (notice) console.log("::warning title=French factory not producing::" + notice);
  if (process.env.GITHUB_STEP_SUMMARY) {
    const lines = [
      "## French Factory — liveness",
      "- Operational status: **" + result.operational_status + "**",
      "- Published: **" + result.published + "/" + result.target + "**; remaining: **" + result.remaining + "**",
      "- Writer queue: " + (result.queued_ids.join(", ") || "(empty)"),
      "- Draft files available: " + result.draft_files.length,
      "- Manual review files: " + result.review_count,
      notice ? "- **Action needed:** " + notice : "- Draft processing can proceed when files are present."
    ];
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, lines.join("\n") + "\n");
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) run();
