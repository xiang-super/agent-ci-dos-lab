import test from "node:test";
import assert from "node:assert/strict";
import { parseNdjson, tidy } from "../dist/index.js";

test("tidy normalizes core fields and redacts secrets", () => {
  const event = tidy({
    ts: 1718500000,
    lvl: "WARN",
    message: "deprecated endpoint hit",
    authorization: "Bearer secret",
    region: "us-east-1",
  });

  assert.equal(event.ts, "2024-06-16T01:06:40.000Z");
  assert.equal(event.level, "warn");
  assert.equal(event.msg, "deprecated endpoint hit");
  assert.equal(event.authorization, "[REDACTED]");
  assert.equal(event.region, "us-east-1");
});

test("parseNdjson keeps valid events and reports malformed lines", () => {
  const result = parseNdjson('{"level":"error","msg":"failed"}\nnot-json\n{"level":"debug","msg":"ok"}');

  assert.equal(result.events.length, 2);
  assert.equal(result.diagnostics.length, 1);
  assert.equal(result.diagnostics[0].line, 2);
});

test("sampling can drop debug events without dropping errors", () => {
  const debugEvent = tidy({ level: "debug", msg: "verbose" }, { sampling: { debugRate: 0 } });
  const errorEvent = tidy({ level: "error", msg: "failed" }, { sampling: { debugRate: 0 } });

  assert.equal(debugEvent, null);
  assert.equal(errorEvent?.level, "error");
});
