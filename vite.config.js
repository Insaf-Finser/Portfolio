import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
  },
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return

          if (id.includes('three-stdlib') || id.includes('@react-three/drei') || id.includes('@react-three/fiber')) {
            return 'three-react'
          }

          if (id.includes('@react-three/postprocessing') || id.includes('postprocessing')) {
            return 'three-effects'
          }

          if (id.includes('/three/') || id.includes('three')) {
            return 'three-core'
          }

          if (id.includes('gsap') || id.includes('@studio-freight/lenis')) {
            return 'animations'
          }

          if (id.includes('react') || id.includes('scheduler')) {
            return 'react-vendor'
          }

          if (id.includes('@emailjs/browser') || id.includes('react-responsive')) {
            return 'utils'
          }
        },
      },
    },
  },
})
