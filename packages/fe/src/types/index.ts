/**
 * Evaluation Types
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
