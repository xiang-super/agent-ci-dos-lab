#!/usr/bin/env python3
"""
解析 LLM 推理输出的 JSON 计划，写到 step output 供下游 job 消费。

输入  : 模型返回的原始文本（期望是一段 JSON，可能有 markdown 包裹）
输出  : parsed-plan.json + 通过 $GITHUB_OUTPUT 暴露字段

环境变量上限（实验时可调，模拟真实 workflow 的 safety cap）：
  MAX_COMPONENTS  默认 6
  MAX_ROUNDS      默认 3
"""

import json
import os
import re
import sys
from pathlib import Path


def env_int(name: str, default: int) -> int:
    raw = os.environ.get(name)
    if not raw:
        return default
    try:
        return int(raw)
    except ValueError:
        return default


MAX_COMPONENTS = env_int("MAX_COMPONENTS", 6)
MAX_ROUNDS = env_int("MAX_ROUNDS", 3)
VALID_PRIORITIES = {"low", "normal", "high", "critical"}


def extract_json(text: str) -> dict:
    text = text.strip()
    fence = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, re.DOTALL)
    if fence:
        text = fence.group(1)
    else:
        first = text.find("{")
        last = text.rfind("}")
        if first != -1 and last != -1 and last > first:
            text = text[first : last + 1]
    return json.loads(text)


def coerce_list(value, cap: int) -> list:
    if not isinstance(value, list):
        return []
    out = []
    for item in value:
        if isinstance(item, str) and item.strip():
            out.append(item.strip())
        if len(out) >= cap:
            break
    return out


def main(in_path: str, out_path: str) -> int:
    raw = Path(in_path).read_text(encoding="utf-8", errors="replace")
    try:
        plan = extract_json(raw)
    except Exception as exc:
        print(f"::warning::failed to parse plan JSON: {exc}", file=sys.stderr)
        plan = {}

    components = coerce_list(plan.get("components"), MAX_COMPONENTS)
    if not components:
        components = ["lint"]
    rounds = max(1, min(int(plan.get("rounds", 1) or 1), MAX_ROUNDS))
    priority = plan.get("priority", "normal")
    if priority not in VALID_PRIORITIES:
        priority = "normal"
    summary = str(plan.get("summary", ""))

    parsed = {
        "summary": summary,
        "components": components,
        "components_count": len(components),
        "rounds": rounds,
        "priority": priority,
        "components_matrix": {"include": [{"component": c} for c in components]},
        "rounds_matrix": {"include": [{"round": r} for r in range(1, rounds + 1)]},
    }

    Path(out_path).write_text(json.dumps(parsed, indent=2), encoding="utf-8")

    gh_out = os.environ.get("GITHUB_OUTPUT")
    if gh_out:
        with open(gh_out, "a", encoding="utf-8") as f:
            f.write(f"summary<<EOF_SUMMARY\n{summary}\nEOF_SUMMARY\n")
            f.write(f"components={json.dumps(components)}\n")
            f.write(f"components_count={len(components)}\n")
            f.write(f"rounds={rounds}\n")
            f.write(f"priority={priority}\n")
            f.write(f"components_matrix={json.dumps(parsed['components_matrix'])}\n")
            f.write(f"rounds_matrix={json.dumps(parsed['rounds_matrix'])}\n")

    print(json.dumps(parsed, indent=2))
    return 0


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("usage: parse_plan.py <input> <output>", file=sys.stderr)
        sys.exit(2)
    sys.exit(main(sys.argv[1], sys.argv[2]))
