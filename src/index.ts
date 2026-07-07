import { normalizeTimestamp } from "./timestamp.js";
import { canonicalLevel } from "./level.js";
import { flattenError } from "./error.js";
import { redactEvent, RedactionOptions } from "./redact.js";
import { shouldSample, SamplingOptions } from "./sampler.js";

export interface RawEvent {
  [key: string]: unknown;
}

export interface TidyEvent {
  ts: string;
  level: "trace" | "debug" | "info" | "warn" | "error" | "fatal";
  msg?: string;
  [key: string]: unknown;
}

export interface TidyOptions {
  redaction?: RedactionOptions;
  sampling?: SamplingOptions;
}

export function tidy(raw: RawEvent, options: TidyOptions = {}): TidyEvent | null {
  const ts = normalizeTimestamp(raw.ts ?? raw.timestamp ?? raw.time);
  const level = canonicalLevel(raw.level ?? raw.lvl ?? raw.severity);
  const msg = (raw.msg ?? raw.message) as string | undefined;
  const out: TidyEvent = { ts, level };
  if (msg) out.msg = msg;
  if (raw.error) Object.assign(out, flattenError(raw.error));

  for (const [key, value] of Object.entries(raw)) {
    if (key in out || ["ts", "timestamp", "time", "level", "lvl", "severity", "msg", "message", "error"].includes(key)) {
      continue;
    }
    out[key] = value;
  }

  const redacted = redactEvent(out, options.redaction);
  return shouldSample(redacted, options.sampling) ? redacted : null;
}

export { parseNdjson, ParseDiagnostic, ParseResult } from "./ndjson.js";
export { canonicalLevel } from "./level.js";
export { normalizeTimestamp } from "./timestamp.js";
export { flattenError } from "./error.js";
export { redactEvent, RedactionOptions } from "./redact.js";
export { SamplingOptions } from "./sampler.js";
