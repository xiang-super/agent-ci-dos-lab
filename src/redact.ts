const DEFAULT_SECRET_KEYS = [
  "authorization",
  "password",
  "passwd",
  "secret",
  "token",
  "api_key",
  "apikey",
  "access_token",
  "refresh_token",
  "cookie",
  "set-cookie",
];

export interface RedactionOptions {
  keys?: string[];
  replacement?: string;
}

export function redactEvent<T extends Record<string, unknown>>(event: T, options: RedactionOptions = {}): T {
  const secretKeys = new Set((options.keys ?? DEFAULT_SECRET_KEYS).map((key) => key.toLowerCase()));
  const replacement = options.replacement ?? "[REDACTED]";
  const out: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(event)) {
    out[key] = secretKeys.has(key.toLowerCase()) ? replacement : value;
  }

  return out as T;
}
