// Policy and related types matching backend schema

export interface Policy {
  id: number;
  policy_set_id: number | null;
  name: string;
  description: string | null;
  effect: 'permit' | 'deny';
  principal_types: string | null;
  resource_types: string | null;
  actions: string | null;
  conditions: string | null;
  created_at: string;
  updated_at: string;
}

export interface PolicySet {
  id: number;
  name: string;
  description: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface CreatePolicyRequest {
  policy_set_id: number | null;
  name: string;
  description: string | null;
  effect: 'permit' | 'deny';
  principal_types: string | null;
  resource_types: string | null;
  actions: string | null;
  conditions: string | null;
}

export interface UpdatePolicyRequest extends Partial<CreatePolicyRequest> {}

// Parsed condition for editor UI
export interface ParsedCondition {
  kind: 'principal' | 'resource' | 'action';
  attribute: string;
  operator: '==' | '!=' | 'in' | 'exists' | '!exists';
  value: string;
}

// Policy editor state
export interface PolicyEditorState {
  policy: CreatePolicyRequest;
  errors: Record<string, string>;
  isDirty: boolean;
  isSaving: boolean;
}
