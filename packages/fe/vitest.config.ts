import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    alias: {
      react: 'react',
      'react-dom': 'react-dom',
    },
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
});
