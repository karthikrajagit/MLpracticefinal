import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  server: {
    proxy: {
      '/api/v1': {
        target: 'http://localhost:3000',
        secure: false,
        logLevel: 'debug', // Enables logging for proxy activity
      },
      '/api/v2': {
        target: 'http://localhost:5000',
        secure: false,
        logLevel: 'debug', // Enables logging for proxy activity
      },
    },
  },
  build: {
      outDir: 'dist', 
  },

  plugins: [react()],
});
