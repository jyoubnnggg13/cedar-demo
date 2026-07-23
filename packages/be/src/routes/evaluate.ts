/**
 * Evaluate Route Handler
 * 
 * POST /api/evaluate - Evaluate authorization request
 */

import type { Request, Response } from 'express';
import { evaluate, validateRequest } from '../services/cedar-evaluator.js';
import { policyCache } from '../services/policy-cache.js';
import type { Principal, Resource, EvaluateRequest, ErrorResponse } from '../types/index.js';

/**
 * Handle POST /api/evaluate
 */
export async function handleEvaluate(req: Request, res: Response): Promise<void> {
  try {
    // Validate request
    const validationError = validateRequest(req.body);
    if (validationError) {
      res.status(400).json({ error: 'Bad Request', details: validationError } as ErrorResponse);
      return;
    }

    const { principal, resource, action } = req.body as EvaluateRequest;

    // Ensure policy cache is loaded
    if (!policyCache.isInitialized()) {
      policyCache.refresh();
    }

    // Evaluate the request
    const result = evaluate({
      principal: principal as Principal,
      resource: resource as Resource,
      action
    });

    // Return result
    res.json(result);
  } catch (error) {
    console.error('[Evaluate] Error:', error);
    res.status(500).json({ error: 'Internal Server Error' } as ErrorResponse);
  }
}

/**
 * Register evaluate routes with Express app
 */
export function registerEvaluateRoutes(app: import('express').Express): void {
  app.post('/api/evaluate', handleEvaluate);
  console.log('[Routes] Registered /api/evaluate');
}
