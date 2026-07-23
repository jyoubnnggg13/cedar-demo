/**
 * Cedar Evaluator Service
 * 
 * Implements Forbid-Only policy evaluation logic.
 * - Forbid exists → DENY
 * - Forbid none → ALLOW
 */

import type { Principal, Resource, EvaluateResponse, ParsedPolicy } from '../types/index.js';
import { policyCache } from './policy-cache.js';

export interface EvaluationContext {
  principal: Principal;
  resource: Resource;
  action: string;
}

/**
 * Check if a role matches a policy's principal types
 */
function matchPrincipal(role: string, policyPrincipalTypes: string[]): boolean {
  if (policyPrincipalTypes.length === 0) return true;
  return policyPrincipalTypes.includes(role);
}

/**
 * Check if a resource type matches a policy's resource types
 */
function matchResourceType(type: string, policyResourceTypes: string[]): boolean {
  if (policyResourceTypes.length === 0) return true;
  return policyResourceTypes.includes(type);
}

/**
 * Check if an action matches a policy's actions
 */
function matchAction(action: string, policyActions: string[]): boolean {
  if (policyActions.length === 0) return true;
  return policyActions.includes(action);
}

/**
 * Evaluate a condition against the request context
 * Returns true if the condition passes (and thus the policy applies)
 */
function evaluateCondition(
  condition: { expression: string; description: string },
  context: EvaluationContext
): boolean {
  // Simple expression evaluation for common patterns
  // Pattern: resource.owner != principal.id
  if (condition.expression.includes('resource.owner') && condition.expression.includes('principal.id')) {
    // Check if resource owner is different from principal
    if (context.resource.ownerId && context.resource.ownerId !== context.principal.id) {
      return true;
    }
    return false;
  }

  // Pattern: resource.isPublic == false
  if (condition.expression.includes('resource.isPublic')) {
    if (context.resource.attributes?.isPublic === false) {
      return true;
    }
    return false;
  }

  // Default: condition is not met
  return false;
}

/**
 * Check if a policy matches the given context
 */
function policyMatches(context: EvaluationContext, policy: ParsedPolicy): { matches: boolean; reason?: string } {
  // Check principal match
  if (!matchPrincipal(context.principal.role, policy.principalTypes)) {
    return { matches: false };
  }

  // Check resource type match
  if (!matchResourceType(context.resource.type, policy.resourceTypes)) {
    return { matches: false };
  }

  // Check action match
  if (!matchAction(context.action, policy.actions)) {
    return { matches: false };
  }

  // Check condition if present
  if (policy.condition) {
    const conditionMet = evaluateCondition(policy.condition, context);
    if (!conditionMet) {
      return { matches: false };
    }
    return { matches: true, reason: policy.condition.description };
  }

  // No condition - policy applies
  return { matches: true, reason: policy.description || `${policy.name} denies this action` };
}

/**
 * Evaluate a request against all forbid policies
 */
export function evaluate(context: EvaluationContext): EvaluateResponse {
  const forbidPolicies = policyCache.getForbidPolicies();

  // Evaluate each forbid policy in order
  for (const policy of forbidPolicies) {
    const result = policyMatches(context, policy);
    if (result.matches) {
      return {
        decision: 'DENY',
        matchedPolicy: policy.name,
        reason: result.reason || `${policy.name}: Principal '${context.principal.role}' is not permitted to ${context.action} '${context.resource.type}' resources`
      };
    }
  }

  // No forbid policy matched → ALLOW
  return {
    decision: 'ALLOW'
  };
}

/**
 * Validate evaluation request
 */
export function validateRequest(request: { principal?: unknown; resource?: unknown; action?: unknown }): string | null {
  if (!request.principal) {
    return 'Missing required field: principal';
  }

  if (!request.resource) {
    return 'Missing required field: resource';
  }

  if (!request.action) {
    return 'Missing required field: action';
  }

  const principal = request.principal as Record<string, unknown>;
  if (!['admin', 'editor', 'viewer'].includes(principal.role as string)) {
    return `Invalid role: ${principal.role}. Must be one of: admin, editor, viewer`;
  }

  if (!principal.id || typeof principal.id !== 'string') {
    return 'Invalid principal.id: must be a non-empty string';
  }

  const resource = request.resource as Record<string, unknown>;
  if (!['document', 'issue'].includes(resource.type as string)) {
    return `Invalid resource type: ${resource.type}. Must be one of: document, issue`;
  }

  if (!resource.id || typeof resource.id !== 'string') {
    return 'Invalid resource.id: must be a non-empty string';
  }

  if (!resource.ownerId || typeof resource.ownerId !== 'string') {
    return 'Invalid resource.ownerId: must be a non-empty string';
  }

  if (!['read', 'write', 'delete'].includes(request.action as string)) {
    return `Invalid action: ${request.action}. Must be one of: read, write, delete`;
  }

  return null;
}
