import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.config'
import zip from 'vite-plugin-zip-pack'
import { name, version } from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    react(),
    crx({ manifest }),
    zip({ outDir: "release", outFileName: `${name}-${version}.zip` }),
  ],
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
    cors: true,
  },
  build: {
    rollupOptions: {
      input: {
        dashboard: 'src/pages/dashboard/index.html'
      }
    }
  }
})
