import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
export default defineConfig({
  plugins: [react(), tailwindcss(),VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto', // o 'script' si preferís registrar manualmente
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
      },
    })],
  
})
