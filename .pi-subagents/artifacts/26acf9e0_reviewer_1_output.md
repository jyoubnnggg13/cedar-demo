# Task #17 Review Results

## Review Summary

**Task**: refactor(fe): Selectable Card로 SelectionCard 변환
**Review Date**: 2026-07-27
**Verdict**: **NEEDS_MODIFICATION**

---

## 변경 파일 검증

| 파일 | 변경 내용 | 상태 |
|------|-----------|------|
| `SelectionCard.tsx` | SelectableCard 재익스포트 (162줄 → 14줄) | ✅ |
| `PolicyEditor.tsx` | SelectionCard → SelectableCard API 변경 | ⚠️ |
| `index.ts` | SelectableCard, SelectionCard export 추가 | ✅ |
| `StepContainer.tsx` | SelectionCard 미사용 (import 변경 불필요) | ✅ |

---

## 🚫 Blocker: onChange 핸들러 이중 호출 버그

**파일**: `packages/fe/src/components/PolicyEditor.tsx`

**문제**: Action 선택 시 `onChange` 핸들러에서 `handleActionToggle`이 `isSelected` 값과 관계없이 항상 호출됨.

```typescript
// 현재 코드 (버그)
onChange={(isSelected) => {
  if (isSelected) {
    handleActionToggle(option.value);
  } else {
    handleActionToggle(option.value);  // ❌ 불필요한 이중 호출
  }
}}
```

**올바른 구현**: `isSelected` 상태를 직접 확인하여 처리해야 함.

```typescript
// 권장 수정
onChange={() => handleActionToggle(option.value)}
```

**이유**: SelectableCard의 `onChange`는 선택 상태 변경 시마다 호출되며, 토글 동작만 하면 됨. `isSelected` 파라미터를 사용하려면 현재 상태를 확인해야 하지만, 이미 `formState.actions.includes(option.value)`로 확인 가능하므로 단순 토글로 충분.

---

## ⚠️ Note: disabled 상태 처리

**요구사항**: "checked, disabled 상태 처리"

**현재 상태**: 기존 SelectionCard의 `disabled` prop이 SelectableCard로 전달되지 않음.

```typescript
// Task 요구사항에는 disabled 처리가 명시되어 있었으나,
// 현재 PolicyEditor.tsx에서는 disabled prop이 사용되지 않음
```

**평가**: PolicyEditor.tsx 내에서 disabled 상태가 필요한지는 기존 동작을 확인해야 함. 현재 코드에서는 문제가 되지 않으나, 명시적 요구사항과의 불일치.

---

## 검증 과정

### 1. Git Diff 확인
- ✅ SelectionCard.tsx: 커스텀 구현 → SelectableCard 재익스포트
- ✅ PolicyEditor.tsx: API 변경 (title → children, selected → isSelected, onClick → onChange)
- ✅ index.ts: export 추가
- ✅ Git commit 완료 (1f2457a)

### 2. 빌드 검증
```bash
npm run build
✓ built in 4.29s
```

### 3. 코드 품질
- ✅ 하위 호환성 유지 (SelectionCard 별칭 export)
- ✅ 타입 정의 올바름
- ✅ 불필요한 코드 제거됨 (162줄 → 14줄)

---

## 수정 요청 목록

| # | 파일 | 위치 | 수정 내용 |
|---|------|------|----------|
| 1 | PolicyEditor.tsx | Action SelectableCard onChange | `isSelected` 값과 관계없이 항상 토글이 호출되는 버그 수정 |

---

## 판단 근거

1. **요구사항 충족**: ⚠️ (onChange 버그로 기능 손상 가능성)
2. **코드 품질**: ⚠️ (하위 호환성 양호하나, 버그 존재)
3. **부작용/회귀**: ⚠️ (Action 선택 시 예상치 못한 동작 가능)

---

## 결론

**NEEDS_MODIFICATION**

주요 버그가 발견되어 수정이 필요합니다:

1. **수정 필요**: Action SelectableCard의 `onChange` 핸들러에서 불필요한 이중 호출 문제

빌드는 성공했으나, Action 선택 시 의도치 않은 동작(연속 두 번 토글)이 발생할 수 있습니다.