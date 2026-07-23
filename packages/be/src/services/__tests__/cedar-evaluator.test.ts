/**
 * Cedar Evaluator Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { validateRequest } from '../cedar-evaluator.js';

describe('validateRequest', () => {
  it('should return null for valid request', () => {
    const request = {
      principal: { role: 'viewer', id: 'user-1' },
      resource: { type: 'document', id: 'doc-1', ownerId: 'user-2' },
      action: 'delete'
    };

    const result = validateRequest(request);
    expect(result).toBeNull();
  });

  it('should return error for missing principal', () => {
    const request = {
      resource: { type: 'document', id: 'doc-1', ownerId: 'user-2' },
      action: 'delete'
    };

    const result = validateRequest(request);
    expect(result).toContain('Missing required field: principal');
  });

  it('should return error for missing resource', () => {
    const request = {
      principal: { role: 'viewer', id: 'user-1' },
      action: 'delete'
    };

    const result = validateRequest(request);
    expect(result).toContain('Missing required field: resource');
  });

  it('should return error for missing action', () => {
    const request = {
      principal: { role: 'viewer', id: 'user-1' },
      resource: { type: 'document', id: 'doc-1', ownerId: 'user-2' }
    };

    const result = validateRequest(request);
    expect(result).toContain('Missing required field: action');
  });

  it('should return error for invalid role', () => {
    const request = {
      principal: { role: 'invalid', id: 'user-1' },
      resource: { type: 'document', id: 'doc-1', ownerId: 'user-2' },
      action: 'delete'
    };

    const result = validateRequest(request);
    expect(result).toContain('Invalid role');
  });

  it('should return error for invalid resource type', () => {
    const request = {
      principal: { role: 'viewer', id: 'user-1' },
      resource: { type: 'invalid', id: 'doc-1', ownerId: 'user-2' },
      action: 'delete'
    };

    const result = validateRequest(request);
    expect(result).toContain('Invalid resource type');
  });

  it('should return error for invalid action', () => {
    const request = {
      principal: { role: 'viewer', id: 'user-1' },
      resource: { type: 'document', id: 'doc-1', ownerId: 'user-2' },
      action: 'invalid'
    };

    const result = validateRequest(request);
    expect(result).toContain('Invalid action');
  });

  it('should return error for empty principal.id', () => {
    const request = {
      principal: { role: 'viewer', id: '' },
      resource: { type: 'document', id: 'doc-1', ownerId: 'user-2' },
      action: 'delete'
    };

    const result = validateRequest(request);
    expect(result).toContain('Invalid principal.id');
  });

  it('should return error for empty resource.id', () => {
    const request = {
      principal: { role: 'viewer', id: 'user-1' },
      resource: { type: 'document', id: '', ownerId: 'user-2' },
      action: 'delete'
    };

    const result = validateRequest(request);
    expect(result).toContain('Invalid resource.id');
  });

  it('should return error for empty resource.ownerId', () => {
    const request = {
      principal: { role: 'viewer', id: 'user-1' },
      resource: { type: 'document', id: 'doc-1', ownerId: '' },
      action: 'delete'
    };

    const result = validateRequest(request);
    expect(result).toContain('Invalid resource.ownerId');
  });
});
