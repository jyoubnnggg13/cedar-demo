export { 
  getDatabase, 
  closeDatabase, 
  resetDatabase, 
  DB_PATH, 
  DATA_DIR,
  initSql,
  openDatabase,
  saveDatabase,
  runSql,
  execSql,
  getSql
} from './connection.js';
export { migrate, rollbackLast, getAppliedMigrations, migrations } from './migrations/index.js';
export {
  policyRepository,
  policySetRepository,
  resourceRepository,
  roleRepository,
  userRepository,
  userRoleRepository
} from './repositories.js';
export type {
  Migration,
  Policy,
  PolicySet,
  Resource,
  Role,
  User,
  UserRole
} from './schema.js';
export { SCHEMA_VERSION } from './schema.js';
