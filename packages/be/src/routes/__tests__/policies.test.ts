import { describe, it, expect } from 'vitest';
import { validateCedarJson, validateCreatePolicyInput } from '../policies.js';

describe('Cedar JSON Validation', () => {
  it('should accept valid forbid policy JSON', () => {
    const validJson = JSON.stringify({
      effect: 'forbid',
      principal: { type: 'User', id: '*' },
      resource: { type: 'Document', id: '*' },
      action: 'delete'
    });

    const result = validateCedarJson(validJson);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject invalid JSON', () => {
    const invalidJson = 'not valid json';
    const result = validateCedarJson(invalidJson);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Invalid JSON format');
  });

  it('should reject non-forbid effect', () => {
    const nonForbidJson = JSON.stringify({
      effect: 'permit',
      principal: { type: 'User', id: '*' },
      resource: { type: 'Document', id: '*' },
      action: 'delete'
    });

    const result = validateCedarJson(nonForbidJson);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('effect must be "forbid"');
  });

  it('should reject missing effect field', () => {
    const missingEffect = JSON.stringify({
      principal: { type: 'User', id: '*' },
      resource: { type: 'Document', id: '*' },
      action: 'delete'
    });

    const result = validateCedarJson(missingEffect);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Missing required field: effect');
  });

  it('should reject missing principal field', () => {
    const missingPrincipal = JSON.stringify({
      effect: 'forbid',
      resource: { type: 'Document', id: '*' },
      action: 'delete'
    });

    const result = validateCedarJson(missingPrincipal);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Missing required field: principal');
  });

  it('should reject missing resource field', () => {
    const missingResource = JSON.stringify({
      effect: 'forbid',
      principal: { type: 'User', id: '*' },
      action: 'delete'
    });

    const result = validateCedarJson(missingResource);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Missing required field: resource');
  });

  it('should reject missing action field', () => {
    const missingAction = JSON.stringify({
      effect: 'forbid',
      principal: { type: 'User', id: '*' },
      resource: { type: 'Document', id: '*' }
    });

    const result = validateCedarJson(missingAction);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Missing required field: action');
  });
});

describe('Create Policy Input Validation', () => {
  it('should accept valid input', () => {
    const input = {
      name: 'Test Policy',
      cedarJson: JSON.stringify({
        effect: 'forbid',
        principal: { type: 'User', id: '*' },
        resource: { type: 'Document', id: '*' },
        action: 'delete'
      }),
      description: 'Test description'
    };

    const result = validateCreatePolicyInput(input);
    expect(result.valid).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data?.name).toBe('Test Policy');
  });

  it('should accept input without description', () => {
    const input = {
      name: 'Test Policy',
      cedarJson: JSON.stringify({
        effect: 'forbid',
        principal: { type: 'User', id: '*' },
        resource: { type: 'Document', id: '*' },
        action: 'delete'
      })
    };

    const result = validateCreatePolicyInput(input);
    expect(result.valid).toBe(true);
  });

  it('should reject empty body', () => {
    const result = validateCreatePolicyInput(null);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Request body is required');
  });

  it('should reject missing name', () => {
    const input = {
      cedarJson: JSON.stringify({
        effect: 'forbid',
        principal: { type: 'User', id: '*' },
        resource: { type: 'Document', id: '*' },
        action: 'delete'
      })
    };

    const result = validateCreatePolicyInput(input);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('name is required and must be a string');
  });

  it('should reject name longer than 100 characters', () => {
    const input = {
      name: 'a'.repeat(101),
      cedarJson: JSON.stringify({
        effect: 'forbid',
        principal: { type: 'User', id: '*' },
        resource: { type: 'Document', id: '*' },
        action: 'delete'
      })
    };

    const result = validateCreatePolicyInput(input);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('name must be between 1 and 100 characters');
  });

  it('should reject missing cedarJson', () => {
    const input = {
      name: 'Test Policy'
    };

    const result = validateCreatePolicyInput(input);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('cedarJson is required and must be a string');
  });

  it('should reject invalid cedarJson', () => {
    const input = {
      name: 'Test Policy',
      cedarJson: 'not valid json'
    };

    const result = validateCreatePolicyInput(input);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Invalid JSON format');
  });

  it('should reject cedarJson with non-forbid effect', () => {
    const input = {
      name: 'Test Policy',
      cedarJson: JSON.stringify({
        effect: 'permit',
        principal: { type: 'User', id: '*' },
        resource: { type: 'Document', id: '*' },
        action: 'delete'
      })
    };

    const result = validateCreatePolicyInput(input);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('effect must be "forbid"');
  });

  it('should reject description longer than 500 characters', () => {
    const input = {
      name: 'Test Policy',
      cedarJson: JSON.stringify({
        effect: 'forbid',
        principal: { type: 'User', id: '*' },
        resource: { type: 'Document', id: '*' },
        action: 'delete'
      }),
      description: 'a'.repeat(501)
    };

    const result = validateCreatePolicyInput(input);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('description must be at most 500 characters');
  });

  it('should reject non-string description', () => {
    const input = {
      name: 'Test Policy',
      cedarJson: JSON.stringify({
        effect: 'forbid',
        principal: { type: 'User', id: '*' },
        resource: { type: 'Document', id: '*' },
        action: 'delete'
      }),
      description: 123
    };

    const result = validateCreatePolicyInput(input);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('description must be a string');
  });
});
