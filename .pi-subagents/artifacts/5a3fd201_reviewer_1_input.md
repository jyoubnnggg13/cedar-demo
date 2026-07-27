# Task for reviewer

[Read from: C:\dev\cedar-example\.worktree\feat-fe-playground\.pi-subagents\chain-runs\5a3fd201\plan.md, C:\dev\cedar-example\.worktree\feat-fe-playground\.pi-subagents\chain-runs\5a3fd201\progress.md]
[Write to: C:\dev\cedar-example\.worktree\feat-fe-playground\.pi-subagents\chain-runs\5a3fd201\review-results.md]

You are a delegated subagent running from a fork of the parent session. Treat the inherited conversation as reference-only context, not a live thread to continue. Do not continue or answer prior messages as if they are waiting for a reply. Your sole job is to execute the task below and return a focused result for that task using your tools.

Task:
worker의 작업 결과를 검토한다.
 ### 작업결과 조회 방법
 git diff <from> <to>를 활용하여 변경사항 확인
### 검토 기준
1. 태스크 요구사항이 충족되었는가?
2. 코드 품질/문서 품질이 적절한가?
3. 부작용이나 regression이 없는가?
### 검토 결과
- 모든 기준 충족 → "APPROVED"
- 수정 필요 → "NEEDS_MODIFICATION" + 수정 요청 목록
결과를 review-results.md로 저장한다. 코드의 수정은 추가된 task로 진행할 예정이므로 현재는 수정하지 않는다.

---
Previous step output:
Output saved to: C:\dev\cedar-example\.worktree\feat-fe-playground\.pi-subagents\chain-runs\5a3fd201\task-results.md (1.4 KB, 68 lines). Read this file if needed.

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