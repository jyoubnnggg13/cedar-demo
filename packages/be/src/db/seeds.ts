import { openDatabase, saveDatabase } from './connection.js';
import type { Policy, PolicySet, Resource, Role, User, UserRole } from './schema.js';

export interface SeedData {
  users: User[];
  roles: Role[];
  userRoles: UserRole[];
  resources: Resource[];
  policySets: PolicySet[];
  policies: Policy[];
}

function execute(sql: string, params: unknown[] = []): number {
  const db = openDatabase();
  db.run(sql, params);
  const result = db.exec('SELECT last_insert_rowid() as id');
  if (result.length > 0 && result[0].values.length > 0) {
    return result[0].values[0][0] as number;
  }
  return 0;
}

function executeMany(sql: string, paramsArray: unknown[][]): void {
  const db = openDatabase();
  for (const params of paramsArray) {
    db.run(sql, params);
  }
}

function executeUpdate(sql: string, params: unknown[] = []): number {
  const db = openDatabase();
  db.run(sql, params);
  const result = db.exec('SELECT changes() as changes');
  if (result.length > 0 && result[0].values.length > 0) {
    return result[0].values[0][0] as number;
  }
  return 0;
}

export interface SeedResult {
  success: boolean;
  data?: SeedData;
  error?: string;
}

/**
 * Seeds the database with sample data for testing the Cedar authorization system.
 * Creates sample users, roles, resources, and policies.
 */
export function seedDatabase(): SeedResult {
  try {
    const db = openDatabase();

    // Check if data already exists
    const existingUsers = db.exec('SELECT COUNT(*) as count FROM users');
    if (existingUsers.length > 0 && (existingUsers[0].values[0][0] as number) > 0) {
      return {
        success: false,
        error: 'Database already contains data. Use clearDatabase() first or use forceSeed().'
      };
    }

    // Seed Users
    const users = [
      { username: 'admin', email: 'admin@example.com', attributes: JSON.stringify({ department: 'engineering', level: 5 }) },
      { username: 'developer', email: 'dev@example.com', attributes: JSON.stringify({ department: 'engineering', level: 3 }) },
      { username: 'viewer', email: 'viewer@example.com', attributes: JSON.stringify({ department: 'marketing', level: 1 }) },
      { username: 'manager', email: 'manager@example.com', attributes: JSON.stringify({ department: 'management', level: 4 }) }
    ];

    const userIds: number[] = [];
    for (const user of users) {
      const id = execute(
        `INSERT INTO users (username, email, attributes) VALUES (?, ?, ?)`,
        [user.username, user.email, user.attributes]
      );
      userIds.push(id);
    }

    // Seed Roles
    const roles = [
      { name: 'admin', description: 'Full system access', permissions: JSON.stringify(['read', 'write', 'delete', 'admin']) },
      { name: 'developer', description: 'Development access', permissions: JSON.stringify(['read', 'write']) },
      { name: 'viewer', description: 'Read-only access', permissions: JSON.stringify(['read']) },
      { name: 'manager', description: 'Management access', permissions: JSON.stringify(['read', 'write', 'approve']) }
    ];

    const roleIds: number[] = [];
    for (const role of roles) {
      const id = execute(
        `INSERT INTO roles (name, description, permissions) VALUES (?, ?, ?)`,
        [role.name, role.description, role.permissions]
      );
      roleIds.push(id);
    }

    // Seed User-Role mappings
    const userRoleMappings = [
      { userId: userIds[0], roleId: roleIds[0] }, // admin -> admin
      { userId: userIds[1], roleId: roleIds[1] }, // developer -> developer
      { userId: userIds[2], roleId: roleIds[2] }, // viewer -> viewer
      { userId: userIds[3], roleId: roleIds[3] }  // manager -> manager
    ];

    for (const mapping of userRoleMappings) {
      execute(
        `INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)`,
        [mapping.userId, mapping.roleId]
      );
    }

    // Seed Resources
    const resources = [
      { type: 'document', identifier: 'doc:policy-001', name: 'Security Policy', attributes: JSON.stringify({ classification: 'confidential' }) },
      { type: 'document', identifier: 'doc:policy-002', name: 'HR Policy', attributes: JSON.stringify({ classification: 'internal' }) },
      { type: 'document', identifier: 'doc:report-q1', name: 'Q1 Report', attributes: JSON.stringify({ classification: 'public' }) },
      { type: 'api', identifier: 'api:/users', name: 'Users API', attributes: JSON.stringify({ sensitivity: 'high' }) },
      { type: 'api', identifier: 'api:/policies', name: 'Policies API', attributes: JSON.stringify({ sensitivity: 'high' }) },
      { type: 'folder', identifier: 'folder:engineering', name: 'Engineering Folder', attributes: JSON.stringify({ department: 'engineering' }) }
    ];

    for (const resource of resources) {
      execute(
        `INSERT INTO resources (type, identifier, name, attributes) VALUES (?, ?, ?, ?)`,
        [resource.type, resource.identifier, resource.name, resource.attributes]
      );
    }

    // Seed Policy Sets
    const policySets = [
      { name: 'default', description: 'Default policy set for all resources' },
      { name: 'admin', description: 'Administrative policies' },
      { name: 'engineering', description: 'Engineering team policies' }
    ];

    const policySetIds: number[] = [];
    for (const ps of policySets) {
      const id = execute(
        `INSERT INTO policy_sets (name, description) VALUES (?, ?)`,
        [ps.name, ps.description]
      );
      policySetIds.push(id);
    }

    // Seed Policies
    const policies = [
      {
        policySetId: policySetIds[0],
        name: 'allow-admin-all',
        description: 'Allow admins to perform all actions',
        effect: 'permit' as const,
        principalTypes: '["User"]',
        resourceTypes: '["*"]',
        actions: '["*"]',
        conditions: null
      },
      {
        policySetId: policySetIds[0],
        name: 'deny-delete-critical',
        description: 'Deny delete on critical resources',
        effect: 'deny' as const,
        principalTypes: '["User"]',
        resourceTypes: '["document", "api"]',
        actions: '["delete"]',
        conditions: JSON.stringify({ "resource.classification": { eq: "confidential" } })
      },
      {
        policySetId: policySetIds[1],
        name: 'allow-developer-read',
        description: 'Allow developers to read all resources',
        effect: 'permit' as const,
        principalTypes: '["User"]',
        resourceTypes: '["*"]',
        actions: '["read"]',
        conditions: null
      },
      {
        policySetId: policySetIds[1],
        name: 'allow-developer-write-engineering',
        description: 'Allow developers to write engineering resources',
        effect: 'permit' as const,
        principalTypes: '["User"]',
        resourceTypes: '["folder"]',
        actions: '["write"]',
        conditions: JSON.stringify({ "resource.department": { eq: "engineering" } })
      },
      {
        policySetId: policySetIds[2],
        name: 'allow-viewer-read-public',
        description: 'Allow viewers to read public resources',
        effect: 'permit' as const,
        principalTypes: '["User"]',
        resourceTypes: '["document"]',
        actions: '["read"]',
        conditions: JSON.stringify({ "resource.classification": { eq: "public" } })
      }
    ];

    for (const policy of policies) {
      execute(
        `INSERT INTO policies (policy_set_id, name, description, effect, principal_types, resource_types, actions, conditions)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          policy.policySetId,
          policy.name,
          policy.description,
          policy.effect,
          policy.principalTypes,
          policy.resourceTypes,
          policy.actions,
          policy.conditions
        ]
      );
    }

    saveDatabase();

    // Return seeded data summary
    const seededData: SeedData = {
      users: userIds.map((id, i) => ({
        id,
        username: users[i].username,
        email: users[i].email,
        attributes: users[i].attributes,
        created_at: '',
        updated_at: ''
      })),
      roles: roleIds.map((id, i) => ({
        id,
        name: roles[i].name,
        description: roles[i].description,
        permissions: roles[i].permissions,
        created_at: '',
        updated_at: ''
      })),
      userRoles: userRoleMappings.map((m, i) => ({
        id: i + 1,
        user_id: m.userId,
        role_id: m.roleId,
        created_at: ''
      })),
      resources: resources.map((r, i) => ({
        id: i + 1,
        type: r.type,
        identifier: r.identifier,
        name: r.name,
        attributes: r.attributes,
        created_at: '',
        updated_at: ''
      })),
      policySets: policySetIds.map((id, i) => ({
        id,
        name: policySets[i].name,
        description: policySets[i].description,
        is_active: 1,
        created_at: '',
        updated_at: ''
      })),
      policies: policies.map((p, i) => ({
        id: i + 1,
        policy_set_id: p.policySetId,
        name: p.name,
        description: p.description,
        effect: p.effect,
        principal_types: p.principalTypes,
        resource_types: p.resourceTypes,
        actions: p.actions,
        conditions: p.conditions,
        created_at: '',
        updated_at: ''
      }))
    };

    return { success: true, data: seededData };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during seeding'
    };
  }
}

/**
 * Force seeds the database, clearing existing data first.
 */
export function forceSeedDatabase(): SeedResult {
  clearDatabase();
  return seedDatabase();
}

/**
 * Clears all data from the database (keeps schema).
 */
export function clearDatabase(): void {
  const db = openDatabase();
  
  // Delete in reverse order of dependencies
  db.run('DELETE FROM user_roles');
  db.run('DELETE FROM policies');
  db.run('DELETE FROM policy_sets');
  db.run('DELETE FROM resources');
  db.run('DELETE FROM roles');
  db.run('DELETE FROM users');
  
  saveDatabase();
}

/**
 * Gets a count of records in each table.
 */
export function getSeedStats(): Record<string, number> {
  const db = openDatabase();
  const tables = ['users', 'roles', 'user_roles', 'resources', 'policy_sets', 'policies'];
  const stats: Record<string, number> = {};

  for (const table of tables) {
    const result = db.exec(`SELECT COUNT(*) as count FROM ${table}`);
    stats[table] = result.length > 0 ? result[0].values[0][0] as number : 0;
  }

  return stats;
}

/**
 * Checks if the database has been seeded.
 */
export function isDatabaseSeeded(): boolean {
  const stats = getSeedStats();
  return stats.users > 0;
}
