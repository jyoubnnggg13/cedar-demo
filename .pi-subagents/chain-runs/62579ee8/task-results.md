# Task #19 - Code Block 컴포넌트 변환 완료

## Summary
커스텀 JSON 미리보기(`<pre>` 태그 + 커스텀 스타일)를 Astryx `CodeBlock` 컴포넌트로 대체했습니다.

## Changed Files
- `packages/fe/src/components/PolicyEditor.tsx`

## Changes Details
| 변경 항목 | Before | After |
|-----------|--------|-------|
| 컴포넌트 | `<pre style={codeBlockStyle}>` | `<CodeBlock />` |
| 스타일 | 커스텀 CSS | Astryx CodeBlock 컴포넌트 |
| 문법 하이라이팅 | 없음 | JSON highlighting |
| 복사 버튼 | 없음 | `hasCopyButton` |
| 줄 바꿈 | `white-space: pre-wrap` | `isWrapped` |
| 최대 높이 | `maxHeight: 200px` | `maxHeight={200}` |

## Git Information
- **Commit**: `231b12e`
- **Message**: refactor(fe): replace custom JSON preview with Astryx CodeBlock
- **Diff**: +11 insertions, -15 deletions

## Validation
- TypeScript compilation: ✅ Passed (no errors in PolicyEditor.tsx)

## Open Items
- None

## Next Steps
- Push to remote
- Review 결과 대기 (chain phase 2)
