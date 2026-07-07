# Agentic CI 攻击面 v2 实验总索引

本目录组织所有 PoC 实验,与 `xiangmaster/Agentic-CI-Survey` 仓库中定义的 v2 攻击面分类学一一对应。

## 组织原则

- **一 PoC 一目录**,严格按 `A{编号}[{子面}]-{slug}` 命名
- **一 PoC 只 illustrate 一个 A**,禁止跨面混合
- **每个 PoC 走标准 10 段结构**(见 `_template/README.md`),含 §7 Attack variants + §8 Defense matrix
- **Defense 编号统一引用 `DEFENSES.md`**,不重复描述
- **命名与 v2 分类学对齐**,不再使用 V1–V14 旧编号

## Round 制的实验流程

- **Round 1 Baseline**:所有 defense 保持默认宽松,跑每个 PoC 的 §7 Attack variants 表,验证攻击面成立
- **Round 2 Defense**:每次只开一个 D-R#/D-F#,重跑 baseline 成功的 variant,填 §8 Defense matrix
- **Round 3 组合**(可选):把有效 defense 叠加,验证是否有绕过路径

关键文档:
- 分类学:`../../Agentic-CI-Survey/docs/attack-surface-taxonomy.md`
- Defense 编号库:`DEFENSES.md`
- 决策树:`../../Agentic-CI-Survey/assets/fig3-prereq-tree.pdf`

## 12 格状态总表(双维度:攻击成立 + 防御有效)

| 编号 | 攻击面 | P | R1 攻击 | R2 有效 defense | 最后运行 |
|---|---|---|---|---|---|
| A1 | 事件内容注入 | P2 | ⚪ | — | — |
| A2a | `pull_request_target` 借权 | P1 | ⚪ | — | — |
| A2b | `issue_comment` 借状态 | P1 | ⚪ | — | — |
| A2c | TOCTOU checkout | P1 | ⚪ | — | — |
| A3 | 配置信任提升 | P1 | ⚪ | — | — |
| **A4-1** | 恶意 GitHub Action | **P0** | ⚪ | — | — |
| **A4-2** | 恶意 MCP server | **P0** | ⚪ | — | — |
| **A4-3** | 恶意 npm 包 | **P0** | ⚪ | — | — |
| A5 | Agent 上下文腐化 | P2 | ⚪ | — | — |
| A6a | 工具越权 | P2 | ⚪ | — | — |
| **A6b** | 沙箱逃逸 | **P0** | ⚪ | — | — |
| A7a | Output-as-Prompt | P0 | ⚪ | — | — |
| A7b | Output-as-Sink | P2 | ⚪ | — | — |
| **A7c** | 欺骗人类审核员 | **P0** | ⚪ | — | — |
| A8 | Sink 解析破 | P1 | ⚪ | — | — |
| **A9-1** | Token exfil | **P0** | ⚪ | — | — |
| **A9-2** | Cache poisoning | P1 | ⚪ | — | — |
| **A9-3** | Auto-merge 传播 | P1 | ⚪ | — | — |

图例:⚪ 未开始 / 🟡 进行中 / ✅ 复现成功 / ❌ 复现失败(被防御拦截) / 🔒 已受平台修复
R1 攻击列填最强 variant 的结果;R2 有效 defense 列填哪个 D 编号能 block(如 `D-R2+D-F2`)。

## 优先级说明

- **P0(novelty 集中,必做)**:A4-1/A4-2/A4-3、A6b、A7a、A7c、A9-1 —— 论文的独有贡献
- **P1(强建议)**:A2a/A2b/A2c、A3、A8、A9-2、A9-3 —— 已知攻击面在 agentic 场景的验证
- **P2(代表性)**:A1、A5、A6a、A7b —— 有大量类似工作,做一个 baseline 即可

## 攻击者 / 受害者角色

| 角色 | 账号 | 用途 |
|---|---|---|
| Repo_victim | `xiangmaster/agent-ci-dos-lab` (public) | 挂载 agentic workflow,接受攻击 |
| User_attacker | 待定 (原 `xiang-super`) | fork / 发 issue / 开 PR |
| Attacker_repo | 待定 (`xiang-super/*`) | 承载 A4-1 恶意 action、A9 exfil endpoint |
| Attacker_webhook | 待定 (webhook.site / CF Worker) | 收 A9 泄露的 token |

## 复现流程

1. `cd experiments/A{X}-{...}/`
2. 读 `README.md` 的 Setup + Attacker action 章节
3. 按 attacker/ 下的 payload 文件在 GitHub UI 手动构造 issue/PR/comment
4. 观察 GitHub Actions run log,采集到 observed/
5. 填 `result.md` 记录 success/fail 判定与时间戳
6. 回来更新本文件顶部状态表

## 关联文档

- 主分类学:`../../Agentic-CI-Survey/docs/attack-surface-taxonomy.md`
- 威胁模型前置:`../../Agentic-CI-Survey/docs/threat-model-prerequisites.md`
- 主图:`../../Agentic-CI-Survey/assets/fig1-pipeline.pdf`
