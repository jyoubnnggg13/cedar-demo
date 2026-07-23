import { describe, it, expect, beforeEach, afterAll, beforeAll } from 'vitest';
import {
  closeDatabase,
  resetDatabase,
  initSql,
  migrate,
  openDatabase,
  policyRepository,
  policySetRepository,
  resourceRepository,
  roleRepository,
  userRepository,
  userRoleRepository
} from '../index.js';

beforeAll(async () => {
  await initSql();
});

describe('Database Schema and Repositories', () => {
  beforeEach(() => {
    resetDatabase();
    openDatabase();
    migrate();
  });

  afterAll(() => {
    closeDatabase();
  });

  describe('PolicySet Repository', () => {
    it('should create a policy set', () => {
      const policySet = policySetRepository.create({
        name: 'Test Policy Set',
        description: 'A test policy set'
      });

      expect(policySet.id).toBeGreaterThan(0);
      expect(policySet.name).toBe('Test Policy Set');
      expect(policySet.description).toBe('A test policy set');
      expect(policySet.is_active).toBe(1);
    });

    it('should find all policy sets', () => {
      policySetRepository.create({ name: 'Policy Set 1', description: null });
      policySetRepository.create({ name: 'Policy Set 2', description: null });

      const policySets = policySetRepository.findAll();
      expect(policySets.length).toBe(2);
    });

    it('should update a policy set', () => {
      const policySet = policySetRepository.create({
        name: 'Original Name',
        description: null
      });

      const updated = policySetRepository.update(policySet.id, {
        name: 'Updated Name',
        is_active: 0
      });

      expect(updated?.name).toBe('Updated Name');
      expect(updated?.is_active).toBe(0);
    });

    it('should delete a policy set', () => {
      const policySet = policySetRepository.create({
        name: 'To Delete',
        description: null
      });

      const deleted = policySetRepository.delete(policySet.id);
      expect(deleted).toBe(true);
      expect(policySetRepository.findById(policySet.id)).toBeUndefined();
    });
  });

  describe('Policy Repository', () => {
    it('should create a policy', () => {
      const policy = policyRepository.create({
        policy_set_id: null,
        name: 'Test Policy',
        description: 'A test policy',
        effect: 'permit',
        principal_types: 'User',
        resource_types: 'Document',
        actions: 'read,write',
        conditions: null,
        cedar_json: null
      });

      expect(policy.id).toBeGreaterThan(0);
      expect(policy.name).toBe('Test Policy');
      expect(policy.effect).toBe('permit');
    });

    it('should associate policy with policy set', () => {
      const policySet = policySetRepository.create({
        name: 'Parent Policy Set',
        description: null
      });

      const policy = policyRepository.create({
        policy_set_id: policySet.id,
        name: 'Child Policy',
        description: null,
        effect: 'deny',
        principal_types: null,
        resource_types: null,
        actions: null,
        conditions: null,
        cedar_json: null
      });

      expect(policy.policy_set_id).toBe(policySet.id);

      const policies = policyRepository.findByPolicySetId(policySet.id);
      expect(policies.length).toBe(1);
      expect(policies[0].name).toBe('Child Policy');
    });
  });

  describe('Resource Repository', () => {
    it('should create a resource', () => {
      const resource = resourceRepository.create({
        type: 'Document',
        identifier: 'doc-123',
        name: 'Test Document',
        attributes: '{"owner": "user1"}'
      });

      expect(resource.id).toBeGreaterThan(0);
      expect(resource.type).toBe('Document');
      expect(resource.identifier).toBe('doc-123');
    });

    it('should find resources by type', () => {
      resourceRepository.create({ type: 'Document', identifier: 'doc-1', name: null, attributes: null });
      resourceRepository.create({ type: 'Document', identifier: 'doc-2', name: null, attributes: null });
      resourceRepository.create({ type: 'Folder', identifier: 'folder-1', name: null, attributes: null });

      const documents = resourceRepository.findByType('Document');
      expect(documents.length).toBe(2);
    });

    it('should enforce unique type + identifier', () => {
      resourceRepository.create({
        type: 'Document',
        identifier: 'unique-doc',
        name: null,
        attributes: null
      });

      expect(() => {
        resourceRepository.create({
          type: 'Document',
          identifier: 'unique-doc',
          name: null,
          attributes: null
        });
      }).toThrow();
    });
  });

  describe('Role Repository', () => {
    it('should create a role', () => {
      const role = roleRepository.create({
        name: 'Admin',
        description: 'Administrator role',
        permissions: '["read", "write", "delete"]'
      });

      expect(role.id).toBeGreaterThan(0);
      expect(role.name).toBe('Admin');
    });

    it('should find role by name', () => {
      roleRepository.create({ name: 'Editor', description: null, permissions: null });

      const editor = roleRepository.findByName('Editor');
      expect(editor).toBeDefined();
      expect(editor?.name).toBe('Editor');
    });
  });

  describe('User Repository', () => {
    it('should create a user', () => {
      const user = userRepository.create({
        username: 'testuser',
        email: 'test@example.com',
        attributes: '{"department": "Engineering"}'
      });

      expect(user.id).toBeGreaterThan(0);
      expect(user.username).toBe('testuser');
      expect(user.email).toBe('test@example.com');
    });

    it('should find user by username', () => {
      userRepository.create({
        username: 'john',
        email: 'john@example.com',
        attributes: null
      });

      const user = userRepository.findByUsername('john');
      expect(user).toBeDefined();
      expect(user?.email).toBe('john@example.com');
    });

    it('should enforce unique username', () => {
      userRepository.create({
        username: 'unique-user',
        email: 'first@example.com',
        attributes: null
      });

      expect(() => {
        userRepository.create({
          username: 'unique-user',
          email: 'second@example.com',
          attributes: null
        });
      }).toThrow();
    });
  });

  describe('UserRole Repository', () => {
    it('should assign role to user', () => {
      const user = userRepository.create({
        username: 'roleuser',
        email: 'role@example.com',
        attributes: null
      });

      const role = roleRepository.create({
        name: 'Reviewer',
        description: null,
        permissions: null
      });

      const userRole = userRoleRepository.create({
        user_id: user.id,
        role_id: role.id
      });

      expect(userRole.id).toBeGreaterThan(0);
      expect(userRole.user_id).toBe(user.id);
      expect(userRole.role_id).toBe(role.id);
    });

    it('should find roles by user id', () => {
      const user = userRepository.create({
        username: 'multirole',
        email: 'multi@example.com',
        attributes: null
      });

      const role1 = roleRepository.create({ name: 'Role1', description: null, permissions: null });
      const role2 = roleRepository.create({ name: 'Role2', description: null, permissions: null });

      userRoleRepository.create({ user_id: user.id, role_id: role1.id });
      userRoleRepository.create({ user_id: user.id, role_id: role2.id });

      const userRoles = userRoleRepository.findByUserId(user.id);
      expect(userRoles.length).toBe(2);
    });
  });

  describe('Integration', () => {
    it('should create a complete authorization setup', () => {
      // Create policy set
      const policySet = policySetRepository.create({
        name: 'Document Access Policies',
        description: 'Controls access to documents'
      });

      // Create policies
      const allowPolicy = policyRepository.create({
        policy_set_id: policySet.id,
        name: 'Allow Read',
        description: 'Allow read access',
        effect: 'permit',
        principal_types: 'User',
        resource_types: 'Document',
        actions: 'read',
        conditions: null,
        cedar_json: null
      });

      const denyPolicy = policyRepository.create({
        policy_set_id: policySet.id,
        name: 'Deny Delete',
        description: 'Deny delete access',
        effect: 'deny',
        principal_types: 'User',
        resource_types: 'Document',
        actions: 'delete',
        conditions: null,
        cedar_json: null
      });

      // Create resources
      const doc1 = resourceRepository.create({
        type: 'Document',
        identifier: 'confidential-1',
        name: 'Confidential Document',
        attributes: '{"classification": "confidential"}'
      });

      const doc2 = resourceRepository.create({
        type: 'Document',
        identifier: 'public-1',
        name: 'Public Document',
        attributes: '{"classification": "public"}'
      });

      // Create roles
      const adminRole = roleRepository.create({
        name: 'DocumentAdmin',
        description: 'Full document access',
        permissions: '["read", "write", "delete"]'
      });

      const viewerRole = roleRepository.create({
        name: 'DocumentViewer',
        description: 'Read-only access',
        permissions: '["read"]'
      });

      // Create users
      const adminUser = userRepository.create({
        username: 'admin',
        email: 'admin@example.com',
        attributes: null
      });

      const viewerUser = userRepository.create({
        username: 'viewer',
        email: 'viewer@example.com',
        attributes: null
      });

      // Assign roles
      userRoleRepository.create({ user_id: adminUser.id, role_id: adminRole.id });
      userRoleRepository.create({ user_id: viewerUser.id, role_id: viewerRole.id });

      // Verify setup
      expect(policySetRepository.findById(policySet.id)).toBeDefined();
      expect(policyRepository.findByPolicySetId(policySet.id).length).toBe(2);
      expect(resourceRepository.findAll().length).toBe(2);
      expect(roleRepository.findAll().length).toBe(2);
      expect(userRepository.findAll().length).toBe(2);
      expect(userRoleRepository.findByUserId(adminUser.id).length).toBe(1);
      expect(userRoleRepository.findByUserId(viewerUser.id).length).toBe(1);
    });
  });
});
