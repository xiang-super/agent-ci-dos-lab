import type { TidyEvent } from "./index.js";

export interface SamplingOptions {
  debugRate?: number;
  traceRate?: number;
}

export function shouldSample(event: TidyEvent, options: SamplingOptions = {}): boolean {
  if (event.level === "debug") return deterministicSample(event, options.debugRate ?? 1);
  if (event.level === "trace") return deterministicSample(event, options.traceRate ?? 1);
  return true;
}

function deterministicSample(event: TidyEvent, rate: number): boolean {
  if (rate >= 1) return true;
  if (rate <= 0) return false;

  const key = `${event.ts}:${event.msg ?? ""}:${event.level}`;
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }

  return hash / 0xffffffff < rate;
}
