import { openDatabase, saveDatabase } from '../connection.js';

export interface MigrationRecord {
  id: number;
  name: string;
  applied_at: string;
}

export interface Migration {
  name: string;
  up: string;
  down: string;
}

const migrations: Migration[] = [
  {
    name: '001_initial_schema',
    up: `
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        applied_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS policy_sets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS policies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        policy_set_id INTEGER REFERENCES policy_sets(id) ON DELETE SET NULL,
        name TEXT NOT NULL,
        description TEXT,
        effect TEXT NOT NULL CHECK (effect IN ('permit', 'deny')),
        principal_types TEXT,
        resource_types TEXT,
        actions TEXT,
        conditions TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS resources (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        identifier TEXT NOT NULL,
        name TEXT,
        attributes TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        UNIQUE(type, identifier)
      );

      CREATE TABLE IF NOT EXISTS roles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        permissions TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL,
        attributes TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS user_roles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        UNIQUE(user_id, role_id)
      );

      CREATE INDEX IF NOT EXISTS idx_policies_policy_set_id ON policies(policy_set_id);
      CREATE INDEX IF NOT EXISTS idx_resources_type ON resources(type);
      CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
      CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);
    `,
    down: `
      DROP TABLE IF EXISTS user_roles;
      DROP TABLE IF EXISTS users;
      DROP TABLE IF EXISTS roles;
      DROP TABLE IF EXISTS resources;
      DROP TABLE IF EXISTS policies;
      DROP TABLE IF EXISTS policy_sets;
      DROP TABLE IF EXISTS schema_migrations;
    `
  }
];

function bootstrap(): void {
  const db = openDatabase();
  db.run(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      applied_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
}

export function getAppliedMigrations(): MigrationRecord[] {
  bootstrap();
  const db = openDatabase();
  const stmt = db.prepare(`
    SELECT id, name, applied_at 
    FROM schema_migrations 
    ORDER BY id ASC
  `);
  
  const results: MigrationRecord[] = [];
  while (stmt.step()) {
    const row = stmt.getAsObject() as unknown as MigrationRecord;
    results.push(row);
  }
  stmt.free();
  
  return results;
}

export function applyMigration(migration: Migration): void {
  const db = openDatabase();
  
  // Split the migration SQL into individual statements
  const statements = migration.up
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);
  
  for (const stmt of statements) {
    db.run(stmt);
  }
  
  // Insert migration record
  db.run('INSERT INTO schema_migrations (name) VALUES (?)', [migration.name]);
  saveDatabase();
  
  console.log(`Applied migration: ${migration.name}`);
}

export function rollbackMigration(migration: Migration): void {
  const db = openDatabase();
  
  // Split the rollback SQL into individual statements
  const statements = migration.down
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);
  
  for (const stmt of statements) {
    db.run(stmt);
  }
  
  saveDatabase();
  console.log(`Rolled back migration: ${migration.name}`);
}

export function migrate(): { applied: number; current: number } {
  const applied = getAppliedMigrations();
  const appliedNames = new Set(applied.map(m => m.name));
  
  let count = 0;
  for (const migration of migrations) {
    if (!appliedNames.has(migration.name)) {
      applyMigration(migration);
      count++;
    }
  }
  
  return { applied: count, current: applied.length + count };
}

export function rollbackLast(): boolean {
  const applied = getAppliedMigrations();
  if (applied.length === 0) {
    console.log('No migrations to rollback');
    return false;
  }
  
  const lastMigration = migrations.find(m => m.name === applied[applied.length - 1].name);
  if (lastMigration) {
    rollbackMigration(lastMigration);
    return true;
  }
  return false;
}

export { migrations };
