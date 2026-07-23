# A2 Trigger-Runtime Desynchronization

## Objective

Verify whether a pull request submitted by a low-privilege external fork actor
can trigger a workflow whose definition and runtime authority come from the
base repository. The experiment isolates A2 from A3 by never checking out or
reading the pull request head.

## Test configuration

- Base repository: `xiangmaster/agent-ci-dos-lab`
- External fork: `xiang-super/agent-ci-dos-lab`
- External actor: `xiang-super`
- Author association: `NONE`
- Pull request: [PR #57](https://github.com/xiangmaster/agent-ci-dos-lab/pull/57)
- Workflow: `A2 Runtime Authority Probe`
- Workflow event: `pull_request_target` (`opened`, `reopened`)
- Workflow commit: `b151e0f17d1939c41ca45cd14fdbcce9200652d5`
- Job permissions: `contents: read`, `issues: write`, `pull-requests: write`
- Run: [29982812915](https://github.com/xiangmaster/agent-ci-dos-lab/actions/runs/29982812915)
- Resulting comment: [5054885425](https://github.com/xiangmaster/agent-ci-dos-lab/pull/57#issuecomment-5054885425)

## Isolation controls

1. PR #57 was opened as a draft so the repository's production PR review job
   was skipped.
2. The fork branch was created from the exact base commit and added one inert
   four-line documentation file only.
3. The A2 workflow contained no checkout step and did not read the PR diff,
   source tree, configuration, dependency manifests, model input, repository
   secrets, or third-party services.
4. The only state mutation was one bounded PR comment written with the
   workflow's `GITHUB_TOKEN`.

## Evidence

1. GitHub recorded the event and triggering actor as
   `pull_request_target` / `xiang-super`; the PR author association was `NONE`.
2. The event identified distinct trust domains:
   `head_repository=xiang-super/agent-ci-dos-lab` and
   `base_repository=xiangmaster/agent-ci-dos-lab`.
3. The fork head SHA was
   `caa87ae26e93c47373a12a4036d3a538013bfb8e`, while `github.sha` at runtime
   was the base SHA `b151e0f17d1939c41ca45cd14fdbcce9200652d5`.
   Therefore the externally created event selected a workflow runtime from the
   base repository rather than from the submitted fork revision.
4. The runner reported `Issues: write` and `PullRequests: write` for
   `GITHUB_TOKEN` even though the triggering actor had no association with the
   base repository.
5. The workflow used that token successfully: comment `5054885425` was
   created in the base repository by `github-actions[bot]` and records the
   external trigger actor, fork head repository, and base repository.
6. The unrelated `PR Review Assistant` run `29982812933` was skipped, so no
   agent model, fork checkout, or additional write path contributed to the
   observation.

## Verdict

**A2 reachability and authority mismatch: confirmed.** A pull request authored
by an external actor with `author_association=NONE` triggered a base-defined
`pull_request_target` workflow. That runtime received base-repository write
authority and performed a real state change in the base repository.

This result proves the A2 primitive, not an arbitrary repository compromise.
The PR-controlled file was never loaded. A harmful end-to-end chain would need
another surface to carry attacker-controlled data or code into this privileged
runtime, such as A1/A3/A4, followed by an applicable action or sink. Those
stages must be tested and attributed separately.
