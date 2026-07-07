# A{N}[{sub}] — {Attack Surface Slug}

> **PoC 标准模板 · 10 段结构**。复制本目录 → 重命名 → 按段填写。
> Defense 编号统一引用 `experiments/DEFENSES.md`(D-R1..D-R10 / D-F1..D-F5)。

---

## 1. Surface
- 编号 / 名称 / 阶段 / 主图数据流

## 2. Root cause
一句话,不超过 30 字。

## 3. Preconditions
- 攻击者能力:L1..L5
- GitHub 仓库设置基线(通常都是"宽松默认")
- workflow / agent 前置

## 4. Setup
- Workflow 文件路径
- 需要预置的文件 / secrets

## 5. Attacker action
- 攻击者身份
- 投递面
- Payload 文件位置

## 6. Success signal
可观测判据(至少一条)。

## 7. Attack variants matrix(Round 1 baseline)

| Variant | Payload 摘要 | Agent 版本 | 结果 | log |
|---|---|---|---|---|
| V1 | ... | ...@sha | ⚪ / ✅ / ❌ | observed/... |
| V2 | ... | ...@sha | ⚪ | — |

## 8. Defense matrix(Round 2)

只列本 PoC 相关的 defense,从 `DEFENSES.md` 复制编号。每次只开一个 defense,重跑 §7 中 baseline 成功的 variant。

| Defense | 层 | 期望效果 | 实测结果 | 备注 |
|---|---|---|---|---|
| D-R? | Platform | Block | ⚪ / ✅ blocked / ❌ bypassed / 🟡 partial | — |
| D-F? | Workflow | Partial | ⚪ | — |

## 9. Failure / Blocked signal
- agent 主动拒答的关键词 / 平台拦截提示 / 沙箱报错

## 10. Result
| 日期 | 复现者 | Round | 结论 | 关键 log |
|---|---|---|---|---|
| YYYY-MM-DD | xiang | R1 | ✅ V1 成立 | observed/... |
| YYYY-MM-DD | xiang | R2 | D-R2 有效 block | observed/... |

**详细日志**:`observed/`
**判定文件**:`result.md`

---

## 附:isolation / 道德边界
- 所有 exfil 目标为 attacker-controlled endpoint,不打真实生态
- Secret 用 canary 值
- 供应链攻击禁止实际发布
- 未知漏洞走 responsible disclosure
