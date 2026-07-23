import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const DB_PATH = join(__dirname, '..', '..', 'data', 'cedar.db');
export const DATA_DIR = join(__dirname, '..', '..', 'data');

let db: SqlJsDatabase | null = null;
let SQL: Awaited<ReturnType<typeof initSqlJs>> | null = null;

export async function initSql(): Promise<void> {
  if (!SQL) {
    SQL = await initSqlJs();
  }
}

export function getDatabase(): SqlJsDatabase {
  if (!db) {
    throw new Error('Database not initialized. Call openDatabase() first.');
  }
  return db;
}

export function openDatabase(): SqlJsDatabase {
  if (!SQL) {
    throw new Error('SQL.js not initialized. Call initSql() first.');
  }
  
  if (db) {
    return db;
  }
  
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  
  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }
  
  return db;
}

export function closeDatabase(): void {
  if (db) {
    // Save before closing
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
    db.close();
    db = null;
  }
}

export function resetDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
  if (fs.existsSync(DB_PATH)) {
    fs.unlinkSync(DB_PATH);
  }
}

export function saveDatabase(): void {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
  }
}
