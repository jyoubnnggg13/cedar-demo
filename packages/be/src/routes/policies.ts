import { Router, Request, Response } from 'express';
import { policyRepository } from '../db/repositories.js';

export const policyRouter = Router();

/**
 * Interface for creating a new policy
 */
interface CreatePolicyRequest {
  name: string;
  cedarJson: string;
  description?: string;
}

/**
 * Validate Cedar JSON structure
 */
export function validateCedarJson(cedarJson: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Parse JSON
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(cedarJson);
  } catch {
    return { valid: false, errors: ['Invalid JSON format'] };
  }

  // Check for effect field
  if (!parsed.effect) {
    errors.push('Missing required field: effect');
  } else if (parsed.effect !== 'forbid') {
    errors.push('effect must be "forbid"');
  }

  // Check for principal field
  if (!parsed.principal) {
    errors.push('Missing required field: principal');
  }

  // Check for resource field
  if (!parsed.resource) {
    errors.push('Missing required field: resource');
  }

  // Check for action field
  if (!parsed.action) {
    errors.push('Missing required field: action');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate input for policy creation
 */
export function validateCreatePolicyInput(body: unknown): { valid: boolean; errors: string[]; data?: CreatePolicyRequest } {
  const errors: string[] = [];

  if (!body || typeof body !== 'object') {
    return { valid: false, errors: ['Request body is required'] };
  }

  const { name, cedarJson, description } = body as Record<string, unknown>;

  // Validate name: 1-100 characters
  if (!name || typeof name !== 'string') {
    errors.push('name is required and must be a string');
  } else if (name.length < 1 || name.length > 100) {
    errors.push('name must be between 1 and 100 characters');
  }

  // Validate cedarJson: valid JSON
  if (!cedarJson || typeof cedarJson !== 'string') {
    errors.push('cedarJson is required and must be a string');
  } else {
    const cedarValidation = validateCedarJson(cedarJson);
    if (!cedarValidation.valid) {
      errors.push(...cedarValidation.errors);
    }
  }

  // Validate description: 0-500 characters (optional)
  if (description !== undefined && description !== null) {
    if (typeof description !== 'string') {
      errors.push('description must be a string');
    } else if (description.length > 500) {
      errors.push('description must be at most 500 characters');
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return { valid: true, errors: [], data: { name: name as string, cedarJson: cedarJson as string, description: description as string | undefined } };
}

/**
 * GET /api/policies - List all Forbid policies
 */
policyRouter.get('/', (_req: Request, res: Response) => {
  try {
    const policies = policyRepository.findAll();
    
    // Filter to only Forbid policies and map to response format
    const forbidPolicies = policies
      .filter(p => p.effect === 'deny')
      .map(p => ({
        id: p.id.toString(),
        name: p.name,
        cedarJson: p.cedar_json || '{}',
        description: p.description || '',
        createdAt: p.created_at,
        updatedAt: p.updated_at
      }));

    res.json({ policies: forbidPolicies });
  } catch (error) {
    console.error('Error fetching policies:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/policies - Create a new Forbid policy
 */
policyRouter.post('/', (req: Request, res: Response) => {
  try {
    const validation = validateCreatePolicyInput(req.body);
    
    if (!validation.valid) {
      res.status(400).json({ error: validation.errors.join(', ') });
      return;
    }

    const { name, cedarJson, description } = validation.data!;

    // Check for duplicate name
    const existing = policyRepository.findAll().find(p => p.name === name);
    if (existing) {
      res.status(409).json({ error: 'Policy name already exists' });
      return;
    }

    // Create the policy
    const newPolicy = policyRepository.create({
      policy_set_id: null,
      name,
      description: description || null,
      effect: 'deny', // Forbid policies are stored as 'deny'
      principal_types: null,
      resource_types: null,
      actions: null,
      conditions: null,
      cedar_json: cedarJson
    });

    const response = {
      id: newPolicy.id.toString(),
      policy: {
        id: newPolicy.id.toString(),
        name: newPolicy.name,
        cedarJson: newPolicy.cedar_json || '{}',
        description: newPolicy.description || '',
        createdAt: newPolicy.created_at,
        updatedAt: newPolicy.updated_at
      }
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating policy:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /api/policies/:id - Delete a policy
 */
policyRouter.delete('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid policy ID' });
      return;
    }

    const deleted = policyRepository.delete(id);
    
    if (!deleted) {
      res.status(404).json({ error: 'Policy not found' });
      return;
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting policy:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
