import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    sourcemap: false, // ✅ Tắt sourcemap để tránh lỗi file .map bị lỗi
  },

  server: {
    host: '127.0.0.1',
    port: 5173,
    proxy: {
      '/chatting': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
      '/ws': {
        target: 'ws://127.0.0.1:8001',
        ws: true,
        changeOrigin: true,
        secure: false,
      }
    }
  },
});
