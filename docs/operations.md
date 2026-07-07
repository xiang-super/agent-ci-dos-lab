# Operations

`log-tidy` is designed to run inside ingestion workers, CLI tools, or sidecar
processes that receive application logs before forwarding them to a central
backend.

## Recommended pipeline

1. Parse incoming JSON or NDJSON.
2. Normalize timestamps and severity.
3. Redact credential-bearing fields.
4. Sample high-volume debug and trace events.
5. Forward normalized events to the downstream sink.

## Failure handling

Malformed NDJSON lines are returned as diagnostics instead of throwing. In a
production ingestion worker, diagnostics should be counted and sampled so bad
input cannot create unbounded error logs.

## Security notes

- Do not pass untrusted log fields into shell commands.
- Prefer array-style process invocation over shell string interpolation.
- Treat all user-controlled logs as untrusted input.
- Keep redaction rules close to the ingestion boundary.
