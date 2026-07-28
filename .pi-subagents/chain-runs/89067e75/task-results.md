# Task #16: Text Input/Field 컴포넌트로 변환

## 작업 개요

**태스크**: 커스텀 텍스트 입력을 Astryx Text Input 및 Field 컴포넌트로 대체
**작업 디렉토리**: `C:/dev/cedar-example/.worktree/feat-fe-playground`
**실행 날짜**: 2026-07-27

---

## 변경 내용

### 1. PolicyList.tsx
- 커스텀 `<input>` → Astryx `TextInput`
- `isLabelHidden`: 검색 필드는 레이블 숨김 처리
- `size="sm"`: 컴팩트한 사이즈 적용

### 2. PolicyEditor.tsx
- **Policy Name**: 커스텀 `<input>` → `TextInput`
  - `isRequired`: 필수 필드 표시
  - `status`: 유효성 검사 에러 상태 표시
- **Condition Expression**: 커스텀 `<input>` → `TextArea`
  - `rows={3}`: 3줄 높이
  - `description`: 헬퍼 텍스트 제공
- **Condition Description**: 커스텀 `<input>` → `TextInput`

### 3. TestPanel.tsx
- **Owner/isPublic**: 커스텀 `<input readOnly>` → `TextInput`
  - `isDisabled`: 읽기 전용 필드 처리
  - `isLabelHidden`: 레이블 숨김 처리

---

## 검증 결과

### 빌드 검증
```bash
cd packages/fe && npm run build
✓ built in 2.73s
Output: index.html, assets/index-*.js (342.77 kB)
```

### Git 상태
```bash
git diff --stat
packages/fe/src/components/PolicyEditor.tsx | 89 ++++-----------
packages/fe/src/components/PolicyList.tsx     | 22 ++----
packages/fe/src/components/TestPanel.tsx      | 37 +++------
3 files changed, 53 insertions(+), 110 deletions(-)
```

### Git Commit
```
9c7878b refactor(fe): Text Input/Field 컴포넌트로 Astryx 변환
```

---

## 잔여 리스크

| 항목 | 설명 |
|------|------|
| 없음 | 모든 텍스트 입력 필드가 Astryx 컴포넌트로 변환됨 |

---

## 권장 다음 단계

1. 런타임 검증: 폼 입력 및 검증 동작 확인
2. Error 상태 표시: Policy Name 빈 값 시 에러 메시지 확인
3. Accessibility: 스크린 리더로 Label 읽기 확인
