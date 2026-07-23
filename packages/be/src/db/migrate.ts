#!/usr/bin/env node

import { migrate, rollbackLast, getAppliedMigrations } from './index.js';
import { closeDatabase } from './connection.js';

const command = process.argv[2] || 'up';

async function main() {
  try {
    switch (command) {
      case 'up':
      case 'migrate':
        console.log('Running migrations...');
        const result = migrate();
        console.log(`Applied ${result.applied} migration(s). Total: ${result.current} migration(s).`);
        break;
      
      case 'down':
      case 'rollback':
        console.log('Rolling back last migration...');
        const rolledBack = rollbackLast();
        if (rolledBack) {
          console.log('Rollback successful.');
        } else {
          console.log('No migration to rollback.');
        }
        break;
      
      case 'status':
        console.log('Current migrations:');
        const migrations = getAppliedMigrations();
        if (migrations.length === 0) {
          console.log('  No migrations applied.');
        } else {
          for (const m of migrations) {
            console.log(`  ${m.id}: ${m.name} (${m.applied_at})`);
          }
        }
        break;
      
      default:
        console.log(`Unknown command: ${command}`);
        console.log('Available commands: up, down, status');
        process.exit(1);
    }
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  } finally {
    closeDatabase();
  }
}

main();
