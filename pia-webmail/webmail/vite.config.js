import { defineConfig } from 'vite';

import mkcert from 'vite-plugin-mkcert'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(), mkcert()],
  server: {
    port: 3001,
    open: '/',
    https: true,  
  },
  build: {
    // Relative to the root
    outDir: '../www',
    emptyOutDir: true,
  },
  publicDir: './public',
});