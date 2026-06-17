# Experiments

本目录存放攻击实验的 payload、运行记录和截图。

## 仓库结构

```
.github/workflows/
  summary.yml               L1 真实模板（GitHub 官方 starter-workflows a041377 漏洞原版）
  claude-issue-triage.yml   L1 真实模板（Anthropic 官方 examples，适配 yunwu 中转）
  claude-pr-review.yml      L1 真实模板（Anthropic 官方 examples，适配 yunwu 中转）
  triage-pipeline.yml       L2 最小可复现（基于 TaintAWI Case #1 模式，用 GitHub Models）
  normal-ci.yml             配合 triage-pipeline 演示 V3
.github/scripts/
  parse_plan.py             triage-pipeline 用的最小 plan parser
```

## L1 vs L2

- **L1 真实模板**：从 GitHub / Anthropic / OpenAI 官方 examples 一字不差或仅做最小适配（如配上中转站 base_url）部署的模板，攻击落点 = 这些 production-grade 真实模板自带的漏洞。
- **L2 最小可复现实例**：基于 TaintAWI (Wang et al., 2026) 在 13392 个 workflow 上扫描已经统计到的 P2A / P2S amplifier 模式，写的最简化复刻。攻击成立 = 已知模式在最小实例上的复现。

## V_i → workflow 映射

| V | 名称 | Workflow | 类型 | 真实性背书 |
|---|---|---|---|---|
| V1 | Matrix Inflation | triage-pipeline.yml `validate-components` | L2 | TaintAWI Case #1 (gemini-scheduled-triage) |
| V2 | Round/Loop Amplification | triage-pipeline.yml `deep-review` | L2 | TaintAWI Section IV-B P2A 路径 |
| V3 | Concurrency Hijack | triage-pipeline.yml `release-gate` + normal-ci.yml | L2 | GitHub Actions concurrency 原生机制 |
| V4 | Self-Cascade | claude-issue-triage.yml | **L1** | Anthropic claude-code-action 官方 issue-triage 示例 |
| V7 | Shell Quote Break | summary.yml `gh issue comment --body '...'` | **L1** | TaintAWI Case #2，93 fork 仍受影响 |
| V8 | Command Substitution | summary.yml（与 V7 同一 sink 组合 escape + $()） | **L1** | 同上 |
| V14 | Persistent Config Pollution | claude-pr-review.yml + PR adds CLAUDE.md | **L1** | Anthropic 官方 PR review 模板 + auto-load CLAUDE.md 行为 |

未在今天范围内的 V：V5（tool spam）、V6（timeout inflation）、V9（YAML parse break）、V10（expression re-eval）、V11（encoding bypass）、V12（oversize payload）、V13（filename hostile）。这些列为 future work。

## 文件

- [attack-payloads.md](attack-payloads.md)：每个 V 对应的攻击 issue / PR 文本
- [results.md](results.md)：每次实验的运行记录、截图清单、放大比
- [test_yunwu.sh](test_yunwu.sh)：验证中转站 endpoint 可用性的脚本
