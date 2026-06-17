# agent-ci-dos-lab

研究 agent-mediated CI-DoS 攻击的受害者仓库。GitHub 镜像：`xiangmaster/agent-ci-dos-lab`（public）。

## 项目角色

这是实验中的 `Repo_victim`：在 GitHub 上以公开仓库形态部署多组真实 agentic workflow 模板，接受外部账号（`User_attacker`）通过 issue / PR 投放攻击载荷。

仓库本身伪装成一个小型 TypeScript 日志规范化工具（`log-tidy`）。装饰性的 `src/` / `package.json` / `README.md` 是为了让仓库看起来像真实开源项目（仿 GitInject 的 ephemeral victim 做法）。

## 实验装置两层

### L1 真实官方模板（一字不差或仅最小适配）
- `.github/workflows/summary.yml`：GitHub `actions/starter-workflows` commit a041377 漏洞原版，TaintAWI Case #2 记录。覆盖 V7 / V8 sink 类
- `.github/workflows/claude-issue-triage.yml`：Anthropic claude-code-action 官方 examples/issue-triage.yml 适配版。覆盖 V4 self-cascade
- `.github/workflows/claude-pr-review.yml`：Anthropic claude-code-action 官方 examples/pr-review-comprehensive.yml 适配版。覆盖 V14 持久污染

### L2 最小可复现实例（基于 TaintAWI 已扫到的模式）
- `.github/workflows/triage-pipeline.yml`：用 actions/ai-inference 复刻 P2S amplifier，覆盖 V1 / V2 / V3
- `.github/workflows/normal-ci.yml`：与 triage-pipeline 共享 concurrency group，配合演示 V3

## API key 配置

仓库 secrets：
- `ANTHROPIC_API_KEY`：yunwu.ai 中转站 token（喂 claude-code-action）
- `ANTHROPIC_BASE_URL`：`https://yunwu.ai`（claude-code-action 走中转）
- `OPENAI_API_KEY`：同 yunwu token
- `OPENAI_BASE_URL`：`https://yunwu.ai/v1`

本地 `.env`（gitignored）存同样配置，给 `experiments/test_yunwu.sh` 用。

## 启动方式

仓库本身不运行。所有实验通过外部账号在 GitHub 网页发 issue / PR 触发对应 workflow 完成。

## 实验流程

详见 `experiments/README.md` 和 `experiments/attack-payloads.md`。

## 部署

仓库已部署到 `xiangmaster/agent-ci-dos-lab` (public)。本地改动通过 git push 同步。
