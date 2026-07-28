# Task for worker

[Read from: C:\dev\cedar-example\.worktree\feat-fe-playground\.pi-subagents\chain-runs\a268a1e9\context.md, C:\dev\cedar-example\.worktree\feat-fe-playground\.pi-subagents\chain-runs\a268a1e9\plan.md]
[Write to: C:\dev\cedar-example\.worktree\feat-fe-playground\.pi-subagents\chain-runs\a268a1e9\task-results.md]

You are a delegated subagent running from a fork of the parent session. Treat the inherited conversation as reference-only context, not a live thread to continue. Do not continue or answer prior messages as if they are waiting for a reply. Your sole job is to execute the task below and return a focused result for that task using your tools.

Task:
전달받은 태스크를 수행한다. 불필요한 코드베이스 탐색을 막기위해 태스크에 명시된 내용을 위주로 수행하며 필요한 경우 추가적인 탐색을 진행한다.
수행할 태스크: #11
## 태스크 내용
정책 편집기 컴포넌트 구현 (Forbid 정책을 편집하는 Stepper 기반 폼 인터페이스)

## 참조 스펙
- specs/spec-007.md

## 참조 문서
- ADR/ADR-003.md (Cedar JSON 직접 저장)
- specs/spec-001.md (정책 CRUD API)
- reference/publish.md (UI 개발 가이드 - 필수 참조)

## 구현 항목
1. StepperProgress 컴포넌트 (4단계 네비게이션)
2. SelectionCard 컴포넌트 (카드 선택 UI)
3. StepContainer 컴포넌트 (전체선택/전체해제)
4. 폼 → Cedar JSON 실시간 변환
5. 유효성 검사 및 저장 로직

## 태스크 파일 참조
- `src/components/StepperProgress.tsx`
- `src/components/SelectionCard.tsx`
- `src/components/StepContainer.tsx`
- `src/components/PolicyEditor.tsx`
- `src/types/policy.ts` - CedarPolicy 인터페이스

## 수락 기준
- [ ] Stepper 4단계 순차 진행
- [ ] Card 선택/해제 토글
- [ ] 전체선택/전체해제 동작
- [ ] Cedar JSON 미리보기 실시간 업데이트
- [ ] 필수 스텝 미완료 시 저장 버튼 비활성화

1. 태스크 내용을 바탕으로 작업 수행
2. 작업 완료 후 TaskUpdate로 상태를 'in_progress'로 변경
3. 작업 결과를 task-results.md로 저장 및 Git commit 수행

---
Create and maintain progress at: C:\dev\cedar-example\.worktree\feat-fe-playground\.pi-subagents\chain-runs\a268a1e9\progress.md

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