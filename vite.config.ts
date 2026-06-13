import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Honor an externally assigned port (e.g. preview tooling); default 5173.
  server: {
    port: Number(process.env.PORT) || 5173,
  },
  optimizeDeps: {
    exclude: ['js-big-decimal']
  }
})