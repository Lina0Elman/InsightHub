import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';
import { config } from './src/config'


dotenv.config();

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: config.app.port(),
    host: config.app.domain_name(),
  },
  preview: { port: config.app.port() },
  define: {
    'process.env': process.env
  }
})
