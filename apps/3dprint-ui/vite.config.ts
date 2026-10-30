import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const target = process.env.VITE_3DPRINT_TARGET === 'management' ? 'management' : 'reservation';
const appRoot = path.join(rootDir, target);
const outDir = path.resolve(
  rootDir,
  target === 'management'
    ? '../../public/apps/3dprint-management'
    : '../../public/apps/3dprint-reservation'
);

export default defineConfig({
  plugins: [react()],
  base: target === 'management' ? '/apps/3dprint-management/' : '/apps/3dprint-reservation/',
  root: appRoot,
  publicDir: path.join(rootDir, 'public'),
  build: {
    outDir,
    emptyOutDir: false,
    rollupOptions: {
      input: path.join(appRoot, 'index.html'),
    },
  },
  resolve: {
    alias: {
      '@shared': path.resolve(rootDir, 'src/shared'),
      '@components': path.resolve(rootDir, 'src/components'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://127.0.0.1:8788', changeOrigin: true },
    },
  },
});
