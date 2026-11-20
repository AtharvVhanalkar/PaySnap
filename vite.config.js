import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Base path: '/' on Vercel and local dev server, '/PaySnap/' for GitHub Pages production
const isVercel = Boolean(process.env.VERCEL);
const isProd = process.env.NODE_ENV === 'production';
const base = isVercel ? '/' : (isProd ? '/PaySnap/' : '/');

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [
    tailwindcss(),
    react(),
  ],
})
