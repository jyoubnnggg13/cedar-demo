# Task #19 Progress

## Status: ✅ Completed

## Task: refactor(fe): Code Block 컴포넌트로 변환

### Objective
커스텀 JSON 미리보기를 Astryx Code Block 컴포넌트로 대체

### Changes Made
1. **Import 추가**: `CodeBlock` from `@astryxdesign/core`
2. **커스텀 스타일 제거**: `codeBlockStyle` 제거
3. **CodeBlock 컴포넌트로 대체**: `<pre>` 태그 → `<CodeBlock>`
   - `code={cedarJson}`: JSON 데이터 전달
   - `language="json"`: JSON 문법 하이라이팅
   - `container="section"`: 섹션 스타일 (기존 디자인 호환)
   - `size="sm"`: 작은 크기
   - `hasCopyButton`: 복사 버튼 추가
   - `isWrapped`: 줄 바꿈 허용
   - `maxHeight={200}`: 최대 높이 설정

### Git Commit
- **Hash**: 231b12e
- **Message**: refactor(fe): replace custom JSON preview with Astryx CodeBlock
- **Files Changed**: packages/fe/src/components/PolicyEditor.tsx (+11, -15)

### Validation
- TypeScript compilation: ✅ No errors
- Code review: Manual visual check recommended
