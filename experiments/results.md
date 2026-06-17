# 实验结果记录（真实模板版）

每个 V 跑完一次填一栏。所有 attack issue / PR 用 `User_attacker` 外部账号。

---

## V1 · Matrix Inflation

| Field | Value |
|---|---|
| Workflow | `triage-pipeline.yml`（L2 minimal reproducer） |
| Run URL | — |
| Attacker | `User_attacker` 外部账号 |
| Agent components | — |
| `validate-components` job 展开数 | — |
| baseline 同 workflow | 1 component |
| **放大比** | — |
| 备注 | — |

截图 (`screenshots/V1/`)
- [ ] S1 issue 页面
- [ ] S2 run 总览（左栏 6 个 validate-components）
- [ ] S3 `Parse plan` step 完整 JSON
- [ ] S4 任一 validate-components job 内部

---

## V2 · Round/Loop Amplification

| Field | Value |
|---|---|
| Workflow | `triage-pipeline.yml`（L2） |
| Run URL | — |
| Agent rounds | — |
| `deep-review` job 展开数 | — |
| model_call_count | — |
| baseline model_call_count | 1 |
| **放大比** | — |

截图
- [ ] S1 issue 页面
- [ ] S2 run 总览（左栏 3 个 deep-review）
- [ ] S3 任一 deep-review job 内部 ai-inference 调用

---

## V3 · Concurrency Hijack

| Field | Value |
|---|---|
| Workflow | `triage-pipeline.yml` + `normal-ci.yml`（L2） |
| Triage run URL | — |
| Normal CI run URL | — |
| Agent priority | — |
| `release-gate` job 占用时长 | — |
| `Normal CI` 排队时长（created→started） | — |

截图
- [ ] S1 attacker issue 页面
- [ ] S2 Triage Pipeline run 总览 + release-gate 在跑
- [ ] S3 Normal CI **Waiting 状态**（含 "waiting for concurrency group" 黄条）
- [ ] S4 Normal CI run timing 页面（排队时长）

---

## V4 · Self-Cascade

| Field | Value |
|---|---|
| Workflow | `claude-issue-triage.yml`（**L1 Anthropic 真实模板**） |
| Run URL | — |
| Agent 行为 | — |
| 拆出的子 issue 数 | — |
| 子 issue 触发的新 workflow run 数 | — |

截图
- [ ] S1 attacker 原始 issue 页面
- [ ] S2 Claude Issue Triage run 详情
- [ ] S3 仓库 Issues 列表（多出来的子 issue）
- [ ] S4 子 issue 触发的新 workflow run 列表

---

## V7 · Shell Quote Break

| Field | Value |
|---|---|
| Workflow | `summary.yml`（**L1 GitHub starter-workflows a041377 漏洞原版**） |
| Run URL | — |
| Agent summary 含单引号 | — |
| `Comment with AI Summary` step | failure |

截图
- [ ] S1 issue 页面
- [ ] S2 Summarize new issues run 失败状态
- [ ] S3 step log 显示 bash unexpected EOF

---

## V8 · Command Substitution

| Field | Value |
|---|---|
| Workflow | `summary.yml`（同 V7） |
| Run URL | — |
| Agent summary 含 `'$(sleep 30)'` | — |
| runner 实际多消耗秒数 | — |

截图
- [ ] S1 issue 页面
- [ ] S2 step log 显示 sleep 30 被执行
- [ ] S3 timing 页面体现多出来的 30 秒

---

## V14 · Persistent Config Pollution

| Field | Value |
|---|---|
| Workflow | `claude-pr-review.yml`（**L1 Anthropic 真实模板**） |
| PR URL | — |
| Run URL | — |
| CLAUDE.md 是否被 claude 加载 | — |
| Claude 留下的预设字面评论 | — |

截图
- [ ] S1 attacker 的 PR 页面（含 CLAUDE.md diff）
- [ ] S2 Claude PR Review run 详情
- [ ] S3 PR 评论区出现 claude 按 CLAUDE.md 指令留的预设评论
- [ ] S4 CLAUDE.md 文件内容截图

---

## 汇总表

| ID | 名称 | Workflow | 类型 | 状态 | 放大效果 |
|---|---|---|---|---|---|
| V1 | Matrix Inflation | triage-pipeline.yml | L2 | – | – |
| V2 | Round Amplification | triage-pipeline.yml | L2 | – | – |
| V3 | Concurrency Hijack | triage-pipeline.yml + normal-ci.yml | L2 | – | – |
| V4 | Self-Cascade | claude-issue-triage.yml | **L1** | – | – |
| V7 | Shell Quote Break | summary.yml | **L1** | – | – |
| V8 | Command Substitution | summary.yml | **L1** | – | – |
| V14 | Persistent Config Pollution | claude-pr-review.yml | **L1** | – | – |
