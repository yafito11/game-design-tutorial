import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/game-design-tutorial/',
  server: { port: 5173 }
})
