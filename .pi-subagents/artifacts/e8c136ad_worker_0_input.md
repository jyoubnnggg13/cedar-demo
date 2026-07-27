# Task for worker

[Read from: C:\dev\cedar-example\.worktree\feat-fe-playground\.pi-subagents\chain-runs\e8c136ad\context.md, C:\dev\cedar-example\.worktree\feat-fe-playground\.pi-subagents\chain-runs\e8c136ad\plan.md]
[Write to: C:\dev\cedar-example\.worktree\feat-fe-playground\.pi-subagents\chain-runs\e8c136ad\task-results.md]

You are a delegated subagent running from a fork of the parent session. Treat the inherited conversation as reference-only context, not a live thread to continue. Do not continue or answer prior messages as if they are waiting for a reply. Your sole job is to execute the task below and return a focused result for that task using your tools.

Task:
전달받은 태스크를 수행한다. 불필요한 코드베이스 탐색을 막기위해 태스크에 명시된 내용을 위주로 수행하며 필요한 경우 추가적인 탐색을 진행한다.
수행할 태스크: #18
## 태스크 내용
## 목적
커스텀 배지를 Astryx Badge 컴포넌트로 대체

## 참조 컨텍스트
### reference
- `reference/publish.md`
- https://astryx.atmeta.com/components/badge (Badge)

## 기타 지침
### worktree
- **사용**: `C:/dev/cedar-example/.worktree/feat-fe-playground`

### 참조 파일
- `packages/fe/src/pages/Playground.tsx` - "선택됨" 배지
- `packages/fe/src/components/TestPanel.tsx` - "Playground" 배지
- `packages/fe/src/components/ResultDisplay.tsx` - ALLOW/DENY 결과 배지

## 작업 내용
1. Astryx Badge 컴포넌트 import
2. variant, color 적용 (success/danger 등)
3. 변경 사항 커밋

1. 태스크 내용을 바탕으로 작업 수행
2. 작업 완료 후 TaskUpdate로 상태를 'in_progress'로 변경
3. 작업 결과를 task-results.md로 저장 및 Git commit 수행

---
Create and maintain progress at: C:\dev\cedar-example\.worktree\feat-fe-playground\.pi-subagents\chain-runs\e8c136ad\progress.md

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