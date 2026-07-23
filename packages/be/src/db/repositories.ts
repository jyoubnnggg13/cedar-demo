import { openDatabase, saveDatabase } from './connection.js';
import type { Policy, PolicySet, Resource, Role, User, UserRole } from './schema.js';

function queryAll<T>(sql: string, params: unknown[] = []): T[] {
  const db = openDatabase();
  const stmt = db.prepare(sql);
  if (params.length > 0) {
    stmt.bind(params);
  }
  
  const results: T[] = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject() as T);
  }
  stmt.free();
  
  return results;
}

function queryOne<T>(sql: string, params: unknown[] = []): T | undefined {
  const results = queryAll<T>(sql, params);
  return results[0];
}

function execute(sql: string, params: unknown[] = []): number {
  const db = openDatabase();
  db.run(sql, params);
  
  // Get the last insert rowid
  const result = db.exec('SELECT last_insert_rowid() as id');
  if (result.length > 0 && result[0].values.length > 0) {
    return result[0].values[0][0] as number;
  }
  return 0;
}

function executeUpdate(sql: string, params: unknown[] = []): number {
  const db = openDatabase();
  db.run(sql, params);
  
  // Get changes count
  const result = db.exec('SELECT changes() as changes');
  if (result.length > 0 && result[0].values.length > 0) {
    return result[0].values[0][0] as number;
  }
  return 0;
}

// Policy Repository
export const policyRepository = {
  findAll(): Policy[] {
    return queryAll<Policy>('SELECT * FROM policies ORDER BY id');
  },

  findById(id: number): Policy | undefined {
    return queryOne<Policy>('SELECT * FROM policies WHERE id = ?', [id]);
  },

  findByPolicySetId(policySetId: number): Policy[] {
    return queryAll<Policy>('SELECT * FROM policies WHERE policy_set_id = ?', [policySetId]);
  },

  create(policy: Omit<Policy, 'id' | 'created_at' | 'updated_at'>): Policy {
    const id = execute(
      `INSERT INTO policies (policy_set_id, name, description, effect, principal_types, resource_types, actions, conditions, cedar_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        policy.policy_set_id,
        policy.name,
        policy.description,
        policy.effect,
        policy.principal_types,
        policy.resource_types,
        policy.actions,
        policy.conditions,
        policy.cedar_json || null
      ]
    );
    return this.findById(id)!;
  },

  update(id: number, policy: Partial<Omit<Policy, 'id' | 'created_at' | 'updated_at'>>): Policy | undefined {
    const fields: string[] = [];
    const values: unknown[] = [];

    if (policy.policy_set_id !== undefined) {
      fields.push('policy_set_id = ?');
      values.push(policy.policy_set_id);
    }
    if (policy.name !== undefined) {
      fields.push('name = ?');
      values.push(policy.name);
    }
    if (policy.description !== undefined) {
      fields.push('description = ?');
      values.push(policy.description);
    }
    if (policy.effect !== undefined) {
      fields.push('effect = ?');
      values.push(policy.effect);
    }
    if (policy.principal_types !== undefined) {
      fields.push('principal_types = ?');
      values.push(policy.principal_types);
    }
    if (policy.resource_types !== undefined) {
      fields.push('resource_types = ?');
      values.push(policy.resource_types);
    }
    if (policy.actions !== undefined) {
      fields.push('actions = ?');
      values.push(policy.actions);
    }
    if (policy.conditions !== undefined) {
      fields.push('conditions = ?');
      values.push(policy.conditions);
    }
    if (policy.cedar_json !== undefined) {
      fields.push('cedar_json = ?');
      values.push(policy.cedar_json);
    }

    if (fields.length === 0) return this.findById(id);

    fields.push("updated_at = datetime('now')");
    values.push(id);
    
    executeUpdate(`UPDATE policies SET ${fields.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  },

  delete(id: number): boolean {
    const changes = executeUpdate('DELETE FROM policies WHERE id = ?', [id]);
    return changes > 0;
  }
};

// PolicySet Repository
export const policySetRepository = {
  findAll(): PolicySet[] {
    return queryAll<PolicySet>('SELECT * FROM policy_sets ORDER BY id');
  },

  findById(id: number): PolicySet | undefined {
    return queryOne<PolicySet>('SELECT * FROM policy_sets WHERE id = ?', [id]);
  },

  findActive(): PolicySet[] {
    return queryAll<PolicySet>('SELECT * FROM policy_sets WHERE is_active = 1');
  },

  create(policySet: Omit<PolicySet, 'id' | 'is_active' | 'created_at' | 'updated_at'>): PolicySet {
    const id = execute(
      `INSERT INTO policy_sets (name, description)
       VALUES (?, ?)`,
      [policySet.name, policySet.description]
    );
    return this.findById(id)!;
  },

  update(id: number, policySet: Partial<Omit<PolicySet, 'id' | 'created_at' | 'updated_at'>>): PolicySet | undefined {
    const fields: string[] = [];
    const values: unknown[] = [];

    if (policySet.name !== undefined) {
      fields.push('name = ?');
      values.push(policySet.name);
    }
    if (policySet.description !== undefined) {
      fields.push('description = ?');
      values.push(policySet.description);
    }
    if (policySet.is_active !== undefined) {
      fields.push('is_active = ?');
      values.push(policySet.is_active);
    }

    if (fields.length === 0) return this.findById(id);

    fields.push("updated_at = datetime('now')");
    values.push(id);
    
    executeUpdate(`UPDATE policy_sets SET ${fields.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  },

  delete(id: number): boolean {
    const changes = executeUpdate('DELETE FROM policy_sets WHERE id = ?', [id]);
    return changes > 0;
  }
};

// Resource Repository
export const resourceRepository = {
  findAll(): Resource[] {
    return queryAll<Resource>('SELECT * FROM resources ORDER BY id');
  },

  findById(id: number): Resource | undefined {
    return queryOne<Resource>('SELECT * FROM resources WHERE id = ?', [id]);
  },

  findByType(type: string): Resource[] {
    return queryAll<Resource>('SELECT * FROM resources WHERE type = ?', [type]);
  },

  findByTypeAndIdentifier(type: string, identifier: string): Resource | undefined {
    return queryOne<Resource>('SELECT * FROM resources WHERE type = ? AND identifier = ?', [type, identifier]);
  },

  create(resource: Omit<Resource, 'id' | 'created_at' | 'updated_at'>): Resource {
    const id = execute(
      `INSERT INTO resources (type, identifier, name, attributes)
       VALUES (?, ?, ?, ?)`,
      [resource.type, resource.identifier, resource.name, resource.attributes]
    );
    return this.findById(id)!;
  },

  update(id: number, resource: Partial<Omit<Resource, 'id' | 'created_at' | 'updated_at'>>): Resource | undefined {
    const fields: string[] = [];
    const values: unknown[] = [];

    if (resource.type !== undefined) {
      fields.push('type = ?');
      values.push(resource.type);
    }
    if (resource.identifier !== undefined) {
      fields.push('identifier = ?');
      values.push(resource.identifier);
    }
    if (resource.name !== undefined) {
      fields.push('name = ?');
      values.push(resource.name);
    }
    if (resource.attributes !== undefined) {
      fields.push('attributes = ?');
      values.push(resource.attributes);
    }

    if (fields.length === 0) return this.findById(id);

    fields.push("updated_at = datetime('now')");
    values.push(id);
    
    executeUpdate(`UPDATE resources SET ${fields.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  },

  delete(id: number): boolean {
    const changes = executeUpdate('DELETE FROM resources WHERE id = ?', [id]);
    return changes > 0;
  }
};

// Role Repository
export const roleRepository = {
  findAll(): Role[] {
    return queryAll<Role>('SELECT * FROM roles ORDER BY id');
  },

  findById(id: number): Role | undefined {
    return queryOne<Role>('SELECT * FROM roles WHERE id = ?', [id]);
  },

  findByName(name: string): Role | undefined {
    return queryOne<Role>('SELECT * FROM roles WHERE name = ?', [name]);
  },

  create(role: Omit<Role, 'id' | 'created_at' | 'updated_at'>): Role {
    const id = execute(
      `INSERT INTO roles (name, description, permissions)
       VALUES (?, ?, ?)`,
      [role.name, role.description, role.permissions]
    );
    return this.findById(id)!;
  },

  update(id: number, role: Partial<Omit<Role, 'id' | 'created_at' | 'updated_at'>>): Role | undefined {
    const fields: string[] = [];
    const values: unknown[] = [];

    if (role.name !== undefined) {
      fields.push('name = ?');
      values.push(role.name);
    }
    if (role.description !== undefined) {
      fields.push('description = ?');
      values.push(role.description);
    }
    if (role.permissions !== undefined) {
      fields.push('permissions = ?');
      values.push(role.permissions);
    }

    if (fields.length === 0) return this.findById(id);

    fields.push("updated_at = datetime('now')");
    values.push(id);
    
    executeUpdate(`UPDATE roles SET ${fields.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  },

  delete(id: number): boolean {
    const changes = executeUpdate('DELETE FROM roles WHERE id = ?', [id]);
    return changes > 0;
  }
};

// User Repository
export const userRepository = {
  findAll(): User[] {
    return queryAll<User>('SELECT * FROM users ORDER BY id');
  },

  findById(id: number): User | undefined {
    return queryOne<User>('SELECT * FROM users WHERE id = ?', [id]);
  },

  findByUsername(username: string): User | undefined {
    return queryOne<User>('SELECT * FROM users WHERE username = ?', [username]);
  },

  findByEmail(email: string): User | undefined {
    return queryOne<User>('SELECT * FROM users WHERE email = ?', [email]);
  },

  create(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): User {
    const id = execute(
      `INSERT INTO users (username, email, attributes)
       VALUES (?, ?, ?)`,
      [user.username, user.email, user.attributes]
    );
    return this.findById(id)!;
  },

  update(id: number, user: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>): User | undefined {
    const fields: string[] = [];
    const values: unknown[] = [];

    if (user.username !== undefined) {
      fields.push('username = ?');
      values.push(user.username);
    }
    if (user.email !== undefined) {
      fields.push('email = ?');
      values.push(user.email);
    }
    if (user.attributes !== undefined) {
      fields.push('attributes = ?');
      values.push(user.attributes);
    }

    if (fields.length === 0) return this.findById(id);

    fields.push("updated_at = datetime('now')");
    values.push(id);
    
    executeUpdate(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  },

  delete(id: number): boolean {
    const changes = executeUpdate('DELETE FROM users WHERE id = ?', [id]);
    return changes > 0;
  }
};

// UserRole Repository
export const userRoleRepository = {
  findByUserId(userId: number): UserRole[] {
    return queryAll<UserRole>('SELECT * FROM user_roles WHERE user_id = ?', [userId]);
  },

  findByRoleId(roleId: number): UserRole[] {
    return queryAll<UserRole>('SELECT * FROM user_roles WHERE role_id = ?', [roleId]);
  },

  create(userRole: Omit<UserRole, 'id' | 'created_at'>): UserRole {
    const id = execute(
      `INSERT INTO user_roles (user_id, role_id)
       VALUES (?, ?)`,
      [userRole.user_id, userRole.role_id]
    );
    return queryOne<UserRole>('SELECT * FROM user_roles WHERE id = ?', [id])!;
  },

  delete(id: number): boolean {
    const changes = executeUpdate('DELETE FROM user_roles WHERE id = ?', [id]);
    return changes > 0;
  },

  deleteByUserAndRole(userId: number, roleId: number): boolean {
    const changes = executeUpdate('DELETE FROM user_roles WHERE user_id = ? AND role_id = ?', [userId, roleId]);
    return changes > 0;
  }
};
