/**
 * Policy Types
 * Cedar Forbid Policy 관련 타입 정의
 */

/**
 * Cedar Forbid 정책 구조
 * ADR-003: Cedar JSON 직접 저장 방식
 */
export interface CedarPolicy {
  effect: "forbid";
  principal: {
    role: "admin" | "editor" | "viewer";
  };
  resource: {
    type: "document" | "issue";
  };
  action: "read" | "write" | "delete";
  condition?: {
    expression: string;
    description: string;
  };
}

/**
 * 정책 목록 조회 응답
 */
export interface PolicyListResponse {
  policies: Policy[];
}

/**
 * 정책 생성/수정 요청
 */
export interface PolicyCreateRequest {
  name: string;
  cedarJson: string;
  description?: string;
}

/**
 * 정책 생성 응답
 */
export interface PolicyCreateResponse {
  id: string;
  policy: Policy;
}

/**
 * 저장소 정책 객체 (DB 저장 형태)
 */
export interface Policy {
  id: string;
  name: string;
  cedarJson: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 정책 편집기 Form 상태
 */
export interface PolicyFormState {
  name: string;
  principalRole: "admin" | "editor" | "viewer" | null;
  resourceType: "document" | "issue" | null;
  actions: ("read" | "write" | "delete")[];
  conditionExpression: string;
  conditionDescription: string;
}

/**
 * 스텝 정의
 */
export interface Step {
  id: number;
  title: string;
  required: boolean;
  description: string;
}

/**
 * 스텝 유효성 상태
 */
export interface StepValidation {
  isValid: boolean;
  error?: string;
}
