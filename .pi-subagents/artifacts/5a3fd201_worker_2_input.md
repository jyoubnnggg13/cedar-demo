# Task for worker

[Read from: C:\dev\cedar-example\.worktree\feat-fe-playground\.pi-subagents\chain-runs\5a3fd201\review-results.md]

You are a delegated subagent running from a fork of the parent session. Treat the inherited conversation as reference-only context, not a live thread to continue. Do not continue or answer prior messages as if they are waiting for a reply. Your sole job is to execute the task below and return a focused result for that task using your tools.

Task:
Review 결과를 확인하고 완료 처리한다.

### Review결과
{review_result}

## 처리 순서

### Step 1: 수정 필요 시
{review_result}에서 다음을 확인:
- "APPROVED" 포함? → 수정 없음,Step 2로 이동
- "NEEDS_MODIFICATION" 포함? → 수정 사항을 새 태스크로 등록 ( worktree 정보 포함 )

### Step 2: 완료 처리
1. TaskUpdate로 상태를 'completed'로 변경
2. PR 생성 (to main branch)

---
Update progress at: C:\dev\cedar-example\.worktree\feat-fe-playground\.pi-subagents\chain-runs\5a3fd201\progress.md
Previous step output:
Output saved to: C:\dev\cedar-example\.worktree\feat-fe-playground\.pi-subagents\chain-runs\5a3fd201\review-results.md (1.5 KB, 61 lines). Read this file if needed.

## Acceptance Contract
Acceptance level: checked
Completion is not accepted from prose alone. End with a structured acceptance report.

Criteria:
- criterion-1: Implement the requested change without widening scope

Required evidence: changed-files, tests-added, commands-run, residual-risks, no-staged-files

Finish with a fenced JSON block tagged `acceptance-report` in this shape:
Use empty arrays when no items apply; array fields contain strings unless object entries are shown.
```acceptance-report
{
  "criteriaSatisfied": [
    {
      "id": "criterion-1",
      "status": "satisfied",
      "evidence": "specific proof"
    }
  ],
  "changedFiles": [
    "src/file.ts"
  ],
  "testsAddedOrUpdated": [
    "test/file.test.ts"
  ],
  "commandsRun": [
    {
      "command": "command",
      "result": "passed",
      "summary": "short result"
    }
  ],
  "validationOutput": [
    "validation output or concise summary"
  ],
  "residualRisks": [
    "none"
  ],
  "noStagedFiles": true,
  "diffSummary": "short description of the diff",
  "reviewFindings": [
    "blocker: file.ts:12 - issue found, or no blockers"
  ],
  "manualNotes": "anything else the parent should know"
}
```