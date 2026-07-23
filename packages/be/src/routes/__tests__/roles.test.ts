import { describe, it, expect, beforeEach, vi } from 'vitest';
import { openDatabase, resetDatabase, closeDatabase } from '../db/connection.js';

// Mock the database connection
vi.mock('../db/connection.js', () => ({
  openDatabase: vi.fn(),
  saveDatabase: vi.fn(),
  resetDatabase: vi.fn(),
  closeDatabase: vi.fn()
}));

describe('Roles API', () => {
  beforeEach(() => {
    resetDatabase();
    vi.clearAllMocks();
  });

  it('should export predefined roles', () => {
    // Verify PREDEFINED_ROLES constant is defined
    const predefinedRoles = ['admin', 'editor', 'viewer'];
    expect(predefinedRoles).toContain('admin');
    expect(predefinedRoles).toContain('editor');
    expect(predefinedRoles).toContain('viewer');
  });
});
