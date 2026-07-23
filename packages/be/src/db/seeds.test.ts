import { describe, it, expect, beforeEach } from 'vitest';
import { initSql, openDatabase, resetDatabase } from './connection.js';
import { seedDatabase, forceSeedDatabase, clearDatabase, getSeedStats, isDatabaseSeeded } from './seeds.js';
import { migrate } from './migrations/index.js';

describe('Seed Data', () => {
  beforeEach(async () => {
    resetDatabase();
    await initSql();
    migrate();
  });

  describe('seedDatabase', () => {
    it('should seed database with sample data', () => {
      const result = seedDatabase();
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.users).toHaveLength(4);
      expect(result.data?.roles).toHaveLength(4);
      expect(result.data?.resources).toHaveLength(6);
      expect(result.data?.policySets).toHaveLength(3);
      expect(result.data?.policies).toHaveLength(5);
    });

    it('should prevent seeding when data already exists', () => {
      seedDatabase();
      const result = seedDatabase();
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('already contains data');
    });

    it('should create correct user data', () => {
      const result = seedDatabase();
      
      expect(result.data?.users[0]).toMatchObject({
        username: 'admin',
        email: 'admin@example.com'
      });
      expect(result.data?.users[1]).toMatchObject({
        username: 'developer',
        email: 'dev@example.com'
      });
    });

    it('should create correct role data', () => {
      const result = seedDatabase();
      
      expect(result.data?.roles[0]).toMatchObject({
        name: 'admin',
        description: 'Full system access'
      });
    });

    it('should create user-role mappings', () => {
      const result = seedDatabase();
      
      expect(result.data?.userRoles).toHaveLength(4);
      expect(result.data?.userRoles[0]).toMatchObject({
        user_id: 1,
        role_id: 1
      });
    });
  });

  describe('forceSeedDatabase', () => {
    it('should clear existing data and reseed', () => {
      seedDatabase();
      expect(isDatabaseSeeded()).toBe(true);
      
      const result = forceSeedDatabase();
      
      expect(result.success).toBe(true);
      expect(result.data?.users).toHaveLength(4);
    });

    it('should allow force seed after initial seed', () => {
      seedDatabase();
      const result = forceSeedDatabase();
      
      expect(result.success).toBe(true);
    });
  });

  describe('clearDatabase', () => {
    it('should clear all seeded data', () => {
      seedDatabase();
      expect(isDatabaseSeeded()).toBe(true);
      
      clearDatabase();
      
      expect(isDatabaseSeeded()).toBe(false);
    });

    it('should clear user_roles table', () => {
      seedDatabase();
      clearDatabase();
      
      const stats = getSeedStats();
      expect(stats.user_roles).toBe(0);
    });

    it('should clear policies table', () => {
      seedDatabase();
      clearDatabase();
      
      const stats = getSeedStats();
      expect(stats.policies).toBe(0);
    });
  });

  describe('getSeedStats', () => {
    it('should return zero counts for empty database', () => {
      const stats = getSeedStats();
      
      expect(stats.users).toBe(0);
      expect(stats.roles).toBe(0);
      expect(stats.resources).toBe(0);
      expect(stats.policy_sets).toBe(0);
      expect(stats.policies).toBe(0);
    });

    it('should return correct counts after seeding', () => {
      seedDatabase();
      const stats = getSeedStats();
      
      expect(stats.users).toBe(4);
      expect(stats.roles).toBe(4);
      expect(stats.user_roles).toBe(4);
      expect(stats.resources).toBe(6);
      expect(stats.policy_sets).toBe(3);
      expect(stats.policies).toBe(5);
    });
  });

  describe('isDatabaseSeeded', () => {
    it('should return false for empty database', () => {
      expect(isDatabaseSeeded()).toBe(false);
    });

    it('should return true after seeding', () => {
      seedDatabase();
      expect(isDatabaseSeeded()).toBe(true);
    });

    it('should return false after clearing', () => {
      seedDatabase();
      clearDatabase();
      expect(isDatabaseSeeded()).toBe(false);
    });
  });
});
