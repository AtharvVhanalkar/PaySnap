import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Base path: '/' on Vercel and local dev, '/PaySnap/' for GitHub Pages
const isGitHubPages = process.env.GITHUB_PAGES === 'true' || process.env.GITHUB_ACTIONS === 'true';

// https://vite.dev/config/
export default defineConfig({
  base: isGitHubPages ? '/PaySnap/' : '/',
  plugins: [
    tailwindcss(),
    react(),
  ],
})
