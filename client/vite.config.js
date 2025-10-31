import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        // target: 'https://ffw-deploy-backend.onrender.com',
        target: `http://localhost:${process.env.PORT_BE || 3000}`, // chỉnh lại localhost của backend
        changeOrigin: true
      }
    }
  }
})
