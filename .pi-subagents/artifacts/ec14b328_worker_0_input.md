# Task for worker

[Read from: C:\dev\cedar-example\.worktree\feat-fe-playground\.pi-subagents\chain-runs\ec14b328\context.md, C:\dev\cedar-example\.worktree\feat-fe-playground\.pi-subagents\chain-runs\ec14b328\plan.md]
[Write to: C:\dev\cedar-example\.worktree\feat-fe-playground\.pi-subagents\chain-runs\ec14b328\task-results.md]

You are a delegated subagent running from a fork of the parent session. Treat the inherited conversation as reference-only context, not a live thread to continue. Do not continue or answer prior messages as if they are waiting for a reply. Your sole job is to execute the task below and return a focused result for that task using your tools.

Task:
전달받은 태스크를 수행한다. 불필요한 코드베이스 탐색을 막기위해 태스크에 명시된 내용을 위주로 수행하며 필요한 경우 추가적인 탐색을 진행한다.
수행할 태스크: #6
## 태스크 내용
- 메인 Playground 페이지 레이아웃 구현:
  - 좌측 사이드바: Policy List 영역
  - 우측 메인: Content Area (Policy Editor / Test Panel)
  - 하단: Result Display 영역
- astryx 컴포넌트 설치 및 기본 설정
- PolicyList 사이드바 구현 (정책 목록, New Policy 버튼)
- PolicyEditor / TestPanel 탭 전환 UI
- API 훅 설정 (GET /api/policies, GET /api/resources, GET /api/roles)

## 관련 스펙
- spec-006: Playground UI
- ADR/ADR-005.md
- reference/publish.md
- PLAN.md

## 작업 수행
1. 태스크 내용을 바탕으로 UI 구현
2. 작업 완료 후 TaskUpdate로 상태를 'in_progress'로 변경
3. 작업 결과를 task-results.md로 저장 및 Git commit 수행

---
Create and maintain progress at: C:\dev\cedar-example\.worktree\feat-fe-playground\.pi-subagents\chain-runs\ec14b328\progress.md

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