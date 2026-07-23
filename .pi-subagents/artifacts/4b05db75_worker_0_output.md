# Task #5: BE: 리소스 & 역할 API 구현

## 구현 내용

### 완료된 작업

1. **GET /api/roles** - 미리 정의된 역할 목록 반환
   - 파일: `packages/be/src/routes/roles.ts`
   - `admin`, `editor`, `viewer` 역할 반환
   - 권한(permissions)은 JSON으로 파싱하여 반환

2. **GET /api/resources** - 샘플 리소스 목록 조회 (type 필터 지원)
   - 파일: `packages/be/src/routes/resources.ts`
   - 선택적 `type` 쿼리 파라미터로 필터링
   - 필터 없으면 전체 리소스 반환

3. **GET /api/resources/:id** - 단일 리소스 상세 조회
   - 파일: `packages/be/src/routes/resources.ts`
   - ID로 리소스 조회, 없으면 404 반환
   - 속성(attributes)은 JSON으로 파싱하여 반환

### 변경된 파일

- `packages/be/src/index.ts` - API 라우트 등록
- `packages/be/src/routes/roles.ts` - 역할 API
- `packages/be/src/routes/resources.ts` - 리소스 API
- `packages/be/src/routes/index.ts` - 라우트 export
- `packages/be/src/routes/__tests__/roles.test.ts` - 역할 테스트
- `packages/be/src/routes/__tests__/resources.test.ts` - 리소스 테스트

### 검증

- TypeScript 빌드: 성공
- 테스트: 21개 테스트 모두 통과 (기존 17개 + 신규 4개)
- Git 커밋: 완료 (6개 파일, 174줄 추가)

## Diff 요약

```
packages/be/src/index.ts                           |  5 ++
packages/be/src/routes/__tests__/resources.test.ts | 38 +++++++++++
packages/be/src/routes/__tests__/roles.test.ts     | 25 +++++++++
packages/be/src/routes/index.ts                    |  2 +
packages/be/src/routes/resources.ts                | 71 +++++++++++++++
packages/be/src/routes/roles.ts                   | 33 ++++++++++
6 files changed, 174 insertions(+)
```

## 잔여 위험

- 없음

## 다음 단계

- Reviewer phase로 이동하여 코드 검토 진행