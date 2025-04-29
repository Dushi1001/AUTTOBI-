import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Keep all existing configuration here
  
  // Add this build section if it doesn't exist, or update it if it does
  build: {
    // Keep any existing build options
    rollupOptions: {
      external: ['pg-cloudflare']
    }
  }
});({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  server: {
    port: 3000,
    host: true
  }
});
