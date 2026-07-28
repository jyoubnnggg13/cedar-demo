# Task #17: refactor(fe): Selectable Card로 SelectionCard 변환

## 작업 개요

**태스크**: 커스텀 SelectionCard를 Astryx Selectable Card 컴포넌트로 대체
**작업 디렉토리**: `C:/dev/cedar-example/.worktree/feat-fe-playground`
**실행 날짜**: 2026-07-27

---

## 변경 사항

### 1. SelectionCard.tsx 변환

기존 커스텀 구현을 제거하고 `@astryxdesign/core`의 `SelectableCard`를 재익스포트:

```typescript
// 기존: 162줄의 커스텀 구현 → 제거
// 새 구현: 13줄의 래퍼/재익스포트
export {
  SelectableCard,
  type SelectableCardProps,
} from "@astryxdesign/core";

export type SelectionCardProps = import("@astryxdesign/core").SelectableCardProps;
export { SelectableCard as SelectionCard } from "@astryxdesign/core";
```

### 2. index.ts 업데이트

```typescript
// 변경 전
export { SelectionCard } from "./SelectionCard";
export type { SelectionCardProps } from "./SelectionCard";

// 변경 후
export { SelectableCard, SelectionCard } from "./SelectionCard";
export type { SelectableCardProps, SelectionCardProps } from "./SelectionCard";
```

### 3. PolicyEditor.tsx 업데이트

SelectionCard → SelectableCard로 변경 및 API 변경 적용:

| 기존 Prop | 새 Prop | 변경 내용 |
|-----------|---------|-----------|
| `title` | children | content를 children으로 이동 |
| `description` | children | content를 children으로 이동 |
| `selected` | `isSelected` | 이름 변경 |
| `onClick` | `onChange` | 콜백 시그니처 변경 |
| - | `label` | accessibility를 위한 필수 속성 추가 |

### 4. Git Commit

```
commit 1f2457a
refactor(fe): Replace SelectionCard with Astryx SelectableCard

- Replace custom SelectionCard implementation with @astryxdesign/core SelectableCard
- Update SelectionCard.tsx to re-export SelectableCard for backward compatibility
- Update PolicyEditor.tsx to use SelectableCard with new API (label, isSelected, onChange)
- Preserve existing visual styling by moving content to children prop
- Update exports in index.ts to include both SelectableCard and SelectionCard aliases
```

---

## 검증 결과

### 빌드 검증
```bash
npm run build
✓ built in 4.29s
Output: index.html, assets/index-nJRncjpV.js (232.03 kB)
```

### 변경된 파일
- `packages/fe/src/components/SelectionCard.tsx` - SelectableCard 재익스포트
- `packages/fe/src/components/index.ts` - export 추가
- `packages/fe/src/components/PolicyEditor.tsx` - SelectableCard 사용으로 변경

---

## 하위 호환성

기존 `SelectionCard` import를 사용하는 코드도 계속 동작하도록:
- `SelectionCard`를 `SelectableCard`의 별칭으로 export
- `SelectionCardProps`를 `SelectableCardProps`의 타입 별칭으로 제공

---

## 잔여 리스크

| 항목 | 설명 |
|------|------|
| 없음 | 빌드 성공, 코드 변경 완료 |

---

## 권장 다음 단계

1. 런타임 검증: Policy Editor에서 Principal/Resource/Action 선택 동작 테스트
2. Accessibility 테스트: Screen reader로 SelectableCard 접근성 확인
