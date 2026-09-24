import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Custom domain (representdc.org)
  server: {
    proxy: {
      // /news fetches its feed same-origin, but that file is published straight to
      // gh-pages by the news workflow and is deliberately never part of a build —
      // scripts/deploy.mjs refuses to deploy if it turns up in dist/. In dev there is
      // nothing to serve it, so point at the live copy. Dev only; not in the bundle.
      '/api/news.json': {
        target: 'https://www.representdc.org',
        changeOrigin: true,
      },
    },
  },
})
