import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/', // GitHub User Page → use '/'
  plugins: [react()],
})
