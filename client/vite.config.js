import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    ...(command === 'serve' && {
      proxy: {
        '/api': {
          target: `http://localhost:${process.env.PORT_BE || 3000}`,
          changeOrigin: true,
        },
      },
    }),
  },
}))
