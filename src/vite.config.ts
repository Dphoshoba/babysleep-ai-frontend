import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Ensures correct path resolution on Netlify
  server: {
    port: 3000, // Optional: local dev port
  },
  build: {
    outDir: 'dist', // Default for Vite — just here for clarity
  },
});
