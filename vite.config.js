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
},
});
