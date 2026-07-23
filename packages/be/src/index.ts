import { migrate, closeDatabase } from './db/index.js';
import { initializePolicyCache } from './services/policy-cache.js';
import { registerEvaluateRoutes } from './routes/evaluate.js';
import express from 'express';
import { policyRouter } from './routes/policies.js';
import { rolesRouter, resourcesRouter } from './routes/index.js';

export function initDatabase(): void {
  console.log('Initializing database...');
  migrate();
  console.log('Database initialized.');
}

export function initializeAuthorization(): void {
  console.log('Initializing authorization cache...');
  initializePolicyCache();
  console.log('Authorization cache initialized.');
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

app.use('/api/policies', policyRouter);
// Register API routes
registerEvaluateRoutes(app);
// API Routes
app.use('/api/roles', rolesRouter);
app.use('/api/resources', resourcesRouter);

app.listen(3000, () => {
  initDatabase();
  initializeAuthorization();
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
