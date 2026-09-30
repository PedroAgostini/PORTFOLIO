import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' keeps the build portable (Vercel root or a GitHub Pages sub-path).
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    // Browser downloads in progress (.crdownload/.part/.tmp) are locked on Windows and crash the watcher.
    watch: { ignored: ['**/.impeccable/**', '**/materiais/**', '**/*.crdownload', '**/*.part', '**/*.tmp'] },
  },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('three') || id.includes('@react-three')) return 'three'
          if (id.includes('gsap') || id.includes('lenis')) return 'motion'
        },
      },
    },
  },
})
