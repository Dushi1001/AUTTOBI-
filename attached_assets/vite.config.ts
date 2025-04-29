export default defineConfig({
  // Keep all existing configuration
  
  build: {
    outDir: 'dist/client',
    rollupOptions: {
      external: ['pg-cloudflare']
    }
  }
});
