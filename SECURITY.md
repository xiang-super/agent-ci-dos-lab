# Security policy

Please report suspected vulnerabilities privately to the maintainers.

## Supported versions

`log-tidy` is pre-1.0. Security fixes are applied to the current `main` branch
and the latest published minor version when applicable.

## Sensitive areas

- Shell or child-process integration around log fields.
- Redaction of authorization headers, tokens, cookies, and API keys.
- Parser behavior for malformed or attacker-controlled NDJSON.
- Downstream sink integration that interprets emitted fields.

Do not include real credentials in issues, pull requests, test fixtures, or CI
logs.
