/**
 * Cedar Evaluation Types
 */

export interface Principal {
  role: 'admin' | 'editor' | 'viewer';
  id: string;
}

export interface Resource {
  type: 'document' | 'issue';
  id: string;
  ownerId: string;
  attributes?: {
    isPublic?: boolean;
    isPrivate?: boolean;
    author?: string;
  };
}

export interface EvaluateRequest {
  principal: Principal;
  resource: Resource;
  action: 'read' | 'write' | 'delete';
}

export interface EvaluateResponse {
  decision: 'ALLOW' | 'DENY';
  matchedPolicy?: string;
  reason?: string;
}

export interface ParsedPolicy {
  id: number;
  name: string;
  description: string | null;
  effect: 'permit' | 'deny';
  principalTypes: string[];
  resourceTypes: string[];
  actions: string[];
  condition?: {
    expression: string;
    description: string;
  };
}

/**
 * Error response type
 */
export interface ErrorResponse {
  error: string;
  details?: string;
}
