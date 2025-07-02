import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      "@core": path.resolve(__dirname, "./src/core"),
      "@apps": path.resolve(__dirname, "./src/apps"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@iti": path.resolve(__dirname, "./src/iti")
    },
  },
  build: {
    rollupOptions: {
      external: [
        'electron',          // prevent bundling Electron
        'fs', 'path', 'os',  // prevent bundling Node built-ins
        'child_process',
      ],
    },
  },
});
