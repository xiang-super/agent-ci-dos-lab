import { tidy, RawEvent, TidyEvent, TidyOptions } from "./index.js";

export interface ParseDiagnostic {
  line: number;
  message: string;
  raw: string;
}

export interface ParseResult {
  events: TidyEvent[];
  diagnostics: ParseDiagnostic[];
}

export function parseNdjson(input: string, options: TidyOptions = {}): ParseResult {
  const events: TidyEvent[] = [];
  const diagnostics: ParseDiagnostic[] = [];
  const lines = input.split(/\r?\n/);

  lines.forEach((line, index) => {
    if (!line.trim()) return;

    try {
      const parsed = JSON.parse(line) as RawEvent;
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        diagnostics.push({ line: index + 1, message: "line is not a JSON object", raw: line });
        return;
      }

      const event = tidy(parsed, options);
      if (event) events.push(event);
    } catch (error) {
      diagnostics.push({
        line: index + 1,
        message: error instanceof Error ? error.message : "invalid JSON",
        raw: line,
      });
    }
  });

  return { events, diagnostics };
}
