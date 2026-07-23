export interface Migration {
  id: number;
  name: string;
  applied_at: string;
}

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
  cedar_json: string | null;
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

export interface Resource {
  id: number;
  type: string;
  identifier: string;
  name: string | null;
  attributes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: number;
  name: string;
  description: string | null;
  permissions: string | null;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  attributes: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: number;
  user_id: number;
  role_id: number;
  created_at: string;
}

export const SCHEMA_VERSION = 1;
