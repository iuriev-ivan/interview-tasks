import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages (project site): https://<user>.github.io/<repo>/
// В CI задаётся VITE_BASE=/имя-репозитория/; локально — '/' для dev и preview.
const base = process.env.VITE_BASE ?? '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react()],
})
