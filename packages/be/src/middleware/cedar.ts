/**
 * Cedar Authorization Middleware
 * 
 * Express middleware for Cedar policy evaluation.
 * Can be used to protect routes based on authorization policies.
 */

import type { Request, Response, NextFunction } from 'express';
import { evaluate } from '../services/cedar-evaluator.js';
import { policyCache } from '../services/policy-cache.js';
import type { Principal, Resource, ErrorResponse } from '../types/index.js';

/**
 * Extract principal from request (customize based on auth implementation)
 */
function extractPrincipal(req: Request): Principal | null {
  // For demo purposes, extract from request body or headers
  // In production, this would come from JWT/session
  const body = req.body || {};
  const headers = req.headers || {};

  const role = body.principal?.role || headers['x-user-role'];
  const id = body.principal?.id || headers['x-user-id'];

  if (role && id) {
    return { role, id };
  }

  return null;
}

/**
 * Extract resource from request (customize based on route)
 */
function extractResource(req: Request): Resource | null {
  const body = req.body || {};
  const params = req.params || {};

  const type = body.resource?.type || params.type;
  const id = body.resource?.id || params.id;
  const ownerId = body.resource?.ownerId || params.ownerId;

  if (type && id && ownerId) {
    return {
      type,
      id,
      ownerId,
      attributes: body.resource?.attributes
    };
  }

  return null;
}

/**
 * Extract action from request method or body
 */
function extractAction(req: Request): string | null {
  // Map HTTP methods to actions
  const methodMap: Record<string, string> = {
    GET: 'read',
    POST: 'write',
    PUT: 'write',
    PATCH: 'write',
    DELETE: 'delete'
  };

  const body = req.body || {};
  return body.action || methodMap[req.method] || null;
}

/**
 * Create Cedar authorization middleware
 * 
 * @param options - Middleware configuration
 * @returns Express middleware function
 */
export function cedarMiddleware(options: {
  skipIfNoPrincipal?: boolean;
  onDeny?: (result: { decision: 'DENY'; matchedPolicy?: string; reason?: string }, req: Request) => void;
} = {}) {
  const { skipIfNoPrincipal = true, onDeny } = options;

  return function(req: Request, res: Response, next: NextFunction): void {
    // Ensure policy cache is loaded
    if (!policyCache.isInitialized()) {
      policyCache.refresh();
    }

    const principal = extractPrincipal(req);
    const resource = extractResource(req);
    const action = extractAction(req);

    // Skip if we can't extract required context
    if (!principal) {
      if (skipIfNoPrincipal) {
        next();
        return;
      }
      res.status(401).json({ error: 'Unauthorized: No principal found' } as ErrorResponse);
      return;
    }

    if (!resource) {
      res.status(400).json({ error: 'Bad Request: No resource found' } as ErrorResponse);
      return;
    }

    if (!action) {
      res.status(400).json({ error: 'Bad Request: No action found' } as ErrorResponse);
      return;
    }

    // Evaluate authorization
    const result = evaluate({ principal, resource, action });

    if (result.decision === 'DENY') {
      if (onDeny) {
        onDeny(result, req);
      }
      res.status(403).json({
        error: 'Forbidden',
        details: result.reason,
        matchedPolicy: result.matchedPolicy
      } as ErrorResponse & { matchedPolicy?: string });
      return;
    }

    // ALLOW - continue to route handler
    next();
  };
}

/**
 * Pre-configured middleware for protected routes
 */
export const requireAuthorization = cedarMiddleware({
  skipIfNoPrincipal: false
});

/**
 * Optional authorization middleware (continues if no principal)
 */
export const optionalAuthorization = cedarMiddleware({
  skipIfNoPrincipal: true
});
