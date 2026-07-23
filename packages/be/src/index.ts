import { migrate, closeDatabase } from './db/index.js';
import express from 'express';
import { rolesRouter, resourcesRouter } from './routes/index.js';

export function initDatabase(): void {
  console.log('Initializing database...');
  migrate();
  console.log('Database initialized.');
}

export function shutdownDatabase(): void {
  closeDatabase();
  console.log('Database connection closed.');
}

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// API Routes
app.use('/api/roles', rolesRouter);
app.use('/api/resources', resourcesRouter);

app.listen(3000, () => {
  initDatabase();
  console.log('Server running on http://localhost:3000');
});

process.on('SIGINT', () => {
  shutdownDatabase();
  process.exit(0);
});

process.on('SIGTERM', () => {
  shutdownDatabase();
  process.exit(0);
});

export { app };
