import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Exclude Hardhat/Solidity files from the frontend bundle
      external: [/contracts\//, /test\//, /scripts\//],
    },
  },
  optimizeDeps: {
    exclude: ['hardhat'],
  },
});
