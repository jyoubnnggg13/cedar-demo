/**
 * Policy Cache Service
 * 
 * Loads and caches all forbid policies at server startup.
 * Cache is refreshed when policies are created/updated/deleted.
 */

import { policyRepository } from '../db/index.js';
import type { Policy, ParsedPolicy } from '../types/index.js';

/**
 * Parse policy from database row to structured format
 */
function parsePolicy(policy: Policy): ParsedPolicy {
  return {
    id: policy.id,
    name: policy.name,
    description: policy.description,
    effect: policy.effect,
    principalTypes: policy.principal_types ? JSON.parse(policy.principal_types) : [],
    resourceTypes: policy.resource_types ? JSON.parse(policy.resource_types) : [],
    actions: policy.actions ? JSON.parse(policy.actions) : [],
    condition: policy.conditions ? JSON.parse(policy.conditions) : undefined
  };
}

/**
 * Policy cache singleton
 */
class PolicyCache {
  private forbidPolicies: ParsedPolicy[] = [];
  private initialized = false;

  /**
   * Load all forbid policies from database
   */
  load(): void {
    const allPolicies = policyRepository.findAll();
    this.forbidPolicies = allPolicies
      .filter(p => p.effect === 'deny')
      .map(parsePolicy);
    this.initialized = true;
    console.log(`[PolicyCache] Loaded ${this.forbidPolicies.length} forbid policies`);
  }

  /**
   * Get all cached forbid policies
   */
  getForbidPolicies(): ParsedPolicy[] {
    return this.forbidPolicies;
  }

  /**
   * Check if cache is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Refresh cache from database
   */
  refresh(): void {
    this.load();
  }
}

// Export singleton instance
export const policyCache = new PolicyCache();

/**
 * Initialize policy cache at server startup
 */
export function initializePolicyCache(): void {
  policyCache.load();
}
